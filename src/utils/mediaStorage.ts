/**
 * IndexedDB Media Storage for storing large MP4 videos and high-res photos directly in browser.
 * Bypasses localStorage 5MB quota restrictions safely.
 */

const DB_NAME = 'boas_limpas_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredMedia {
  id: string;
  name: string;
  type: 'video' | 'image';
  blob: Blob;
  mimeType: string;
  createdAt: number;
}

export async function saveMediaFile(id: string, file: File | Blob, name: string, type: 'video' | 'image'): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: StoredMedia = {
        id,
        name,
        type,
        blob: file,
        mimeType: file.type,
        createdAt: Date.now(),
      };

      const request = store.put(record);

      request.onsuccess = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('IndexedDB save failed, falling back to blob URL', err);
    return URL.createObjectURL(file);
  }
}

export async function getMediaUrl(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const record = request.result as StoredMedia | undefined;
        if (record && record.blob) {
          resolve(URL.createObjectURL(record.blob));
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllStoredMedia(): Promise<StoredMedia[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
