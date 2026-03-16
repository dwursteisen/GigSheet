import type {
  TabId, ExportSubTab, GigSheetProject, EventDetails, Schedule,
  Musician, SongEntry, Patch, MonitorReturn, LightingFixture, LightingCue,
} from '@/types';

// UI actions
type SetTab = { type: 'ui/setTab'; tab: TabId };
type SetExportSubTab = { type: 'ui/setExportSubTab'; subTab: ExportSubTab };
type SetSelectedSong = { type: 'ui/setSelectedSong'; songId: string | null };
type MarkSaved = { type: 'ui/markSaved' };
type MarkDirty = { type: 'ui/markDirty' };

// Project actions
type LoadProject = { type: 'project/load'; project: GigSheetProject };
type UpdateProjectMeta = { type: 'project/updateMeta'; name: string; bandName: string };
type UpdateEvent = { type: 'project/updateEvent'; event: Partial<EventDetails> };
type UpdateSchedule = { type: 'project/updateSchedule'; schedule: Partial<Schedule> };

// Musicians
type AddMusician = { type: 'musicians/add'; musician: Musician };
type UpdateMusician = { type: 'musicians/update'; id: string; changes: Partial<Musician> };
type RemoveMusician = { type: 'musicians/remove'; id: string };

// Setlist
type AddSetlistEntry = { type: 'setlist/add'; entry: SongEntry; afterId?: string };
type UpdateSetlistEntry = { type: 'setlist/update'; id: string; changes: Partial<SongEntry> };
type RemoveSetlistEntry = { type: 'setlist/remove'; id: string };
type MoveSetlistEntry = { type: 'setlist/move'; id: string; direction: 'up' | 'down' };

// Patches (Son)
type AddPatch = { type: 'patches/add'; patch: Patch };
type UpdatePatch = { type: 'patches/update'; id: string; changes: Partial<Patch> };
type RemovePatch = { type: 'patches/remove'; id: string };

// Song-Track Matrix
type ToggleMatrixCell = { type: 'matrix/toggle'; songId: string; patchId: string };

// Monitor Returns
type AddMonitorReturn = { type: 'monitors/add'; monitor: MonitorReturn };
type UpdateMonitorReturn = { type: 'monitors/update'; id: string; changes: Partial<MonitorReturn> };
type RemoveMonitorReturn = { type: 'monitors/remove'; id: string };
type SetMonitorVolume = { type: 'monitors/setVolume'; monitorId: string; patchId: string; volume: number };

// Lighting Equipment
type AddFixture = { type: 'lighting/addFixture'; fixture: LightingFixture };
type UpdateFixture = { type: 'lighting/updateFixture'; id: string; changes: Partial<LightingFixture> };
type RemoveFixture = { type: 'lighting/removeFixture'; id: string };

// Lighting Script
type SetSongMood = { type: 'lighting/setMood'; songId: string; mood: string };
type AddCue = { type: 'lighting/addCue'; songId: string; cue: LightingCue };
type UpdateCue = { type: 'lighting/updateCue'; songId: string; cueId: string; changes: Partial<LightingCue> };
type RemoveCue = { type: 'lighting/removeCue'; songId: string; cueId: string };

export type AppAction =
  | SetTab | SetExportSubTab | SetSelectedSong | MarkSaved | MarkDirty
  | LoadProject | UpdateProjectMeta | UpdateEvent | UpdateSchedule
  | AddMusician | UpdateMusician | RemoveMusician
  | AddSetlistEntry | UpdateSetlistEntry | RemoveSetlistEntry | MoveSetlistEntry
  | AddPatch | UpdatePatch | RemovePatch
  | ToggleMatrixCell
  | AddMonitorReturn | UpdateMonitorReturn | RemoveMonitorReturn | SetMonitorVolume
  | AddFixture | UpdateFixture | RemoveFixture
  | SetSongMood | AddCue | UpdateCue | RemoveCue;
