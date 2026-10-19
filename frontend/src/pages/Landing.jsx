import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  X, ChevronDown, ArrowRight, Send, ChevronRight, ChevronLeft,
  Moon, Sun, Quote, MapPin, Phone, Mail, Globe, ExternalLink,
  Star, Play, Pause, Cpu, Network, Brain, Shield, Code2, GitBranch,
  Database, Building, CreditCard, UserCheck, Wrench, Server,
  Award, Zap, Lock, Users, GraduationCap, BookOpen, Calculator, Megaphone,
  TrendingUp, Clock, CheckCircle2, Camera, Image as ImageIcon,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { DEPARTEMENTS } from '../data/departements'
import {
  getPublicStudents, getFilieres, getFormateurs, getMembresAdmins,
  getPartenaires, getTemoignages, submitTemoignage, subscribeNewsletter,
} from '../services/api'

// ─── Social icons ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { key:'facebook',  I: ({s})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
  { key:'instagram', I: ({s})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg> },
  { key:'tiktok',   I: ({s})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.77.08 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 106.34 6.34V8.69a8.19 8.19 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z"/></svg> },
  { key:'youtube',  I: ({s})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg> },
  { key:'linkedin', I: ({s})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
]

// ─── Static data ──────────────────────────────────────────────────────────────
const PARTENAIRES = [
  { nom:'3FPT',        logo:'/3FPT.png',        tag:'Financement',    desc:'Fonds de Financement de la Formation Pro & Technique. Soutient nos programmes avec des bourses et co-financements officiels.' },
  { nom:'AWS Academy', logo:'/aws-academy.png', tag:'Cloud & Certif', desc:'Programme Amazon Web Services. Nos étudiants obtiennent des certifications Cloud officielles reconnues mondialement.' },
  { nom:'CAMES',       logo:'/cames_logo.png',  tag:'Accréditation',  desc:'Conseil Africain et Malgache pour l\'Enseignement Supérieur. Garantit la reconnaissance officielle de tous nos diplômes.' },
  { nom:'Cisco',       logo:'/cisco.png',        tag:'Réseaux & CCNA', desc:'Cisco Networking Academy. Certifications CCNA et CyberOps accessibles directement depuis le campus ISI SUPTECH.' },
  { nom:'Demdik',      logo:'/demdik.jpeg',      tag:'Emploi & Stages',desc:'Partenaire local de transformation digitale au Sénégal. Stages et recrutements pour nos diplômés.' },
  { nom:'Huawei',      logo:'/huawei.png',       tag:'ICT & 5G',       desc:'Huawei ICT Academy. Formation et certifications : Cloud, 5G, datacenter et infrastructure réseau.' },
  { nom:'ANAQ',        logo:'/logo_anaq.png',    tag:'Qualité',        desc:'Autorité Nationale d\'Assurance Qualité. Certifie l\'excellence et la rigueur académique de l\'ISI SUPTECH.' },
  { nom:'ONFP',        logo:'/onfp.png',         tag:'Formation Pro',  desc:'Office National de la Formation Professionnelle. Reconnaît officiellement nos certifications techniques.' },
]

const FORMATEURS = [
  { nom:'Cissé',  prenom:'M.', photo:'/cisse.jpeg',     role:'Formateur • Coach Cisco', specialite:'Réseaux & Infrastructure', icon:Network, skills:['Cisco CCNA','VLAN','TCP/IP','Wireless'], desc:'Expert en architecture réseau et protocoles TCP/IP. Coach certifié Cisco CCNA — il accompagne les étudiants jusqu\'à la certification officielle.' },
  { nom:'Junior', prenom:'M.', photo:'/junior.jpeg',    role:'Formateur • Pentester',   specialite:'Cybersécurité',            icon:Shield,  skills:['Pentest','CTF','Forensics','SIEM'],    desc:'Spécialiste sécurité offensive et défensive. Anime des CTF, forme au pentesting, forensique numérique et réponse aux incidents.' },
  { nom:'Robert', prenom:'M.', photo:'/mr_robert.jpeg', role:'Formateur • Dev Full-Stack',specialite:'Développement Web & Mobile',icon:Code2, skills:['React','Laravel','Flutter','Node.js'],desc:'Développeur full-stack passionné. Enseigne React, Laravel, Flutter et Node.js. Mentor de projets innovants et startups étudiantes.' },
]

const MEMBRES = [
  { nom:'M. Abdou SAMBE',              photo:'/abdou-sambe.jpg',   poste:'Président du Groupe ISI',  specialite:'Président du Groupe ISI', icon:Award,    skills:['Vision stratégique','Gouvernance','Partenariats','Développement'], desc:'Préside le Groupe ISI et porte la vision stratégique de l\'institut depuis sa fondation.', grad:'from-slate-800 to-slate-600' },
  { nom:'M. Thierno Birahime SAMBE',   photo:'/thierno-sambe-dg.jpg', poste:'Directeur Général',        specialite:'Directeur Général', icon:Building, skills:['Management','Stratégie','Qualité','Croissance'], desc:'Dirige les opérations et le développement du Groupe ISI au quotidien.', grad:'from-indigo-800 to-isiblue-600' },
  { nom:'M. Kara SAMB',   photo:'/kara_directeur.jpg', poste:'Directeur des Études',   specialite:'Directeur des Études', icon:BookOpen,    skills:['Oracle','MySQL','Merise','UML'],         desc:'Dirige les études à l\'ISI SUPTECH avec vision et excellence. Formateur expert en analyse de systèmes d\'information et bases de données.',    grad:'from-violet-700 to-isiblue-600' },
  { nom:'Mme Oumou Khayri GAYE', photo:'/oumoukhairy.jpg',    poste:'Caissière',           specialite:'Gestion financière',      icon:CreditCard,  skills:['Wave','Orange Money','Reçus PDF','Suivi'],desc:'Gère avec rigueur les paiements et le suivi financier. Disponible et souriante pour faciliter chaque démarche.',                  grad:'from-cyan-700 to-teal-600' },
  { nom:'Mme Mbène TALL', photo:'/mbene-tall.jpg',     poste:'Assistante Pédagogique',    specialite:'Assistance Pédagogique', icon:UserCheck,   skills:['Orientation','Dossiers','Planning','Support'],desc:'Premier visage de l\'ISI SUPTECH. Oriente et accompagne chaque étudiant et parent avec bienveillance.',                        grad:'from-blue-700 to-cyan-600' },
  { nom:'M. Samba NDOUR', photo:'/samba.jpg',           poste:'Technicien IT',       specialite:'Support & Infrastructure', icon:Wrench,      skills:['Maintenance','Réseau LAN','Serveurs','Support'],desc:'Maintient l\'infrastructure du campus. Gère les équipements, le réseau LAN, les serveurs et fournit un support rapide.',       grad:'from-amber-700 to-orange-600' },
]

const FILIERES = [
  { id:1, code:'INF-RI',  nom:'Réseaux Informatiques',     icon:Network,    color:'cyan',    desc:'Infrastructure réseau, protocoles TCP/IP, administration Cisco et déploiement de solutions réseau d\'entreprise.', skills:['Cisco CCNA','TCP/IP','VLAN','WiFi'],
    curriculum:['Fondamentaux TCP/IP','Routage & Commutation Cisco','Administration systèmes & serveurs','Cloud Networking','Sécurité & Supervision réseau'],
    duree:'DTS 2 ans · Licence Pro 10 mois', certifs:['Cisco CCNA','Huawei HCIA'], meta:'Cisco Academy · Certif officielle' },
  { id:2, code:'INF-GL',  nom:'Génie Logiciel',            icon:GitBranch,  color:'amber',   desc:'Programmation orientée objet, méthodes Agile, DevOps et architecture logicielle — du DTS au Master Pro.', skills:['Java','Python','Agile','Docker'],
    curriculum:['Algorithmique & POO','Bases de données relationnelles','Méthodes Agile & Scrum','CI/CD & intégration continue','Architecture microservices'],
    duree:'DTS · Licence Pro · Master Pro', certifs:['Scrum Master','Docker Certified'], meta:'DevOps & Qualité · Architecture' },
  { id:3, code:'INF-WEB', nom:'Web Master',                icon:Code2,      color:'emerald', desc:'Conception de sites et applications web modernes, du design à la mise en production.', skills:['HTML/CSS','JavaScript','PHP','React'],
    curriculum:['HTML/CSS & JavaScript moderne','Développement front-end (React)','Développement back-end & bases de données','Hébergement, déploiement & SEO','Projet web professionnel'],
    duree:'DTS-BTS-Licence 2 ans', certifs:['Meta Front-End'], meta:'Le + polyvalent · Débouchés immédiats' },
  { id:4, code:'GES-CF',  nom:'Comptabilité Finance',      icon:Calculator, color:'violet',  desc:'Comptabilité générale, gestion financière, fiscalité et analyse financière d\'entreprise.', skills:['Comptabilité','Fiscalité','Sage','Audit'],
    curriculum:['Comptabilité générale & analytique','Fiscalité d\'entreprise','Gestion financière & trésorerie','Logiciels comptables (Sage)','Analyse financière & audit'],
    duree:'DTS · Licence Pro · Master Pro', certifs:['Sage Certified'], meta:'Fondamentaux Gestion · Très demandé' },
  { id:5, code:'GES-CI',  nom:'Commerce International',    icon:Globe,      color:'red',     desc:'Techniques du commerce international, logistique import-export et négociation commerciale.', skills:['Import-Export','Douane','Négociation','Incoterms'],
    curriculum:['Techniques du commerce international','Douane & Incoterms','Logistique import-export','Négociation commerciale','Anglais des affaires'],
    duree:'DTS 2 ans · Licence Pro 10 mois', certifs:['Incoterms Certified'], meta:'Forte demande · Débouchés internationaux' },
  { id:6, code:'GES-MD',  nom:'Marketing Digital',         icon:Megaphone,  color:'blue',    desc:'Stratégies marketing digital, réseaux sociaux, communication de marque et growth.', skills:['SEO/SEA','Réseaux sociaux','Google Ads','Branding'],
    curriculum:['Fondamentaux du marketing digital','SEO & référencement payant','Réseaux sociaux & content marketing','Google Ads & Analytics','Branding & communication'],
    duree:'DTS 2 ans · Licence Pro 10 mois', certifs:['Google Ads Certified'], meta:'Filière en croissance · Créatif' },
]

const CM = {
  blue:   { g:'from-blue-600 to-blue-400',    t:'text-blue-400',    b:'bg-blue-500/15 border-blue-500/25' },
  cyan:   { g:'from-cyan-600 to-cyan-400',    t:'text-cyan-400',    b:'bg-cyan-500/15 border-cyan-500/25' },
  violet: { g:'from-violet-600 to-violet-400',t:'text-violet-400',  b:'bg-violet-500/15 border-violet-500/25' },
  red:    { g:'from-red-600 to-red-400',      t:'text-red-400',     b:'bg-red-500/15 border-red-500/25' },
  emerald:{ g:'from-emerald-600 to-emerald-400',t:'text-emerald-400',b:'bg-emerald-500/15 border-emerald-500/25' },
  amber:  { g:'from-amber-600 to-amber-400',  t:'text-amber-400',   b:'bg-amber-500/15 border-amber-500/25' },
}

const GALLERY = [
  { img:'/Etudiant_gestion.jpeg',               span:'col-span-2 row-span-2', label:'Gestion académique' },
  { img:'/caroursel_isi_suptech_soutenace.jpg', span:'col-span-1 row-span-1', label:'Soutenances' },
  { img:'/etudant_farda.jpeg',                  span:'col-span-1 row-span-1', label:'Étudiants' },
]

const CAMPUS_SHOTS = [
  { img:'/Etudiant_gestion.jpeg',               label:'Laboratoire',  tag:'Informatique' },
  { img:'/caroursel_isi_suptech_soutenace.jpg', label:'Soutenance',   tag:'Diplômes' },
  { img:'/etudant_farda.jpeg',                  label:'Ateliers',     tag:'Pratique' },
]

// ─── Fond institutionnel ──────────────────────────────────────────────────────
// Remplace l'ancien fond "code flottant" (héritage identité agence tech
// générique) par une trame géométrique sobre — un quadrillage fin façon plan
// d'architecte + deux halos navy/or, cohérent avec l'identité des documents
// officiels (cartes, attestations) plutôt qu'un imaginaire "startup IA".
function TechBg({ isDark }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.035)' : 'rgba(15,35,82,0.05)'} 1px,transparent 1px),
                           linear-gradient(90deg,${isDark ? 'rgba(255,255,255,0.035)' : 'rgba(15,35,82,0.05)'} 1px,transparent 1px)`,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
      }} className="absolute inset-0"/>
      <div className={`absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full blur-3xl ${isDark ? 'bg-isiblue-700/20' : 'bg-isiblue-200/35'}`}/>
      <div className={`absolute top-1/3 -right-52 w-[560px] h-[560px] rounded-full blur-3xl ${isDark ? 'bg-isigold-600/8' : 'bg-isigold-200/40'}`}/>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-24 right-[8%] w-2 h-2 rounded-full ${isDark ? 'bg-isigold-400' : 'bg-isiblue-400'}`}/>
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className={`absolute bottom-40 left-[12%] w-1.5 h-1.5 rounded-full ${isDark ? 'bg-isiblue-300' : 'bg-isigold-400'}`}/>
    </div>
  )
}

