import sodium from "libsodium-wrappers";

let ready = false;

async function init() {
  if (!ready) {
    await sodium.ready;
    ready = true;
  }
}

function getKey(): Uint8Array {
  const keyB64 = process.env["VAULT_ENCRYPTION_KEY"];
  if (!keyB64) throw new Error("VAULT_ENCRYPTION_KEY is not set");
  return sodium.from_base64(keyB64, sodium.base64_variants.ORIGINAL);
}

export async function encrypt(
  plaintext: string,
): Promise<{ ciphertext: string; nonce: string }> {
  await init();
  const key = getKey();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const message = sodium.from_string(plaintext);
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);
  return {
    ciphertext: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
    nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
  };
}

export async function decrypt(
  ciphertextB64: string,
  nonceB64: string,
): Promise<string> {
  await init();
  const key = getKey();
  const ciphertext = sodium.from_base64(
    ciphertextB64,
    sodium.base64_variants.ORIGINAL,
  );
  const nonce = sodium.from_base64(nonceB64, sodium.base64_variants.ORIGINAL);
  const message = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
  return sodium.to_string(message);
}
