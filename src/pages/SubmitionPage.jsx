import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  User,
  Power,
  Clock,
  Sparkles,
  Target,
  MessageCircle,
  Mic,
  Square,
  ShieldCheck,
  ChevronLeft,
  Save,
  ArrowRight,
  Code2,
} from "lucide-react";
import SubmitionSent from "./SubmitionSent";
import "./SubmitionPage.css";

const MAX_CHARS = 2000;
const DENSITY_SEGMENTS = 7;
const TOTAL_QUESTIONS = 8;
const INTERVIEW_SECONDS = 18 * 60 + 42;

// TODO: replace with data from your API / router state
const CURRENT_QUESTION = {
  number: 3,
  phase: 3,
  phaseLabel: "Technical Proficiency",
  before: "Describe a scenario where you utilized",
  highlight: "Django Signal Handlers",
  after: "to decouple cross-domain business logic.",
  followUp: "What were the technical trade-offs?",
  timeBudgetMin: 8,
};

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function SubmitionPage() {
  const navigate = useNavigate();
  const q = CURRENT_QUESTION;

  const [answer, setAnswer] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(INTERVIEW_SECONDS);
  const [listening, setListening] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const recognitionRef = useRef(null);

  // Interview countdown
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // Stop mic on unmount
  useEffect(() => () => recognitionRef.current?.stop(), []);

  const tokens = useMemo(() => Math.ceil(answer.trim().length / 4), [answer]);
  const words = useMemo(() => (answer.trim() ? answer.trim().split(/\s+/).length : 0), [answer]);
  const filledSegments = Math.min(DENSITY_SEGMENTS, Math.floor(words / 15));

  const handleChange = (e) => setAnswer(e.target.value.slice(0, MAX_CHARS));

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) text += event.results[i][0].transcript + " ";
      }
      if (text) setAnswer((prev) => (prev + (prev ? " " : "") + text.trim()).slice(0, MAX_CHARS));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const handleSave = () => {
    // TODO: POST draft to backend
    localStorage.setItem(`answer_q${q.number}`, answer);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleComplete = () => {
    // TODO: submit answer to backend, then show the confirmation popup
    localStorage.setItem(`answer_q${q.number}`, answer);
    recognitionRef.current?.stop();
    setShowSent(true);
  };

  return (
    <div className="sp-page">
      {/* ---------- Top bar ---------- */}
      <header className="sp-topbar">
        <div className="sp-brand">
          <div className="sp-logo"><Cpu size={26} strokeWidth={1.8} /></div>
          <div>
            <div className="sp-brand-name">treva.ai</div>
            <div className="sp-brand-sub">Assessment Engine</div>
          </div>
        </div>

        <div className="sp-topbar-right">
          <div className="sp-signal">
            <span className="sp-dot" />
            <div>
              <div className="sp-micro">Signal Status</div>
              <div className="sp-signal-value">Optimized</div>
            </div>
          </div>
          <button className="sp-round sp-round--filled" aria-label="Profile">
            <User size={20} />
          </button>
          <button className="sp-round" aria-label="Exit assessment" onClick={() => navigate("/")}>
            <Power size={18} />
          </button>
        </div>
      </header>

      {/* ---------- Main card ---------- */}
      <main className="sp-card">
        <div className="sp-meta-row">
          <div className="sp-phase-group">
            <span className="sp-phase-pill">
              <Target size={16} /> Phase {String(q.phase).padStart(2, "0")}
            </span>
            <div className="sp-steps" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`sp-step ${i < q.phase - 1 ? "is-done" : i === q.phase - 1 ? "is-active" : ""}`}
                />
              ))}
            </div>
            <span className="sp-phase-label">{q.phaseLabel}</span>
          </div>

          <div className="sp-stats">
            <div className="sp-stat">
              <Clock size={20} className="sp-stat-icon" />
              <div>
                <div className="sp-micro">Time Budget</div>
                <div className="sp-stat-value">{String(q.timeBudgetMin).padStart(2, "0")}:00 MIN</div>
              </div>
            </div>
            <div className="sp-stat">
              <div>
                <div className="sp-micro">Interview Timer</div>
                <div className="sp-stat-value">
                  {formatTime(secondsLeft)} <small>LEFT</small>
                </div>
              </div>
            </div>
            <div className="sp-stat sp-stat--bar">
              <span className="sp-stat-bar" />
              <div>
                <div className="sp-micro">Current Question</div>
                <div className="sp-stat-value">
                  Question {String(q.number).padStart(2, "0")} of {String(TOTAL_QUESTIONS).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="sp-question">
          <div className="sp-question-text">
            <div className="sp-eyebrow"><Sparkles size={14} /> AI Interview</div>
            <h1 className="sp-title">
              {q.before} <span className="sp-grad">{q.highlight}</span> {q.after}
            </h1>
            <p className="sp-followup">{q.followUp}</p>
          </div>

          <div className="sp-art" aria-hidden="true">
            <div className="sp-art-ring" />
            <span className="sp-orb sp-orb--blue-sq" />
            <span className="sp-orb sp-orb--purple-top" />
            <span className="sp-orb sp-orb--purple-left" />
            <span className="sp-orb sp-orb--blue-dot" />
            <div className="sp-art-tile"><Cpu size={64} strokeWidth={1.6} /></div>
            <div className="sp-art-code"><Code2 size={26} strokeWidth={2.2} /></div>
          </div>
        </section>

        {/* ---------- Response box ---------- */}
        <section className="sp-response">
          <div className="sp-response-head">
            <div className="sp-response-title">
              <span className="sp-chat-icon"><MessageCircle size={18} /></span>
              Your Response
            </div>
            <div className="sp-count">{answer.length} / {MAX_CHARS}</div>
          </div>

          <textarea
            className="sp-textarea"
            placeholder="Synthesize your technical logic here..."
            value={answer}
            onChange={handleChange}
            maxLength={MAX_CHARS}
          />

          <div className="sp-response-foot">
            <button
              className={`sp-voice ${listening ? "is-live" : ""}`}
              onClick={toggleVoice}
              type="button"
            >
              <span className="sp-voice-icon">
                {listening ? <Square size={14} fill="currentColor" /> : <Mic size={18} />}
              </span>
              {listening ? "Stop Voice Input" : "Start Voice Input"}
            </button>

            <div className="sp-density">
              <div className="sp-micro">Logic Density</div>
              <div className="sp-density-bars">
                {Array.from({ length: DENSITY_SEGMENTS }).map((_, i) => (
                  <span key={i} className={i < filledSegments ? "is-on" : ""} />
                ))}
              </div>
            </div>

            <div className="sp-analytics">
              <div className="sp-micro">Session Analytics</div>
              <div className="sp-tokens">{tokens} TOKENS</div>
            </div>

            <div className="sp-shield" title="Responses are encrypted">
              <ShieldCheck size={20} />
            </div>
          </div>
        </section>

        {/* ---------- Actions ---------- */}
        <footer className="sp-actions">
          <button className="sp-back" onClick={() => navigate(-1)} type="button">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="sp-actions-right">
            <button className="sp-btn sp-btn--ghost" onClick={handleSave} type="button">
              <Save size={16} /> {saved ? "Saved" : "Save Progress"}
            </button>
            <button className="sp-btn sp-btn--primary" onClick={handleComplete} type="button">
              Complete Assessment <ArrowRight size={16} />
            </button>
          </div>
        </footer>
      </main>

      {showSent && <SubmitionSent candidateName="Marcus" company="Stripe" />}
    </div>
  );
}
