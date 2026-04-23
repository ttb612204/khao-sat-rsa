const STORAGE_KEY = 'rsa_survey_draft';
const STORAGE_VERSION_KEY = 'rsa_survey_version';
const CURRENT_VERSION = '1.0.4'; // Tăng version mỗi khi thay đổi cấu trúc form

export const saveDraft = (data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  }
};

export const loadDraft = () => {
  if (typeof window !== 'undefined') {
    const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    // Nếu phiên bản cũ hoặc không khớp, xóa bản nháp cũ
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_VERSION_KEY);
      return null;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

export const clearDraft = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
  }
};