// ─── Filières animated background ─────────────────────────────────────────────
function FilieresBg({ isDark }) {
  const nodes = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    x: 5 + (i * 83) % 88, y: 8 + (i * 61) % 82,
    dur: 3 + (i % 3) * 1.5, delay: i * 0.45
  })), [])
  const links = [[0,3],[1,4],[2,5],[3,6],[4,7],[5,8],[6,9],[7,1],[8,2],[9,0]]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute inset-0 ${isDark
        ? 'bg-gradient-to-br from-[#07071e] via-[#0a0a2e]/80 to-[#05050f]'
        : 'bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/80'
      }`}/>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isDark ? 0.09 : 0.08 }}>
        <defs>
          <pattern id="hexfil" x="0" y="0" width="80" height="70" patternUnits="userSpaceOnUse">
            <polygon points="40,2 74,20 74,56 40,70 6,56 6,20" fill="none"
              stroke={isDark ? '#818cf8' : '#4f46e5'} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexfil)"/>
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map(([a, b], i) => (
          <motion.line key={i}
            x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
            x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
            stroke={isDark ? 'rgba(99,102,241,0.22)' : 'rgba(79,70,229,0.15)'}
            strokeWidth="1" strokeDasharray="4 8"
            animate={{ opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 5 + i * 0.3, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div key={i} className={`absolute rounded-full ${isDark ? 'bg-isiblue-400' : 'bg-isiblue-500'}`}
          style={{ left: `${n.x}%`, top: `${n.y}%`, width: 6, height: 6, marginLeft: -3, marginTop: -3 }}
          animate={{ scale: [1, 2.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: n.dur, repeat: Infinity, delay: n.delay, ease: 'easeInOut' }}
        />
      ))}
      <motion.div className={`absolute left-0 right-0 h-px ${isDark
        ? 'bg-gradient-to-r from-transparent via-isiblue-500/25 to-transparent'
        : 'bg-gradient-to-r from-transparent via-isiblue-400/20 to-transparent'
      }`}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <div className={`absolute rounded-full blur-3xl ${isDark ? 'bg-isiblue-600/8' : 'bg-indigo-300/15'}`}
        style={{ top: '-10%', right: '-5%', width: 600, height: 600, transform: 'translate(30%,-30%)' }}/>
      <div className={`absolute rounded-full blur-3xl ${isDark ? 'bg-cyan-600/6' : 'bg-blue-300/12'}`}
        style={{ bottom: '-10%', left: '-5%', width: 600, height: 600, transform: 'translate(-30%,30%)' }}/>
    </div>
  )
}

// ─── Formateurs animated background ──────────────────────────────────────────
function FormateursBg({ isDark }) {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    x: 2 + (i * 53) % 96, y: 2 + (i * 41) % 96, sz: 3 + (i % 4),
    dur: 3 + (i % 5) * 1.1, delay: i * 0.32
  })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute inset-0 ${isDark
        ? 'bg-gradient-to-br from-[#080814] via-[#0b0a22]/90 to-[#060610]'
        : 'bg-gradient-to-br from-slate-100/95 via-indigo-50/80 to-slate-50'
      }`}/>
      {/* Large glow orbs */}
      <motion.div className={`absolute rounded-full blur-3xl ${isDark?'bg-isiblue-600/18':'bg-indigo-300/50'}`}
        style={{top:'10%',left:'-5%',width:500,height:500}}
        animate={{scale:[1,1.25,1],opacity:[0.5,1,0.5],y:[0,-20,0]}}
        transition={{duration:8,repeat:Infinity,ease:'easeInOut'}}/>
      <motion.div className={`absolute rounded-full blur-3xl ${isDark?'bg-cyan-600/14':'bg-cyan-200/60'}`}
        style={{bottom:'5%',right:'-5%',width:420,height:420}}
        animate={{scale:[1,1.3,1],opacity:[0.4,0.9,0.4],y:[0,15,0]}}
        transition={{duration:9,repeat:Infinity,delay:2,ease:'easeInOut'}}/>
      <motion.div className={`absolute rounded-full blur-3xl ${isDark?'bg-violet-600/10':'bg-violet-200/40'}`}
        style={{top:'40%',left:'45%',width:300,height:300,marginLeft:-150,marginTop:-150}}
        animate={{scale:[1,1.4,1],opacity:[0.3,0.7,0.3]}}
        transition={{duration:7,repeat:Infinity,delay:1,ease:'easeInOut'}}/>
      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div key={i}
          className={`absolute rounded-full ${isDark?'bg-isiblue-400/45':'bg-isiblue-500/25'}`}
          style={{left:`${p.x}%`,top:`${p.y}%`,width:p.sz,height:p.sz,marginLeft:-p.sz/2,marginTop:-p.sz/2}}
          animate={{scale:[1,3.5,1],opacity:[0.1,0.6,0.1]}}
          transition={{duration:p.dur,repeat:Infinity,delay:p.delay,ease:'easeInOut'}}/>
      ))}
      {/* Scan line */}
      <motion.div className={`absolute left-0 right-0 h-px ${isDark
        ?'bg-gradient-to-r from-transparent via-isiblue-400/25 to-transparent'
        :'bg-gradient-to-r from-transparent via-isiblue-400/18 to-transparent'
      }`} animate={{top:['0%','100%']}} transition={{duration:12,repeat:Infinity,ease:'linear'}}/>
    </div>
  )
}

