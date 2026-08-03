# Explore Gilgit-Baltistan Backend

## Setup

1. Copy environment values:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   python -m pip install --upgrade pip
   python -m pip install -e '.[dev]'
   ```

3. Run migrations:

   ```bash
   alembic upgrade head
   ```

## Seed database

Run the seeder after the database is available:

```bash
python backend/scripts/seed_db.py
```

The seeder is idempotent and will create taxonomy groups, categories, sample users, a business profile, listings, booking availability, and room/tour inventory.
