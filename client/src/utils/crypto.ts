/**
 * Client-Side Web Crypto for Aawaz
 * Implements AES-256-GCM zero-knowledge client encryption, PBKDF2 key derivation,
 * and attachment SHA-256 hashing.
 */

const SEED_WORDS = [
  'lotus', 'amber', 'solace', 'harbor', 'aurora', 'meadow',
  'willow', 'serene', 'velvet', 'crystal', 'breeze', 'feather',
  'blossom', 'cradle', 'radiant', 'shelter', 'clarity', 'horizon',
  'cascade', 'lantern', 'silence', 'peony', 'glimmer', 'sanctuary'
];

/**
 * Generate a 12-word mnemonic recovery phrase
 */
export function generateRecoveryPhrase(): string {
  const chosen: string[] = [];
  const array = new Uint32Array(12);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < 12; i++) {
    const idx = array[i] % SEED_WORDS.length;
    chosen.push(SEED_WORDS[idx]);
  }
  return chosen.join(' ');
}

/**
 * Derive AES-256 key from recovery phrase using PBKDF2
 */
async function deriveKeyFromPhrase(phrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(phrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a JSON object with AES-256-GCM
 */
export async function encryptPayload(data: unknown, phrase: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKeyFromPhrase(phrase, salt);
  const encodedData = enc.encode(JSON.stringify(data));

  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encodedData
  );

  const combined = new Uint8Array(salt.byteLength + iv.byteLength + cipherBuffer.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(cipherBuffer), salt.byteLength + iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt AES-256-GCM ciphertext using recovery phrase
 */
export async function decryptPayload<T>(cipherBase64: string, phrase: string): Promise<T> {
  const binaryString = atob(cipherBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const cipherBytes = bytes.slice(28);

  const key = await deriveKeyFromPhrase(phrase, salt);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    cipherBytes
  );

  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decryptedBuffer)) as T;
}

/**
 * Calculate SHA-256 hex hash of file or string for tamper-evident indexing
 */
export async function computeSha256(content: string | ArrayBuffer): Promise<string> {
  const buffer = typeof content === 'string' ? new TextEncoder().encode(content) : content;
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
