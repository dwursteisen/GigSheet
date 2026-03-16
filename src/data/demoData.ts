import type { GigSheetProject } from '@/types';

const id = () => crypto.randomUUID();

const musicianIds = {
  vocals: id(),
  guitar1: id(),
  guitar2: id(),
  bass: id(),
  drums: id(),
  keys: id(),
};

const songIds = {
  s1: id(), s2: id(), s3: id(), s4: id(), s5: id(),
  s6: id(), s7: id(), s8: id(), s9: id(), s10: id(),
};

const patchIds = {
  vocalMic: id(),
  guitar1DI: id(),
  guitar2DI: id(),
  bassDI: id(),
  kick: id(),
  snare: id(),
  ohL: id(),
  ohR: id(),
  keys_L: id(),
  keys_R: id(),
};

const fixtureIds = {
  parL: id(), parR: id(), parC: id(),
  washL: id(), washR: id(),
  strobe: id(),
};

export const demoProject: GigSheetProject = {
  id: id(),
  name: 'Fête de la Musique 2026',
  bandName: 'Les Satellites',
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z',
  event: {
    name: 'Fête de la Musique 2026',
    date: '2026-06-21',
    venue: 'Place de la République',
    address: 'Place de la République, 75003 Paris',
    contactName: 'Marie Dupont',
    contactPhone: '06 12 34 56 78',
    contactEmail: 'marie@fetedelamusique.fr',
    notes: 'Scène principale côté Est. Accès camion par rue du Temple.',
  },
  schedule: {
    loadIn: '16:00',
    soundcheck: '17:00',
    doors: '19:00',
    showStart: '20:30',
    showEnd: '23:00',
    loadOut: '23:30',
  },
  musicians: [
    { id: musicianIds.vocals, name: 'Julie', instrument: 'Chant', stageX: 50, stageY: 25, color: '#f59e0b' },
    { id: musicianIds.guitar1, name: 'Nico', instrument: 'Guitare Lead', stageX: 30, stageY: 40, color: '#ef4444' },
    { id: musicianIds.guitar2, name: 'Alex', instrument: 'Guitare Rythmique', stageX: 70, stageY: 40, color: '#3b82f6' },
    { id: musicianIds.bass, name: 'Sam', instrument: 'Basse', stageX: 20, stageY: 60, color: '#22c55e' },
    { id: musicianIds.drums, name: 'Max', instrument: 'Batterie', stageX: 50, stageY: 75, color: '#a855f7' },
    { id: musicianIds.keys, name: 'Léa', instrument: 'Clavier', stageX: 80, stageY: 60, color: '#ec4899' },
  ],
  setlist: [
    { id: id(), type: 'set-header', title: 'SET 1', durationSeconds: 0 },
    { id: songIds.s1, type: 'song', title: 'Cosmic Highway', artist: 'Les Satellites', key: 'Em', bpm: 128, durationSeconds: 240, notes: 'Intro longue avec delay' },
    { id: songIds.s2, type: 'song', title: 'Nuit Électrique', artist: 'Les Satellites', key: 'Am', bpm: 135, durationSeconds: 210, notes: 'Break batterie avant refrain 2' },
    { id: songIds.s3, type: 'song', title: 'Satellite Love', artist: 'Les Satellites', key: 'C', bpm: 120, durationSeconds: 195, notes: '' },
    { id: songIds.s4, type: 'song', title: 'Vague à l\'Âme', artist: 'Les Satellites', key: 'G', bpm: 95, durationSeconds: 270, notes: 'Solo guitare lead' },
    { id: songIds.s5, type: 'song', title: 'Hyperdrive', artist: 'Les Satellites', key: 'Bm', bpm: 145, durationSeconds: 200, notes: 'Fin abrupte' },
    { id: id(), type: 'pause', title: 'Pause', durationSeconds: 900, notes: '' },
    { id: id(), type: 'set-header', title: 'SET 2', durationSeconds: 0 },
    { id: songIds.s6, type: 'song', title: 'Aurore Boréale', artist: 'Les Satellites', key: 'D', bpm: 110, durationSeconds: 255, notes: 'Démarrage clavier seul' },
    { id: songIds.s7, type: 'song', title: 'Gravity Pull', artist: 'Les Satellites', key: 'F#m', bpm: 140, durationSeconds: 225, notes: '' },
    { id: songIds.s8, type: 'song', title: 'Fréquence Noire', artist: 'Les Satellites', key: 'Dm', bpm: 130, durationSeconds: 210, notes: 'Effet wah sur guitare rythmique' },
    { id: songIds.s9, type: 'song', title: 'Dernière Orbite', artist: 'Les Satellites', key: 'A', bpm: 100, durationSeconds: 300, notes: 'Ballade — spots seuls' },
    { id: songIds.s10, type: 'song', title: 'Supernova', artist: 'Les Satellites', key: 'E', bpm: 155, durationSeconds: 270, notes: 'Rappel — tout le monde sur scène' },
  ],
  patches: [
    { id: patchIds.vocalMic, channel: 1, instrument: 'Chant', musicianId: musicianIds.vocals, mic: 'SM58', stand: true, diBox: false, notes: '' },
    { id: patchIds.guitar1DI, channel: 2, instrument: 'Guitare Lead', musicianId: musicianIds.guitar1, mic: 'SM57 (cab)', stand: true, diBox: false, notes: 'Ampli Marshall' },
    { id: patchIds.guitar2DI, channel: 3, instrument: 'Guitare Rythmique', musicianId: musicianIds.guitar2, mic: '', stand: false, diBox: true, notes: 'Modeler direct' },
    { id: patchIds.bassDI, channel: 4, instrument: 'Basse', musicianId: musicianIds.bass, mic: '', stand: false, diBox: true, notes: '' },
    { id: patchIds.kick, channel: 5, instrument: 'Kick', musicianId: musicianIds.drums, mic: 'Beta 52', stand: false, diBox: false, notes: '' },
    { id: patchIds.snare, channel: 6, instrument: 'Snare', musicianId: musicianIds.drums, mic: 'SM57', stand: false, diBox: false, notes: '' },
    { id: patchIds.ohL, channel: 7, instrument: 'OH L', musicianId: musicianIds.drums, mic: 'C214', stand: true, diBox: false, notes: '' },
    { id: patchIds.ohR, channel: 8, instrument: 'OH R', musicianId: musicianIds.drums, mic: 'C214', stand: true, diBox: false, notes: '' },
    { id: patchIds.keys_L, channel: 9, instrument: 'Keys L', musicianId: musicianIds.keys, mic: '', stand: false, diBox: true, notes: 'Stéréo gauche' },
    { id: patchIds.keys_R, channel: 10, instrument: 'Keys R', musicianId: musicianIds.keys, mic: '', stand: false, diBox: true, notes: 'Stéréo droite' },
  ],
  songTrackMatrix: Object.fromEntries(
    Object.values(songIds).map(sId => [
      sId,
      Object.fromEntries(
        Object.values(patchIds).map(pId => [pId, true])
      ),
    ])
  ),
  monitorReturns: [
    {
      id: id(), name: 'Retour 1 — Julie', musicianId: musicianIds.vocals,
      patchVolumes: { [patchIds.vocalMic]: 80, [patchIds.guitar1DI]: 40, [patchIds.keys_L]: 30 },
    },
    {
      id: id(), name: 'Retour 2 — Nico', musicianId: musicianIds.guitar1,
      patchVolumes: { [patchIds.vocalMic]: 50, [patchIds.guitar1DI]: 70, [patchIds.kick]: 40, [patchIds.snare]: 30 },
    },
    {
      id: id(), name: 'Retour 3 — Max', musicianId: musicianIds.drums,
      patchVolumes: { [patchIds.vocalMic]: 40, [patchIds.bassDI]: 60, [patchIds.guitar1DI]: 30 },
    },
  ],
  lightingEquipment: [
    { id: fixtureIds.parL, type: 'PAR', name: 'PAR Gauche', dmxStart: 1, dmxChannels: 4, position: 'Truss gauche', stageX: 20, stageY: 10, coneAngle: 180, coneLength: 15, notes: '' },
    { id: fixtureIds.parR, type: 'PAR', name: 'PAR Droit', dmxStart: 5, dmxChannels: 4, position: 'Truss droite', stageX: 80, stageY: 10, coneAngle: 180, coneLength: 15, notes: '' },
    { id: fixtureIds.parC, type: 'PAR', name: 'PAR Centre', dmxStart: 9, dmxChannels: 4, position: 'Truss centre', stageX: 50, stageY: 10, coneAngle: 180, coneLength: 15, notes: '' },
    { id: fixtureIds.washL, type: 'WASH', name: 'Wash Gauche', dmxStart: 13, dmxChannels: 7, position: 'Sol cour', stageX: 15, stageY: 55, coneAngle: 0, coneLength: 15, notes: '' },
    { id: fixtureIds.washR, type: 'WASH', name: 'Wash Droit', dmxStart: 20, dmxChannels: 7, position: 'Sol jardin', stageX: 85, stageY: 55, coneAngle: 0, coneLength: 15, notes: '' },
    { id: fixtureIds.strobe, type: 'STROBE', name: 'Strobe', dmxStart: 27, dmxChannels: 2, position: 'Truss centre', stageX: 50, stageY: 5, coneAngle: 180, coneLength: 10, notes: 'Utiliser avec parcimonie' },
  ],
  lightingScript: {
    [songIds.s1]: {
      mood: 'Montée progressive — bleu vers ambre',
      cues: [
        { id: id(), moment: 'Intro', fixtureId: fixtureIds.washL, r: 0, g: 30, b: 180, notes: 'Bleu diffus' },
        { id: id(), moment: 'Intro', fixtureId: fixtureIds.washR, r: 0, g: 30, b: 180, notes: '' },
        { id: id(), moment: 'Couplet 1', fixtureId: fixtureIds.parL, r: 200, g: 120, b: 0, notes: '' },
        { id: id(), moment: 'Refrain', fixtureId: fixtureIds.parC, r: 245, g: 158, b: 11, notes: 'Full ambre' },
      ],
    },
    [songIds.s5]: {
      mood: 'Énergie maximale — rouge et strobe',
      cues: [
        { id: id(), moment: 'Couplet', fixtureId: fixtureIds.parL, r: 220, g: 0, b: 0, notes: '' },
        { id: id(), moment: 'Couplet', fixtureId: fixtureIds.parR, r: 220, g: 0, b: 0, notes: '' },
        { id: id(), moment: 'Refrain', fixtureId: fixtureIds.strobe, r: 255, g: 255, b: 255, notes: 'Burst court' },
      ],
    },
    [songIds.s9]: {
      mood: 'Intimiste — blanc chaud, spots seuls',
      cues: [
        { id: id(), moment: 'Toute la chanson', fixtureId: fixtureIds.parC, r: 255, g: 200, b: 100, notes: 'Spot seul sur Julie' },
      ],
    },
    [songIds.s10]: {
      mood: 'Grand final — toutes couleurs, crescendo',
      cues: [
        { id: id(), moment: 'Intro', fixtureId: fixtureIds.washL, r: 100, g: 0, b: 200, notes: '' },
        { id: id(), moment: 'Intro', fixtureId: fixtureIds.washR, r: 200, g: 0, b: 100, notes: '' },
        { id: id(), moment: 'Refrain final', fixtureId: fixtureIds.parL, r: 255, g: 200, b: 0, notes: '' },
        { id: id(), moment: 'Refrain final', fixtureId: fixtureIds.parR, r: 255, g: 200, b: 0, notes: '' },
        { id: id(), moment: 'Refrain final', fixtureId: fixtureIds.parC, r: 255, g: 255, b: 255, notes: 'Full blast' },
        { id: id(), moment: 'Outro', fixtureId: fixtureIds.strobe, r: 255, g: 255, b: 255, notes: 'Strobe final 3sec' },
      ],
    },
  },
};
