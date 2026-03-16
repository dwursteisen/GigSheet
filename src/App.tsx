import { useReducer, useCallback, useEffect } from 'react';
import { AppStateContext, AppDispatchContext } from '@/store/context';
import { appReducer } from '@/store/reducer';
import { useAutoSave, loadProjectFromStorage } from '@/hooks/useAutoSave';
import { demoProject } from '@/data/demoData';
import { Layout } from '@/components/Layout';
import { InfosGenerales } from '@/components/tabs/InfosGenerales';
import { Setlist } from '@/components/tabs/Setlist';
import { Son } from '@/components/tabs/Son';
import { Lumiere } from '@/components/tabs/Lumiere';
import { Export } from '@/components/tabs/Export';
import type { AppState } from '@/types';

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

  const onSaved = useCallback(() => {
    dispatch({ type: 'ui/markSaved' });
  }, []);

  useAutoSave(state.project, state.ui.isDirty, onSaved);

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
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;
