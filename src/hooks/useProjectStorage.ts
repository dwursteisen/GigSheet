import { useCallback } from 'react';
import type { GigSheetProject } from '@/types';
import type { AppAction } from '@/store/actions';
import { saveProjectToStorage, clearProjectStorage } from './useAutoSave';

export function useProjectStorage(
  project: GigSheetProject,
  dispatch: React.Dispatch<AppAction>,
) {
  const exportProject = useCallback(async () => {
    const data = JSON.stringify(project, null, 2);
    const fileName = `${project.name.replace(/\s+/g, '_')}.gigsheet.json`;

    if ('showSaveFilePicker' in window) {
      try {
        const showSaveFilePicker = (window as unknown as { showSaveFilePicker: (opts: { suggestedName: string; types: { description: string; accept: Record<string, string[]> }[] }) => Promise<FileSystemFileHandle> }).showSaveFilePicker;
        const handle = await showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'GigSheet JSON',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
        return;
      } catch (err) {
        if ((err as DOMException).name === 'AbortError') return;
      }
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
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
