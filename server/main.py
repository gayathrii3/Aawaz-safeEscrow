"""
Aawaz (Echo) - Privacy-First Harassment Matching Escrow Backend
FastAPI implementation of anonymous authentication, keyed HMAC matching,
consent-gated escrow release, and non-PII audit logging.
"""

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import hashlib
import hmac
import time
import uuid
import re

app = FastAPI(
    title="Aawaz Escrow Matching API",
    description="Privacy-Preserving Reporting Platform Linking Repeat Offenders Under India's POSH Act",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Server Secret Pepper - kept outside DB to prevent dictionary attacks
SERVER_PEPPER = "Aawaz_Sacred_Escrow_Pepper_2026_Secure_Key"

# In-memory demo datastore
db = {
    "users": {},
    "reports": {},
    "matches": {},
    "consents": {},
    "audit_log": []
}

HONORIFICS = r"^(mr|mrs|ms|miss|dr|prof|professor|sir|shri|smt|madam)\.?\s+"
ORG_SUFFIXES = r"\b(pvt|ltd|limited|private|inc|corp|corporation|technologies|solutions|group|university|college|inst|institute)\b\.?"

def normalise_identifier(name: str, org: str) -> str:
    """Normalises name and org to ensure identical hash for the same person."""
    clean_name = re.sub(HONORIFICS, "", name.strip().lower(), flags=re.IGNORECASE)
    clean_name = re.sub(r"[^\w\s]", "", clean_name)
    clean_name = " ".join(clean_name.split())

    clean_org = re.sub(ORG_SUFFIXES, "", org.strip().lower(), flags=re.IGNORECASE)
    clean_org = re.sub(r"[^\w\s]", "", clean_org)
    clean_org = " ".join(clean_org.split())

    return f"{clean_name}|{clean_org}"

def generate_match_token(name: str, org: str) -> str:
    """Derives HMAC-SHA256 token using the secret server pepper."""
    norm = normalise_identifier(name, org)
    return hmac.new(SERVER_PEPPER.encode('utf-8'), norm.encode('utf-8'), hashlib.sha256).hexdigest()

def compute_phonetic_key(name: str) -> str:
    """Phonetic sound key for Indian/English names."""
    norm = re.sub(HONORIFICS, "", name.strip().lower(), flags=re.IGNORECASE)
    words = re.sub(r"[^\w\s]", "", norm).split()
    codes = []
    for w in words:
        c = re.sub(r"ee|ea|e|i|y", "I", w)
        c = re.sub(r"oo|ou|o|u", "U", c)
        c = re.sub(r"aa|a", "A", c)
        c = re.sub(r"sh|ch|c", "S", c)
        c = re.sub(r"ph|f", "F", c)
        c = re.sub(r"th|t", "T", c)
        c = re.sub(r"kh|k|q", "K", c)
        c = re.sub(r"jh|z|j", "J", c)
        c = re.sub(r"(.)\1+", r"\1", c)
        codes.append(c[:6])
    return "_".join(codes)

# Schemas
class AnonymousAuthRequest(BaseModel):
    public_key: str

class ReportSubmission(BaseModel):
    user_id: str
    accused_name: str
    accused_org: str
    encrypted_blob: str
    evidence_hashes: List[str] = []

class ConsentUpdate(BaseModel):
    user_id: str
    scope: str # 'none', 'existence_only', 'timeline', 'full'

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Aawaz Privacy Escrow Engine"}

@app.post("/auth/anonymous")
def create_anonymous_user(req: AnonymousAuthRequest):
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    pseudonym = f"Aura-{uuid.uuid4().hex[:4].upper()}"
    db["users"][user_id] = {
        "id": user_id,
        "pseudonym": pseudonym,
        "public_key": req.public_key,
        "created_at": time.time()
    }
    db["audit_log"].append({
        "event": "ANONYMOUS_USER_CREATED",
        "actor": pseudonym,
        "timestamp": time.time()
    })
    return {"user_id": user_id, "pseudonym": pseudonym}

@app.post("/reports")
def submit_report(req: ReportSubmission):
    match_token = generate_match_token(req.accused_name, req.accused_org)
    phonetic_token = compute_phonetic_key(req.accused_name)
    report_id = f"rep_{uuid.uuid4().hex[:8]}"

    report_record = {
        "id": report_id,
        "user_id": req.user_id,
        "match_token": match_token,
        "phonetic_token": phonetic_token,
        "encrypted_blob": req.encrypted_blob,
        "evidence_hashes": req.evidence_hashes,
        "status": "encrypted_stored",
        "created_at": time.time()
    }
    db["reports"][report_id] = report_record

    # Check for matching reports from distinct users
    matches_found = []
    for other_id, other_rep in db["reports"].items():
        if other_id != report_id and other_rep["user_id"] != req.user_id:
            if other_rep["match_token"] == match_token:
                match_id = f"match_{uuid.uuid4().hex[:8]}"
                m_record = {
                    "id": match_id,
                    "report_a": other_id,
                    "report_b": report_id,
                    "match_token": match_token,
                    "confidence": "high",
                    "status": "pending_consent",
                    "created_at": time.time()
                }
                db["matches"][match_id] = m_record
                matches_found.append(m_record)

    db["audit_log"].append({
        "event": "REPORT_SEALED_ESCROW",
        "token_prefix": match_token[:12],
        "matches_detected": len(matches_found),
        "timestamp": time.time()
    })

    return {
        "report_id": report_id,
        "match_token": match_token,
        "status": "sealed",
        "peer_matches_detected": len(matches_found)
    }

@app.get("/matches/mine")
def get_user_matches(user_id: str):
    user_report_ids = [r_id for r_id, r in db["reports"].items() if r["user_id"] == user_id]
    user_matches = []
    for m_id, m in db["matches"].items():
        if m["report_a"] in user_report_ids or m["report_b"] in user_report_ids:
            user_matches.append(m)
    return {"matches": user_matches}

@app.post("/matches/{match_id}/consent")
def update_consent_scope(match_id: str, update: ConsentUpdate):
    if match_id not in db["matches"]:
        raise HTTPException(status_code=404, detail="Match not found")
    
    db["consents"][f"{match_id}_{update.user_id}"] = update.scope
    db["audit_log"].append({
        "event": "CONSENT_SCOPE_GRANTED",
        "match_id": match_id,
        "scope": update.scope,
        "timestamp": time.time()
    })
    return {"status": "consent_recorded", "scope": update.scope}
