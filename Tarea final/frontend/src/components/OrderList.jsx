import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

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
        <div>
            <Link to="/order/new">Create New Order</Link>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>{item.product} - {item.quantity}</li>
                            ))}
                        </ul>
                        <Link to={`/order/edit/${order._id}`}>Edit</Link>
                        <button onClick={() => handleDelete(order._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
