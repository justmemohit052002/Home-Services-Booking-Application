import React, { useState, useEffect, useCallback } from 'react';
import { getServices } from '../api/servicesApi';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { ServiceGrid } from '../components/ServiceGrid';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

/**
 * HomePage component
 * Hero banner, search bar with 400ms debounce, and dynamic service catalog.
 */
export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async (query, signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServices(query, signal);
      setServices(data || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search when debounced term changes
  useEffect(() => {
    const controller = new AbortController();
    fetchServices(debouncedSearch, controller.signal);

    return () => {
      controller.abort();
    };
  }, [debouncedSearch, fetchServices]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <span className="hero-badge">Verified Home Professionals</span>
          <h1 className="hero-title">Expert Home Services, On Demand</h1>
          <p className="hero-subtitle">
            Book trusted cleaners, plumbers, electricians, painters, and technicians at transparent fixed prices.
          </p>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleClear}
            placeholder="Search cleaning, AC, plumbing, electrical, carpentry..."
          />
        </div>
      </section>

      {/* Catalog Section */}
      <section className="catalog-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {debouncedSearch ? `Search Results for "${debouncedSearch}"` : 'All Services'}
            </h2>
            <p className="section-subtitle">
              {debouncedSearch
                ? `Showing matching services`
                : 'Browse our complete catalog of certified professional home services.'}
            </p>
          </div>
          {debouncedSearch && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClear}>
              View All Services
            </button>
          )}
        </div>

        {/* States: Loading, Error, Empty, Success */}
        {loading && <Loader message="Fetching available services from server..." />}

        {error && !loading && (
          <ErrorMessage
            error={error}
            onRetry={() => fetchServices(debouncedSearch)}
            title="Failed to Load Services"
          />
        )}

        {!loading && !error && services.length === 0 && (
          <EmptyState
            title="No services found"
            description={
              debouncedSearch
                ? `No service matches "${debouncedSearch}". Try a different keyword.`
                : 'The service catalog is currently empty.'
            }
            actionText={debouncedSearch ? 'Clear Search' : undefined}
            onAction={debouncedSearch ? handleClear : undefined}
          />
        )}

        {!loading && !error && services.length > 0 && <ServiceGrid services={services} />}
      </section>
    </div>
  );
}
