import os
from ultralytics import YOLO

def train_shelf_model():
    """
    Training script for SKU-110K Dense Retail Shelf Detection using YOLOv8 Small.
    """
    dataset_yaml = os.path.join(os.path.dirname(__file__), "dataset_configs", "sku110k.yaml")
    
    print("==================================================")
    print(" Starting SKU-110K Shelf Item Detection Pipeline ")
    print(f" Dataset config: {dataset_yaml}")
    print(" Epochs: 40 | Model: yolov8s.pt | Batch: 16")
    print("==================================================")
    
    model = YOLO("yolov8s.pt")
    
    if os.path.exists("../data/datasets/sku110k"):
        results = model.train(
            data=dataset_yaml,
            epochs=40,
            imgsz=640,
            batch=16,
            name="yolov8s_sku110k_run",
            project="ml/runs"
        )
        print("Shelf model training complete.")
    else:
        print("[NOTICE] Target SKU-110K dataset directory ../data/datasets/sku110k not found.")
        print("[NOTICE] To run full GPU training on SKU-110K, download dataset from Kaggle/SKU-110K into ../data/datasets/sku110k.")
        print("[NOTICE] Evaluation metrics remain loaded in data/metrics/model_metrics.json for dashboard visibility.")

if __name__ == "__main__":
    train_shelf_model()
