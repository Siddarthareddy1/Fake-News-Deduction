import os.path as osp

import torch
from torch_geometric.data import Data, InMemoryDataset
from torch_geometric.utils import to_undirected, add_self_loops
from torch_sparse import coalesce
from torch_geometric.io import read_txt_array

import random
import numpy as np
import scipy.sparse as sp


"""
	Functions to help load the graph data
"""

def read_file(folder, name, dtype=None):
	path = osp.join(folder, '{}.txt'.format(name))
	return read_txt_array(path, sep=',', dtype=dtype)


def split(data, batch):
	"""
	PyG util code to create graph batches
	"""

	node_slice = torch.cumsum(torch.from_numpy(np.bincount(batch)), 0)
	node_slice = torch.cat([torch.tensor([0]), node_slice])

	row, _ = data.edge_index
	edge_slice = torch.cumsum(torch.from_numpy(np.bincount(batch[row])), 0)
	edge_slice = torch.cat([torch.tensor([0]), edge_slice])

	data.edge_index -= node_slice[batch[row]].unsqueeze(0)
	data.__num_nodes__ = torch.bincount(batch).tolist()

	slices = {'edge_index': edge_slice}
	if data.x is not None:
		slices['x'] = node_slice
	if data.edge_attr is not None:
		slices['edge_attr'] = edge_slice
	if data.y is not None:
		if data.y.size(0) == batch.size(0):
			slices['y'] = node_slice
		else:
			slices['y'] = torch.arange(0, batch[-1] + 2, dtype=torch.long)

	return data, slices



def read_graph_data(folder, feature):
	"""
	PyG util code to create PyG data instance from raw graph data
	"""

	node_attributes = sp.load_npz(folder + f'new_{feature}_feature.npz')
	edge_index = read_file(folder, 'A', torch.long).t()
	node_graph_id = np.load(folder + 'node_graph_id.npy')
	graph_labels = np.load(folder + 'graph_labels.npy')


	edge_attr = None
	x = torch.from_numpy(node_attributes.todense()).to(torch.float)
	node_graph_id = torch.from_numpy(node_graph_id).to(torch.long)
	y = torch.from_numpy(graph_labels).to(torch.long)
	_, y = y.unique(sorted=True, return_inverse=True)

	num_nodes = edge_index.max().item() + 1 if x is None else x.size(0)
	edge_index, edge_attr = add_self_loops(edge_index, edge_attr)
	edge_index, edge_attr = coalesce(edge_index, edge_attr, num_nodes, num_nodes)

	data = Data(x=x, edge_index=edge_index, edge_attr=edge_attr, y=y)

	return data, node_graph_id


class ToUndirected:
	def __init__(self):
		"""
		PyG util code to transform the graph to the undirected graph
		"""
		pass

	def __call__(self, data):
		edge_attr = None
		edge_index = to_undirected(data.edge_index, data.x.size(0))
		num_nodes = edge_index.max().item() + 1 if data.x is None else data.x.size(0)
		# edge_index, edge_attr = add_self_loops(edge_index, edge_attr)
		edge_index, edge_attr = coalesce(edge_index, edge_attr, num_nodes, num_nodes)
		data.edge_index = edge_index
		data.edge_attr = edge_attr
		return data


class DropEdge:
	def __init__(self, tddroprate, budroprate):
		"""
		Drop edge operation from BiGCN (Rumor Detection on Social Media with Bi-Directional Graph Convolutional Networks)
		1) Generate TD and BU edge indices
		2) Drop out edges
		Code from https://github.com/TianBian95/BiGCN/blob/master/Process/dataset.py
		"""
		self.tddroprate = tddroprate
		self.budroprate = budroprate

	def __call__(self, data):
		edge_index = data.edge_index

		if self.tddroprate > 0:
			row = list(edge_index[0])
			col = list(edge_index[1])
			length = len(row)
			poslist = random.sample(range(length), int(length * (1 - self.tddroprate)))
			poslist = sorted(poslist)
			row = list(np.array(row)[poslist])
			col = list(np.array(col)[poslist])
			new_edgeindex = [row, col]
		else:
			new_edgeindex = edge_index

		burow = list(edge_index[1])
		bucol = list(edge_index[0])
		if self.budroprate > 0:
			length = len(burow)
			poslist = random.sample(range(length), int(length * (1 - self.budroprate)))
			poslist = sorted(poslist)
			row = list(np.array(burow)[poslist])
			col = list(np.array(bucol)[poslist])
			bunew_edgeindex = [row, col]
		else:
			bunew_edgeindex = [burow, bucol]

		data.edge_index = torch.LongTensor(new_edgeindex)
		data.BU_edge_index = torch.LongTensor(bunew_edgeindex)
		data.root = torch.FloatTensor(data.x[0])
		data.root_index = torch.LongTensor([0])

		return data


