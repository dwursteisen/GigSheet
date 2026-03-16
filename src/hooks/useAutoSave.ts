import { useEffect, useRef } from 'react';
import type { GigSheetProject } from '@/types';

const STORAGE_KEY = 'gigsheet_project';

export function useAutoSave(project: GigSheetProject, isDirty: boolean, onSaved: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!isDirty) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const data = { ...project, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      onSaved();
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [project, isDirty, onSaved]);
}

export function loadProjectFromStorage(): GigSheetProject | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GigSheetProject;
  } catch {
    return null;
  }
}

export function saveProjectToStorage(project: GigSheetProject) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

export function clearProjectStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
