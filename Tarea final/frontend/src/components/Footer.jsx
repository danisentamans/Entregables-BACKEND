// import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container_footer}>
                {/* <div className={styles.socialIcons}>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebookSquare /></a>
                    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FaTwitterSquare /></a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagramSquare /></a>
                </div> */}
                <p className={styles.copyRight}>© 2024 Fitness Gym. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
