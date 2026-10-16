import React from 'react';

/**
 * Footer component
 * Simple footer displaying project context and backend connection status info.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} <strong>HomeCare Booking</strong> — Spring Boot + React Full-Stack Application.
        </p>
        <p className="footer-subtext">
          Connected to Spring Boot API via Vite Proxy (<code>/api</code> &rarr; <code>http://localhost:8080</code>).
        </p>
      </div>
    </footer>
  );
}