// ─── Membres animated background ─────────────────────────────────────────────
function MembresBg({ isDark }) {
  const orbs = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    x: 5 + (i * 67) % 88, y: 8 + (i * 43) % 82,
    size: 220 + (i * 55) % 280, dur: 6 + (i % 4) * 2, delay: i * 0.8
  })), [])
  const dots = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    x: 3 + (i * 59) % 94, y: 4 + (i * 71) % 92, dur: 3.5 + (i % 5), delay: i * 0.38
  })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute inset-0 ${isDark
        ? 'bg-gradient-to-br from-[#050510] via-[#06061a] to-[#030308]'
        : 'bg-white'
      }`}/>
      {/* Large animated orbs - much more visible */}
      {orbs.map((o, i) => (
        <motion.div key={i}
          className={`absolute rounded-full blur-3xl ${isDark
            ? i % 2 === 0 ? 'bg-cyan-500/20' : 'bg-isiblue-500/15'
            : i % 2 === 0 ? 'bg-cyan-400/20' : 'bg-isiblue-400/15'
          }`}
          style={{ left:`${o.x}%`, top:`${o.y}%`, width:o.size, height:o.size, marginLeft:-o.size/2, marginTop:-o.size/2 }}
          animate={{ scale:[1,1.4,1], opacity:[0.5,1,0.5], x:[0,20,-12,0], y:[0,-25,12,0] }}
          transition={{ duration:o.dur, repeat:Infinity, delay:o.delay, ease:'easeInOut' }}
        />
      ))}
      {/* Sparkle dots */}
      {dots.map((n, i) => (
        <motion.div key={i}
          className={`absolute rounded-full ${isDark ? 'bg-cyan-300/50' : 'bg-cyan-600/30'}`}
          style={{ left:`${n.x}%`, top:`${n.y}%`, width:4, height:4, marginLeft:-2, marginTop:-2 }}
          animate={{ scale:[1,3.2,1], opacity:[0.15,0.7,0.15] }}
          transition={{ duration:n.dur, repeat:Infinity, delay:n.delay, ease:'easeInOut' }}
        />
      ))}
      {/* Scan line */}
      <motion.div
        className={`absolute left-0 right-0 h-[1px] ${isDark
          ? 'bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent'
          : 'bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent'
        }`}
        animate={{ top:['0%','100%'] }}
        transition={{ duration:14, repeat:Infinity, ease:'linear' }}
      />
    </div>
  )
}

// ─── Campus photo strip (hero side panel) ────────────────────────────────────
function CampusStrip({ isDark }) {
  const [lightbox, setLightbox] = useState(null)
  const D = isDark
  return (
    <>
      <div className="hidden lg:flex flex-col gap-2 w-[88px] flex-shrink-0">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl mb-0.5 ${D?'bg-white/5 border border-white/10':'bg-slate-100 border border-slate-200'}`}>
          <Camera size={10} className={D?'text-isiblue-400':'text-isiblue-600'}/>
          <span className={`text-[9px] font-black uppercase tracking-widest ${D?'text-white/50':'text-slate-500'}`}>Campus</span>
        </div>
        {CAMPUS_SHOTS.map((s, i) => (
          <motion.button key={i} onClick={() => setLightbox(s)}
            initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 + i*0.12 }}
            whileHover={{ scale:1.04, x:-3, transition:{ type:'spring', stiffness:260, damping:20 } }}
            className={`relative rounded-2xl overflow-hidden border-2 transition-colors group shadow-xl shadow-black/30 ${D?'border-white/10 hover:border-isiblue-400/70':'border-slate-200 hover:border-isiblue-400'}`}
            style={{ height:110 }}>
            <img src={s.img} alt={s.label} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <ImageIcon size={12} className="text-white"/>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-1.5">
              <span className="text-[8px] text-white/90 font-black block leading-tight">{s.label}</span>
              <span className="text-[7px] text-isiblue-300/70 font-bold">{s.tag}</span>
            </div>
          </motion.button>
        ))}
        <p className={`text-[8px] text-center leading-tight mt-0.5 ${D?'text-white/20':'text-slate-400'}`}>Cliquez<br/>pour voir</p>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <div className="absolute inset-0 bg-black/82 backdrop-blur-xl"/>
            <motion.div initial={{ scale:0.85, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.85, opacity:0, y:20 }}
              transition={{ type:'spring', damping:22, stiffness:250 }}
              className="relative z-10 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
              onClick={e => e.stopPropagation()}>
              <img src={lightbox.img} alt={lightbox.label} className="w-full object-cover max-h-[80vh]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"/>
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-black text-2xl">{lightbox.label}</span>
                <p className="text-white/55 text-sm mt-0.5">ISI SUPTECH — Campus Dakar</p>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="bg-isiblue-600/85 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-white">{lightbox.tag}</div>
                <button onClick={() => setLightbox(null)}
                  className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <X size={16}/>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix='', label, icon: Icon, isDark }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once:true })
  useEffect(() => {
    if (!inView) return
    let v=0; const end=parseInt(target); const step=Math.max(1,end/60)
    const t=setInterval(()=>{ v+=step; if(v>=end){setN(end);clearInterval(t)}else setN(Math.floor(v)) },25)
    return ()=>clearInterval(t)
  }, [inView, target])
  return (
    <motion.div ref={ref} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center group">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-isiblue-600 to-isiblue-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-isiblue-500/30 group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} className="text-isigold-300"/>
      </div>
      <div className={`text-4xl md:text-5xl font-black mb-1 ${isDark?'text-white':'text-slate-900'}`}>{n.toLocaleString()}{suffix}</div>
      <div className={`text-sm font-medium ${isDark?'text-white/50':'text-slate-500'}`}>{label}</div>
    </motion.div>
  )
}

function Stars({ note, sz=14 }) {
  return <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} size={sz} className={i<=note?'text-amber-400 fill-amber-400':'text-white/20'}/>)}</div>
}

