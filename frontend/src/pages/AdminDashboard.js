import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('bookings');

    const [serviceForm, setServiceForm] = useState({
        name: '', description: '', price: '', duration: ''
    });
    const [serviceMsg, setServiceMsg] = useState('');
    const [serviceError, setServiceError] = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [bookingsRes, servicesRes, usersRes] = await Promise.all([
                API.get('/bookings'),
                API.get('/services'),
                API.get('/auth/users')      // Fetch all user accounts
            ]);
            setBookings(bookingsRes.data.bookings);
            setServices(servicesRes.data.services);
            setUsers(usersRes.data.users);
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, status) => {
        try {
            await API.put(`/bookings/${bookingId}/status`, { status });
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        setServiceMsg(''); setServiceError('');
        try {
            await API.post('/services', { ...serviceForm, price: Number(serviceForm.price) });
            setServiceMsg('✅ Service added successfully!');
            setServiceForm({ name: '', description: '', price: '', duration: '' });
            fetchAll();
        } catch (err) {
            setServiceError(err.response?.data?.message || 'Failed to add service');
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Delete this service?')) return;
        try {
            await API.delete(`/services/${serviceId}`);
            fetchAll();
        } catch (err) { alert('Failed to delete service'); }
    };

    // Admin updates a user's role
    const handleRoleChange = async (userId, role) => {
        try {
            await API.put(`/auth/users/${userId}/role`, { role });
            fetchAll(); // Refresh users list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role');
        }
    };

    if (loading) return <div style={styles.center}>Loading dashboard...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    const totalBookings = bookings.length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);

    return (
        <div className="page">
            <h1 className="page-title">Admin Dashboard</h1>

            {/* ── Stat Cards ── */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Total Bookings</p>
                    <p style={styles.statValue}>{totalBookings}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Pending</p>
                    <p style={{...styles.statValue, color: '#f4a261'}}>{pendingCount}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Completed</p>
                    <p style={{...styles.statValue, color: '#2a9d8f'}}>{completedCount}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Total Users</p>
                    <p style={{...styles.statValue, color: '#4f46e5'}}>{users.length}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Revenue</p>
                    <p style={{...styles.statValue, color: '#e63946'}}>
                        Rs. {totalRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div style={styles.tabs}>
                <button
                    style={activeTab === 'bookings' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('bookings')}
                >Manage Bookings</button>
                <button
                    style={activeTab === 'services' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('services')}
                >Manage Services</button>
                <button
                    style={activeTab === 'users' ? styles.tabActive : styles.tab}
                    onClick={() => setActiveTab('users')}
                >View Accounts</button>
            </div>

            {/* ── Bookings Tab ── */}
            {activeTab === 'bookings' && (
                <div>
                    {bookings.length === 0 ? (
                        <p style={styles.empty}>No bookings found.</p>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking._id} style={styles.bookingCard}>
                                <div style={styles.bookingHeader}>
                                    <div>
                                        <p style={styles.customerName}>
                                            👤 {booking.customer?.name}
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
                                <div style={styles.bookingDetails}>
                                    <span> {booking.service?.name}</span>
                                    <span> {booking.vehicleDetails?.year}{' '}
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
            )}

            {/* ── Services Tab ── */}
            {activeTab === 'services' && (
                <div>
                    <div style={styles.addServiceCard}>
                        <h3 style={styles.formTitle}>Add New Service</h3>
                        {serviceMsg &&
                            <div className="alert alert-success">{serviceMsg}</div>}
                        {serviceError &&
                            <div className="alert alert-error">{serviceError}</div>}
                        <form onSubmit={handleAddService}>
                            <div style={styles.formRow}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Service Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Tire Rotation"
                                        value={serviceForm.name}
                                        onChange={(e) => setServiceForm({
                                            ...serviceForm, name: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 30 mins"
                                        value={serviceForm.duration}
                                        onChange={(e) => setServiceForm({
                                            ...serviceForm, duration: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Describe the service..."
                                    value={serviceForm.description}
                                    onChange={(e) => setServiceForm({
                                        ...serviceForm, description: e.target.value
                                    })}
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price (Rs.)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 2500"
                                    value={serviceForm.price}
                                    onChange={(e) => setServiceForm({
                                        ...serviceForm, price: e.target.value
                                    })}
                                    min="0"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                + Add Service
                            </button>
                        </form>
                    </div>
                    <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>
                        Current Services ({services.length})
                    </h3>
                    <div style={styles.servicesList}>
                        {services.map((service) => (
                            <div key={service._id} style={styles.serviceItem}>
                                <div>
                                    <p style={styles.serviceItemName}>{service.name}</p>
                                    <p style={styles.serviceItemMeta}>
                                        Rs. {service.price.toLocaleString()} • {service.duration}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    style={{ padding: '6px 14px', fontSize: '13px' }}
                                    onClick={() => handleDeleteService(service._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Users Tab ── */}
            {activeTab === 'users' && (
                <div>
                    <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                        {users.length} registered accounts — you can promote customers
                        to manager or admin roles.
                    </p>
                    {users.map((u) => (
                        <div key={u._id} style={styles.userCard}>
                            <div style={styles.userInfo}>
                                <p style={styles.userName}>👤 {u.name}</p>
                                <p style={styles.userEmail}>{u.email}</p>
                                <p style={styles.userDate}>
                                    Joined: {new Date(u.createdAt)
                                        .toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                                </p>
                            </div>
                            <div style={styles.roleSection}>
                                <span className={`badge ${
                                    u.role === 'admin'    ? 'badge-confirmed' :
                                    u.role === 'manager'  ? 'badge-pending'   :
                                                            'badge-completed'
                                }`}>
                                    {u.role}
                                </span>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
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
    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a2e'
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    tab: {
        padding: '10px 20px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#666'
    },
    tabActive: {
        padding: '10px 20px',
        border: '2px solid #e63946',
        borderRadius: '8px',
        backgroundColor: '#e63946',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white'
    },
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
    addServiceCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    },
    formTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' },
    formRow: { display: 'flex', gap: '16px' },
    servicesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    serviceItem: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
    },
    serviceItemName: { fontWeight: '700', fontSize: '15px', color: '#1a1a2e', marginBottom: '4px' },
    serviceItemMeta: { fontSize: '13px', color: '#888' },
    userCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
    },
    userInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    userName: { fontWeight: '700', fontSize: '15px', color: '#1a1a2e' },
    userEmail: { fontSize: '13px', color: '#666' },
    userDate: { fontSize: '12px', color: '#aaa' },
    roleSection: { display: 'flex', alignItems: 'center', gap: '12px' },
    center: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#666' },
    empty: { textAlign: 'center', padding: '40px', color: '#999' }
};

export default AdminDashboard;