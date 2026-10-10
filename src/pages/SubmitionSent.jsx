import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Cpu, Bell, Zap, FileText, ArrowRight } from "lucide-react";
import "./SubmitionSent.css";

/**
 * Popup shown above SubmitionPage after "Complete Assessment".
 * Usage: {showSent && <SubmitionSent candidateName="Marcus" company="Stripe" />}
 */
export default function SubmitionSent({
  candidateName = "Marcus",
  company = "Stripe",
  confidence = 92,
  dashboardPath = "/dashboard", // TODO: set to your dashboard route
}) {
  const navigate = useNavigate();

  // Lock background scroll while the popup is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="ss-overlay" role="dialog" aria-modal="true" aria-labelledby="ss-title">
      <div className="ss-card">
        <span className="ss-blob ss-blob--tr" aria-hidden="true" />
        <span className="ss-blob ss-blob--bl" aria-hidden="true" />

        <div className="ss-check"><Check size={40} strokeWidth={2.6} /></div>

        <h1 id="ss-title" className="ss-title">Interview Completed!</h1>
        <p className="ss-sub">
          Excellent work, {candidateName}. Your responses have been submitted and are now being
          evaluated by our AI engine.
        </p>

        <div className="ss-info">
          <div className="ss-info-card">
            <span className="ss-info-icon"><Cpu size={18} /></span>
            <h3>AI Evaluation</h3>
            <p>Our AI will analyze your technical depth, communication, and logical reasoning.</p>
          </div>
          <div className="ss-info-card">
            <span className="ss-info-icon"><Bell size={18} fill="currentColor" /></span>
            <h3>Results Soon</h3>
            <p>
              A detailed report will be shared with {company}. You'll be notified of the next steps.
            </p>
          </div>
        </div>

        <div className="ss-ai">
          <div className="ss-ai-head">
            <span className="ss-ai-logo"><Cpu size={26} strokeWidth={1.8} /></span>
            <div>
              <div className="ss-ai-name">TREVA Core AI</div>
              <div className="ss-ai-status">Analyzing response...</div>
            </div>
          </div>

          <div className="ss-tips">
            <div className="ss-tip">
              <span className="ss-tip-icon"><Zap size={18} /></span>
              <div>
                <div className="ss-tip-label">Tip 01</div>
                <p>AI is looking for <b>latency considerations</b> in signals.</p>
              </div>
            </div>
            <div className="ss-tip">
              <span className="ss-tip-icon"><FileText size={18} /></span>
              <div>
                <div className="ss-tip-label">Tip 02</div>
                <p>Mention <b>Atomic Transactions</b> for extra depth.</p>
              </div>
            </div>
          </div>

          <div className="ss-confidence">
            <div className="ss-conf-row">
              <span>Assessment Confidence</span>
              <strong>{confidence}%</strong>
            </div>
            <div className="ss-track">
              <span className="ss-fill" style={{ width: `${confidence}%` }} />
            </div>
          </div>
        </div>

        <button className="ss-cta" onClick={() => navigate(dashboardPath)} type="button">
          Go to Dashboard <ArrowRight size={18} />
        </button>
        <div className="ss-eta">Estimated result time: 24-48 hours</div>

        <div className="ss-help">
          <span>Need help?</span>
          <a href="mailto:support@treva.ai">Contact Candidate Support</a>
        </div>
      </div>
    </div>
  );
}