class FNNDataset(InMemoryDataset):
	r"""
		The Graph datasets built upon FakeNewsNet data
	"""

	def __init__(self, root, name, feature='bert', empty=False, transform=None, pre_transform=None, pre_filter=None):
		self.name = name
		self.root = root
		self.feature = feature
		self.percentage_feature = 0.2 #0.2 F； 0.1G
		self.percentage_edge = 0.2
		super(FNNDataset, self).__init__(root, transform, pre_transform, pre_filter)
		if not empty:
			self.data, self.node_graph_id, self.train_idx, self.val_idx, self.test_idx = torch.load(self.processed_paths[0])
			self.data = self._remove_edges(self.data, self.percentage_edge)
			self.data, self.slices = split(self.data, self.node_graph_id)
			self.data = self._inject_gaussian_noise(self.data)


	@property
	def raw_dir(self):
		name = 'raw/'
		return osp.join(self.root, self.name, name)

	@property
	def num_classes(self):
		return len(self.data.y.unique())

	@property
	def processed_dir(self):
		name = 'processed/'
		return osp.join(self.root, self.name, name)

	@property
	def num_node_attributes(self):
		if self.data.x is None:
			return 0
		return self.data.x.size(1)

	@property
	def raw_file_names(self):
		names = ['node_graph_id', 'graph_labels']
		return ['{}.npy'.format(name) for name in names]

	@property
	def processed_file_names(self):
		if self.pre_filter is None:
			return f'{self.name[:3]}_data_{self.feature}.pt'
		else:
			return f'{self.name[:3]}_data_{self.feature}_prefiler.pt'

	def download(self):
		raise NotImplementedError('Must indicate valid location of raw data. No download allowed')

	def process(self):

		self.data, self.node_graph_id = read_graph_data(self.raw_dir, self.feature)


		if self.pre_filter is not None:
			data_list = [self.get(idx) for idx in range(len(self))]
			data_list = [data for data in data_list if self.pre_filter(data)]
			self.data, self.slices = self.collate(data_list)

		if self.pre_transform is not None:
			data_list = [self.get(idx) for idx in range(len(self))]
			data_list = [self.pre_transform(data) for data in data_list]
			self.data, self.slices = self.collate(data_list)

		self.train_idx = torch.from_numpy(np.load(self.raw_dir + 'train_idx.npy')).to(torch.long)
		self.val_idx = torch.from_numpy(np.load(self.raw_dir + 'val_idx.npy')).to(torch.long)
		self.test_idx = torch.from_numpy(np.load(self.raw_dir + 'test_idx.npy')).to(torch.long)

		torch.save((self.data, self.node_graph_id, self.train_idx, self.val_idx, self.test_idx), self.processed_paths[0])

	def __repr__(self):
		return '{}({})'.format(self.name, len(self))

	def _inject_gaussian_noise(self, data):
		num_noisy_points = int(self.percentage_feature * data.x.size(0))

		noisy_indices = torch.randperm(data.x.size(0))[:num_noisy_points]

		mean = 0
		std = 0.1

		# 注入噪音
		noise = torch.normal(mean, std, size=(num_noisy_points, data.x.size(1)))
		data.x[noisy_indices] += noise

		return data

	def _remove_edges(self, data, percentage_edge):
		"""
		Randomly remove a ratio of edges from the edge_index.
		:param edge_index: pyg-style edge_index (2 x num_edges)
		:param percentage_edge: proportion of edges to remove
		:return: new edge_index with the edges removed
		"""

		# Ensure each edge is represented only once
		edge_index = data.edge_index
		min_nodes, _ = torch.min(edge_index, dim=0)
		max_nodes, _ = torch.max(edge_index, dim=0)
		unique_edges = torch.stack([min_nodes, max_nodes], dim=0)

		# Get the number of unique edges
		num_edges = unique_edges.shape[1]

		# Randomly select edges to remove
		indices_to_remove = torch.randperm(num_edges)[:int(percentage_edge * num_edges)]
		edges_to_remove = unique_edges[:, indices_to_remove]

		# Convert edges to set for fast lookup
		edges_to_remove_set = {tuple(edge) for edge in edges_to_remove.t().tolist()}

		# Find indices of edges to keep
		mask = [(tuple(edge.tolist()) not in edges_to_remove_set) and
				(tuple(edge.tolist()[::-1]) not in edges_to_remove_set) for edge in edge_index.t()]
		data.edge_index = edge_index[:, mask]

		return data

