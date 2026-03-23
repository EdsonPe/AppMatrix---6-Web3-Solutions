
import { BIP39_WORDLIST } from '../constants';

// --- Web Crypto API Functions ---

/**
 * Calculates the SHA-256 hash of a file.
 * @param file - The file to hash.
 * @returns A promise that resolves to the hex-encoded hash string.
 */
export async function calculateSHA256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a 2048-bit RSA-PSS key pair for signing.
 * @returns A promise that resolves to a CryptoKeyPair object.
 */
export function generateRsaKeyPair(): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
        {
            name: 'RSA-PSS',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
    );
}

/**
 * Signs a SHA-256 hash with a private RSA key.
 * @param privateKey - The private key to sign with.
 * @param data - The data (hash) to sign.
 * @returns A promise that resolves to the base64-encoded signature string.
 */
export async function signData(privateKey: CryptoKey, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const signatureBuffer = await crypto.subtle.sign(
        {
            name: 'RSA-PSS',
            saltLength: 32,
        },
        privateKey,
        encodedData
    );
    return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}

/**
 * Generates a strong random password using the Web Crypto API.
 * @param length - The desired length of the password.
 * @returns A cryptographically secure random string.
 */
export function generateStrongPassword(length: number = 24): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
    }
    return result;
}

// --- Helper & Simulation Functions ---

/**
 * Generates a fake transaction hash.
 * @returns A string resembling a blockchain transaction hash.
 */
export function generateFakeTxHash(): string {
    return `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
}

/**
 * Generates a fake IPFS CID (Content Identifier).
 * @returns A string resembling an IPFS CID.
 */
export function generateFakeCid(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let cid = '';
    for (let i = 0; i < 44; i++) {
        cid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Qm${cid}`;
}

/**
 * Generates a 12-word seed phrase from a predefined wordlist.
 * @returns An array of 12 random words.
 */
export function generateSeedPhrase(): string[] {
    const seed = [];
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * BIP39_WORDLIST.length);
        seed.push(BIP39_WORDLIST[randomIndex]);
    }
    return seed;
}

/**
 * Creates a downloadable blob from text data.
 * @param data - The string data to be included in the file.
 * @param filename - The name of the file to be downloaded.
 */
export function downloadTextFile(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Converts a File object to a Base64 encoded string.
 * @param file The file to convert.
 * @returns A Promise that resolves with the Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
