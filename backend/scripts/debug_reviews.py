import asyncio, jwt
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db
from tests.test_reviews import setup_test_db, _token_for

override = setup_test_db()
app.dependency_overrides[get_db] = override
client = TestClient(app)
user = _token_for({"sub": "user_1"})
owner = _token_for({"sub": "owner_1"})

r = client.post("/api/v1/reviews/listings/l_biz", headers={"Authorization": f"Bearer {user}"}, json={"rating":5, "text":"Great"})
print('create', r.status_code, r.json())
rv_id = r.json().get('review_id')

rl = client.post(f"/api/v1/reviews/{rv_id}/like", headers={"Authorization": f"Bearer {user}"})
print('like', rl.status_code, rl.json())

resp = client.post(f"/api/v1/reviews/{rv_id}/owner-reply", headers={"Authorization": f"Bearer {owner}"}, json={"reply":"Thanks!"})
print('reply', resp.status_code, resp.json())
app.dependency_overrides.clear()
