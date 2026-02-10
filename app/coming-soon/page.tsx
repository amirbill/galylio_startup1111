"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./coming-soon.css";

// ---- Launch date: March 15, 2026 ----
const LAUNCH_DATE = new Date("2026-03-15T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(LAUNCH_DATE - now, 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ---------- Floating particle ---------- */
function Particle({ index }: { index: number }) {
  const size = 4 + (index % 5) * 2;
  const left = ((index * 17) % 100);
  const delay = (index * 0.7) % 8;
  const duration = 12 + (index % 8) * 2;

  return (
    <div
      className="particle"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
}

/* ---------- Countdown digit card ---------- */
function CountdownCard({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="countdown-card group">
      <div className="countdown-card-inner">
        <span className="countdown-value">{display}</span>
      </div>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

/* ---------- Feature pill ---------- */
function FeaturePill({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="feature-pill">
      <span className="feature-icon">{icon}</span>
      <span className="feature-text">{text}</span>
    </div>
  );
}

/* ========== MAIN PAGE ========== */
export default function ComingSoonPage() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null; // avoid hydration mismatch

  return (
    <div className="cs-root">
      {/* Particles */}
      <div className="particles-container" aria-hidden>
        {Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="orb orb-1" aria-hidden />
      <div className="orb orb-2" aria-hidden />
      <div className="orb orb-3" aria-hidden />

      {/* Content */}
      <main className="cs-content">
        {/* Logo */}
        <div className="cs-logo-wrap fadeIn-up" style={{ animationDelay: "0.1s" }}>
          <Image
            src="/images/Logo 1111.svg"
            alt="1111.tn"
            width={140}
            height={140}
            priority
            className="cs-logo"
          />
        </div>

        {/* Tagline */}
        <div className="fadeIn-up" style={{ animationDelay: "0.3s" }}>
          <h1 className="cs-title">
            <span className="cs-title-gradient">Bientôt Disponible</span>
          </h1>
          <p className="cs-subtitle">
            La première plateforme tunisienne de comparaison de prix intelligente.
            <br />
            Trouvez les meilleurs prix, traquez les fausses promotions, et économisez.
          </p>
        </div>

        {/* Countdown */}
        <div className="cs-countdown fadeIn-up" style={{ animationDelay: "0.5s" }}>
          <CountdownCard value={time.days} label="Jours" />
          <span className="countdown-sep">:</span>
          <CountdownCard value={time.hours} label="Heures" />
          <span className="countdown-sep">:</span>
          <CountdownCard value={time.minutes} label="Minutes" />
          <span className="countdown-sep">:</span>
          <CountdownCard value={time.seconds} label="Secondes" />
        </div>

        {/* Feature pills */}
        <div className="cs-features fadeIn-up" style={{ animationDelay: "0.7s" }}>
          <FeaturePill icon="🔍" text="Comparaison de prix" />
          <FeaturePill icon="🚨" text="Alerte fausses promos" />
          <FeaturePill icon="📊" text="Suivi des tendances" />
          <FeaturePill icon="🛒" text="Panier intelligent" />
        </div>

        {/* CTA */}
        <div className="cs-cta fadeIn-up" style={{ animationDelay: "0.9s" }}>
          <Link href="/signup" className="cs-btn-primary">
            Créer un compte
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <p className="cs-cta-hint">
            Inscrivez-vous maintenant pour être parmi les premiers à en profiter !
          </p>
        </div>

        {/* Social / footer */}
        <footer className="cs-footer fadeIn-up" style={{ animationDelay: "1.1s" }}>
          <p>© 2026 1111.tn — Tous droits réservés</p>
        </footer>
      </main>
    </div>
  );
}
