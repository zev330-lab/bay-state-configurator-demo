import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FileText,
  CalendarDays,
  Check,
  Star,
  MessageSquare,
  Send,
  Bot,
} from 'lucide-react'

/* ─── Data ─── */

const LAYOUTS = [
  { id: 'l-shape', name: 'L-Shape', dims: '10 x 12 ft', multiplier: 1.0 },
  { id: 'u-shape', name: 'U-Shape', dims: '10 x 14 ft', multiplier: 1.15 },
  { id: 'galley', name: 'Galley', dims: '8 x 12 ft', multiplier: 0.85 },
  { id: 'island', name: 'Island', dims: '12 x 14 ft', multiplier: 1.3 },
]

const CABINET_LINES = [
  {
    id: 'fabuwood',
    name: 'Fabuwood',
    tier: 'Value',
    basePrice: 8200,
    color: '#22c55e',
    features: ['Solid wood doors', 'Soft-close standard', 'Wide color selection'],
  },
  {
    id: 'mid-continent',
    name: 'Mid Continent',
    tier: 'Value-Plus',
    basePrice: 11500,
    color: '#3b82f6',
    features: ['All-plywood construction', 'Dovetail drawers', 'Lifetime warranty'],
  },
  {
    id: 'masterbrand',
    name: 'MasterBrand',
    tier: 'Mid-Range',
    basePrice: 15800,
    color: '#8b5cf6',
    features: [
      'Multiple brands under one roof',
      'Designer finishes',
      'Custom modifications available',
    ],
  },
  {
    id: 'starmark',
    name: 'StarMark',
    tier: 'Premium',
    basePrice: 22400,
    color: '#f59e0b',
    features: [
      'Inset & overlay options',
      'Unlimited finish combinations',
      'Handcrafted in Iowa',
    ],
  },
  {
    id: 'europa',
    name: 'Europa',
    tier: 'Ultra-Premium',
    basePrice: 31000,
    color: '#ef4444',
    features: [
      'Full custom European styling',
      'Integrated lighting systems',
      'Precision German engineering',
    ],
  },
]

const DOOR_STYLES = [
  { id: 'shaker', name: 'Shaker', price: 0, popular: true },
  { id: 'raised-panel', name: 'Raised Panel', price: 400 },
  { id: 'flat-panel', name: 'Flat Panel', price: 200 },
  { id: 'beadboard', name: 'Beadboard', price: 600 },
  { id: 'inset', name: 'Inset', price: 1800 },
  { id: 'glass-front', name: 'Glass Front', price: 2200 },
]

const FINISHES = [
  { id: 'white', name: 'White Painted', price: 0, bg: 'bg-white', ring: 'ring-white' },
  { id: 'dove-gray', name: 'Dove Gray', price: 300, bg: 'bg-gray-300', ring: 'ring-gray-300' },
  { id: 'navy-blue', name: 'Navy Blue', price: 500, bg: 'bg-blue-900', ring: 'ring-blue-900' },
  { id: 'natural-oak', name: 'Natural Oak', price: 0, bg: 'bg-amber-600', ring: 'ring-amber-600' },
  { id: 'espresso', name: 'Espresso', price: 200, bg: 'bg-amber-950', ring: 'ring-amber-950' },
  { id: 'cherry', name: 'Cherry', price: 400, bg: 'bg-red-900', ring: 'ring-red-900' },
]

const COUNTERTOPS = [
  { id: 'granite', name: 'Granite', price: 3200, bg: 'bg-gray-600' },
  { id: 'quartz', name: 'Quartz (Cambria)', price: 4800, bg: 'bg-gray-200' },
  { id: 'marble', name: 'Marble', price: 6500, bg: 'bg-gray-100' },
  { id: 'butcher-block', name: 'Butcher Block', price: 1800, bg: 'bg-amber-700' },
]

/* ─── Helpers ─── */

function fmt(n) {
  return '$' + n.toLocaleString('en-US')
}

/* ─── Layout SVG Icons ─── */

