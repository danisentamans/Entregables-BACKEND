import styles from '../styles/Home.module.css';
import ImageCarousel from '../components/ImageCarousel';
import logo from '../images/logo.jpg';
import cabecero from '../images/cabecero.jpg';

const Home = () => {
    return (
        <div className={styles.homeContainer} style={{ backgroundImage: `url(${cabecero})` }}>
            <div className={styles.content}>
                <div className={styles.leftSection}>
                    <div className={styles.logoContainer}>
                        <img src={logo} alt="Logo del horno" className={styles.logoImage} />
                    </div>
                    <div className={styles.textContainer}>
                        <h1 className={styles.title}>Horno Tradicional</h1>
                        <p className={styles.subtitle}>
                            El sabor de siempre, hecho con amor y dedicación.
                        </p>
                        <p className={styles.description}>
                            Ven a descubrir nuestros productos frescos y artesanales. Cada día,
                            horneamos con ingredientes de la más alta calidad para ofrecerte el
                            auténtico sabor de un horno tradicional.
                        </p>
                        <button className={styles.ctaButton}>Explorar Productos</button>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <ImageCarousel />
                </div>
            </div>
        </div>
    );
};

export default Home;
