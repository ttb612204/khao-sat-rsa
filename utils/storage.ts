const STORAGE_KEY = 'rsa_survey_draft';

export const saveDraft = (data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const loadDraft = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

export const clearDraft = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
