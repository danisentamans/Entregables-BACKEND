import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styles from '../styles/OrderList.module.css';

const OrderList = () => {
    const { user } = useAuth(); 
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${user.token}` } 
        }).then(response => {
            setOrders(response.data);
        }).catch(error => {
            console.error('Error fetching orders', error);
        });
    }, [user.token]); 

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` } 
            });
            setOrders(orders.filter(order => order._id !== id));
        } catch (error) {
            console.error('Error deleting order', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pedidos</h2>
            <Link to="/order/new" className={styles.newOrderButton}>Nuevo pedido</Link>
            <ul className={styles.orderList}>
                {orders.map(order => (
                    <li key={order._id} className={styles.orderItem}>
                        <ul className={styles.itemList}>
                            {order.items.map((item, index) => (
                                <li key={index} className={styles.item}>{item.product} - {item.quantity}</li>
                            ))}
                        </ul>
                        <div className={styles.buttons}>
                            <Link to={`/order/edit/${order._id}`} className={styles.editButton}>Editar</Link>
                            <button onClick={() => handleDelete(order._id)} className={styles.deleteButton}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
