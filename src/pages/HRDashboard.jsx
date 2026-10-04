import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  Heart,
  FileText,
  User,
  Briefcase,
  Users,
  CalendarDays,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  MapPin,
  Clock,
  Wallet,
  BadgeCheck,
  ArrowRight,
  Pencil,
  Plus,
  Funnel,
  Target,
  Sparkles,
} from "lucide-react";

import bannerIllustration from "../assets/hr-banner-illustration.png";
import promoIllustration from "../assets/hr-promo-illustration.jpeg";
import "./HRDashboard.css";

/* ------------------------------------------------------------------ */
/*  Static demo data  (replace with API data later)                    */
/* ------------------------------------------------------------------ */

const user = { name: " XYZ", role: "HR Manager" };

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, filledWhenActive: true },
  { label: "Browse Jobs", icon: FilePlus },
  { label: "Saved Jobs", icon: Heart },
  { label: "Applied Jobs", icon: FileText },
  { label: "Profile", icon: User },
];

const roles = [
  "Backend + Django",
  "React",
  "DevOps",
  "Python",
  "Data Science",
  "UI/UX",
];

const candidates = [
  {
    id: 1,
    name: "Aarav Mehta",
    title: "Backend Engineer (Django)",
    location: "Bengaluru, KA",
    type: "Full-time",
    years: 3,
    salary: "₹10L – ₹14L / yr",
    skills: ["Django", "Python", "PostgreSQL", "REST APIs"],
    summary:
      "Backend developer with 3 years of experience building scalable Django applications and REST APIs.",
    status: "Shortlisted",
    match: 94,
    roles: ["Backend + Django", "Python"],
  },
  {
    id: 2,
    name: "Riya Sharma",
    title: "Python Backend Developer",
    location: "Hyderabad, TG",
    type: "Full-time",
    years: 2,
    salary: "₹6L – ₹10L / yr",
    skills: ["Python", "Django", "FastAPI", "Docker"],
    summary:
      "Builds high-performance APIs and has worked on next-gen web applications using Django and FastAPI.",
    status: "New",
    match: 89,
    roles: ["Backend + Django", "Python"],
  },
  {
    id: 3,
    name: "Kabir Singh",
    title: "Software Engineer (Backend)",
    location: "Noida, UP",
    type: "Full-time",
    years: 4,
    salary: "₹12L – ₹18L / yr",
    skills: ["Django", "Python", "AWS", "Linux"],
    summary:
      "Designs and delivers scalable services on cloud technologies with a strong Linux and AWS background.",
    status: "New",
    match: 86,
    roles: ["Backend + Django", "Python", "DevOps"],
  },
  {
    id: 4,
    name: "Ananya Rao",
    title: "Frontend Developer (React)",
    location: "Pune, MH",
    type: "Full-time",
    years: 2,
    salary: "₹7L – ₹11L / yr",
    skills: ["React", "JavaScript", "Redux", "CSS"],
    summary:
      "Frontend developer focused on clean, responsive interfaces and reusable React component libraries.",
    status: "Interview",
    match: 91,
    roles: ["React"],
  },
  {
    id: 5,
    name: "Rohan Verma",
    title: "DevOps Engineer",
    location: "Remote",
    type: "Full-time",
    years: 5,
    salary: "₹15L – ₹22L / yr",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    summary:
      "Automates build and deployment pipelines and manages production infrastructure for growing teams.",
    status: "New",
    match: 88,
    roles: ["DevOps"],
  },
  {
    id: 6,
    name: "Sneha Iyer",
    title: "Data Scientist",
    location: "Chennai, TN",
    type: "Full-time",
    years: 3,
    salary: "₹12L – ₹16L / yr",
    skills: ["Python", "Pandas", "ML", "SQL"],
    summary:
      "Turns raw data into insights and has shipped machine learning models into production.",
    status: "Shortlisted",
    match: 92,
    roles: ["Data Science", "Python"],
  },
  {
    id: 7,
    name: "Vikram Joshi",
    title: "UI/UX Designer",
    location: "Mumbai, MH",
    type: "Full-time",
    years: 4,
    salary: "₹9L – ₹14L / yr",
    skills: ["Figma", "Prototyping", "Research"],
    summary:
      "Product designer who blends user research with polished visual design for web and mobile apps.",
    status: "New",
    match: 85,
    roles: ["UI/UX"],
  },
];

