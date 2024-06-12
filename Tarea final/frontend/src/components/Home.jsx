import styles from '../styles/Home.module.css';
import coverImage from '../images/cabecero.jpg'; // Asegúrate de que la ruta sea correcta

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            <img src={coverImage} alt="Horno artesanal" className={styles.coverImage} />
            <div className={styles.overlay}>
                <h1 className={styles.title}>Bienvenido a la aplicación de gestión de pedidos de horno</h1>
                <p className={styles.subtitle}>Horno tradicional. El de toda la vida</p>
            </div>
        </div>
    );
};

export default Home;