function Overlay({ open, onClose, children }) {
  useEffect(()=>{ document.body.style.overflow=open?'hidden':''; return()=>{ document.body.style.overflow='' } },[open])
  return (
    <AnimatePresence>
      {open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md"/>
        <motion.div initial={{scale:0.88,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.88,opacity:0}} transition={{type:'spring',damping:22,stiffness:280}}
          className="relative z-10 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl" onClick={e=>e.stopPropagation()}>
          {children}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  )
}

// ─── Filière card — statique, sobre ───────────────────────────────────────────
// Une carte "featured" (fond navy plein) rythme la grille, le reste reste blanc
// à bordure fine — plus de flip au survol, juste un lien "En savoir plus".
function FCard({ f, openF, featured = false }) {
  const Icon = f.icon || Cpu
  return (
    <motion.button type="button" onClick={() => openF(f)}
      initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      whileHover={{y:-3}}
      className={`text-left rounded-2xl p-6 h-full flex flex-col transition-all duration-200 ${featured
        ? 'bg-slate-900 border border-slate-900'
        : 'bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md'}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${featured ? 'bg-white/10' : 'bg-teal-50'}`}>
        <Icon size={20} className={featured ? 'text-teal-300' : 'text-teal-600'}/>
      </div>
      <h3 className={`font-black text-lg leading-tight mb-2 ${featured ? 'text-white' : 'text-slate-900'}`}>{f.nom}</h3>
      <p className={`text-sm leading-relaxed flex-1 mb-4 ${featured ? 'text-white/60' : 'text-slate-500'}`}>{f.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(f.skills||[]).slice(0,2).map((s,si)=>(
          <span key={si} className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${featured ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-500'}`}>{s}</span>
        ))}
      </div>
      <div className={`text-sm font-bold flex items-center gap-1 ${featured ? 'text-teal-300' : 'text-teal-600'}`}>
        En savoir plus <ArrowRight size={14}/>
      </div>
    </motion.button>
  )
}


// ─── Filière modal ────────────────────────────────────────────────────────────
function FModal({ f, onClose }) {
  if (!f) return null
  const Icon = f.icon || Cpu
  return (
    <Overlay open={!!f} onClose={onClose}>
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><X size={16} className="text-white"/></button>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4"><Icon size={30} className="text-teal-300"/></div>
          <h3 className="text-2xl font-black text-white mb-2">{f.nom}</h3>
          <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-teal-300 text-xs font-mono font-bold tracking-widest">{f.code}</span>
        </div>
        <div className="p-6">
          {f.desc && <p className="text-slate-500 text-sm leading-relaxed mb-5">{f.desc}</p>}
          {f.skills?.length>0&&<div className="flex flex-wrap gap-2 mb-5">{f.skills.map((s,i)=><span key={i} className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-600">{s}</span>)}</div>}
          {f.licenses?.length>0&&<><p className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest mb-3">Niveaux & Frais</p><div className="space-y-3 mb-5">
            {f.licenses.map((l,i)=><div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3"><span className="font-bold text-slate-900 text-sm">{l.nom}</span><span className="text-xs bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">{l.duree_annees} an{l.duree_annees>1?'s':''}</span></div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white border border-slate-200 rounded-xl p-2.5"><div className="text-slate-400 mb-0.5">Inscription</div><div className="text-slate-900 font-bold">{Number(l.frais_inscription).toLocaleString()} FCFA</div></div>
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-2.5"><div className="text-teal-600/80 mb-0.5">Mensualité</div><div className="text-teal-700 font-bold">{Number(l.frais_mensuel).toLocaleString()} FCFA</div></div>
              </div>
            </div>)}
          </div></>}
          <Link to="/pre-inscription" onClick={onClose} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"><GraduationCap size={18}/> S'inscrire dans cette filière</Link>
        </div>
      </div>
    </Overlay>
  )
}


// ─── Circular 3D carousel — pot style (RAF-driven, no Framer Motion for rotation) ─
function CircleCarousel({ items, renderItem, radius=420, duration=22, cardW=268, cardH=260, height=540, isDark }) {
  const count   = items.length
  const step    = 360 / (count || 1)
  const rotRef  = useRef(null)
  const rafRef  = useRef(null)
  const angleRef = useRef(0)

  useEffect(() => {
    const degPerMs = 360 / (duration * 1000)
    let prev = performance.now()
    function frame(now) {
      const dt = now - prev
      prev = now
      angleRef.current = (angleRef.current + degPerMs * dt) % 360
      if (rotRef.current) rotRef.current.style.transform = `rotateY(${angleRef.current}deg)`
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration])

  const fadeL = isDark ? 'rgba(7,7,30,0.97)'  : 'rgba(255,255,255,0.97)'
  const fadeM = isDark ? 'rgba(7,7,30,0.4)'   : 'rgba(255,255,255,0.4)'

  return (
    <div className="w-full relative" style={{ height, overflow:'hidden' }}>
      <div className="absolute inset-0" style={{ perspective:'1400px', perspectiveOrigin:'50% 50%' }}>

        {/* LEFT / RIGHT cylinder wall fade */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex:20,
          background:`linear-gradient(to right, ${fadeL} 0%, transparent 18%, transparent 82%, ${fadeL} 100%)`
        }}/>

        {/* TOP / BOTTOM cylinder fade */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex:20,
          background:`linear-gradient(to bottom, ${fadeM} 0%, transparent 18%, transparent 82%, ${fadeM} 100%)`
        }}/>

        {/* CAPUCHON — top elliptical rim */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{
          zIndex:30, top:8, width:'70%', height:50, borderRadius:'50%',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.1) 0%, rgba(99,102,241,0.2) 55%, transparent 100%)'
            : 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.92) 0%, rgba(99,102,241,0.1) 55%, transparent 100%)',
          border: isDark ? '1.5px solid rgba(139,92,246,0.38)' : '1.5px solid rgba(99,102,241,0.28)',
          boxShadow: isDark ? '0 4px 20px rgba(99,102,241,0.15)' : '0 3px 14px rgba(99,102,241,0.08)',
        }}/>
        {/* Rim highlight */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{
          zIndex:30, top:12, width:'38%', height:16, borderRadius:'50%',
          background: isDark
            ? 'linear-gradient(to bottom, rgba(255,255,255,0.14), transparent)'
            : 'linear-gradient(to bottom, rgba(255,255,255,1), transparent)',
        }}/>

        {/* Central glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none" style={{
          zIndex:1, width:200, height:200,
          background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.03)',
        }}/>

        {/* 3D rotating ring — driven by requestAnimationFrame */}
        <div
          ref={rotRef}
          style={{
            position:'absolute',
            transformStyle:'preserve-3d',
            left:'50%', top:'50%',
            width:0, height:0,
            zIndex:10,
            transform:'rotateY(0deg)',
          }}>
          {items.map((item, i) => (
            <div key={i} style={{
              position:'absolute',
              transform:`rotateY(${step * i}deg) translateZ(${radius}px)`,
              width:cardW, height:cardH,
              marginLeft:-cardW/2, marginTop:-cardH/2,
              backfaceVisibility:'hidden',
            }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>

        {/* Bottom elliptical shadow */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{
          zIndex:22, bottom:6, width:'70%', height:38, borderRadius:'50%',
          background:'radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 55%, transparent 75%)',
          filter:'blur(4px)',
        }}/>
        {/* Ground drop shadow */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{
          zIndex:22, bottom:-14, width:'38%', height:20, borderRadius:'50%',
          background:'radial-gradient(ellipse at center, rgba(0,0,0,0.14) 0%, transparent 70%)',
          filter:'blur(8px)',
        }}/>
      </div>
    </div>
  )
}

// ─── Filière card for marquee (no whileInView) ────────────────────────────────
// ─── Explorateur de départements (BT/BTS/Licences/Masters/Cycle Ingénieur) ────
const DEPT_GROUPES = [
  { key: 'bt', label: 'BT' },
  { key: 'bts', label: 'BTS' },
  { key: 'licences', label: 'Licences' },
  { key: 'masters', label: 'Masters' },
]
function DepartementsBrowser({ isDark: D }) {
  const [activeDept, setActiveDept] = useState(DEPARTEMENTS[0].id)
  const dept = DEPARTEMENTS.find(d => d.id === activeDept)
  const groupesActifs = DEPT_GROUPES.filter(g => (dept[g.key] || []).length > 0)

  return (
    <div className="mt-16 max-w-5xl mx-auto">
      {/* Onglets départements */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {DEPARTEMENTS.map(d => (
          <button key={d.id} onClick={() => setActiveDept(d.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeDept === d.id
                ? 'bg-gradient-to-r from-isiblue-600 to-isiblue-500 text-white shadow-lg shadow-isiblue-500/25'
                : D ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}>
            {d.nom.replace('Département ', '')}
          </button>
        ))}
      </div>

      {/* Programmes du département actif */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDept}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6 rounded-3xl border ${
            D ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {groupesActifs.map(g => (
            <div key={g.key}>
              <div className={`text-xs font-black uppercase tracking-wider mb-2.5 ${D ? 'text-isiblue-400' : 'text-isiblue-600'}`}>{g.label}</div>
              <ul className="space-y-2">
                {dept[g.key].map(nom => (
                  <li key={nom}>
                    <Link to="/pre-inscription"
                      className={`text-sm flex items-center gap-1.5 group ${D ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-isiblue-700'}`}>
                      <ChevronRight size={13} className="flex-shrink-0 opacity-50 group-hover:translate-x-0.5 transition-transform"/>
                      {nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {dept.ingenieur && (
            <div>
              <div className={`text-xs font-black uppercase tracking-wider mb-2.5 ${D ? 'text-isiblue-400' : 'text-isiblue-600'}`}>Cycle Ingénieur</div>
              <Link to="/pre-inscription"
                className={`text-sm flex items-start gap-1.5 ${D ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-isiblue-700'}`}>
                <GraduationCap size={14} className="flex-shrink-0 mt-0.5"/> {dept.ingenieur}
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <p className={`text-center text-xs mt-5 ${D ? 'text-white/40' : 'text-slate-400'}`}>
        Les inscriptions démarrent selon le programme — septembre, octobre ou novembre.
      </p>
    </div>
  )
}

function FCardM({ f, openF, D }) {
  const [hovered, setHovered] = useState(false)
  const c = CM[f.color] || CM.blue
  const Icon = f.icon || Cpu
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y:-6, scale:1.03, transition:{type:'spring',stiffness:220,damping:20} }}
      whileTap={{ scale:0.97 }}
      onClick={() => openF(f)}
      className={`cursor-pointer rounded-2xl border relative overflow-hidden transition-all duration-300 ${D
        ?'bg-white/[0.04] border-white/[0.08] hover:border-isiblue-500/40 hover:shadow-2xl hover:shadow-isiblue-500/10 hover:bg-white/[0.07]'
        :'bg-white border-slate-200 hover:border-isiblue-300 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)]'}`}
      style={{ width:272, height:255 }}>
      {/* Base content */}
      <motion.div animate={{ opacity:hovered?0:1, y:hovered?-8:0 }} transition={{ duration:0.2 }}
        className="p-5 flex flex-col h-full">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.g} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon size={20} className="text-white"/>
        </div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-black text-sm leading-tight flex-1 ${D?'text-white':'text-slate-900'}`}>{f.nom}</h3>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex-shrink-0 ${D?`${c.b} ${c.t}`:'bg-slate-100 border-slate-200 text-slate-500'}`}>{f.code}</span>
        </div>
        <p className={`text-xs leading-relaxed flex-1 mb-3 line-clamp-3 ${D?'text-white/60':'text-slate-500'}`}>{f.desc}</p>
        <div className="flex flex-wrap gap-1">
          {(f.skills||[]).slice(0,3).map((s,si)=>(
            <span key={si} className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${D?`${c.b} ${c.t}`:'bg-slate-50 border-slate-200 text-slate-600'}`}>{s}</span>
          ))}
        </div>
      </motion.div>
      {/* Hover overlay */}
      <motion.div
        initial={{ y:'100%', opacity:0 }}
        animate={{ y:hovered?0:'100%', opacity:hovered?1:0 }}
        transition={{ duration:0.32, ease:[0.76,0,0.24,1] }}
        className={`absolute inset-0 z-20 p-5 flex flex-col justify-between bg-gradient-to-br ${c.g}`}>
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 flex-shrink-0">
              <Icon size={17} className="text-white"/>
            </div>
            <div>
              <p className="font-black text-white text-sm leading-tight">{f.nom}</p>
              <p className="text-white/60 text-[10px]">{f.duree||'2-3 ans'}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {(f.curriculum||f.skills||[]).slice(0,4).map((item,idx)=>(
              <motion.div key={idx} className="flex items-start gap-1.5"
                initial={{ x:-8, opacity:0 }}
                animate={hovered?{x:0,opacity:1}:{x:-8,opacity:0}}
                transition={{ delay:0.05+idx*0.06 }}>
                <CheckCircle2 size={11} className="text-white/80 mt-0.5 flex-shrink-0"/>
                <span className="text-[11px] text-white/85 leading-snug">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();openF(f)}}
          className="w-full bg-white/20 border border-white/30 text-white font-bold text-xs py-2 rounded-xl hover:bg-white/35 transition-colors flex items-center justify-center gap-1.5 mt-3">
          <GraduationCap size={11}/> Voir détails <ArrowRight size={10}/>
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
// Icon mapping helpers
function formateurIcon(specialite='') {
  const s = specialite.toLowerCase()
  if (s.includes('réseau') || s.includes('reseau') || s.includes('cisco')) return Network
  if (s.includes('cyber') || s.includes('sécurité') || s.includes('securite')) return Shield
  if (s.includes('dev') || s.includes('web') || s.includes('mobile') || s.includes('logiciel')) return Code2
  if (s.includes('ia') || s.includes('intelligence') || s.includes('machine')) return Brain
  if (s.includes('base') || s.includes('bdd') || s.includes('données')) return Database
  if (s.includes('système') || s.includes('systeme') || s.includes('server')) return Server
  return BookOpen
}
function membreIcon(poste='') {
  const p = poste.toLowerCase()
  if (p.includes('direct')) return Building
  if (p.includes('caissier') || p.includes('caissière') || p.includes('finance')) return CreditCard
  if (p.includes('accueil') || p.includes('orient') || p.includes('reception')) return UserCheck
  if (p.includes('tech') || p.includes('infra') || p.includes('maintenance')) return Wrench
  return Users
}
function membreGrad(poste='') {
  const p = poste.toLowerCase()
  if (p.includes('direct')) return 'from-violet-700 to-isiblue-600'
  if (p.includes('caissier') || p.includes('caissière')) return 'from-cyan-700 to-teal-600'
  if (p.includes('accueil')) return 'from-blue-700 to-cyan-600'
  return 'from-amber-700 to-orange-600'
}
function photoUrl(path) {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('/')) return path
  return `/storage/${path}`
}

export default function Landing() {
  // Thème unique (clair) — plus de bascule sombre/clair sur la vitrine.
  const isDark = false
  const [filieres, setFil]      = useState(FILIERES)
  const [formateurs, setForms]  = useState(FORMATEURS)
  const [membres, setMembres]   = useState(MEMBRES)
  const [temos, setTemos]       = useState([])
  const [temoIndex, setTemoIndex] = useState(0)
  const [selF, setSelF]         = useState(null)
  const [news, setNews]         = useState({ email:'', nom:'' })
  const [newsOK, setNewsOK]     = useState(false)
  const [tForm, setTForm]       = useState({ nom:'', filiere:'', annee_diplome:'', contenu:'', note:5 })
  const [tOK, setTOK]           = useState(false)
  const [socials, setSocials]   = useState({})
  const [siteStats, setSiteStats] = useState({ stat_etudiants: '2500', stat_experience: '15', stat_insertion: '95', stat_filieres: '20' })
  const [blocs, setBlocs] = useState({})

  useEffect(() => {
    getFilieres().then(r => {
      const list = r.data || []
      if (list.length) {
        // Le carrousel vitrine affiche 6 filières fixes — on n'y injecte que les
        // tarifs/licences réels correspondants, sans jamais dépasser 6 cartes.
        setFil(FILIERES.map(d => {
          const match = list.find(f => f.code === d.code)
          return match ? { ...d, ...match } : d
        }))
      }
    }).catch(()=>{})
    // Load real team from API — fall back to static if empty
    getFormateurs().then(r => {
      const list = r.data || []
      if (list.length > 0) {
        setForms(list.map(f => ({
          ...f,
          nom: f.nom || f.name || '',
          prenom: f.prenom || 'M.',
          photo: photoUrl(f.photo) || `/cisse.jpeg`,
          role: f.role || 'Formateur',
          specialite: f.specialite || f.expertise || '',
          desc: f.description || f.desc || '',
          skills: f.competences ? f.competences.split(',').map(s=>s.trim()) : (f.skills || []),
          icon: formateurIcon(f.specialite || f.expertise || ''),
        })))
      }
    }).catch(()=>{})
    getMembresAdmins().then(r => {
      const list = r.data || []
      if (list.length > 0) {
        setMembres(list.map(m => ({
          ...m,
          nom: m.nom || m.name || '',
          photo: photoUrl(m.photo) || `/kara_directeur.jpg`,
          poste: m.poste || m.role || '',
          specialite: m.specialite || m.expertise || '',
          desc: m.description || m.desc || '',
          skills: m.competences ? m.competences.split(',').map(s=>s.trim()) : (m.skills || []),
          icon: membreIcon(m.poste || m.role || ''),
          grad: membreGrad(m.poste || m.role || ''),
        })))
      }
    }).catch(()=>{})
    getTemoignages().then(r => setTemos(r.data||[])).catch(()=>{})
    fetch('/api/settings/social').then(r=>r.json()).then(setSocials).catch(()=>{})
    fetch('/api/settings/stats').then(r=>r.json()).then(setSiteStats).catch(()=>{})
    fetch('/api/contenu/blocs').then(r=>r.json()).then(setBlocs).catch(()=>{})
  }, [])

  // Fusionne les blocs modifiés par le super admin (texte/photo) par-dessus les
  // valeurs par défaut codées en dur — rien ne change tant qu'aucun bloc n'est édité.
  const heroPhoto = blocs.slide_1_image || '/Etudiant_gestion.jpeg'

  // Fait défiler les vrais témoignages publiés toutes les 3s — dès qu'il y en a
  // au moins un, on n'affiche plus jamais l'exemple factice par défaut.
  useEffect(() => {
    if (temos.length <= 1) return
    const id = setInterval(() => setTemoIndex(i => (i + 1) % temos.length), 3000)
    return () => clearInterval(id)
  }, [temos.length])

  // Scroll to section if navigated from another page via Navbar
  useEffect(() => {
    const id = sessionStorage.getItem('isi_scroll_to')
    if (!id) return
    sessionStorage.removeItem('isi_scroll_to')
    const attempt = (tries = 0) => {
      const el = document.getElementById(id)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 72
        window.scrollTo({ top: y, behavior: 'smooth' })
      } else if (tries < 10) {
        setTimeout(() => attempt(tries + 1), 150)
      }
    }
    setTimeout(() => attempt(), 300)
  }, [])

  const openF = async f => {
    setSelF(f)
    if (f.id && !f.licenses) {
      try { const r=await fetch(`/api/filieres/${f.id}`); setSelF({...f,...await r.json()}) } catch{}
    }
  }

  const D = isDark
  const tx  = D ? 'text-white'   : 'text-slate-900'
  const txs = D ? 'text-white/60': 'text-slate-500'
  const txm = D ? 'text-white/30': 'text-slate-400'
  const card= D
    ? 'bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm'
    : 'bg-white border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
  const inp = D
    ? 'bg-white/5 border border-white/10 text-white placeholder-white/25 focus:border-isiblue-400/60 focus:bg-white/8'
    : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-isiblue-400 shadow-sm'
  const hr  = D ? 'border-white/[0.08]':'border-slate-100'
  const sec = D ? 'bg-white/[0.02]':'bg-slate-50/80'

  return (
    <div className={`min-h-screen relative ${D?'bg-[#080812]':'bg-slate-50'}`}>
      <TechBg isDark={D}/>

      <Navbar/>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      {/* Deux colonnes pleine largeur — texte à gauche, photo à droite — pour
          occuper tout l'écran plutôt qu'une colonne étroite centrée. */}
      <section className="relative z-10 px-4 pt-28 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-7 bg-teal-50 text-teal-700 border border-teal-100">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500"/> {blocs.hero_badge || 'Inscriptions 2026-2027 ouvertes'}
            </motion.div>
            <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1}}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] mb-5 text-slate-900">
              {blocs.hero_titre_1 || "L'excellence en"}{' '}
              <span className="text-teal-600">{blocs.hero_titre_accent || 'numérique'}</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.2}}
              className="text-base max-w-lg mb-9 leading-relaxed text-slate-500">
              {blocs.hero_sous_titre || "Formez-vous aux métiers de demain avec une approche pédagogique moderne, combinant excellence académique et pratique professionnelle."}
            </motion.p>
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.3}} className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link to="/pre-inscription"
                className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                Découvrir nos programmes <ArrowRight size={16}/>
              </Link>
              <Link to="/formations"
                className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl border-2 border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors">
                Nos formations
              </Link>
            </motion.div>

            {/* Repères chiffrés */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.4}}
              className="grid grid-cols-4 gap-4 pt-8 border-t border-slate-200">
              {[
                [`${siteStats.stat_etudiants}+`, 'Étudiants'],
                [`${siteStats.stat_experience} ans`, "d'expérience"],
                [`${siteStats.stat_filieres}`, 'Filières'],
                [`${siteStats.stat_insertion}%`, 'Insertion'],
              ].map(([v, l], i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-slate-900 font-mono">{v}</div>
                  <div className="text-[11px] text-slate-400">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Photo unique — remplace l'ancien carrousel autoplay */}
          <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2}}
            className="relative rounded-2xl overflow-hidden shadow-xl h-[380px] lg:h-[560px]">
            <img src={heroPhoto} alt="Campus" className="w-full h-full object-cover"/>
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto flex items-center gap-3 rounded-xl px-4 py-3 bg-white/95 backdrop-blur-sm shadow-md">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Award size={16} className="text-teal-600"/>
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900">{siteStats.stat_insertion}% d'insertion</div>
                <div className="text-[11px] font-mono text-slate-400">Taux d'insertion professionnelle</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILIÈRES ──────────────────────────────────────────────────────── */}
      <section id="filieres" className="relative z-10 py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 mb-3 block">Formations</span>
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-900">Nos filières d'excellence</h2>
            <p className="max-w-lg mx-auto text-sm text-slate-500">Des programmes conçus pour répondre aux défis technologiques actuels et futurs des entreprises.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filieres.map((f, i) => <FCard key={f.id ?? i} f={f} openF={openF} featured={i===1}/>)}
          </div>
        </div>
      </section>


      {/* ── GALERIE VIE DU CAMPUS ─────────────────────────────────────────── */}
      <section id="campus" className={`relative z-10 py-20 overflow-hidden ${sec}`}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-12">
            <span className={`text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-3 ${D?'text-isiblue-400':'text-isiblue-600'}`}><Camera size={14}/> Vie du campus</span>
            <h2 className={`text-4xl md:text-5xl font-black mb-3 ${tx}`}>Campus & <span className={D?'gradient-text':'gradient-text-light'}>Étudiants</span></h2>
            <p className={`text-sm ${txs}`}>Découvrez la vie à l'ISI SUPTECH — formations, soutenances et projets innovants.</p>
          </motion.div>
        </div>
        {/* Full-width 3D mosaic */}
        <div className="px-4 sm:px-8 lg:px-12" style={{perspective:'1400px'}}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4" style={{gridTemplateRows:'280px 280px'}}>
            {/* Big left - 2 rows */}
            <motion.div
              initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0,transition:{duration:0.7}}} viewport={{once:true}}
              whileHover={{rotateY:3,rotateX:-2,scale:1.02,transition:{type:'spring',stiffness:200,damping:20}}}
              className="row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl shadow-black/25">
              <img src="/Etudiant_gestion.jpeg" alt="Gestion" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"/>
              <motion.div initial={{y:10,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} transition={{delay:0.3}} className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-isiblue-600 flex items-center justify-center flex-shrink-0`}><Camera size={14} className="text-white"/></div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Gestion académique</span>
                </div>
                <p className="text-white font-black text-xl">Outils numériques modernes</p>
                <p className="text-white/50 text-xs mt-1">Administration & suivi étudiant en temps réel</p>
              </motion.div>
              {/* Glow on hover */}
              <div className="absolute inset-0 ring-2 ring-isiblue-500/0 group-hover:ring-isiblue-500/60 rounded-3xl transition-all duration-500"/>
            </motion.div>

            {/* Top right - Soutenance */}
            <motion.div
              initial={{opacity:0,y:-30}} whileInView={{opacity:1,y:0,transition:{delay:0.1,duration:0.6}}} viewport={{once:true}}
              whileHover={{rotateY:-3,rotateX:2,scale:1.03,transition:{type:'spring',stiffness:200,damping:20}}}
              className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl shadow-black/20">
              <img src="/caroursel_isi_suptech_soutenace.jpg" alt="Soutenance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-black text-base">Soutenances officielles</p>
                <p className="text-white/50 text-xs">Jurys professionnels</p>
              </div>
              <div className="absolute top-3 right-3 bg-isiblue-600/80 text-white text-[10px] font-black px-2.5 py-1 rounded-full">Diplômes</div>
              <div className="absolute inset-0 ring-2 ring-cyan-500/0 group-hover:ring-cyan-500/60 rounded-3xl transition-all duration-500"/>
            </motion.div>

            {/* Bottom right - Étudiant */}
            <motion.div
              initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0,transition:{delay:0.2,duration:0.6}}} viewport={{once:true}}
              whileHover={{rotateY:3,rotateX:2,scale:1.03,transition:{type:'spring',stiffness:200,damping:20}}}
              className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl shadow-black/20">
              <img src="/etudant_farda.jpeg" alt="Étudiant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-black text-base">Talents en Formation</p>
                <p className="text-white/50 text-xs">Innovation & projets numériques</p>
              </div>
              <div className="absolute top-3 right-3 bg-emerald-600/80 text-white text-[10px] font-black px-2.5 py-1 rounded-full">Projets</div>
              <div className="absolute inset-0 ring-2 ring-emerald-500/0 group-hover:ring-emerald-500/60 rounded-3xl transition-all duration-500"/>
            </motion.div>

            {/* Stats card - bottom left (hidden on small screens) */}
            <motion.div
              initial={{opacity:0,scale:0.88}} whileInView={{opacity:1,scale:1,transition:{delay:0.3,duration:0.6}}} viewport={{once:true}}
              whileHover={{scale:1.04,transition:{type:'spring',stiffness:200,damping:20}}}
              className="hidden md:flex col-span-2 md:col-span-1 rounded-3xl bg-gradient-to-br from-isiblue-700 via-isiblue-600 to-cyan-700 flex-col items-center justify-center p-8 shadow-2xl shadow-isiblue-500/35 relative overflow-hidden cursor-pointer">
              <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px)',backgroundSize:'22px 22px'}}/>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2"/>
              <div className="relative z-10 grid grid-cols-3 gap-6 w-full">
                {[[`${siteStats.stat_etudiants}+`,'Étudiants formés'],[siteStats.stat_filieres,'Filières actives'],[`${siteStats.stat_insertion}%`,'Insertion pro']].map(([v,l],i)=>(
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white mb-1">{v}</div>
                    <div className="text-white/55 text-[11px] font-medium leading-tight">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        {/* CTA under gallery */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.4}} className="mt-8 text-center px-4">
          <Link to="/pre-inscription" className={`inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl border transition-all ${D?'border-isiblue-500/30 text-isiblue-400 hover:bg-isiblue-500/10 hover:border-isiblue-400':'border-isiblue-300 text-isiblue-600 hover:bg-isiblue-50'}`}>
            Rejoindre la communauté ISI SUPTECH <ArrowRight size={16}/>
          </Link>
        </motion.div>
      </section>

      {/* ── TÉMOIGNAGES ───────────────────────────────────────────────────── */}
      {temos.length > 0 && (
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
              <span className={`text-sm font-black uppercase tracking-[0.3em] mb-3 block ${D?'text-isiblue-400':'text-isiblue-600'}`}>Témoignages</span>
              <h2 className={`text-4xl font-black ${tx}`}>Ce que disent <span className={D?'gradient-text':'gradient-text-light'}>nos étudiants</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {temos.slice(0,6).map((t,i)=>(
                <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
                  <div className={`${card} rounded-2xl p-6 h-full flex flex-col`}>
                    <Quote size={20} className={`mb-3 ${D?'text-isiblue-400':'text-isiblue-500'}`}/>
                    <p className={`text-sm leading-relaxed flex-1 mb-4 ${txs}`}>{t.contenu}</p>
                    <div><Stars note={t.note}/><div className={`font-bold text-sm mt-2 ${tx}`}>{t.nom}</div><div className={`text-xs ${txm}`}>{t.filiere}{t.annee_diplome?` · ${t.annee_diplome}`:''}</div></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TÉMOIGNAGE FORM ───────────────────────────────────────────────── */}
      <section className={`relative z-10 py-24 px-4 overflow-hidden ${D?'bg-[#07071e]':'bg-white'}`}>
        {/* BG elements */}
        <div className="absolute inset-0 pointer-events-none">
          {D ? (
            <>
              <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle,rgba(139,92,246,0.06) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
              <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-isiblue-500/12 blur-3xl"/>
              <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl"/>
            </>
          ) : (
            <>
              <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle,rgba(99,102,241,0.04) 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
              <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-isiblue-100/60 blur-3xl translate-x-1/2 -translate-y-1/4"/>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-100/50 blur-3xl -translate-x-1/4 translate-y-1/4"/>
            </>
          )}
          {[{x:'4%',y:'12%',rot:-15,s:68},{x:'87%',y:'8%',rot:20,s:52},{x:'2%',y:'78%',rot:10,s:58},{x:'93%',y:'82%',rot:-20,s:42}].map(({x,y,rot,s},i)=>(
            <motion.div key={i} className={`absolute font-black select-none ${D?'text-white/[0.04]':'text-isiblue-200/60'}`}
              style={{left:x,top:y,fontSize:s,transform:`rotate(${rot}deg)`}}
              animate={{y:[0,-12,0],opacity:D?[0.04,0.08,0.04]:[0.4,0.8,0.4]}}
              transition={{duration:4.5+i*0.9,repeat:Infinity,delay:i*1.1,ease:'easeInOut'}}>
              "
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">

            {/* ── Left info panel ── */}
            <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7}}
              className="lg:col-span-2">
              <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-bold mb-6 ${D?'bg-white/10 border-white/20 text-white/80':'bg-isiblue-50 border-isiblue-200 text-isiblue-700'}`}>
                <Quote size={12}/> Témoignages étudiants
              </div>
              <h2 className={`text-4xl md:text-5xl font-black mb-4 leading-tight ${D?'text-white':'text-slate-900'}`}>
                Votre voix<br/><span className={D?'gradient-text':'gradient-text-light'}>compte ici</span>
              </h2>
              <p className={`leading-relaxed mb-8 text-base ${D?'text-white/60':'text-slate-500'}`}>
                Chaque témoignage aide les futurs étudiants à trouver leur voie. Partagez votre vécu à l'ISI SUPTECH.
              </p>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  {n:`${siteStats.stat_etudiants}+`,l:'Étudiants',Icon:Users},
                  {n:`${siteStats.stat_insertion}%`,l:'Satisfaction',Icon:Star},
                  {n:`${siteStats.stat_experience} ans`,l:'Excellence',Icon:Award},
                ].map(({n,l,Icon},i)=>(
                  <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.2+i*0.1}}
                    className={`border rounded-2xl p-3.5 text-center ${D?'bg-white/8 border-white/12':'bg-white border-slate-200 shadow-sm'}`}>
                    <Icon size={15} className={D?'text-isiblue-300 mx-auto mb-1.5':'text-isiblue-500 mx-auto mb-1.5'}/>
                    <div className={`text-xl font-black ${D?'text-white':'text-slate-900'}`}>{n}</div>
                    <div className={`text-[10px] font-medium leading-tight ${D?'text-white/50':'text-slate-400'}`}>{l}</div>
                  </motion.div>
                ))}
              </div>
              {/* Témoignage — un vrai avis publié tourne toutes les 3s ; à défaut, un exemple */}
              {(() => {
                const real = temos[temoIndex]
                const shown = real
                  ? { nom: real.nom, sousTitre: [real.filiere, real.annee_diplome].filter(Boolean).join(' · '), contenu: real.contenu, note: real.note || 5, photo: real.photo }
                  : { nom: 'Amadou D.', sousTitre: 'Réseaux Informatiques · 2024', contenu: "ISI SUPTECH m'a donné les outils pour réussir dans le numérique. Les formateurs sont de vrais experts du terrain.", note: 5, photo: null }
                return (
                  <AnimatePresence mode="wait">
                    <motion.div key={real?.id ?? 'exemple'}
                      initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.4}}
                      className={`border rounded-2xl p-5 relative overflow-hidden ${D?'bg-white/5 border-white/12':'bg-white border-slate-200 shadow-md'}`}>
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-isiblue-500 to-isigold-500"/>
                      <Quote size={18} className={D?'text-isiblue-300 mb-3':'text-isiblue-500 mb-3'}/>
                      <p className={`text-sm leading-relaxed italic mb-4 ${D?'text-white/65':'text-slate-600'}`}>
                        "{shown.contenu}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-isiblue-500 to-isigold-500 flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                          {shown.photo ? <img src={shown.photo} alt={shown.nom} className="w-full h-full object-cover"/> : shown.nom[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${D?'text-white':'text-slate-800'}`}>{shown.nom}</div>
                          {shown.sousTitre && <div className={`text-xs ${D?'text-white/40':'text-slate-400'}`}>{shown.sousTitre}</div>}
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1,2,3,4,5].map(i=><Star key={i} size={11} className={i<=shown.note?'text-isigold-500 fill-isigold-500':D?'text-white/20':'text-slate-300'}/>)}
                        </div>
                      </div>
                      {temos.length > 1 && (
                        <div className="flex gap-1 mt-4 justify-center">
                          {temos.map((_,i)=><div key={i} className={`h-1 rounded-full transition-all ${i===temoIndex?'w-5 bg-isiblue-500':'w-1 bg-slate-300'}`}/>)}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )
              })()}
            </motion.div>

            {/* ── Right: form ── */}
            <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.1}}
              className="lg:col-span-3">
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${D?'shadow-black/40':'shadow-slate-200/80'}`}>
                <div className="h-1.5 bg-gradient-to-r from-isiblue-600 via-isiblue-400 to-isigold-400"/>
                <div className={`p-8 border border-t-0 ${D?'bg-white/[0.05] backdrop-blur-xl border-white/10':'bg-white border-slate-200'}`}>
                  <div className="text-center mb-7">
                    <h3 className={`text-2xl font-black mb-1.5 ${D?'text-white':'text-slate-900'}`}>Partagez votre expérience</h3>
                    <p className={`text-sm ${D?'text-white/50':'text-slate-500'}`}>Votre avis aide les futurs étudiants à choisir ISI SUPTECH</p>
                  </div>
                  {tOK ? (
                    <div className="text-center py-10">
                      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',damping:12}}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-emerald-500/30">
                        <CheckCircle2 size={36} className="text-white"/>
                      </motion.div>
                      <h4 className={`font-black text-2xl mb-2 ${D?'text-white':'text-slate-900'}`}>Merci pour votre témoignage !</h4>
                      <p className={D?'text-white/50':'text-slate-500'}>Il sera affiché après validation par notre équipe.</p>
                    </div>
                  ) : (
                    <form onSubmit={async e=>{e.preventDefault();try{await submitTemoignage(tForm);setTOK(true)}catch{setTOK(true)}}} className="space-y-5">
                      {/* Stars */}
                      <div className={`flex flex-col items-center gap-3 py-5 rounded-2xl border ${D?'bg-white/5 border-white/8':'bg-isiblue-50/60 border-isiblue-100'}`}>
                        <p className={`text-xs font-black uppercase tracking-widest ${D?'text-white/40':'text-slate-400'}`}>Votre satisfaction</p>
                        <div className="flex gap-3">
                          {[1,2,3,4,5].map(n=>(
                            <motion.button key={n} type="button" whileHover={{scale:1.25}} whileTap={{scale:0.9}}
                              onClick={()=>setTForm(f=>({...f,note:n}))}>
                              <Star size={38} className={n<=tForm.note?'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]':D?'text-white/20':'text-slate-300'} style={{transition:'all 0.2s'}}/>
                            </motion.button>
                          ))}
                        </div>
                        <p className={`text-sm font-bold ${D?'text-amber-300':'text-amber-600'}`}>
                          {['','Décevant','Passable','Bien','Très bien','Excellent !'][tForm.note]}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-black mb-2 ${D?'text-white/50':'text-slate-500'}`}>Nom complet *</label>
                          <input value={tForm.nom} onChange={e=>setTForm(f=>({...f,nom:e.target.value}))} required
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium ${inp}`}
                            placeholder="Votre nom"/>
                        </div>
                        <div>
                          <label className={`block text-xs font-black mb-2 ${D?'text-white/50':'text-slate-500'}`}>Filière</label>
                          <input value={tForm.filiere} onChange={e=>setTForm(f=>({...f,filiere:e.target.value}))}
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium ${inp}`}
                            placeholder="Ex: Informatique"/>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs font-black mb-2 ${D?'text-white/50':'text-slate-500'}`}>Promotion / Année</label>
                        <input value={tForm.annee_diplome} onChange={e=>setTForm(f=>({...f,annee_diplome:e.target.value}))}
                          className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium ${inp}`}
                          placeholder="2024-2025"/>
                      </div>
                      <div>
                        <label className={`block text-xs font-black mb-2 ${D?'text-white/50':'text-slate-500'}`}>Votre témoignage *</label>
                        <textarea value={tForm.contenu} onChange={e=>setTForm(f=>({...f,contenu:e.target.value}))}
                          required rows={4} className={`w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all font-medium ${inp}`}
                          placeholder="Partagez ce que vous avez aimé, ce que vous avez appris, comment ISI SUPTECH a changé votre parcours..."/>
                      </div>
                      <motion.button whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.98}} type="submit"
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl shadow-xl shadow-isiblue-500/25 text-base">
                        <Send size={16}/> Envoyer mon témoignage
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
            className="relative rounded-3xl overflow-hidden">
            {/* BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-isiblue-800 via-isiblue-700 to-cyan-800"/>
            <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.08) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2"/>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/2"/>
            <div className="relative z-10 p-10 md:p-14">
              {newsOK ? (
                <div className="text-center py-4">
                  <CheckCircle2 size={52} className="text-emerald-400 mx-auto mb-4"/>
                  <h3 className="text-2xl font-black text-white mb-2">Vous êtes inscrit(e) !</h3>
                  <p className="text-white/60">Vous recevrez nos actualités ISI SUPTECH directement par email.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-xs font-bold mb-4">
                      <Mail size={12}/> Newsletter ISI SUPTECH
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">Restez informé(e)</h3>
                    <p className="text-white/60 leading-relaxed">Actualités, dates d'inscription, événements et opportunités de notre campus — dans votre boîte mail.</p>
                  </div>
                  <form onSubmit={async e=>{e.preventDefault();try{await subscribeNewsletter(news);setNewsOK(true)}catch{setNewsOK(true)}}} className="space-y-3">
                    <input value={news.nom} onChange={e=>setNews(n=>({...n,nom:e.target.value}))} placeholder="Votre prénom" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/50 focus:bg-white/15 transition-all"/>
                    <input value={news.email} onChange={e=>setNews(n=>({...n,email:e.target.value}))} type="email" required placeholder="Votre email *" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/50 focus:bg-white/15 transition-all"/>
                    <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} type="submit"
                      className="w-full bg-white text-isiblue-700 hover:bg-isiblue-50 font-black py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-colors">
                      <Send size={16}/> S'abonner gratuitement
                    </motion.button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-4">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}}
          className="max-w-4xl mx-auto rounded-3xl bg-slate-900 px-8 py-14 md:px-16 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-6 bg-white/10 text-teal-300">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400"/> Inscriptions 2026-2027 ouvertes
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-white">
            Prêt à rejoindre l'excellence ?
          </h2>
          <p className="mb-8 text-base max-w-lg mx-auto leading-relaxed text-white/60">
            Déposez votre demande en quelques minutes. Réponse garantie sous <strong className="text-teal-300">48h ouvrées</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/pre-inscription" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-colors">
              <GraduationCap size={18}/> Pré-inscription <ArrowRight size={16}/>
            </Link>
            <Link to="/connexion" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl border-2 border-white/25 text-white hover:bg-white/10 transition-colors">
              <Lock size={15}/> Espace étudiant
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['ANAQ Certifié','CAMES Reconnu','Cisco Academy','95% Insertion'].map((t,i)=>(
              <div key={i} className="px-3 py-1.5 rounded-full text-xs font-mono text-white/50 border border-white/10">{t}</div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-white">
        {/* Gradient accent top bar */}
        <div className="h-1 bg-gradient-to-r from-slate-900 via-teal-600 to-teal-400"/>

        <div className="py-14 px-4 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

              {/* Brand — span 2 */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <img src="/isi-logo.png" alt="ISI" className="h-12 w-auto object-contain" onError={e=>{e.target.style.display='none'}}/>
                  <div>
                    <div className="font-black text-xl text-slate-900">ISI SUPTECH</div>
                    <div className="text-xs text-slate-400">Institut Supérieur d'Informatique</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6 max-w-xs text-slate-500">
                  Excellence académique, pratique professionnelle et innovation numérique au service des talents africains depuis 2009.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Cisco Academy','AWS Academy','ANAQ certifié','CAMES reconnu'].map((b,i)=>(
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-bold border bg-isiblue-50 border-isiblue-200 text-isiblue-700">{b}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {SOCIALS.map(({key,I})=>{
                    const url=socials[key]; if(!url) return null
                    return (
                      <motion.a key={key} href={url} target="_blank" rel="noopener noreferrer"
                        whileHover={{scale:1.15,y:-2}} whileTap={{scale:0.9}}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-slate-100 border border-slate-200 text-slate-600 hover:bg-isiblue-50 hover:text-isiblue-600 hover:border-isiblue-200">
                        <I s={16}/>
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Formations */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-5 text-slate-400">Formations</h4>
                <div className="space-y-2.5">
                  {filieres.map((f,i)=>(
                    <button key={i} onClick={()=>openF(f)}
                      className="flex items-center gap-2 text-sm group transition-colors text-left text-slate-500 hover:text-isiblue-600">
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"/>
                      <span>{f.nom}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-5 text-slate-400">Contact</h4>
                <div className="space-y-4">
                  {[
                    {Icon:MapPin,v:'Sicap Liberté 3 N°1977\nDakar, Sénégal'},
                    {Icon:Phone,v:'+221 33 825 62 10',href:'tel:+221338256210'},
                    {Icon:Mail,v:'suptech@isisuptech.com',href:'mailto:suptech@isisuptech.com'},
                    {Icon:Globe,v:'www.isisuptech.com'},
                  ].map(({Icon,v,href},i)=>(
                    <div key={i} className="flex items-start gap-2.5">
                      <Icon size={13} className="mt-0.5 flex-shrink-0 text-isiblue-500"/>
                      {href
                        ?<a href={href} className="text-sm transition-colors text-slate-500 hover:text-isiblue-600">{v}</a>
                        :<span className="text-sm whitespace-pre-line text-slate-500">{v}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Accès rapide + Horaires */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-5 text-slate-400">Accès rapide</h4>
                <div className="space-y-2.5 mb-7">
                  {[{to:'/pre-inscription',l:'Pré-inscription',Icon:GraduationCap},{to:'/connexion',l:'Espace étudiant',Icon:Lock},{to:'/formations',l:'Nos Formations',Icon:BookOpen}].map((lk,i)=>(
                    <Link key={i} to={lk.to} className="flex items-center gap-2 text-sm transition-colors text-slate-500 hover:text-isiblue-600">
                      <lk.Icon size={13} className="text-isiblue-500"/> {lk.l}
                    </Link>
                  ))}
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-3 text-slate-400">Horaires</h4>
                <div className="space-y-1.5">
                  {[['Lun–Ven','08h–18h',true],['Samedi','09h–14h',true],['Dimanche','Fermé',false]].map(([j,h,o],i)=>(
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{j}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${o?'bg-emerald-50 text-emerald-600 border-emerald-200':'bg-red-50 text-red-500 border-red-200'}`}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Partners strip */}
            <div className="py-8 border-t border-b border-slate-100">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-slate-400">Partenaires officiels</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {PARTENAIRES.map((p,i)=>(
                  <img key={i} src={p.logo} alt={p.nom}
                    className="h-7 max-w-[80px] object-contain transition-all opacity-35 grayscale hover:grayscale-0 hover:opacity-100"
                    onError={e=>{e.target.style.display='none'}}/>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">© {new Date().getFullYear()} ISI SUPTECH. Tous droits réservés.</p>
              <div className="flex items-center gap-4">
                <Link to="/pre-inscription" className="text-xs transition-colors text-slate-400 hover:text-isiblue-600">Pré-inscription</Link>
                <span className="text-slate-300">·</span>
                <Link to="/connexion" className="text-xs transition-colors text-slate-400 hover:text-isiblue-600">Connexion</Link>
              </div>
              <p className="text-xs text-slate-400">Développé par : <span className="text-isiblue-600">Mansour Service</span></p>
            </div>
          </div>
        </div>
      </footer>

      <FModal f={selF} onClose={()=>setSelF(null)}/>
    </div>
  )
}
