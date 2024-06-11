import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    return (
        <div>
            <h2>Perfil de Usuario</h2>
            {user && (
                <div>
                    <p>Nombre de usuario: {user.username}</p>
                    <p>Nombre: {user.firstName} {user.lastName}</p>
                    <p>Teléfono: {user.phone}</p>
                    <p>Correo electrónico: {user.email}</p>
                    <p>Recibir noticias: {user.receiveNews ? 'Sí' : 'No'}</p>
                    <p>Rol: {user.role}</p>
                    <p>Fecha de nacimiento: {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                    <p>Fecha de registro: {new Date(user.createdAt).toLocaleDateString()}</p>
                    {/* Agrega más campos según los datos del usuario que quieras mostrar */}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
