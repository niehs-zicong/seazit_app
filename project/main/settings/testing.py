#from main.settings.local import *
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
print(BASE_DIR) 

# forces celery tasks to be synchronous; can't unit-test async patterns
#CELERY_TASK_ALWAYS_EAGER = True
