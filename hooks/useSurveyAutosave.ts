import { useEffect, useRef } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { saveDraft } from '@/utils/storage';

export const useSurveyAutosave = (watch: UseFormWatch<any>, delay: number = 2000) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const subscription = watch((value) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        saveDraft(value);
        console.log('Draft saved at', new Date().toLocaleTimeString());
      }, delay);
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [watch, delay]);
};
