class Config:
    MYSQL_CONFIG = {
        'user': 'petuptemporar1',
        'password': 'boC#it9Uchlco8',
        'host': 'petuptemporar1.mysql.dbaas.com.br',
        'database': 'petuptemporar1'

    }
    CLIP_MODEL = 'ViT-B-32'
    CLIP_PRETRAINED = 'openai'
    YOLO_MODEL = 'yolov8n-seg.pt'
    SIMILARITY_THRESHOLD = 0.85
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True
    LOG_LEVEL = 'INFO'
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

def get_config():
    return Config()