import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-lg">SkillTrack Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary">Log in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto text-center px-6 pt-16 pb-24">
        <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mb-4">
          Built for developers who ship
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4">
          Track your skills. <span className="text-brand-600">Showcase your growth.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-5 text-lg max-w-2xl mx-auto">
          SkillTrack Pro helps you log your skills, projects, certifications, and learning
          goals in one clean dashboard — so you always know exactly where you stand.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/register" className="btn-primary !px-6 !py-3">Create free account</Link>
          <Link to="/login" className="btn-secondary !px-6 !py-3">Log in</Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mt-20 text-left">
          {[
            { icon: '🧠', title: 'Skill Tracking', desc: 'Log skills with proficiency scores and watch your growth over time.' },
            { icon: '🚀', title: 'Project Portfolio', desc: 'Showcase what you have built and link it to the skills you used.' },
            { icon: '🎯', title: 'Learning Goals', desc: 'Set goals, track progress, and stay accountable to your roadmap.' },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
