import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceById } from '../api/servicesApi';
import { formatPrice, formatRating } from '../utils/formatters';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';

/**
 * ServiceDetailPage component
 * Displays complete details for a single service entity (/services/:id).
 * Handles 404 Not Found cleanly with friendly back navigation.
 */
export function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    getServiceById(id, controller.signal)
      .then((data) => {
        setService(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    const cleanup = fetchDetail();
    return cleanup;
  }, [id]);

  if (loading) {
    return (
      <div className="container page-container">
        <Loader message={`Loading details for service #${id}...`} />
      </div>
    );
  }

  // 404 or other errors
  if (error) {
    const isNotFound = error.status === 404;
    return (
      <div className="container page-container">
        <div className="card not-found-card">
          <span className="not-found-icon" aria-hidden="true">🔍</span>
          <h2>{isNotFound ? 'Service Not Found' : 'Error Loading Service'}</h2>
          <p className="not-found-msg">
            {error.message || `No service exists with ID #${id}.`}
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              ← Return to Services Catalog
            </Link>
            {!isNotFound && (
              <button type="button" className="btn btn-secondary" onClick={fetchDetail}>
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="container page-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/">Services</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{service.name}</span>
      </nav>

      <div className="detail-layout">
        <div className="card detail-card">
          <div className="detail-header">
            <div>
              <span className="detail-tag">Service #{service.id}</span>
              <h1 className="detail-title">{service.name}</h1>
            </div>
            <div className="detail-rating-badge">{formatRating(service.rating)}</div>
          </div>

          <div className="detail-body">
            <h3 className="detail-subheading">About this Service</h3>
            <p className="detail-description">{service.description || 'No detailed description available.'}</p>

            <h3 className="detail-subheading">Service Highlights</h3>
            <ul className="detail-highlights">
              <li>✓ Verified background-checked professionals</li>
              <li>✓ Fixed upfront pricing with zero hidden costs</li>
              <li>✓ Rescheduling and cancellation flexibility</li>
              <li>✓ 30-day post-service satisfaction guarantee</li>
            </ul>
          </div>
        </div>

        {/* Booking Sidebar Summary */}
        <aside className="card detail-sidebar">
          <h3 className="sidebar-title">Pricing & Booking</h3>
          <div className="sidebar-price-row">
            <span className="sidebar-price-label">Starting Price</span>
            <span className="sidebar-price-value">{formatPrice(service.startingPrice)}</span>
          </div>
          <p className="sidebar-note">Standard pricing covers basic labor and standard diagnosis.</p>

          <div className="sidebar-actions">
            <Link to={`/book/${service.id}`} className="btn btn-primary btn-block">
              Book this Service
            </Link>
            <Link to="/" className="btn btn-secondary btn-block">
              Browse Other Services
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
