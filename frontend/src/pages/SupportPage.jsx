import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CircleHelp,
  PhoneCall,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Bot
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Comprehensive Agricultural FAQs
const FAQS = [
  {
    q: 'How does AgroAI calculate crop recommendations?',
    a: 'Our models combine your soil N-P-K nutrient density, pH, and soil moisture with hyper-local Open-Meteo satellite weather telemetry (temperature curves, humidity, and rainfall) and your previous crop rotation history. Rather than a static lookup table, our machine learning model evaluates multi-dimensional agronomic suitability scores.'
  },
  {
    q: 'Can I connect my own RS-485 / USB / Modbus soil sensor probe?',
    a: 'Yes! AgroAI natively supports the W3C Web Serial API. When using Chrome or Edge on Windows, Linux, Mac, or Android with USB OTG, you can plug in any standard RS-485 soil sensor probe, select your baud rate (9600 or 115200 bps), and stream live telemetry directly into the Soil Data page without any custom drivers.'
  },
  {
    q: 'How frequently are APMC Mandi wholesale commodity rates updated?',
    a: 'Wholesale mandi commodity prices are refreshed daily following the morning and afternoon eNAM auction sessions across Indian APMC markets, providing accurate minimum, maximum, and modal price benchmarks.'
  },
  {
    q: 'What should I do if the plant disease scanner indicates an unknown disease?',
    a: 'For best computer vision accuracy, ensure the photo is taken in natural indirect daylight, focused closely on the lesion spots (10-15 cm away). If an unusual infection occurs, you can use our 24/7 AI Agronomist Chat or dial the Kisan Call Center at 1800-180-1551 for local expert plant pathologist advice.'
  },
  {
    q: 'Is my farm acreage and yield data kept private and secure?',
    a: 'Absolutely. Your farm telemetry, location, acreage, and soil records are encrypted and strictly confidential. They are used exclusively to calculate your personalized agronomic advisories and are never shared or sold to commercial third parties.'
  },
  {
    q: 'How can I access local Krishi Vigyan Kendra (KVK) physical soil testing?',
    a: 'If you want to cross-reference your hardware sensors with government lab wet-chemistry soil testing, visit your district KVK center with 500g of composite topsoil taken from 5-6 points across your field. You can log the resulting certified NPK numbers in the Soil Data page.'
  }
]

