import type { AppState } from '@/types';
import type { AppAction } from './actions';

function removeMatrixReferences(
  matrix: Record<string, Record<string, boolean>>,
  key: 'song' | 'patch',
  id: string,
): Record<string, Record<string, boolean>> {
  if (key === 'song') {
    const { [id]: _, ...rest } = matrix;
    void _;
    return rest;
  }
  const result: Record<string, Record<string, boolean>> = {};
  for (const [songId, patches] of Object.entries(matrix)) {
    const { [id]: _, ...rest } = patches;
    void _;
    result[songId] = rest;
  }
  return result;
}

function removeFxSendReferences(
  sends: Record<string, Record<string, Record<string, boolean>>>,
  key: 'song' | 'bus' | 'patch',
  id: string,
): Record<string, Record<string, Record<string, boolean>>> {
  if (key === 'song') {
    const { [id]: _, ...rest } = sends;
    void _;
    return rest;
  }
  if (key === 'bus') {
    const result: Record<string, Record<string, Record<string, boolean>>> = {};
    for (const [songId, buses] of Object.entries(sends)) {
      const { [id]: _, ...rest } = buses;
      void _;
      result[songId] = rest;
    }
    return result;
  }
  // key === 'patch'
  const result: Record<string, Record<string, Record<string, boolean>>> = {};
  for (const [songId, buses] of Object.entries(sends)) {
    const newBuses: Record<string, Record<string, boolean>> = {};
    for (const [busId, patches] of Object.entries(buses)) {
      const { [id]: _, ...rest } = patches;
      void _;
      newBuses[busId] = rest;
    }
    result[songId] = newBuses;
  }
  return result;
}

