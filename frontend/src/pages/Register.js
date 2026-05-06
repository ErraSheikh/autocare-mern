import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check passwords match before sending to backend
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            const { data } = await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // Auto login after successful registration
            login({ ...data.user, token: data.token });
            navigate('/services');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                    <p style={styles.subtitle}>Create your account</p>
                </div>

                {/* Error message */}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Register Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Login link */}
                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.loginLink}>
                        Sign in here
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
    loginText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#666'
    },
    loginLink: {
        color: '#e63946',
        fontWeight: '600',
        textDecoration: 'none'
    }
};

export default Register;