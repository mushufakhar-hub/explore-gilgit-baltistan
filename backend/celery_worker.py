from app.tasks.celery_app import celery_app


def main() -> None:
    # Entrypoint invoked by process managers or CLI: `python celery_worker.py`
    # Use the worker via: `celery -A celery_worker.celery_app worker --loglevel=info --beat`
    print("Celery entrypoint loaded. Use `celery -A celery_worker.celery_app worker --loglevel=info --beat` to start worker with beat.")


if __name__ == "__main__":
    main()
from app.tasks.celery_app import celery_app

if __name__ == "__main__":
    celery_app.start()
