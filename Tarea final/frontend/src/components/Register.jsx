import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const countryCodes = {
    'España': '+34',
    'Alemania': '+49',
    'Francia': '+33',
    'Italia': '+39',
    'Reino unido': '+44'
};

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '',
        email: '', 
        password: '', 
        receiveNews: false, 
        firstName: '', 
        lastName: '', 
        phone: '', 
        dateOfBirth: '',
        countryCode: '+34' // Default country code for Spain
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullPhone = formData.countryCode + formData.phone;
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                ...formData,
                phone: fullPhone // send concatenated phone number
            });
            navigate('/login');
        } catch (error) {
            console.error('Error registering', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <select name="countryCode" value={formData.countryCode} onChange={handleChange} required>
                {Object.entries(countryCodes).map(([country, code]) => (
                    <option key={country} value={code}>{country} ({code})</option>
                ))}
            </select>
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
            <label>
                <input type="checkbox" name="receiveNews" checked={formData.receiveNews} onChange={handleChange} />
                Receive latest news and updates
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
