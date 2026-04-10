from fastapi.testclient import TestClient

VALID_BODY = {
    "answers": {
        "q1-degree-background": "BDS / India",
        "q2-target-program": "DDS / DMD",
        "q3-practice-states": ["Texas", "New York"],
        "q4-visa": "F1",
        "q5-masters-vs-home": "Pursue master's degree",
        "q6-loan-cosigner": "No",
        "q7-clinical-years": "3-4",
        "q8-inbde": "No",
        "q9-toefl": "4",
        "q10-start-cycle": "2028",
    }
}


def test_get_questionnaire(client: TestClient) -> None:
    r = client.get("/api/v1/questionnaire")
    assert r.status_code == 200
    data = r.json()
    assert data["questionnaire"]["id"] == "dentnav-assessment-v1"
    assert data["questionnaire_version"] == "1.0.0"
    assert len(data["questionnaire"]["questions"]) == 10


def test_validate_invalid(client: TestClient) -> None:
    bad = {
        "answers": {
            **VALID_BODY["answers"],
            "q3-practice-states": ["NotAState"],
        }
    }
    r = client.post("/api/v1/questionnaire/validate", json=bad)
    assert r.status_code == 200
    body = r.json()
    assert body["valid"] is False
    assert any(e["field"] == "q3-practice-states" for e in body["errors"])


def test_validate_duplicate_states(client: TestClient) -> None:
    bad = {
        "answers": {
            **VALID_BODY["answers"],
            "q3-practice-states": ["Texas", "Texas"],
        }
    }
    r = client.post("/api/v1/questionnaire/validate", json=bad)
    assert r.status_code == 200
    assert r.json()["valid"] is False


def test_submit_persists(client: TestClient) -> None:
    r = client.post("/api/v1/questionnaire/submit", json=VALID_BODY)
    assert r.status_code == 201
    assert r.json()["response_id"]
    assert r.json()["analysis"]["Performance"] >= 0


def test_submit_validation_error_envelope(client: TestClient) -> None:
    bad = {
        "answers": {
            **VALID_BODY["answers"],
            "q3-practice-states": ["Texas", "Texas"],
        }
    }
    r = client.post("/api/v1/questionnaire/submit", json=bad)
    assert r.status_code == 400
    err = r.json()["error"]
    assert err["code"] == "VALIDATION_FAILED"
    assert "errors" in err["details"]
