import React from 'react';
import { ServiceCard } from './ServiceCard';

/**
 * ServiceGrid component
 * Responsive container for the catalog of ServiceCards.
 */
export function ServiceGrid({ services = [] }) {
  return (
    <div className="services-grid" role="list">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
