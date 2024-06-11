import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrderForm = () => {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    const { id } = useParams();
    const [orderData, setOrderData] = useState({ items: [{ product: '', quantity: 1 }] });

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).then(response => {
                setOrderData({ items: response.data.items });
            }).catch(error => {
                console.error('Error fetching order', error);
            });
        }
    }, [id, user.token]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...orderData.items];
        newItems[index] = { ...newItems[index], [name]: value };
        setOrderData({ ...orderData, items: newItems });
    };

    const handleAddItem = () => {
        setOrderData({ ...orderData, items: [...orderData.items, { product: '', quantity: 1 }] });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...orderData.items];
        newItems.splice(index, 1);
        setOrderData({ ...orderData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/orders/${id}`, orderData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/orders', orderData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }
            navigate('/orders');
        } catch (error) {
            console.error('Error saving order', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {orderData.items.map((item, index) => (
                <div key={index}>
                    <input type="text" name="product" placeholder="Product" value={item.product} onChange={(e) => handleChange(index, e)} required />
                    <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => handleChange(index, e)} required />
                    <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddItem}>Add Item</button>
            <button type="submit">{id ? 'Update' : 'Create'} Order</button>
        </form>
    );
};

export default OrderForm;
