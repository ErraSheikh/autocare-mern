import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const BookService = () => {
    const { serviceId } = useParams(); // Get service ID from URL
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        appointmentDate: '',
        make: '',
        model: '',
        year: ''
    });

    // Fetch service details when page loads
    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await API.get(`/services/${serviceId}`);
                setService(data.service);
            } catch (err) {
                setError('Service not found');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await API.post('/bookings', {
                serviceId,
                appointmentDate: formData.appointmentDate,
                vehicleDetails: {
                    make: formData.make,
                    model: formData.model,
                    year: parseInt(formData.year) // Convert to number
                }
            });

            setSuccess('Booking confirmed! Redirecting to your bookings...');

            // Redirect to my bookings after 2 seconds
            setTimeout(() => navigate('/my-bookings'), 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error && !service) return <div style={styles.center}>{error}</div>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>

                {/* Service Summary */}
                {service && (
                    <div style={styles.serviceSummary}>
                        <h2 style={styles.serviceTitle}>🔧 {service.name}</h2>
                        <p style={styles.serviceDesc}>{service.description}</p>
                        <div style={styles.serviceMeta}>
                            <span style={styles.price}>
                                Rs. {service.price.toLocaleString()}
                            </span>
                            <span style={styles.duration}>⏱ {service.duration}</span>
                        </div>
                    </div>
                )}

                <hr style={styles.divider} />

                <h3 style={styles.formTitle}>Book Your Appointment</h3>

                {/* Messages */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Booking Form */}
                <form onSubmit={handleSubmit}>

                    {/* Appointment Date */}
                    <div className="form-group">
                        <label>Appointment Date & Time</label>
                        <input
                            type="datetime-local"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </div>

                    {/* Vehicle Details */}
                    <p style={styles.sectionLabel}>Vehicle Details</p>

                    <div style={styles.row}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Make</label>
                            <input
                                type="text"
                                name="make"
                                placeholder="e.g. Toyota"
                                value={formData.make}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Model</label>
                            <input
                                type="text"
                                name="model"
                                placeholder="e.g. Corolla"
                                value={formData.model}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Year</label>
                        <input
                            type="number"
                            name="year"
                            placeholder="e.g. 2020"
                            value={formData.year}
                            onChange={handleChange}
                            min="1990"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.buttons}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/services')}
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={submitting}
                        >
                            {submitting ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '36px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    serviceSummary: {
        marginBottom: '8px'
    },
    serviceTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: '8px'
    },
    serviceDesc: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '12px'
    },
    serviceMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#e63946'
    },
    duration: {
        color: '#888',
        fontSize: '13px',
        backgroundColor: '#f8f8f8',
        padding: '4px 10px',
        borderRadius: '20px'
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #f0f0f0',
        margin: '20px 0'
    },
    formTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: '20px'
    },
    sectionLabel: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '12px'
    },
    row: {
        display: 'flex',
        gap: '16px'
    },
    buttons: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px'
    },
    center: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '18px',
        color: '#666'
    }
};

export default BookService;