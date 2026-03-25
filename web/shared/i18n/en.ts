// English translations (base language)
const en = {
  app: {
    name: 'LeetSRS',
    namePart1: 'Leet',
    namePart2: 'SRS',
  },

  nav: {
    home: 'Home',
    cards: 'Cards',
    stats: 'Stats',
    settings: 'Settings',
  },

  actions: {
    save: 'Save',
    saving: 'Saving...',
    delete: 'Delete',
    deleting: 'Deleting...',
    confirm: 'Confirm?',
    confirmDelete: 'Confirm Delete?',
    pause: 'Pause',
    resume: 'Resume',
  },

  states: {
    loading: 'Loading...',
    new: 'New',
    learning: 'Learning',
    review: 'Review',
    relearning: 'Relearning',
    unknown: 'Unknown',
  },

  difficulty: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  },

  ratings: {
    again: 'Again',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
  },

  errors: {
    somethingWentWrong: 'Something went wrong',
    unexpectedError: 'An unexpected error occurred',
    failedToLoadReviewQueue: 'Failed to load review queue',
    failedToExportData: 'Failed to export data',
    failedToResetData: 'Failed to reset data',
    unknownError: 'Unknown error',
  },

  home: {
    loadingReviewQueue: 'Loading review queue...',
    noCardsToReview: 'No cards to review!',
    addProblemsInstructions: 'Add problems manually in the Cards tab or import data from backup.',
  },

  statsBar: {
    review: 'review',
    new: 'new',
    learn: 'learn',
  },

  actionsSection: {
    title: 'Actions',
    delay1Day: '1 Day',
    delay5Days: '5 Days',
    deleteCard: 'Delete Card',
  },

  notes: {
    title: 'Notes',
    ariaLabel: 'Note text',
    placeholderLoading: 'Loading...',
    placeholderEmpty: 'Add your notes here...',
  },

  cardsView: {
    title: 'Cards',
    filterAriaLabel: 'Filter cards',
    filterPlaceholder: 'Filter by name or ID...',
    clearFilterAriaLabel: 'Clear filter',
    loadingCards: 'Loading cards...',
    noCardsAdded: 'No cards added yet.',
    noCardsMatchFilter: 'No cards match your filter.',
    cardPausedTitle: 'Card is paused',
  },

  cardStats: {
    state: 'State',
    reviews: 'Reviews',
    stability: 'Stability',
    lapses: 'Lapses',
    difficulty: 'Difficulty',
    due: 'Due',
    last: 'Last',
    added: 'Added',
  },

  statsView: {
    title: 'Statistics',
  },

  charts: {
    cardDistribution: 'Card Distribution',
    reviewHistory: 'Last 30 Days Review History',
    upcomingReviews: 'Upcoming Reviews (Next 14 Days)',
    cardsDue: 'Cards Due',
  },

  settings: {
    title: 'Settings',

    language: {
      title: 'Language',
      label: 'Display language',
    },

    appearance: {
      title: 'Appearance',
      darkMode: 'Dark mode',
      enableAnimations: 'Enable animations',
    },

    reviewSettings: {
      title: 'Review Settings',
      newCardsPerDay: 'New Cards Per Day',
      dayStartHour: 'Next Day Offset (hours past midnight)',
    },

    data: {
      title: 'Data',
      exportData: 'Export Data',
      exporting: 'Exporting...',
      importData: 'Import Data',
      importing: 'Importing...',
      resetAllData: 'Reset All Data',
      resetting: 'Resetting...',
      clickToConfirm: 'Click again to confirm',
      importConfirmMessage:
        'Are you sure you want to import this data?\n\nThis will replace ALL your current data including cards, review history, and notes.',
      importSuccess: 'Data imported successfully!',
      importFailed: 'Failed to import data:',
      resetConfirmMessage:
        'Are you absolutely sure you want to delete all data? This action cannot be undone.\n\nAll your cards, review history, statistics, and notes will be permanently deleted.',
      resetSuccess: 'All data has been reset',
    },

    gistSync: {
      title: 'GitHub Gist Sync',
      gistDescription: 'LeetSRS Backup - Spaced Repetition Data',
      description: 'Sync your data across browsers using GitHub Gists',
      patLabel: 'Personal Access Token',
      patPlaceholder: 'ghp_xxxxxxxxxxxx',
      patHelpText: 'Create a token with "gist" scope at',
      patHelpLink: 'GitHub Settings',
      validatePat: 'Validate',
      validating: 'Validating...',
      patValid: 'Valid',
      patInvalid: 'Invalid token',
      gistIdLabel: 'Gist ID',
      gistIdPlaceholder: 'Enter existing Gist ID or create new',
      createNewGist: 'Create New Gist',
      creating: 'Creating...',
      validateGist: 'Validate',
      gistValid: 'Valid',
      gistInvalid: 'Invalid gist',
      enableSync: 'Enable automatic sync',
      syncNow: 'Sync Now',
      syncing: 'Syncing...',
      lastSync: 'Last sync',
      lastSyncNever: 'Never',
      lastSyncPushed: 'Pushed',
      lastSyncPulled: 'Pulled',
      patRequired: 'PAT is required to enable sync',
      gistRequired: 'Gist ID is required to enable sync',
      syncFailed: 'Sync failed',
      createGistFailed: 'Failed to create gist',
    },

    about: {
      title: 'About',
      feedbackMessage: 'Feel free to open issues for feature requests, bug reports, and feedback on GitHub!',
      reviewRequest: 'Leave a review 🙏',
      copyright: '© 2026 Matt Drake',
      github: 'GitHub',
    },
  },

  format: {
    leetcodeId: (id: string) => `#${id}`,
    stabilityDays: (days: string) => `${days}d`,
    characterCount: (count: number, max: number) => `${count}/${max}`,
    version: (version: string) => `v${version}`,
  },
} as const;

export default en;
