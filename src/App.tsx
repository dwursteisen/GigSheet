import { useReducer, useCallback, useEffect, useState, useRef } from 'react';
import { AppStateContext, AppDispatchContext } from '@/store/context';
import { appReducer } from '@/store/reducer';
import { useAutoSave, loadProjectFromStorage, saveProjectToStorage } from '@/hooks/useAutoSave';
import { demoProject } from '@/data/demoData';
import { decodeProjectFromUrl } from '@/utils/shareUrl';
import { Layout } from '@/components/Layout';
import { Modal } from '@/components/shared/Modal';
import { InfosGenerales } from '@/components/tabs/InfosGenerales';
import { Setlist } from '@/components/tabs/Setlist';
import { Son } from '@/components/tabs/Son';
import { Lumiere } from '@/components/tabs/Lumiere';
import { Export } from '@/components/tabs/Export';
import type { AppState, GigSheetProject } from '@/types';

function getInitialState(): AppState {
  const saved = loadProjectFromStorage();
  return {
    project: saved ?? demoProject,
    ui: {
      activeTab: 'infos',
      activeExportSubTab: 'rundown',
      selectedSongId: null,
      lastSaved: saved ? new Date().toISOString() : null,
      isDirty: false,
    },
  };
}

function App() {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);
  const [showImportModal, setShowImportModal] = useState(false);
  const pendingImport = useRef<GigSheetProject | null>(null);

  const onSaved = useCallback(() => {
    dispatch({ type: 'ui/markSaved' });
  }, []);

  useAutoSave(state.project, state.ui.isDirty, onSaved);

  // Check URL for shared project on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectParam = params.get('project');
    if (!projectParam) return;

    // Clean URL immediately
    history.replaceState(null, '', window.location.pathname);

    decodeProjectFromUrl(projectParam).then((project) => {
      const hasExisting = loadProjectFromStorage() !== null;
      if (hasExisting) {
        pendingImport.current = project;
        setShowImportModal(true);
      } else {
        dispatch({ type: 'project/load', project });
        saveProjectToStorage(project);
        dispatch({ type: 'ui/markSaved' });
      }
    }).catch(() => {
      // Invalid share link — silently ignore
    });
  }, []);

  const confirmImport = () => {
    if (pendingImport.current) {
      dispatch({ type: 'project/load', project: pendingImport.current });
      saveProjectToStorage(pendingImport.current);
      dispatch({ type: 'ui/markSaved' });
      pendingImport.current = null;
    }
    setShowImportModal(false);
  };

  // Ctrl+S shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        dispatch({ type: 'ui/markDirty' }); // triggers auto-save
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const tab = state.ui.activeTab;

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <Layout>
          {tab === 'infos' && <InfosGenerales />}
          {tab === 'setlist' && <Setlist />}
          {tab === 'son' && <Son />}
          {tab === 'lumiere' && <Lumiere />}
          {tab === 'export' && <Export />}
        </Layout>
        <Modal open={showImportModal} onClose={() => setShowImportModal(false)} title="Importer un projet partagé">
          <p className="text-sm text-gray-600 mb-4">
            Un projet partagé a été détecté dans le lien. Cela va remplacer votre projet actuel.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowImportModal(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmImport}
              className="px-3 py-1.5 text-sm bg-accent text-white rounded hover:opacity-90 transition-colors"
            >
              OK
            </button>
          </div>
        </Modal>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;
