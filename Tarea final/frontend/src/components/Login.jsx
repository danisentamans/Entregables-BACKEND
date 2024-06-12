import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setUser({ token });
            navigate('/')
        } catch (error) {
            console.error('Error logging in', error);
            alert('Invalid credentials');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Iniciar sesión</button>
        </form>
    );
};

export default Login;
