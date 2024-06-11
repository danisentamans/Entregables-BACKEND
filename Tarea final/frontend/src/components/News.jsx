import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const News = () => {
    const [news, setNews] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/news');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news', error);
            }
        };
        fetchNews();
    }, []);

    const handleDelete = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}` // Incluye el token de autenticación en la solicitud
                }
            };
            console.log(id);
            await axios.delete(`http://localhost:5000/api/news/${id}`, config);
            setNews(news.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting news', error);
        }
    };

    return (
        <div>
            <Link to="/news/new">Create New News</Link>
            <ul>
                {news.map(n => (
                    <li key={n._id}>
                        <h2>{n.title}</h2>
                        <p>{n.description}</p>
                        <img src={n.image} alt={n.title} />
                        <Link to={`/news/edit/${n._id}`}>Edit</Link>
                        <button onClick={() => handleDelete(n._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;
