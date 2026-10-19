import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { DEPARTEMENTS } from '../data/departements'

const GROUPES = [
  { key: 'bt', label: 'BT' },
  { key: 'bts', label: 'BTS' },
  { key: 'licences', label: 'Licences' },
  { key: 'masters', label: 'Masters' },
]

/* ── Desktop : bouton "Filières" + panneau déroulant simple, à plat ────────── */
// Une seule grille de départements listant directement leurs licences —
// plus de colonne latérale colorée ni de bascule département par département.
export function FilieresMenuDesktop({ triggerClassName }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={triggerClassName}
      >
        Filières <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed top-16 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-auto w-[760px] max-w-full max-h-[80vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl"
            >
              <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-6">
                {DEPARTEMENTS.map(d => (
                  <div key={d.id}>
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 mb-2">{d.nom.replace('Département ', '')}</div>
                    <ul className="space-y-1">
                      {[...new Set(d.licences || [])].map(nom => (
                        <li key={nom}>
                          <Link to="/pre-inscription" onClick={() => setOpen(false)}
                            className="text-sm text-slate-700 hover:text-teal-700 transition-colors block leading-snug py-0.5">
                            {nom}
                          </Link>
                        </li>
                      ))}
                      {d.ingenieur && (
                        <li>
                          <Link to="/pre-inscription" onClick={() => setOpen(false)}
                            className="text-sm text-slate-700 hover:text-teal-700 transition-colors flex items-center gap-1.5 py-0.5">
                            <GraduationCap size={13} className="flex-shrink-0"/> {d.ingenieur}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
                <Link to="/pre-inscription" onClick={() => setOpen(false)} className="text-teal-600 font-semibold">Pré-inscrivez-vous →</Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Mobile : accordéon imbriqué (Département → BT/BTS/Licences/Masters/Ingénieur) ── */
export function FilieresMenuMobile({ onNavigate }) {
  const [openDept, setOpenDept] = useState(null)

  return (
    <div className="rounded-xl overflow-hidden border border-slate-100">
      {DEPARTEMENTS.map(d => {
        const groupesActifs = GROUPES.filter(g => (d[g.key] || []).length > 0)
        return (
          <div key={d.id} className="border-b border-slate-100 last:border-0">
            <button
              onClick={() => setOpenDept(o => o === d.id ? null : d.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-50/60"
            >
              <span className="text-left">{d.nom.replace('Département ', '')}</span>
              <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${openDept === d.id ? 'rotate-180' : ''}`}/>
            </button>
            <AnimatePresence>
              {openDept === d.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-4">
                    {groupesActifs.map(g => (
                      <div key={g.key}>
                        <div className="text-[11px] font-black uppercase tracking-wider text-teal-600 mb-1.5">{g.label}</div>
                        <div className="space-y-1">
                          {d[g.key].map(nom => (
                            <Link key={nom} to="/pre-inscription" onClick={onNavigate}
                              className="block text-sm text-slate-600 py-1">{nom}</Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    {d.ingenieur && (
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-wider text-teal-600 mb-1.5">Cycle Ingénieur</div>
                        <Link to="/pre-inscription" onClick={onNavigate}
                          className="text-sm text-slate-600 py-1 flex items-center gap-1.5">
                          <GraduationCap size={13}/> {d.ingenieur}
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
      <div className="px-4 py-2.5 text-[11px] text-slate-400 bg-slate-50/60">
        Les inscriptions démarrent selon le programme — septembre, octobre ou novembre.
      </div>
    </div>
  )
}
