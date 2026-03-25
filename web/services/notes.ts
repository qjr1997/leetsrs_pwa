import { STORAGE_KEYS, storage, getNoteStorageKey } from './storage';
import type { Note, StoredNote } from '../shared/notes';
import { markDataUpdated } from './data-tracker';

function deserializeNote(stored: StoredNote): Note {
  return {
    ...stored,
    updatedAt: new Date(stored.updatedAt),
  };
}

function serializeNote(note: Note): StoredNote {
  return {
    ...note,
    updatedAt: note.updatedAt.getTime(),
  };
}

export async function getNote(cardId: string): Promise<Note | null> {
  const key = getNoteStorageKey(cardId);
  const stored = await storage.getItem<StoredNote>(key);
  return stored ? deserializeNote(stored) : null;
}

export async function saveNote(cardId: string, text: string): Promise<Note> {
  const key = getNoteStorageKey(cardId);
  const existing = await storage.getItem<StoredNote>(key);
  
  const note: Note = {
    id: existing?.id || crypto.randomUUID(),
    cardId,
    text,
    updatedAt: new Date(),
  };
  
  await storage.setItem(key, serializeNote(note));
  await markDataUpdated();
  return note;
}

export async function deleteNote(cardId: string): Promise<void> {
  const key = getNoteStorageKey(cardId);
  await storage.removeItem(key);
  await markDataUpdated();
}