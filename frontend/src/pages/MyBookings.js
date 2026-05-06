import { useState, useEffect } from 'react';
import API from '../api/axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [payingId, setPayingId] = useState(null); // Track which booking is being paid

    // Fetch customer's bookings on page load
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await API.get('/bookings/my-bookings');
            setBookings(data.bookings);
        } catch (err) {
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    // Mock payment handler
    const handlePay = async (bookingId) => {
        setPayingId(bookingId);
        try {
            await API.put(`/bookings/${bookingId}/pay`);
            // Refresh bookings to show updated payment status
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Payment failed');
        } finally {
            setPayingId(null);
        }
    };

    // Cancel booking handler
    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await API.delete(`/bookings/${bookingId}`);
            fetchBookings(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed');
        }
    };

    if (loading) return <div style={styles.center}>Loading your bookings...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    return (
        <div className="page">
            <h1 className="page-title">My Bookings</h1>

            {bookings.length === 0 ? (
                <div style={styles.empty}>
                    <p style={styles.emptyIcon}>📋</p>
                    <p>You have no bookings yet.</p>
                </div>
            ) : (
                <div style={styles.list}>
                    {bookings.map((booking) => (
                        <div key={booking._id} style={styles.card}>

                            {/* Top Row: Service name + Status badges */}
                            <div style={styles.cardHeader}>
                                <h2 style={styles.serviceName}>
                                    {booking.service?.name}
                                </h2>
                                <div style={styles.badges}>
                                    <span className={`badge badge-${booking.status}`}>
                                        {booking.status}
                                    </span>
                                    <span className={`badge badge-${booking.paymentStatus}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Booking Details Grid */}
                            <div style={styles.detailsGrid}>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>📅 Appointment</span>
                                    <span style={styles.detailValue}>
                                        {new Date(booking.appointmentDate)
                                            .toLocaleString('en-PK', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>🚗 Vehicle</span>
                                    <span style={styles.detailValue}>
                                        {booking.vehicleDetails?.year}{' '}
                                        {booking.vehicleDetails?.make}{' '}
                                        {booking.vehicleDetails?.model}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>⏱ Duration</span>
                                    <span style={styles.detailValue}>
                                        {booking.service?.duration}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>💰 Amount</span>
                                    <span style={styles.amount}>
                                        Rs. {booking.totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={styles.actions}>
                                {/* Pay button - only if unpaid and not cancelled */}
                                {booking.paymentStatus === 'unpaid' &&
                                    booking.status !== 'cancelled' && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handlePay(booking._id)}
                                        disabled={payingId === booking._id}
                                    >
                                        {payingId === booking._id
                                            ? 'Processing...'
                                            : '💳 Pay Now'}
                                    </button>
                                )}

                                {/* Cancel button - only if not completed/cancelled */}
                                {booking.status !== 'completed' &&
                                    booking.status !== 'cancelled' && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleCancel(booking._id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '10px'
    },
    serviceName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a2e'
    },
    badges: {
        display: 'flex',
        gap: '8px'
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    detailLabel: {
        fontSize: '12px',
        color: '#888',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    detailValue: {
        fontSize: '14px',
        color: '#333',
        fontWeight: '500'
    },
    amount: {
        fontSize: '16px',
        color: '#e63946',
        fontWeight: '700'
    },
    actions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
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
        color: '#999'
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    }
};

export default MyBookings;