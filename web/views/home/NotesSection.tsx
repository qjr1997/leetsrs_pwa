import { useState, useEffect } from 'react';
import { useNoteQuery, useSaveNoteMutation, useDeleteNoteMutation } from '../../hooks/useQueries';
import { NOTES_MAX_LENGTH } from '../../shared/notes';
import { bounceButton } from '../../shared/styles';
import { useI18n } from '../../contexts/I18nContext';

interface NotesSectionProps {
  cardId: string;
}

export function NotesSection({ cardId }: NotesSectionProps) {
  const t = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data: note, isLoading, error } = useNoteQuery(cardId);
  const saveNoteMutation = useSaveNoteMutation(cardId);
  const deleteNoteMutation = useDeleteNoteMutation(cardId);

  // Sync fetched note with local state
  useEffect(() => {
    const text = note?.text || '';
    setNoteText(text);
    setDeleteConfirm(false);
  }, [note]);

  const handleSave = async () => {
    try {
      await saveNoteMutation.mutateAsync(noteText);
    } catch (error) {
      console.error('Failed to save note:', error);
      setNoteText(note?.text || '');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }

    try {
      await deleteNoteMutation.mutateAsync();
      setNoteText('');
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setDeleteConfirm(false);
    }
  };

  const originalText = note?.text || '';
  const characterCount = noteText.length;
  const isOverLimit = characterCount > NOTES_MAX_LENGTH;
  const hasChanges = noteText !== originalText;
  const canSave = hasChanges && !isOverLimit && noteText.length > 0;
  const hasExistingNote = originalText.length > 0;

  if (error) {
    console.error('Failed to load note:', error);
  }

  return (
    <div className="bg-secondary rounded-lg overflow-hidden border border-theme">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-tertiary transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-primary">{t.notes.title}</span>
        <span className={`text-xs text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-theme">
          <label className="sr-only">{t.notes.ariaLabel}</label>
          <textarea
            className="w-full mt-3 p-2 rounded border border-theme bg-primary text-primary text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder={isLoading ? t.notes.placeholderLoading : t.notes.placeholderEmpty}
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            disabled={isLoading || saveNoteMutation.isPending}
            maxLength={NOTES_MAX_LENGTH + 100}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-secondary'}`}>
              {t.format.characterCount(characterCount, NOTES_MAX_LENGTH)}
            </span>
            <div className="flex gap-2">
              {hasExistingNote && (
                <button
                  className={`px-4 py-1.5 rounded text-sm ${deleteConfirm ? 'bg-red-700' : 'bg-red-500'} text-white hover:opacity-90 disabled:opacity-50 ${bounceButton}`}
                  onClick={handleDelete}
                  disabled={deleteNoteMutation.isPending}
                >
                  {deleteNoteMutation.isPending
                    ? t.actions.deleting
                    : deleteConfirm
                      ? t.actions.confirm
                      : t.actions.delete}
                </button>
              )}
              <button
                className={`px-4 py-1.5 rounded text-sm bg-accent text-white hover:opacity-90 disabled:opacity-50 ${bounceButton}`}
                onClick={handleSave}
                disabled={!canSave || saveNoteMutation.isPending}
              >
                {saveNoteMutation.isPending ? t.actions.saving : t.actions.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
