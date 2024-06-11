import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NewsForm = () => {
    const [formData, setFormData] = useState({ title: '', description: '', image: '' });
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (id) {
            const fetchNews = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/news/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching news', error);
                }
            };
            fetchNews();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}` // Incluye el token de autenticación en la solicitud
                }
            };
            if (id) {
                await axios.put(`http://localhost:5000/api/news/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/news', formData, config);
            }
            navigate('/news');
        } catch (error) {
            console.error('Error saving news', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                required
            />
            <button type="submit">{id ? 'Update' : 'Create'} News</button>
        </form>
    );
};

export default NewsForm;
