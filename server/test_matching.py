"""
Unit & Integration Tests for Aawaz Matching Engine and Identifier Normalisation
"""
import unittest
import hashlib
import hmac
import re

SERVER_PEPPER = "Aawaz_Sacred_Escrow_Pepper_2026_Secure_Key"
HONORIFICS = r"^(mr|mrs|ms|miss|dr|prof|professor|sir|shri|smt|madam)\.?\s+"
ORG_SUFFIXES = r"\b(pvt|ltd|limited|private|inc|corp|corporation|technologies|solutions|group|university|college|inst|institute)\b\.?"

def normalise_identifier(name: str, org: str) -> str:
    clean_name = re.sub(HONORIFICS, "", name.strip().lower(), flags=re.IGNORECASE)
    clean_name = re.sub(r"[^\w\s]", "", clean_name)
    clean_name = " ".join(clean_name.split())

    clean_org = re.sub(ORG_SUFFIXES, "", org.strip().lower(), flags=re.IGNORECASE)
    clean_org = re.sub(r"[^\w\s]", "", clean_org)
    clean_org = " ".join(clean_org.split())

    return f"{clean_name}|{clean_org}"

def generate_match_token(name: str, org: str) -> str:
    norm = normalise_identifier(name, org)
    return hmac.new(SERVER_PEPPER.encode('utf-8'), norm.encode('utf-8'), hashlib.sha256).hexdigest()

def compute_phonetic_key(name: str) -> str:
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

class TestAawazMatching(unittest.TestCase):
    def test_identifier_normalisation(self):
        v1 = normalise_identifier("Varun Sharma", "Apex Global Technologies")
        v2 = normalise_identifier("Mr. Varun Sharma", "Apex Global")
        v3 = normalise_identifier("  varun   sharma  ", "Apex Global Pvt Ltd")
        v4 = normalise_identifier("Dr. Varun Sharma", "Apex Global Inc.")

        self.assertEqual(v1, "varun sharma|apex global")
        self.assertEqual(v2, "varun sharma|apex global")
        self.assertEqual(v3, "varun sharma|apex global")
        self.assertEqual(v4, "varun sharma|apex global")

    def test_match_token_identity(self):
        token1 = generate_match_token("Varun Sharma", "Apex Global")
        token2 = generate_match_token("Mr. Varun Sharma", "Apex Global Pvt. Ltd.")
        self.assertEqual(token1, token2)
        self.assertEqual(len(token1), 64)

    def test_phonetic_token_similarity(self):
        # Varun and phonetic variant
        phone1 = compute_phonetic_key("Varun Sharma")
        phone2 = compute_phonetic_key("Varooon Sharma")
        self.assertEqual(phone1, phone2)

if __name__ == "__main__":
    unittest.main()

