import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { setUser } = useAuth();

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
            alert('Login successful');
        } catch (error) {
            console.error('Error logging in', error);
            alert('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