function LayoutIcon({ id }) {
  const common = 'stroke-cyan-accent fill-none stroke-[1.5]'
  const filled = 'fill-cyan-accent/20 stroke-cyan-accent stroke-[1.5]'
  if (id === 'l-shape')
    return (
      <svg viewBox="0 0 48 48" className="w-16 h-16 mx-auto mb-3">
        <path d="M8 8 h12 v32 h20 v-12 h-20 v-20z" className={filled} />
      </svg>
    )
  if (id === 'u-shape')
    return (
      <svg viewBox="0 0 48 48" className="w-16 h-16 mx-auto mb-3">
        <path d="M8 8 h8 v24 h16 v-24 h8 v32 h-32z" className={filled} />
      </svg>
    )
  if (id === 'galley')
    return (
      <svg viewBox="0 0 48 48" className="w-16 h-16 mx-auto mb-3">
        <rect x="6" y="8" width="8" height="32" className={filled} />
        <rect x="34" y="8" width="8" height="32" className={filled} />
        <line x1="18" y1="24" x2="30" y2="24" className={common} strokeDasharray="3 3" />
      </svg>
    )
  // island
  return (
    <svg viewBox="0 0 48 48" className="w-16 h-16 mx-auto mb-3">
      <path d="M6 8 h36 v8 h-36z" className={filled} />
      <rect x="14" y="24" width="20" height="12" rx="2" className={filled} />
    </svg>
  )
}

/* ─── Door Style Visual ─── */

function DoorStyleVisual({ id }) {
  const base = 'w-full h-24 rounded-lg border border-slate-600 overflow-hidden flex items-center justify-center mb-3'
  if (id === 'shaker')
    return (
      <div className={base + ' bg-slate-700'}>
        <div className="w-14 h-16 border-2 border-slate-400 rounded-sm flex items-center justify-center">
          <div className="w-10 h-12 border border-slate-500 rounded-sm" />
        </div>
      </div>
    )
  if (id === 'raised-panel')
    return (
      <div className={base + ' bg-slate-700'}>
        <div className="w-14 h-16 border-2 border-slate-400 rounded-sm flex items-center justify-center">
          <div className="w-9 h-11 bg-slate-600 rounded-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
    )
  if (id === 'flat-panel')
    return (
      <div className={base + ' bg-slate-700'}>
        <div className="w-14 h-16 border-2 border-slate-400 rounded-sm flex items-center justify-center">
          <div className="w-12 h-14 bg-slate-600 rounded-sm" />
        </div>
      </div>
    )
  if (id === 'beadboard')
    return (
      <div className={base + ' bg-slate-700'}>
        <div className="w-14 h-16 border-2 border-slate-400 rounded-sm flex items-center justify-center gap-[3px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-[3px] h-12 bg-slate-500 rounded-full" />
          ))}
        </div>
      </div>
    )
  if (id === 'inset')
    return (
      <div className={base + ' bg-slate-700'}>
        <div className="w-16 h-18 border-2 border-slate-400 rounded-sm p-[3px]">
          <div className="w-full h-full border border-dashed border-slate-500 rounded-sm flex items-center justify-center">
            <div className="w-8 h-10 border border-slate-500 rounded-sm" />
          </div>
        </div>
      </div>
    )
  // glass-front
  return (
    <div className={base + ' bg-slate-700'}>
      <div className="w-14 h-16 border-2 border-slate-400 rounded-sm flex items-center justify-center">
        <div className="w-10 h-12 bg-cyan-accent/10 border border-cyan-accent/40 rounded-sm" />
      </div>
    </div>
  )
}

/* ─── AnimatedStep wrapper ─── */

function AnimatedStep({ children, stepKey }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('step-enter')
    // trigger reflow
    void el.offsetWidth
    el.classList.add('step-enter-active')
    el.classList.remove('step-enter')
    return () => {
      el.classList.remove('step-enter-active')
    }
  }, [stepKey])
  return (
    <div ref={ref} className="step-enter">
      {children}
    </div>
  )
}

