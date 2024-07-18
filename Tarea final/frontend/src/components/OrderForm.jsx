import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/OrderForm.module.css';

const OrderForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [orderData, setOrderData] = useState({ items: [{ product: '', quantity: 1 }] });

    const productOptions = {
        bolleria: ['Croissant', 'Palmera de chocolate', 'Ensaimada'],
        pan: ['Pan De cereales', 'Pan Integral', 'Pan de Centeno', 'Pan Normal'],
        dulces: ['Tarta', 'Hojaldres', 'Tiramisú']
    };

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
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>{id ? 'Actualizar' : 'Nuevo'} Pedido</h2>
            {orderData.items.map((item, index) => (
                <div key={index} className={styles.formGroup}>
                    <select name="product" value={item.product} onChange={(e) => handleChange(index, e)} required className={styles.select}>
                        <option value="">Seleccione un producto</option>
                        <optgroup label="Bollería">
                            {productOptions.bolleria.map((product) => (
                                <option key={product} value={product}>{product}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Pan">
                            {productOptions.pan.map((product) => (
                                <option key={product} value={product}>{product}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Dulces">
                            {productOptions.dulces.map((product) => (
                                <option key={product} value={product}>{product}</option>
                            ))}
                        </optgroup>
                    </select>
                    <input type="number" name="quantity" placeholder="Cantidad" value={item.quantity} onChange={(e) => handleChange(index, e)} required className={styles.input} />
                    <button type="button" onClick={() => handleRemoveItem(index)} className={styles.removeButton}>Eliminar</button>
                </div>
            ))}
            <button type="button" onClick={handleAddItem} className={styles.addButton}>Añadir artículo</button>
            <button type="submit" className={styles.submitButton}>{id ? 'Actualizar' : 'Crear'} Pedido</button>
        </form>
    );
};

export default OrderForm;