const stats = [
  { icon: Briefcase, value: "8", label: "Open Jobs" },
  { icon: Users, value: "156", label: "Applicants" },
  { icon: CalendarDays, value: "12", label: "Interviews" },
  { icon: Target, value: "68%", label: "Offer Rate" },
];

const activeJobs = [
  { letter: "B", title: "Backend Engineer", meta: "Engineering", place: "Bengaluru", applicants: 42 },
  { letter: "F", title: "Full Stack Developer", meta: "Engineering", place: "Remote", applicants: 28 },
  { letter: "P", title: "Python Developer", meta: "Engineering", place: "Noida", applicants: 35 },
];

const recentApplicants = [
  { letter: "A", name: "Aarav Mehta", role: "Backend Engineer", time: "2 days ago", status: "Under Review" },
  { letter: "R", name: "Riya Sharma", role: "Python Developer", time: "4 days ago", status: "Interview" },
  { letter: "K", name: "Kabir Singh", role: "Full Stack Developer", time: "6 days ago", status: "Shortlisted" },
];

const locations = ["All", "Remote", "Bengaluru", "Hyderabad", "Noida", "Pune", "Mumbai", "Chennai"];
const statuses = ["All", "New", "Shortlisted", "Interview"];
const experiences = [
  { value: "All", label: "Experience" },
  { value: "0-2", label: "0 – 2 yrs" },
  { value: "3-4", label: "3 – 4 yrs" },
  { value: "5+", label: "5+ yrs" },
];

const defaultFilters = { search: "", location: "All", status: "All", experience: "All" };

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
};

const matchesExperience = (years, range) => {
  if (range === "All") return true;
  if (range === "0-2") return years <= 2;
  if (range === "3-4") return years >= 3 && years <= 4;
  return years >= 5;
};

const statusClass = (status) => status.toLowerCase().replace(/\s+/g, "-");

