import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Services = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all services when page loads
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await API.get('/services');
                setServices(data.services);
            } catch (err) {
                setError('Failed to load services');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleBookNow = (serviceId) => {
        if (!user) {
            // Redirect to login if not logged in
            navigate('/login');
        } else {
            navigate(`/book/${serviceId}`);
        }
    };

    if (loading) return <div style={styles.center}>Loading services...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    return (
        <div className="page">
            {/* Page Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Our Services</h1>
                <p style={styles.subtitle}>
                    Professional automobile care you can trust
                </p>
            </div>

            {/* Services Grid */}
            {services.length === 0 ? (
                <div style={styles.empty}>
                    No services available at the moment.
                </div>
            ) : (
                <div style={styles.grid}>
                    {services.map((service) => (
                        <div key={service._id} style={styles.card}>

                            {/* Service Icon */}
                            <div style={styles.iconBox}></div>

                            {/* Service Info */}
                            <h2 style={styles.serviceName}>{service.name}</h2>
                            <p style={styles.description}>{service.description}</p>

                            {/* Price and Duration */}
                            <div style={styles.meta}>
                                <span style={styles.price}>
                                    Rs. {service.price.toLocaleString()}
                                </span>
                                <span style={styles.duration}>
                                    ⏱ {service.duration}
                                </span>
                            </div>

                            {/* Book Button */}
                            <button
                                className="btn btn-primary"
                                style={styles.bookBtn}
                                onClick={() => handleBookNow(service._id)}
                            >
                                {user ? 'Book Now' : 'Login to Book'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#666',
        fontSize: '16px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s',
        border: '1px solid #f0f0f0'
    },
    iconBox: {
        fontSize: '36px',
        marginBottom: '4px'
    },
    serviceName: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1a1a2e'
    },
    description: {
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.6',
        flexGrow: 1
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '12px'
    },
    price: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#e63946'
    },
    duration: {
        fontSize: '13px',
        color: '#888',
        backgroundColor: '#f8f8f8',
        padding: '4px 10px',
        borderRadius: '20px'
    },
    bookBtn: {
        width: '100%',
        padding: '12px',
        fontSize: '15px'
    },
    center: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '18px',
        color: '#666'
    },
    empty: {
        textAlign: 'center',
        padding: '60px',
        color: '#999',
        fontSize: '16px'
    }
};

export default Services;