import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createBooking } from '../api/bookingsApi';
import { getServices } from '../api/servicesApi';
import { getTodayDateStr } from '../utils/formatters';

/**
 * BookingForm component
 * Handles appointment creation, field-level 400 validation mappings,
 * 404 service-not-found feedback, and success confirmation cards.
 */
export function BookingForm({ initialServiceId }) {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Form input state
  const [formData, setFormData] = useState({
    serviceId: initialServiceId || '',
    name: '',
    phone: '',
    address: '',
    date: getTodayDateStr(),
    timeSlot: '10:00:00',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [topError, setTopError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Fetch all available services to populate the service dropdown
  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((data) => {
        if (isMounted) {
          setServices(data || []);
          setServicesLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setServicesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update serviceId if initialServiceId changes
  useEffect(() => {
    if (initialServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error as user edits
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setTopError(null);

    // Normalize time slot to HH:mm:ss if browser gives HH:mm
    let timeSlotFormatted = formData.timeSlot ? formData.timeSlot.trim() : '';
    if (timeSlotFormatted && timeSlotFormatted.length === 5) {
      timeSlotFormatted = `${timeSlotFormatted}:00`;
    }

    const payload = {
      serviceId: formData.serviceId ? Number(formData.serviceId) : null,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      date: formData.date || null,
      timeSlot: timeSlotFormatted || null,
    };

    try {
      // POST /api/bookings
      const result = await createBooking(payload);
      setCreatedBooking(result);
    } catch (err) {
      if (err.status === 400 && err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
        setTopError('Validation failed. Please review the highlighted fields below.');
      } else if (err.status === 404) {
        setTopError(err.message || 'Service not found. Please select a valid service.');
        setFieldErrors({ serviceId: err.message });
      } else {
        setTopError(err.message || 'Failed to submit booking. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (createdBooking) {
    return (
      <div className="card confirmation-card" role="region" aria-label="Booking Confirmation">
        <div className="confirmation-header">
          <span className="confirmation-check" aria-hidden="true">✓</span>
          <h3>Booking Successfully Confirmed!</h3>
          <p className="confirmation-sub">
            Your appointment has been registered with status <strong>{createdBooking.status}</strong>.
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-key">Booking ID</span>
            <span className="detail-val">#{createdBooking.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Service</span>
            <span className="detail-val">{createdBooking.serviceName || 'Service #' + createdBooking.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Customer Name</span>
            <span className="detail-val">{createdBooking.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Phone</span>
            <span className="detail-val">{createdBooking.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Address</span>
            <span className="detail-val">{createdBooking.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Scheduled Date</span>
            <span className="detail-val">{createdBooking.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Time Slot</span>
            <span className="detail-val">{createdBooking.timeSlot}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/bookings" className="btn btn-primary">
            View in My Bookings
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCreatedBooking(null);
              setFormData({
                serviceId: initialServiceId || '',
                name: '',
                phone: '',
                address: '',
                date: getTodayDateStr(),
                timeSlot: '10:00:00',
              });
            }}
          >
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      {topError && (
        <div className="error-banner" role="alert" aria-live="assertive">
          <span aria-hidden="true">⚠️</span>
          <span>{topError}</span>
        </div>
      )}

      {/* Service Selection */}
      <div className="form-group">
        <label htmlFor="serviceId" className="form-label">
          Service *
        </label>
        <select
          id="serviceId"
          name="serviceId"
          className={`form-input ${fieldErrors.serviceId ? 'input-invalid' : ''}`}
          value={formData.serviceId}
          onChange={handleChange}
          aria-describedby={fieldErrors.serviceId ? 'serviceId-error' : undefined}
        >
          <option value="">-- Choose a service --</option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>
              {svc.name} (Starts at ₹{svc.startingPrice})
            </option>
          ))}
          {/* Allow manual invalid ID for testing 404 */}
          {formData.serviceId && !services.some((s) => String(s.id) === String(formData.serviceId)) && (
            <option value={formData.serviceId}>Service #{formData.serviceId} (Custom ID)</option>
          )}
        </select>
        <div className="field-hint">Select the service to book (or enter ID).</div>
        {fieldErrors.serviceId && (
          <div id="serviceId-error" className="field-error-message" aria-live="polite">
            {fieldErrors.serviceId}
          </div>
        )}
      </div>

      {/* Customer Full Name */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${fieldErrors.name ? 'input-invalid' : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
        {fieldErrors.name && (
          <div id="name-error" className="field-error-message" aria-live="polite">
            {fieldErrors.name}
          </div>
        )}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`form-input ${fieldErrors.phone ? 'input-invalid' : ''}`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number (e.g. 9876543210)"
          maxLength={15}
          aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
        />
        <div className="field-hint">Backend requires exactly 10 digits (0-9).</div>
        {fieldErrors.phone && (
          <div id="phone-error" className="field-error-message" aria-live="polite">
            {fieldErrors.phone}
          </div>
        )}
      </div>

      {/* Address */}
      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Service Address *
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className={`form-input form-textarea ${fieldErrors.address ? 'input-invalid' : ''}`}
          value={formData.address}
          onChange={handleChange}
          placeholder="Flat/House number, Street name, Locality, City"
          maxLength={500}
          aria-describedby={fieldErrors.address ? 'address-error' : undefined}
        />
        {fieldErrors.address && (
          <div id="address-error" className="field-error-message" aria-live="polite">
            {fieldErrors.address}
          </div>
        )}
      </div>

      {/* Date & Time Slot Grid */}
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            min={getTodayDateStr()}
            className={`form-input ${fieldErrors.date ? 'input-invalid' : ''}`}
            value={formData.date}
            onChange={handleChange}
            aria-describedby={fieldErrors.date ? 'date-error' : undefined}
          />
          <div className="field-hint">Must be today or in the future.</div>
          {fieldErrors.date && (
            <div id="date-error" className="field-error-message" aria-live="polite">
              {fieldErrors.date}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="timeSlot" className="form-label">
            Time Slot *
          </label>
          <input
            type="time"
            id="timeSlot"
            name="timeSlot"
            step={1}
            className={`form-input ${fieldErrors.timeSlot ? 'input-invalid' : ''}`}
            value={formData.timeSlot}
            onChange={handleChange}
            aria-describedby={fieldErrors.timeSlot ? 'timeSlot-error' : undefined}
          />
          <div className="field-hint">Format: HH:mm:ss</div>
          {fieldErrors.timeSlot && (
            <div id="timeSlot-error" className="field-error-message" aria-live="polite">
              {fieldErrors.timeSlot}
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Confirming Appointment...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
}
