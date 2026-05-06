import { useState, useEffect } from 'react';
import API from '../api/axios';

const ManagerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await API.get('/bookings');
            setBookings(data.bookings);
        } catch (err) {
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, status) => {
        try {
            await API.put(`/bookings/${bookingId}/status`, { status });
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    const pending   = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;

    return (
        <div className="page">
            <h1 className="page-title">Manager Dashboard</h1>

            {/* ── Stat Cards ── */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Total Bookings</p>
                    <p style={styles.statValue}>{bookings.length}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Pending</p>
                    <p style={{...styles.statValue, color: '#f4a261'}}>{pending}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Confirmed</p>
                    <p style={{...styles.statValue, color: '#4f46e5'}}>{confirmed}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Completed</p>
                    <p style={{...styles.statValue, color: '#2a9d8f'}}>{completed}</p>
                </div>
            </div>

            {/* ── Bookings List ── */}
            <h2 style={styles.sectionTitle}>All Bookings</h2>
            {bookings.length === 0 ? (
                <p style={styles.empty}>No bookings found.</p>
            ) : (
                bookings.map((booking) => (
                    <div key={booking._id} style={styles.bookingCard}>

                        {/* Header */}
                        <div style={styles.bookingHeader}>
                            <div>
                                <p style={styles.customerName}>
                                     {booking.customer?.name}
                                </p>
                                <p style={styles.customerEmail}>
                                    {booking.customer?.email}
                                </p>
                            </div>
                            <div style={styles.badges}>
                                <span className={`badge badge-${booking.status}`}>
                                    {booking.status}
                                </span>
                                <span className={`badge badge-${booking.paymentStatus}`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div style={styles.bookingDetails}>
                            <span> {booking.service?.name}</span>
                            <span>
                                 {booking.vehicleDetails?.year}{' '}
                                {booking.vehicleDetails?.make}{' '}
                                {booking.vehicleDetails?.model}
                            </span>
                            <span>
                                {new Date(booking.appointmentDate)
                                    .toLocaleString('en-PK', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                            </span>
                            <span style={{ color: '#e63946', fontWeight: '700' }}>
                                Rs. {booking.totalAmount?.toLocaleString()}
                            </span>
                        </div>

                        {/* Status Update */}
                        <div style={styles.statusRow}>
                            <label style={styles.statusLabel}>Update Status:</label>
                            <select
                                value={booking.status}
                                onChange={(e) =>
                                    handleStatusChange(booking._id, e.target.value)
                                }
                                style={styles.select}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        textAlign: 'center'
    },
    statLabel: {
        fontSize: '13px',
        color: '#888',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px'
    },
    statValue: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
    },
    bookingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
    },
    customerName: { fontWeight: '700', fontSize: '16px', color: '#1a1a2e' },
    customerEmail: { fontSize: '13px', color: '#888' },
    badges: { display: 'flex', gap: '8px' },
    bookingDetails: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '14px',
        color: '#555',
        backgroundColor: '#f9f9f9',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '12px'
    },
    statusRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    statusLabel: { fontSize: '13px', fontWeight: '600', color: '#555' },
    select: {
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '13px',
        cursor: 'pointer'
    },
    center: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#666' },
    empty: { textAlign: 'center', padding: '40px', color: '#999' }
};

export default ManagerDashboard;