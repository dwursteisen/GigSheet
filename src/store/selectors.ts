import type { AppState, SongEntry, Musician, Patch } from '@/types';

export function getSongs(state: AppState): SongEntry[] {
  return state.project.setlist.filter(e => e.type === 'song');
}

export function getTotalDuration(state: AppState): number {
  return state.project.setlist.reduce((sum, e) => sum + e.durationSeconds, 0);
}

export function getSetDurations(state: AppState): { set: number; duration: number }[] {
  const sets: { set: number; duration: number }[] = [];
  let currentSet = 0;
  let currentDuration = 0;

  for (const entry of state.project.setlist) {
    if (entry.type === 'set-header') {
      if (currentSet > 0 || currentDuration > 0) {
        sets.push({ set: currentSet || 1, duration: currentDuration });
      }
      currentSet = sets.length + 1;
      currentDuration = 0;
    } else {
      currentDuration += entry.durationSeconds;
    }
  }
  if (currentDuration > 0 || currentSet > 0) {
    sets.push({ set: currentSet || 1, duration: currentDuration });
  }
  return sets;
}

export function getComputedEndTime(state: AppState): string {
  const { showStart } = state.project.schedule;
  if (!showStart) return '';
  const [h, m] = showStart.split(':').map(Number);
  const totalSec = getTotalDuration(state);
  const endMinutes = h * 60 + m + Math.ceil(totalSec / 60);
  const endH = Math.floor(endMinutes / 60) % 24;
  const endM = endMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export function getMusicianById(state: AppState, id: string): Musician | undefined {
  return state.project.musicians.find(m => m.id === id);
}

export function getPatchById(state: AppState, id: string): Patch | undefined {
  return state.project.patches.find(p => p.id === id);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDurationLong(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`;
  return `${m}min`;
}

export function getEntryStartTime(state: AppState, entryId: string): string {
  const { showStart } = state.project.schedule;
  if (!showStart) return '';
  const [h, m] = showStart.split(':').map(Number);
  let totalSec = 0;
  for (const entry of state.project.setlist) {
    if (entry.id === entryId) break;
    totalSec += entry.durationSeconds;
  }
  const startMinutes = h * 60 + m + Math.floor(totalSec / 60);
  const sH = Math.floor(startMinutes / 60) % 24;
  const sM = startMinutes % 60;
  return `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`;
}
