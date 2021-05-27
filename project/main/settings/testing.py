from main.settings.local import *

# forces celery tasks to be synchronous; can't unit-test async patterns
#CELERY_TASK_ALWAYS_EAGER = True