export function appReducer(state: AppState, action: AppAction): AppState {
  const markDirty = (s: AppState): AppState => ({
    ...s,
    ui: { ...s.ui, isDirty: true },
  });

  switch (action.type) {
    // UI
    case 'ui/setTab':
      return { ...state, ui: { ...state.ui, activeTab: action.tab } };
    case 'ui/setExportSubTab':
      return { ...state, ui: { ...state.ui, activeExportSubTab: action.subTab } };
    case 'ui/setSelectedSong':
      return { ...state, ui: { ...state.ui, selectedSongId: action.songId } };
    case 'ui/markSaved':
      return { ...state, ui: { ...state.ui, lastSaved: new Date().toISOString(), isDirty: false } };
    case 'ui/markDirty':
      return { ...state, ui: { ...state.ui, isDirty: true } };

    // Project load
    case 'project/load':
      return { ...state, project: action.project, ui: { ...state.ui, isDirty: false } };
    case 'project/updateMeta':
      return markDirty({ ...state, project: { ...state.project, name: action.name, bandName: action.bandName } });
    case 'project/updateEvent':
      return markDirty({ ...state, project: { ...state.project, event: { ...state.project.event, ...action.event } } });
    case 'project/updateSchedule':
      return markDirty({ ...state, project: { ...state.project, schedule: { ...state.project.schedule, ...action.schedule } } });

    // Musicians
    case 'musicians/add':
      return markDirty({ ...state, project: { ...state.project, musicians: [...state.project.musicians, action.musician] } });
    case 'musicians/update':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          musicians: state.project.musicians.map(m =>
            m.id === action.id ? { ...m, ...action.changes } : m
          ),
        },
      });
    case 'musicians/remove': {
      const patches = state.project.patches.filter(p => p.musicianId !== action.id);
      const removedPatchIds = state.project.patches
        .filter(p => p.musicianId === action.id)
        .map(p => p.id);
      let matrix = state.project.songTrackMatrix;
      let fxSends = state.project.songFxSends;
      for (const pid of removedPatchIds) {
        matrix = removeMatrixReferences(matrix, 'patch', pid);
        fxSends = removeFxSendReferences(fxSends, 'patch', pid);
      }
      return markDirty({
        ...state,
        project: {
          ...state.project,
          musicians: state.project.musicians.filter(m => m.id !== action.id),
          patches,
          songTrackMatrix: matrix,
          songFxSends: fxSends,
          monitorReturns: state.project.monitorReturns.filter(mr => mr.musicianId !== action.id),
        },
      });
    }

    // Setlist
    case 'setlist/add': {
      const list = [...state.project.setlist];
      if (action.afterId) {
        const idx = list.findIndex(e => e.id === action.afterId);
        list.splice(idx + 1, 0, action.entry);
      } else {
        list.push(action.entry);
      }
      return markDirty({ ...state, project: { ...state.project, setlist: list } });
    }
    case 'setlist/update':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          setlist: state.project.setlist.map(e =>
            e.id === action.id ? { ...e, ...action.changes } : e
          ),
        },
      });
    case 'setlist/remove': {
      const entry = state.project.setlist.find(e => e.id === action.id);
      let matrix = state.project.songTrackMatrix;
      let fxSends = state.project.songFxSends;
      let script = state.project.lightingScript;
      if (entry?.type === 'song') {
        matrix = removeMatrixReferences(matrix, 'song', action.id);
        fxSends = removeFxSendReferences(fxSends, 'song', action.id);
        const { [action.id]: _, ...restScript } = script;
        void _;
        script = restScript;
      }
      return markDirty({
        ...state,
        project: {
          ...state.project,
          setlist: state.project.setlist.filter(e => e.id !== action.id),
          songTrackMatrix: matrix,
          songFxSends: fxSends,
          lightingScript: script,
        },
      });
    }
    case 'setlist/move': {
      const list = [...state.project.setlist];
      const idx = list.findIndex(e => e.id === action.id);
      if (idx < 0) return state;
      const newIdx = action.direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= list.length) return state;
      [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
      return markDirty({ ...state, project: { ...state.project, setlist: list } });
    }

    // Patches
    case 'patches/add':
      return markDirty({ ...state, project: { ...state.project, patches: [...state.project.patches, action.patch] } });
    case 'patches/update':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          patches: state.project.patches.map(p =>
            p.id === action.id ? { ...p, ...action.changes } : p
          ),
        },
      });
    case 'patches/remove':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          patches: state.project.patches.filter(p => p.id !== action.id),
          songTrackMatrix: removeMatrixReferences(state.project.songTrackMatrix, 'patch', action.id),
          songFxSends: removeFxSendReferences(state.project.songFxSends, 'patch', action.id),
        },
      });

    // Matrix
    case 'matrix/toggle': {
      const songPatches = state.project.songTrackMatrix[action.songId] ?? {};
      const current = songPatches[action.patchId] ?? false;
      return markDirty({
        ...state,
        project: {
          ...state.project,
          songTrackMatrix: {
            ...state.project.songTrackMatrix,
            [action.songId]: {
              ...songPatches,
              [action.patchId]: !current,
            },
          },
        },
      });
    }

    // FX Buses
    case 'fx/addBus':
      return markDirty({ ...state, project: { ...state.project, fxBuses: [...state.project.fxBuses, action.bus] } });
    case 'fx/updateBus':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          fxBuses: state.project.fxBuses.map(b =>
            b.id === action.id ? { ...b, ...action.changes } : b
          ),
        },
      });
    case 'fx/removeBus':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          fxBuses: state.project.fxBuses.filter(b => b.id !== action.id),
          songFxSends: removeFxSendReferences(state.project.songFxSends, 'bus', action.id),
        },
      });
    case 'fx/toggleSend': {
      const songBuses = state.project.songFxSends[action.songId] ?? {};
      const busPatches = songBuses[action.fxBusId] ?? {};
      const current = busPatches[action.patchId] ?? false;
      return markDirty({
        ...state,
        project: {
          ...state.project,
          songFxSends: {
            ...state.project.songFxSends,
            [action.songId]: {
              ...songBuses,
              [action.fxBusId]: {
                ...busPatches,
                [action.patchId]: !current,
              },
            },
          },
        },
      });
    }

    // Monitors
    case 'monitors/add':
      return markDirty({ ...state, project: { ...state.project, monitorReturns: [...state.project.monitorReturns, action.monitor] } });
    case 'monitors/update':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          monitorReturns: state.project.monitorReturns.map(m =>
            m.id === action.id ? { ...m, ...action.changes } : m
          ),
        },
      });
    case 'monitors/remove':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          monitorReturns: state.project.monitorReturns.filter(m => m.id !== action.id),
        },
      });
    case 'monitors/setVolume': {
      return markDirty({
        ...state,
        project: {
          ...state.project,
          monitorReturns: state.project.monitorReturns.map(m =>
            m.id === action.monitorId
              ? { ...m, patchVolumes: { ...m.patchVolumes, [action.patchId]: action.volume } }
              : m
          ),
        },
      });
    }

    // Lighting fixtures
    case 'lighting/addFixture':
      return markDirty({ ...state, project: { ...state.project, lightingEquipment: [...state.project.lightingEquipment, action.fixture] } });
    case 'lighting/updateFixture':
      return markDirty({
        ...state,
        project: {
          ...state.project,
          lightingEquipment: state.project.lightingEquipment.map(f =>
            f.id === action.id ? { ...f, ...action.changes } : f
          ),
        },
      });
    case 'lighting/removeFixture': {
      const newScript: Record<string, { mood: string; cues: typeof state.project.lightingScript[string]['cues'] }> = {};
      for (const [songId, sl] of Object.entries(state.project.lightingScript)) {
        newScript[songId] = {
          mood: sl.mood,
          cues: sl.cues.filter(c => c.fixtureId !== action.id),
        };
      }
      return markDirty({
        ...state,
        project: {
          ...state.project,
          lightingEquipment: state.project.lightingEquipment.filter(f => f.id !== action.id),
          lightingScript: newScript,
        },
      });
    }

    // Lighting script
    case 'lighting/setMood': {
      const existing = state.project.lightingScript[action.songId] ?? { mood: '', cues: [] };
      return markDirty({
        ...state,
        project: {
          ...state.project,
          lightingScript: {
            ...state.project.lightingScript,
            [action.songId]: { ...existing, mood: action.mood },
          },
        },
      });
    }
    case 'lighting/addCue': {
      const existing = state.project.lightingScript[action.songId] ?? { mood: '', cues: [] };
      return markDirty({
        ...state,
        project: {
          ...state.project,
          lightingScript: {
            ...state.project.lightingScript,
            [action.songId]: { ...existing, cues: [...existing.cues, action.cue] },
          },
        },
      });
    }
    case 'lighting/updateCue': {
      const existing = state.project.lightingScript[action.songId];
      if (!existing) return state;
      return markDirty({
        ...state,
        project: {
          ...state.project,
          lightingScript: {
            ...state.project.lightingScript,
            [action.songId]: {
              ...existing,
              cues: existing.cues.map(c =>
                c.id === action.cueId ? { ...c, ...action.changes } : c
              ),
            },
          },
        },
      });
    }
    case 'lighting/removeCue': {
      const existing = state.project.lightingScript[action.songId];
      if (!existing) return state;
      return markDirty({
        ...state,
        project: {
          ...state.project,
          lightingScript: {
            ...state.project.lightingScript,
            [action.songId]: {
              ...existing,
              cues: existing.cues.filter(c => c.id !== action.cueId),
            },
          },
        },
      });
    }

    default:
      return state;
  }
}
