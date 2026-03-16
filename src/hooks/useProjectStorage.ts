import { useCallback } from 'react';
import type { GigSheetProject } from '@/types';
import type { AppAction } from '@/store/actions';
import { saveProjectToStorage, clearProjectStorage } from './useAutoSave';

export function useProjectStorage(
  project: GigSheetProject,
  dispatch: React.Dispatch<AppAction>,
) {
  const exportProject = useCallback(() => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.gigsheet.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [project]);

  const importProject = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as GigSheetProject;
        dispatch({ type: 'project/load', project: data });
        saveProjectToStorage(data);
        dispatch({ type: 'ui/markSaved' });
      } catch (err) {
        alert('Fichier invalide : ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  }, [dispatch]);

  const newProject = useCallback((template: GigSheetProject) => {
    clearProjectStorage();
    dispatch({ type: 'project/load', project: template });
  }, [dispatch]);

  const quickSave = useCallback(() => {
    saveProjectToStorage(project);
    dispatch({ type: 'ui/markSaved' });
  }, [project, dispatch]);

  return { exportProject, importProject, newProject, quickSave };
}
