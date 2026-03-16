export interface Musician {
  id: string;
  name: string;
  instrument: string;
  stageX: number; // 0-100
  stageY: number; // 0-100
  color: string;
}

export interface SongEntry {
  id: string;
  type: 'song' | 'pause' | 'set-header';
  title: string;
  artist?: string;
  key?: string;
  bpm?: number;
  durationSeconds: number;
  notes?: string;
}

export interface Patch {
  id: string;
  channel: number;
  instrument: string;
  musicianId: string;
  mic?: string;
  stand?: boolean;
  diBox?: boolean;
  notes?: string;
}

export interface MonitorReturn {
  id: string;
  name: string;
  musicianId: string;
  patchVolumes: Record<string, number>; // patchId -> 0-100
}

export interface LightingFixture {
  id: string;
  type: 'PAR' | 'WASH' | 'SPOT' | 'STROBE' | 'BAR' | 'OTHER';
  name: string;
  dmxStart: number;
  dmxChannels: number;
  position: string;
  stageX: number; // 0-100
  stageY: number; // 0-100
  notes?: string;
}

export interface LightingCue {
  id: string;
  moment: string; // e.g. "Intro", "Verse 1", "Chorus"
  fixtureId: string;
  r: number;
  g: number;
  b: number;
  w: number;
  intensity: number; // 0-100
  notes?: string;
}

export interface SongLighting {
  mood: string;
  cues: LightingCue[];
}

export interface EventDetails {
  name: string;
  date: string;
  venue: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
}

export interface Schedule {
  loadIn: string;
  soundcheck: string;
  doors: string;
  showStart: string;
  showEnd: string;
  loadOut: string;
}

export interface GigSheetProject {
  id: string;
  name: string;
  bandName: string;
  createdAt: string;
  updatedAt: string;
  event: EventDetails;
  schedule: Schedule;
  musicians: Musician[];
  setlist: SongEntry[];
  patches: Patch[];
  songTrackMatrix: Record<string, Record<string, boolean>>; // songId -> patchId -> active
  monitorReturns: MonitorReturn[];
  lightingEquipment: LightingFixture[];
  lightingScript: Record<string, SongLighting>; // songId -> lighting
}

export type TabId = 'infos' | 'setlist' | 'son' | 'lumiere' | 'export';
export type ExportSubTab = 'rundown' | 'sound' | 'lighting';

export interface UIState {
  activeTab: TabId;
  activeExportSubTab: ExportSubTab;
  selectedSongId: string | null;
  lastSaved: string | null;
  isDirty: boolean;
}

export interface AppState {
  project: GigSheetProject;
  ui: UIState;
}