export default function SupportPage({ farmer }) {
  const [openFaq, setOpenFaq] = useState(0) // index of expanded FAQ
  const [ticketForm, setTicketForm] = useState({
    category: 'Soil Testing & Sensors',
    priority: 'Normal',
    subject: '',
    message: ''
  })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('')

  function handleTicketSubmit(e) {
    e.preventDefault()
    const id = `AGRO-${Math.floor(Math.random() * 89999 + 10000)}`
    setTicketId(id)
    setTicketSubmitted(true)
  }

  function handleReset() {
    setTicketSubmitted(false)
    setTicketForm({ category: 'Soil Testing & Sensors', priority: 'Normal', subject: '', message: '' })
  }

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      {/* Hero Header Banner */}
      <div
        className="card-agro p-4 mb-4 text-white overflow-hidden position-relative shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 45%, #059669 100%)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.18)'
        }}
      >
        {/* Glow decoration */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -30,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 position-relative" style={{ zIndex: 1 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span
                className="badge px-2.5 py-1 text-uppercase fw-bold"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.05em',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                🎧 24/7 KRISHI HELPDESK & FARMER SUPPORT
              </span>
              <span
                className="badge px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                style={{
                  background: 'rgba(52,211,153,0.25)',
                  color: '#A7F3D0',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(52,211,153,0.35)'
                }}
              >
                <ShieldCheck size={12} /> Government KVK Linkage
              </span>
            </div>
            <h2 className="fw-extrabold mb-1 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              Agronomic Support & Help Center
            </h2>
            <p className="mb-0 text-white-50 small" style={{ maxWidth: 540, fontSize: '0.85rem' }}>
              Direct access to agricultural scientists, kisan toll-free hotlines, interactive troubleshooting guides, and AI chat assistance.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/chat"
              className="btn btn-sm btn-light border px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm rounded-pill"
              style={{ fontSize: '0.84rem', color: '#0369A1' }}
            >
              <Bot size={16} /> Open AI Agronomist Chat
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Quick Contact Channels Bento Grid */}
      <div className="row g-3 mb-4">
        {/* Channel 1: Kisan Call Center */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3.5 rounded-3 h-100 border shadow-xs d-flex flex-column justify-content-between"
            style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderColor: '#A7F3D0' }}
          >
            <div>
              <div
                className="d-flex align-items-center justify-content-center mb-2.5 rounded-3"
                style={{ width: 40, height: 40, background: '#FFFFFF', color: '#059669', boxShadow: '0 2px 6px rgba(5,150,105,0.15)' }}
              >
                <PhoneCall size={20} />
              </div>
              <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.92rem' }}>Kisan Call Center</div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.74rem' }}>
                Toll-free 24/7 government agriculture helpline in 22 regional languages.
              </p>
            </div>
            <a href="tel:18001801551" className="btn btn-sm btn-success fw-bold w-100 text-decoration-none py-1.5" style={{ fontSize: '0.8rem' }}>
              📞 1800-180-1551
            </a>
          </div>
        </div>

        {/* Channel 2: AI Agronomist Chat */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3.5 rounded-3 h-100 border shadow-xs d-flex flex-column justify-content-between"
            style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', borderColor: '#DDD6FE' }}
          >
            <div>
              <div
                className="d-flex align-items-center justify-content-center mb-2.5 rounded-3"
                style={{ width: 40, height: 40, background: '#FFFFFF', color: '#7C3AED', boxShadow: '0 2px 6px rgba(124,58,237,0.15)' }}
              >
                <Bot size={20} />
              </div>
              <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.92rem' }}>AI Agronomist Chat</div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.74rem' }}>
                Instant replies for fertilizer split dosages, weed control, and irrigation advice.
              </p>
            </div>
            <Link to="/chat" className="btn btn-sm btn-agro fw-bold w-100 text-decoration-none py-1.5" style={{ fontSize: '0.8rem', background: '#7C3AED', borderColor: '#7C3AED' }}>
              💬 Chat With AI
            </Link>
          </div>
        </div>

        {/* Channel 3: Specialist Email Desk */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3.5 rounded-3 h-100 border shadow-xs d-flex flex-column justify-content-between"
            style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderColor: '#BAE6FD' }}
          >
            <div>
              <div
                className="d-flex align-items-center justify-content-center mb-2.5 rounded-3"
                style={{ width: 40, height: 40, background: '#FFFFFF', color: '#0284C7', boxShadow: '0 2px 6px rgba(2,132,199,0.15)' }}
              >
                <Mail size={20} />
              </div>
              <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.92rem' }}>Email Helpdesk</div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.74rem' }}>
                Technical inquiries, sensor issues, and bug reports answered within 4 hours.
              </p>
            </div>
            <a href="mailto:support@agroai.local" className="btn btn-sm btn-primary fw-bold w-100 text-decoration-none py-1.5" style={{ fontSize: '0.8rem' }}>
              ✉️ Email Support
            </a>
          </div>
        </div>

        {/* Channel 4: Local KVK Locator */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3.5 rounded-3 h-100 border shadow-xs d-flex flex-column justify-content-between"
            style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderColor: '#FDE68A' }}
          >
            <div>
              <div
                className="d-flex align-items-center justify-content-center mb-2.5 rounded-3"
                style={{ width: 40, height: 40, background: '#FFFFFF', color: '#D97706', boxShadow: '0 2px 6px rgba(217,119,6,0.15)' }}
              >
                <MapPin size={20} />
              </div>
              <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.92rem' }}>District KVK Centers</div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.74rem' }}>
                Locate your nearest ICAR research station for certified seeds and physical soil lab tests.
              </p>
            </div>
            <a
              href="https://kvk.icar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-warning text-dark fw-bold w-100 text-decoration-none py-1.5"
              style={{ fontSize: '0.8rem' }}
            >
              📍 KVK Directory <ExternalLink size={12} className="ms-0.5 inline-block" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket Submission Form & FAQs */}
      <div className="row g-4 mb-4">
        {/* Left Column: Interactive Support Ticket Form */}
        <div className="col-12 col-lg-6">
          <div
            className="card-agro p-4 h-100 shadow-sm"
            style={{ borderRadius: 20, border: '1.5px solid #E2E8F0', background: '#FFFFFF' }}
          >
            <div className="mb-3">
              <span className="badge bg-light text-muted border px-2.5 py-1 small fw-semibold mb-1">
                Direct Agronomist Inquiry
              </span>
              <h5 className="fw-bold mb-0.5 text-dark" style={{ fontSize: '1.15rem' }}>
                Submit a Support Ticket
              </h5>
              <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
                Need help with a sensor reading or crop disease? Our field scientists will respond promptly.
              </p>
            </div>

            {ticketSubmitted ? (
              <motion.div
                className="p-4 rounded-3 text-center my-auto"
                style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 56, height: 56, background: '#DCFCE7', color: '#16A34A' }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h5 className="fw-bold text-success mb-1">Ticket Submitted Successfully!</h5>
                <div className="badge bg-white text-dark border px-3 py-1.5 my-2 fw-bold" style={{ fontSize: '0.88rem' }}>
                  Reference ID: {ticketId}
                </div>
                <p className="text-muted small mb-3" style={{ fontSize: '0.82rem' }}>
                  An agricultural specialist has been assigned to your query. You will receive an update at <strong>{farmer?.email || 'your email'}</strong>.
                </p>
                <button type="button" className="btn btn-outline-success btn-sm px-3.5 py-1.5 fw-bold" onClick={handleReset}>
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleTicketSubmit}>
                <div className="row g-2.5">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold">Inquiry Category</label>
                    <select
                      className="form-select form-control-sm"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    >
                      <option value="Soil Testing & Sensors">Soil Testing & Sensors</option>
                      <option value="Crop Recommendation Advisory">Crop Recommendation Advisory</option>
                      <option value="Disease Detection & Fungicides">Disease Detection & Fungicides</option>
                      <option value="Mandi Prices & APMC Rates">Mandi Prices & APMC Rates</option>
                      <option value="Account & Profile Settings">Account & Profile Settings</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold">Priority</label>
                    <select
                      className="form-select form-control-sm"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    >
                      <option value="Normal">Normal (Within 24h)</option>
                      <option value="Urgent">Urgent Field Issue (Within 4h)</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Subject Summary</label>
                    <input
                      required
                      placeholder="e.g. Discrepancy in Soil Nitrogen reading on USB sensor"
                      className="form-control form-control-sm"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Detailed Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please explain the issue or provide leaf symptoms, soil values, and plot details..."
                      className="form-control form-control-sm"
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-agro w-100 py-2.5 mt-3 fw-bold d-flex align-items-center justify-content-center gap-1.5 shadow"
                  style={{ borderRadius: 12, background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: 'none' }}
                >
                  <Send size={15} /> Submit Support Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Frequently Asked Questions Accordion */}
        <div className="col-12 col-lg-6">
          <div
            className="card-agro p-4 h-100 shadow-sm"
            style={{ borderRadius: 20, border: '1.5px solid #E2E8F0', background: '#FFFFFF' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <span className="badge bg-light text-muted border px-2.5 py-1 small fw-semibold mb-1">
                  Knowledge Base
                </span>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.15rem' }}>
                  Frequently Asked Questions
                </h5>
              </div>
              <HelpCircle size={20} className="text-muted" />
            </div>

            <div className="d-flex flex-column gap-2">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className="border rounded-3 overflow-hidden transition-all"
                    style={{ borderColor: isOpen ? '#A7F3D0' : '#E2E8F0', background: isOpen ? '#F0FDF4' : '#FFFFFF' }}
                  >
                    <button
                      type="button"
                      className="btn w-100 text-start p-3 d-flex align-items-center justify-content-between border-0 shadow-none"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      style={{ fontSize: '0.86rem', fontWeight: 700, color: isOpen ? '#065F46' : '#1E293B' }}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-success flex-shrink-0 ms-2" />
                      ) : (
                        <ChevronDown size={16} className="text-muted flex-shrink-0 ms-2" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-3 pb-3 text-muted small border-top pt-2" style={{ fontSize: '0.8rem', lineHeight: 1.55 }}>
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
