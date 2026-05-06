import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>⚙️AutoCare</Link>
                <div style={styles.links}>
                    <Link to="/services" style={styles.link}>Services</Link>

                    {user && (
                        <>
                            {user.role === 'customer' && (
                                <Link to="/my-bookings" style={styles.link}>
                                    My Bookings
                                </Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin" style={styles.link}>
                                    Admin Dashboard
                                </Link>
                            )}
                            {/* Manager sees their own dashboard */}
                            {user.role === 'manager' && (
                                <Link to="/manager" style={styles.link}>
                                    Manager Dashboard
                                </Link>
                            )}
                            <span style={styles.welcome}>Hi, {user.name} 👋</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    )}

                    {!user && (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" style={styles.registerBtn}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#1a1a2e',
        padding: '14px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: { color: '#e63946', fontSize: '22px', fontWeight: '700', textDecoration: 'none' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: '#ccc', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
    welcome: { color: '#aaa', fontSize: '14px' },
    logoutBtn: {
        backgroundColor: '#e63946',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600'
    },
    registerBtn: {
        backgroundColor: '#e63946',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '600'
    }
};

export default Navbar;