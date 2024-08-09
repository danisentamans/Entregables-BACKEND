import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { setUser } = useAuth(); // Obtener el usuario del contexto de autenticación
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <div>
            <button onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
};

export default LogoutButton;
