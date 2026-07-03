import os
import sys

# Ensure the .python environment is used and print configuration
print("Python executable:", sys.executable)
print("Downloading UPFD dataset raw files...")

# We will dynamically install torch_geometric and use it to download
try:
    from torch_geometric.datasets import UPFD
except ImportError:
    print("Error: torch_geometric is not installed in the environment yet.")
    sys.exit(1)

# List of configurations to pre-download
datasets = ['politifact', 'gossipcop']
features = ['profile', 'spacy', 'bert', 'content']

os.makedirs('data', exist_ok=True)

for dataset_name in datasets:
    for feature_name in features:
        print(f"Downloading {dataset_name} with {feature_name} features...")
        try:
            # Setting force_reload=False to skip if already present
            # Just instantiating UPFD will automatically download the files to data/name/raw/
            UPFD(root='data', name=dataset_name, feature=feature_name, split='train')
            UPFD(root='data', name=dataset_name, feature=feature_name, split='val')
            UPFD(root='data', name=dataset_name, feature=feature_name, split='test')
            print(f"Successfully downloaded {dataset_name} with {feature_name}.")
        except Exception as e:
            print(f"Failed for {dataset_name} with {feature_name}: {e}")

print("Dataset downloader script finished.")