/* ─── AI Chat Widget ─── */

const AI_RESPONSES = {
  default:
    "Great question! Based on your kitchen dimensions and style preferences, I'd recommend starting with an L-Shape layout — it maximizes counter space while keeping the work triangle efficient. For a modern look with great value, Fabuwood's shaker line in White Painted with Cambria quartz countertops is our most popular combination. Want me to walk you through the options?",
  cabinets:
    "We carry 5 cabinet lines ranging from $8,200 to $31,000 for a standard kitchen. Fabuwood is our best value with solid wood doors and soft-close standard. StarMark is our premium pick — handcrafted in Iowa with unlimited finish combinations. I can help you compare any two lines side by side.",
  cost:
    "A typical kitchen remodel at Bay State ranges from $12,000 to $45,000 depending on cabinet line, countertop material, and finish choices. The configurator above will give you a 90% accurate estimate in minutes. Most customers are pleasantly surprised — the number is usually lower than they expected.",
}

function AiChatWidget() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function pickResponse(text) {
    const lower = text.toLowerCase()
    if (lower.includes('cabinet') || lower.includes('brand') || lower.includes('line'))
      return AI_RESPONSES.cabinets
    if (lower.includes('cost') || lower.includes('price') || lower.includes('budget') || lower.includes('how much'))
      return AI_RESPONSES.cost
    return AI_RESPONSES.default
  }

  function handleSend(text) {
    const msg = text || input.trim()
    if (!msg) return
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: pickResponse(msg) }])
      setTyping(false)
    }, 1200)
  }

  return (
    <div className="mt-6 bg-card rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-cyan-accent" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">AI Cabinet Expert</h4>
          <p className="text-[10px] text-muted">Built-in assistant — ask anything</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-medium">Online</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="px-4 py-3 max-h-[200px] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-2">
            <p className="text-xs text-muted mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['What cabinets do you carry?', 'How much does a kitchen cost?', 'Help me choose a layout'].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[11px] px-3 py-1.5 bg-cyan-accent/10 text-cyan-accent rounded-full hover:bg-cyan-accent/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-accent text-navy rounded-br-sm'
                  : 'bg-slate-700/70 text-body rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-slate-700/70 px-4 py-2.5 rounded-xl rounded-bl-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-slate-700/50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about cabinets, pricing, layouts..."
          className="flex-1 bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-accent/50 transition-colors min-h-[40px]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-lg bg-cyan-accent flex items-center justify-center hover:bg-cyan-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4 text-navy" />
        </button>
      </div>
    </div>
  )
}

/* ─── App ─── */

