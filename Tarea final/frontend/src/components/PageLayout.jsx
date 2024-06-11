import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';
import styles from '../styles/Navbar.module.css';

export default function PageLayout() {
    const { user } = useAuth();

    return (
        <>
            <header>
                <nav className={styles.navbar}>
                    <input type="checkbox" id="menu-toggle-checkbox" className={styles.menuToggleCheckbox} />
                    <label htmlFor="menu-toggle-checkbox" className={styles.menuIcon}>&#9776;</label>
                    <ul className={styles.menuItems}>
                        <li><Link to='/'> Forn Pa i Dolç gran Via</Link></li>
                        <li>
                            {user ? (
                                <Link to='/profilePage
                                '> Mi perfil </Link>
                            ) : (
                                <Link to='/register'> Registrarse </Link>
                            )}
                        </li>
                        <li><Link to='/login'> Iniciar sesión </Link></li>
                        <li><Link to='/order/new'> Crear Pedido </Link></li>
                        <li><Link to='/orders'> Lista de Pedidos </Link></li>
                        <li><Link to='/news'> Noticias </Link></li>
                    </ul>
                </nav>
            </header>

            <Outlet />

            <Footer />
        </>
    );
}
