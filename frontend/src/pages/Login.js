import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Update form fields as user types
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await API.post('/auth/login', formData);

            // Save user + token to context and localStorage
            login({ ...data.user, token: data.token });

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/services');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>

                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>🔧 AutoCare</h1>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>

                {/* Error message */}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Register link */}
                <p style={styles.registerText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.registerLink}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '28px'
    },
    title: {
        fontSize: '28px',
        color: '#e63946',
        marginBottom: '8px'
    },
    subtitle: {
        color: '#666',
        fontSize: '14px'
    },
    registerText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#666'
    },
    registerLink: {
        color: '#e63946',
        fontWeight: '600',
        textDecoration: 'none'
    }
};

export default Login;