const LogoMark = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
    <defs>
      <linearGradient id="hr-logo-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6f6bff" />
        <stop offset="1" stopColor="#5a2fd0" />
      </linearGradient>
    </defs>
    <circle cx="17" cy="7.5" r="6" fill="url(#hr-logo-grad)" />
    <path
      d="M3 21.5C3 16.8 6.6 14 11 14h10c4.4 0 8 2.8 8 7.5 0 4-3 6.5-7 6.5H10c-4 0-7-2.5-7-6.5Z"
      fill="url(#hr-logo-grad)"
    />
    <path d="M12 20.5l4 3 6-5" stroke="#fff" strokeOpacity=".0" fill="none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function HRDashboard() {
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeRole, setActiveRole] = useState(roles[0]);
  const [draft, setDraft] = useState(defaultFilters);
  const [applied, setApplied] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("match");
  const [saved, setSaved] = useState([]);

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setApplied(draft);
  };

  const toggleSaved = (id) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const query = applied.search.trim().toLowerCase();

  const visibleCandidates = candidates
    .filter((c) => c.roles.includes(activeRole))
    .filter(
      (c) =>
        !query ||
        `${c.name} ${c.title} ${c.skills.join(" ")}`.toLowerCase().includes(query)
    )
    .filter(
      (c) =>
        applied.location === "All" ||
        c.location.toLowerCase().includes(applied.location.toLowerCase())
    )
    .filter((c) => applied.status === "All" || c.status === applied.status)
    .filter((c) => matchesExperience(c.years, applied.experience))
    .sort((a, b) => (sortBy === "experience" ? b.years - a.years : b.match - a.match));

  return (
    <div className="hr-dashboard">
      <div className="hr-shell">
        {/* ---------- top bar ---------- */}
        <header className="hr-topbar">
          <a href="/hr" className="hr-logo">
            <LogoMark />
            <span>TREVA</span>
          </a>

          <label className="hr-global-search">
            <Search size={16} />
            <input type="text" placeholder="Search candidates, jobs, or skills..." />
          </label>

          <div className="hr-topbar-right">
            <button className="hr-bell" aria-label="Notifications">
              <Bell size={18} />
              <span className="hr-bell-dot" />
            </button>

            <div className="hr-user">
              <span className="hr-user-avatar">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div className="hr-user-text">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="hr-body">
          {/* ---------- sidebar ---------- */}
          <aside className="hr-sidebar">
            <nav className="hr-nav" aria-label="Dashboard">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`hr-nav-item ${activeNav === item.label ? "active" : ""}`}
                    onClick={() => setActiveNav(item.label)}
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.6}
                      fill={
                        activeNav === item.label && item.filledWhenActive
                          ? "currentColor"
                          : "none"
                      }
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="hr-sidebar-bottom">
              <div className="hr-promo">
                <h4>
                  Build your future
                  <br />
                  with TREVA
                </h4>
                <p>
                  Better hiring. Better teams.
                  <br />A brighter future.
                </p>
                <img
                  className="hr-promo-art"
                  src={promoIllustration}
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <button className="hr-logout" onClick={() => navigate("/login")}>
                <LogOut size={18} strokeWidth={1.8} />
                Logout
              </button>
            </div>
          </aside>

          {/* ---------- main column ---------- */}
          <main className="hr-main">
            <section className="hr-card hr-banner">
              <div>
                <p>{getGreeting()}</p>
                <h1>{user.name}!</h1>
                <span>
                  Explore jobs, build your skill and take the next step in your career.
                </span>
              </div>
              <img
                className="hr-banner-art"
                src={bannerIllustration}
                alt=""
                aria-hidden="true"/>
            </section>

            <section className="hr-card hr-roles">
              <div className="hr-roles-head">
                <div>
                  <h2>Target Skills</h2>
                  <p>Select a role to see the best matching candidates.</p>
                </div>
                <button className="hr-link-btn">
                  <Pencil size={14} />
                  Edit Skills
                </button>
              </div>

              <div className="hr-chip-row">
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`hr-chip ${activeRole === role ? "active" : ""}`}
                    onClick={() => setActiveRole(role)}
                  >
                    {activeRole === role && <Briefcase size={13} />}
                    {role}
                  </button>
                ))}
                <button className="hr-chip hr-chip-add">
                  <Plus size={14} />
                  Add more
                </button>
              </div>
            </section>

            <form className="hr-card hr-filters" onSubmit={applyFilters}>
              <label className="hr-filter-search">
                <Search size={16} />
                <input
                  type="text"
                  name="search"
                  placeholder="Search..."
                  value={draft.search}
                  onChange={updateDraft}
                />
              </label>

              <label className="hr-select">
                <MapPin size={15} />
                <select name="location" value={draft.location} onChange={updateDraft}>
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l === "All" ? "Location" : l}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>

              <label className="hr-select">
                <Briefcase size={15} />
                <select name="status" value={draft.status} onChange={updateDraft}>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s === "All" ? "Status" : s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>

              <label className="hr-select">
                <CalendarDays size={15} />
                <select name="experience" value={draft.experience} onChange={updateDraft}>
                  {experiences.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>

              <button type="submit" className="hr-primary-btn">
                <Funnel size={15} />
                Apply Filters
              </button>
            </form>

            <section className="hr-list-head">
              <div>
                <h2>Top Candidates</h2>
                <span>
                  {visibleCandidates.length} candidate
                  {visibleCandidates.length === 1 ? "" : "s"} found for your selected skills
                </span>
              </div>

              <label className="hr-sort">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="match">Most Relevent</option>
                  <option value="experience">Most Experienced</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </section>

            <div className="hr-candidates">
              {visibleCandidates.length === 0 && (
                <div className="hr-card hr-empty">
                  No candidates match these filters. Try changing the role or clearing a filter.
                </div>
              )}

              {visibleCandidates.map((c) => (
                <article className="hr-card hr-candidate" key={c.id}>
                  <span className="hr-avatar">{c.name.charAt(0)}</span>

                  <div className="hr-candidate-body">
                    <p className="hr-candidate-name">
                      {c.name}
                      <BadgeCheck size={14} />
                      <em>{c.match}% match</em>
                    </p>
                    <h3>{c.title}</h3>

                    <ul className="hr-meta">
                      <li><MapPin size={13} /> {c.location}</li>
                      <li><Briefcase size={13} /> {c.type}</li>
                      <li><Clock size={13} /> {c.years} yrs</li>
                      <li><Wallet size={13} /> {c.salary}</li>
                    </ul>

                    <div className="hr-skill-row">
                      {c.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <p className="hr-summary">{c.summary}</p>
                  </div>

                  <div className="hr-candidate-side">
                    <div className="hr-candidate-top">
                      <span className={`hr-status ${statusClass(c.status)}`}>{c.status}</span>
                      <button
                        className={`hr-heart ${saved.includes(c.id) ? "on" : ""}`}
                        onClick={() => toggleSaved(c.id)}
                        aria-label="Save candidate"
                        aria-pressed={saved.includes(c.id)}
                      >
                        <Heart size={16} />
                      </button>
                    </div>

                    <button className="hr-outline-btn">
                      View Profile
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </main>

          {/* ---------- right column ---------- */}
          <aside className="hr-right">
            <section className="hr-card hr-panel">
              <div className="hr-panel-head">
                <h2>Your Progress</h2>
                <a href="#overview">
                  View All <ArrowRight size={12} />
                </a>
              </div>

              <div className="hr-stat-grid">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div className="hr-stat" key={stat.label}>
                      <span className="hr-stat-icon">
                        <Icon size={17} strokeWidth={1.8} />
                      </span>
                      <strong>{stat.value}</strong>
                      <small>{stat.label}</small>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="hr-card hr-panel">
              <div className="hr-panel-head">
                <h2>Saved Jobs</h2>
                <a href="#jobs">
                  View All <ArrowRight size={12} />
                </a>
              </div>

              <ul className="hr-rows">
                {activeJobs.map((job) => (
                  <li key={job.title}>
                    <span className="hr-letter">{job.letter}</span>
                    <div>
                      <strong>{job.title}</strong>
                      <small>
                        {job.meta} • {job.place}
                      </small>
                    </div>
                    <span className="hr-count">
                      <Users size={13} />
                      {job.applicants}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="hr-card hr-panel">
              <div className="hr-panel-head">
                <h2>Recent Applicants</h2>
                <a href="#applicants">
                  View All <ArrowRight size={12} />
                </a>
              </div>

              <ul className="hr-rows">
                {recentApplicants.map((person) => (
                  <li key={person.name}>
                    <span className="hr-letter">{person.letter}</span>
                    <div>
                      <strong>{person.name}</strong>
                      <small>
                        {person.role} • {person.time}
                      </small>
                    </div>
                    <span className={`hr-status small ${statusClass(person.status)}`}>
                      {person.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="hr-cta">
              <Sparkles size={26} className="hr-cta-icon" />
              <div>
                <h3>Keep hiring, great talent awaits!</h3>
                <p>Your next great hire is just a click away.</p>
                <button className="hr-cta-btn">
                  Post a New Job
                  <ArrowRight size={14} />
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;