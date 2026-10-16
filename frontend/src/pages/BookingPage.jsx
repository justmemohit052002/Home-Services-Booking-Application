import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingForm } from '../components/BookingForm';

/**
 * BookingPage component
 * Renders the booking workflow for /book and /book/:serviceId.
 */
export function BookingPage() {
  const { serviceId } = useParams();

  return (
    <div className="container page-container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Book an Appointment</span>
      </nav>

      <div className="booking-page-header">
        <h1 className="page-heading">Schedule Your Service</h1>
        <p className="page-subheading">
          Fill in your contact and timing details to confirm an on-demand appointment.
        </p>
      </div>

      <div className="booking-form-wrapper card">
        <BookingForm initialServiceId={serviceId} />
      </div>
    </div>
  );
}
