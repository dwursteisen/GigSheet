import { Plus, Trash2, User } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/store/context';
import { StagePlot } from '@/components/shared/StagePlot';
import type { EventDetails, Schedule } from '@/types';

const MUSICIAN_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f97316'];

export function InfosGenerales() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { event, schedule, musicians, bandName, name } = state.project;

  const updateEvent = (changes: Partial<EventDetails>) =>
    dispatch({ type: 'project/updateEvent', event: changes });
  const updateSchedule = (changes: Partial<Schedule>) =>
    dispatch({ type: 'project/updateSchedule', schedule: changes });

  const addMusician = () => {
    dispatch({
      type: 'musicians/add',
      musician: {
        id: crypto.randomUUID(),
        name: '',
        instrument: '',
        stageX: 50,
        stageY: 50,
        color: MUSICIAN_COLORS[musicians.length % MUSICIAN_COLORS.length],
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Project meta */}
      <section>
        <h2 className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Projet</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Nom du projet</span>
            <input type="text" value={name} onChange={(e) => dispatch({ type: 'project/updateMeta', name: e.target.value, bandName })} className="w-full" />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Nom du groupe</span>
            <input type="text" value={bandName} onChange={(e) => dispatch({ type: 'project/updateMeta', name, bandName: e.target.value })} className="w-full" />
          </label>
        </div>
      </section>

      {/* Event details */}
      <section>
        <h2 className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Événement</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Nom</span>
            <input type="text" value={event.name} onChange={(e) => updateEvent({ name: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Date</span>
            <input type="date" value={event.date} onChange={(e) => updateEvent({ date: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Lieu</span>
            <input type="text" value={event.venue} onChange={(e) => updateEvent({ venue: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Adresse</span>
            <input type="text" value={event.address} onChange={(e) => updateEvent({ address: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Contact</span>
            <input type="text" value={event.contactName} onChange={(e) => updateEvent({ contactName: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] text-gray-500">Téléphone</span>
            <input type="text" value={event.contactPhone} onChange={(e) => updateEvent({ contactPhone: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1 col-span-2">
            <span className="text-[11px] text-gray-500">Email</span>
            <input type="text" value={event.contactEmail} onChange={(e) => updateEvent({ contactEmail: e.target.value })} className="w-full" />
          </label>
          <label className="space-y-1 col-span-2">
            <span className="text-[11px] text-gray-500">Notes</span>
            <textarea value={event.notes} onChange={(e) => updateEvent({ notes: e.target.value })} rows={2} className="w-full" />
          </label>
        </div>
      </section>

      {/* Schedule */}
      <section>
        <h2 className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Planning</h2>
        <div className="grid grid-cols-3 gap-3">
          {([
            ['loadIn', 'Chargement'],
            ['soundcheck', 'Soundcheck'],
            ['doors', 'Ouverture portes'],
            ['showStart', 'Début concert'],
            ['showEnd', 'Fin concert'],
            ['loadOut', 'Déchargement'],
          ] as const).map(([key, label]) => (
            <label key={key} className="space-y-1">
              <span className="text-[11px] text-gray-500">{label}</span>
              <input type="time" value={schedule[key]} onChange={(e) => updateSchedule({ [key]: e.target.value })} className="w-full" />
            </label>
          ))}
        </div>
      </section>

      {/* Musicians */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-accent text-sm font-bold uppercase tracking-wider">Musiciens</h2>
          <button onClick={addMusician} className="flex items-center gap-1 text-[11px] text-accent hover:text-amber-400 transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {musicians.map((m) => (
            <div key={m.id} className="flex items-center gap-2 bg-console-surface rounded p-2 border border-console-border">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
              <User size={12} className="text-gray-500" />
              <input
                type="text"
                value={m.name}
                onChange={(e) => dispatch({ type: 'musicians/update', id: m.id, changes: { name: e.target.value } })}
                placeholder="Nom"
                className="flex-1 min-w-0"
              />
              <input
                type="text"
                value={m.instrument}
                onChange={(e) => dispatch({ type: 'musicians/update', id: m.id, changes: { instrument: e.target.value } })}
                placeholder="Instrument"
                className="flex-1 min-w-0"
              />
              <input
                type="color"
                value={m.color}
                onChange={(e) => dispatch({ type: 'musicians/update', id: m.id, changes: { color: e.target.value } })}
                className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
              />
              <button
                onClick={() => {
                  if (confirm(`Supprimer ${m.name || 'ce musicien'} ?`)) {
                    dispatch({ type: 'musicians/remove', id: m.id });
                  }
                }}
                className="text-gray-500 hover:text-vu-red transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Stage plot */}
      <section>
        <h2 className="text-accent text-sm font-bold mb-3 uppercase tracking-wider">Plan de scène</h2>
        <p className="text-[11px] text-gray-500 mb-2">Glissez les musiciens pour les positionner sur la scène.</p>
        <StagePlot
          musicians={musicians}
          interactive
          onMove={(id, x, y) => dispatch({ type: 'musicians/update', id, changes: { stageX: x, stageY: y } })}
          width={500}
          height={300}
        />
      </section>
    </div>
  );
}
