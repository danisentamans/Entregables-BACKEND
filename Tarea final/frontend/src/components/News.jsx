import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/News.module.css';

const News = () => {
    const [news, setNews] = useState([]);
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false)

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

    useEffect(() => {
        const fetchUserRole = async () => {
          if (user) {
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
              const response = await axios.get(
                `http://localhost:5000/api/users/me`,
                config
              );
              if (response.data.role === "admin") {
                console.log("Estos es un response", response.data);
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            } catch (error) {
              console.error("Error fetching user role", error);
            }
          }
        };
    
        fetchUserRole();
      }, [user]);

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
        <div className={styles.container}>
            <h2>Notícias</h2>
            {isAdmin && (<Link className="link" to="/news/new">Nueva notícia</Link>)}
            <ul className={styles.ul}>
                {news.map(n => (
                    <li key={n._id}>
                        <h2>{n.title}</h2>
                        <p>{n.description}</p>
                        <img src={n.image} alt={n.title} />
                        {isAdmin && (<Link className="link" to={`/news/edit/${n._id}`}>Editar</Link>)}
                        {isAdmin && (<button className="deleteButton" onClick={() => handleDelete(n._id)}>Eliminar</button>)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;