export default function App() {
  const [step, setStep] = useState(1)
  const [layout, setLayout] = useState(null)
  const [cabinet, setCabinet] = useState(null)
  const [doorStyle, setDoorStyle] = useState(null)
  const [finish, setFinish] = useState(null)
  const [countertop, setCountertop] = useState(null)
  const [priceFlash, setPriceFlash] = useState(false)
  const [popId, setPopId] = useState(null)

  const layoutData = LAYOUTS.find((l) => l.id === layout)
  const cabinetData = CABINET_LINES.find((c) => c.id === cabinet)
  const doorData = DOOR_STYLES.find((d) => d.id === doorStyle)
  const finishData = FINISHES.find((f) => f.id === finish)
  const countertopData = COUNTERTOPS.find((c) => c.id === countertop)

  const multiplier = layoutData ? layoutData.multiplier : 1
  const cabinetPrice = cabinetData ? Math.round(cabinetData.basePrice * multiplier) : 0
  const doorPrice = doorData ? doorData.price : 0
  const finishPrice = finishData ? finishData.price : 0
  const countertopPrice = countertopData ? countertopData.price : 0
  const total = cabinetPrice + doorPrice + finishPrice + countertopPrice

  const flash = useCallback(() => {
    setPriceFlash(true)
    setTimeout(() => setPriceFlash(false), 500)
  }, [])

  const pop = useCallback((id) => {
    setPopId(id)
    setTimeout(() => setPopId(null), 250)
  }, [])

  function selectAndAdvance(setter, value, id) {
    setter(value)
    flash()
    pop(id)
    setTimeout(() => setStep((s) => Math.min(s + 1, 6)), 350)
  }

  function canProceed() {
    if (step === 1) return !!layout
    if (step === 2) return !!cabinet
    if (step === 3) return !!doorStyle
    if (step === 4) return !!finish
    if (step === 5) return !!countertop
    return true
  }

  function goNext() {
    if (canProceed() && step < 6) setStep(step + 1)
  }

  function goBack() {
    if (step > 1) setStep(step - 1)
  }

  function startOver() {
    setStep(1)
    setLayout(null)
    setCabinet(null)
    setDoorStyle(null)
    setFinish(null)
    setCountertop(null)
  }

  /* step titles */
  const stepTitles = [
    '',
    'Choose Your Kitchen Layout',
    'Select Your Cabinet Line',
    'Pick a Door Style',
    'Choose Your Finish',
    'Select a Countertop',
    'Your Estimate',
  ]

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy/90 backdrop-blur-md border-b border-slate-700/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-accent to-cyan-dark flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Bay State Kitchen Configurator
            </h1>
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
            Demo
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-accent to-gold transition-all duration-500 ease-out"
          style={{ width: `${((step) / 6) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <AnimatedStep stepKey={step}>
          {/* Step title */}
          <div className="mb-6">
            <p className="text-muted text-sm font-medium mb-1">
              Step {step} of 6
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {stepTitles[step]}
            </h2>
          </div>

          {/* Step 1: Kitchen Layout */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => selectAndAdvance(setLayout, l.id, l.id)}
                    className={`${
                      popId === l.id ? 'select-pop' : ''
                    } group relative bg-card rounded-xl p-5 text-center border-2 transition-all duration-200 cursor-pointer min-h-[140px] hover:border-cyan-accent/60 hover:bg-card/80 ${
                      layout === l.id
                        ? 'border-cyan-accent shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                        : 'border-slate-700/50'
                    }`}
                  >
                    {layout === l.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-accent flex items-center justify-center">
                        <Check className="w-4 h-4 text-navy" strokeWidth={3} />
                      </div>
                    )}
                    <LayoutIcon id={l.id} />
                    <div className="font-semibold text-white text-base">{l.name}</div>
                    <div className="text-muted text-sm mt-1">{l.dims}</div>
                  </button>
                ))}
              </div>

              {/* AI Chat Assistant */}
              <AiChatWidget />
            </div>
          )}

          {/* Step 2: Cabinet Line */}
          {step === 2 && (
            <div className="space-y-3">
              {CABINET_LINES.map((c) => {
                const price = Math.round(c.basePrice * multiplier)
                return (
                  <button
                    key={c.id}
                    onClick={() => selectAndAdvance(setCabinet, c.id, c.id)}
                    className={`${
                      popId === c.id ? 'select-pop' : ''
                    } group w-full text-left bg-card rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden hover:border-cyan-accent/60 hover:bg-card/80 ${
                      cabinet === c.id
                        ? 'border-cyan-accent shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                        : 'border-slate-700/50'
                    }`}
                  >
                    <div className="flex">
                      {/* Accent stripe */}
                      <div
                        className="w-1.5 shrink-0 rounded-l-xl"
                        style={{ backgroundColor: c.color }}
                      />
                      <div className="flex-1 p-4 md:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-white">{c.name}</span>
                              <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: c.color + '22',
                                  color: c.color,
                                }}
                              >
                                {c.tier}
                              </span>
                            </div>
                            <ul className="mt-2 space-y-1">
                              {c.features.map((f, i) => (
                                <li key={i} className="text-muted text-sm flex items-start gap-2">
                                  <span className="text-cyan-accent mt-0.5 shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                  </span>
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-muted">Starting at</div>
                            <div className="text-xl font-bold text-gold">{fmt(price)}</div>
                          </div>
                        </div>
                      </div>
                      {cabinet === c.id && (
                        <div className="flex items-center pr-4">
                          <div className="w-7 h-7 rounded-full bg-cyan-accent flex items-center justify-center">
                            <Check className="w-4 h-4 text-navy" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 3: Door Style */}
          {step === 3 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DOOR_STYLES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => selectAndAdvance(setDoorStyle, d.id, d.id)}
                  className={`${
                    popId === d.id ? 'select-pop' : ''
                  } group relative bg-card rounded-xl p-4 text-center border-2 transition-all duration-200 cursor-pointer hover:border-cyan-accent/60 hover:bg-card/80 ${
                    doorStyle === d.id
                      ? 'border-cyan-accent shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'border-slate-700/50'
                  }`}
                >
                  {d.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                      <Star className="w-3 h-3" fill="currentColor" /> Most Popular
                    </div>
                  )}
                  {doorStyle === d.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-accent flex items-center justify-center">
                      <Check className="w-4 h-4 text-navy" strokeWidth={3} />
                    </div>
                  )}
                  <DoorStyleVisual id={d.id} />
                  <div className="font-semibold text-white text-sm">{d.name}</div>
                  <div className="text-gold text-sm font-medium mt-1">
                    {d.price === 0 ? 'Included' : '+' + fmt(d.price)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Finish */}
          {step === 4 && (
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
              {FINISHES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => selectAndAdvance(setFinish, f.id, f.id)}
                  className={`${
                    popId === f.id ? 'select-pop' : ''
                  } group relative bg-card rounded-xl p-5 text-center border-2 transition-all duration-200 cursor-pointer hover:border-cyan-accent/60 hover:bg-card/80 ${
                    finish === f.id
                      ? 'border-cyan-accent shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'border-slate-700/50'
                  }`}
                >
                  {finish === f.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-accent flex items-center justify-center">
                      <Check className="w-3 h-3 text-navy" strokeWidth={3} />
                    </div>
                  )}
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-3 ${f.bg} border-4 transition-all duration-200 ${
                      finish === f.id
                        ? 'border-cyan-accent shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'border-slate-600 group-hover:border-slate-400'
                    }`}
                  />
                  <div className="font-semibold text-white text-sm">{f.name}</div>
                  <div className="text-gold text-sm font-medium mt-1">
                    {f.price === 0 ? 'Included' : '+' + fmt(f.price)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 5: Countertop */}
          {step === 5 && (
            <div className="space-y-3">
              {COUNTERTOPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectAndAdvance(setCountertop, c.id, c.id)}
                  className={`${
                    popId === c.id ? 'select-pop' : ''
                  } group w-full flex items-center gap-4 bg-card rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer hover:border-cyan-accent/60 hover:bg-card/80 ${
                    countertop === c.id
                      ? 'border-cyan-accent shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'border-slate-700/50'
                  }`}
                >
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-lg shrink-0 ${c.bg} border-2 transition-colors ${
                      countertop === c.id ? 'border-cyan-accent' : 'border-slate-600'
                    }`}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white text-base">{c.name}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-gold">+{fmt(c.price)}</div>
                  </div>
                  {countertop === c.id && (
                    <div className="w-7 h-7 rounded-full bg-cyan-accent flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-navy" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 6: Summary */}
          {step === 6 && (
            <div>
              {/* Summary Card */}
              <div className="bg-card rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Header band */}
                <div className="bg-gradient-to-r from-cyan-accent/10 to-gold/10 px-5 py-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-bold text-white">Kitchen Configuration Summary</h3>
                  <p className="text-muted text-sm mt-0.5">Your custom selections at a glance</p>
                </div>

                {/* Line items */}
                <div className="divide-y divide-slate-700/50">
                  {/* Layout */}
                  <div className="px-5 py-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-0.5">Layout</div>
                      <div className="font-semibold text-white">
                        {layoutData?.name} ({layoutData?.dims})
                      </div>
                    </div>
                    <div className="text-muted text-sm">Base</div>
                  </div>

                  {/* Cabinets */}
                  <div className="px-5 py-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-0.5">Cabinet Line</div>
                      <div className="font-semibold text-white">
                        {cabinetData?.name}{' '}
                        <span className="text-muted font-normal text-sm">({cabinetData?.tier})</span>
                      </div>
                    </div>
                    <div className="font-semibold text-white">{fmt(cabinetPrice)}</div>
                  </div>

                  {/* Door */}
                  <div className="px-5 py-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-0.5">Door Style</div>
                      <div className="font-semibold text-white">{doorData?.name}</div>
                    </div>
                    <div className="font-semibold text-white">
                      {doorPrice === 0 ? 'Included' : '+' + fmt(doorPrice)}
                    </div>
                  </div>

                  {/* Finish */}
                  <div className="px-5 py-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-0.5">Finish</div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full inline-block ${finishData?.bg}`} />
                        {finishData?.name}
                      </div>
                    </div>
                    <div className="font-semibold text-white">
                      {finishPrice === 0 ? 'Included' : '+' + fmt(finishPrice)}
                    </div>
                  </div>

                  {/* Countertop */}
                  <div className="px-5 py-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wider mb-0.5">Countertop</div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-lg inline-block ${countertopData?.bg}`} />
                        {countertopData?.name}
                      </div>
                    </div>
                    <div className="font-semibold text-white">+{fmt(countertopPrice)}</div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-slate-800/50 px-5 py-5 flex justify-between items-center">
                  <div className="text-lg font-bold text-white">Estimated Total</div>
                  <div className="text-3xl font-extrabold text-gold">{fmt(total)}</div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-muted text-xs text-center mt-4 px-4 leading-relaxed">
                * This is a preliminary estimate for budgeting purposes only. Final pricing may vary based
                on measurements, materials availability, and installation requirements. Schedule a showroom
                visit for an accurate quote.
              </p>

              {/* Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() =>
                    alert(
                      'PDF generation available in full product. This estimate would be emailed to you as a professional PDF.'
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-accent to-cyan-dark text-white font-semibold py-3.5 rounded-xl text-base hover:opacity-90 transition-opacity cursor-pointer min-h-[48px]"
                >
                  <FileText className="w-5 h-5" /> Generate PDF Estimate
                </button>
                <button
                  onClick={() =>
                    alert(
                      'Showroom scheduling available in full product. You would be directed to our online booking system.'
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3.5 rounded-xl text-base hover:opacity-90 transition-opacity cursor-pointer min-h-[48px]"
                >
                  <CalendarDays className="w-5 h-5" /> Schedule Showroom Visit
                </button>
                <button
                  onClick={startOver}
                  className="w-full flex items-center justify-center gap-2 text-muted hover:text-white font-medium py-3 rounded-xl text-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}
        </AnimatedStep>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-slate-700/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left: Back */}
          <div className="w-20">
            {step > 1 && step < 6 && (
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-muted hover:text-white transition-colors text-sm font-medium cursor-pointer min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step === 6 && (
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-muted hover:text-white transition-colors text-sm font-medium cursor-pointer min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>

          {/* Center: Price + Step */}
          <div className="text-center flex-1">
            <div
              className={`text-2xl font-extrabold transition-all duration-200 ${
                priceFlash ? 'price-flash' : 'text-gold'
              }`}
            >
              {total > 0 ? fmt(total) : '--'}
            </div>
            <div className="text-muted text-xs">
              Step {step} of 6
            </div>
          </div>

          {/* Right: Next */}
          <div className="w-20 flex justify-end">
            {step < 6 && (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={`flex items-center gap-1 font-semibold text-sm rounded-lg px-4 min-h-[44px] transition-all cursor-pointer ${
                  canProceed()
                    ? 'bg-cyan-accent text-navy hover:bg-cyan-dark'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
