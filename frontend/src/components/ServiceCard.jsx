import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatRating } from '../utils/formatters';

/**
 * ServiceCard component
 * Displays a single home service item with pricing, ratings, and navigation links.
 */
export function ServiceCard({ service }) {
  if (!service) return null;

  return (
    <article className="service-card">
      <div className="service-card-body">
        <div className="service-card-header">
          <h3 className="service-title">{service.name}</h3>
          <span className="service-rating">{formatRating(service.rating)}</span>
        </div>
        <p className="service-description">{service.description || 'No description provided.'}</p>
        <div className="service-price-row">
          <span className="price-label">Starts at</span>
          <span className="price-value">{formatPrice(service.startingPrice)}</span>
        </div>
      </div>
      <div className="service-card-footer">
        <Link to={`/services/${service.id}`} className="btn btn-secondary btn-sm">
          Details
        </Link>
        <Link to={`/book/${service.id}`} className="btn btn-primary btn-sm">
          Book Now
        </Link>
      </div>
    </article>
  );
}
