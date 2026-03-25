export interface Note {
  id: string;
  cardId: string;
  text: string;
  updatedAt: Date;
}

export interface StoredNote extends Omit<Note, 'updatedAt'> {
  updatedAt: number;
}

export const NOTES_MAX_LENGTH = 2000;
