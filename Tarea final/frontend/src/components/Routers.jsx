import { Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import OrderForm from './OrderForm';
import OrderList from './OrderList';
import PageLayout from './PageLayout';
import News from './News';
import NewsForm from './NewsForm';
import { AuthProvider } from '../contexts/AuthContext';
import ProfilePage from './ProfilePage';

const Home = () => {
    return (
        <div>
            <h1>Bienvenido a la aplicación de gestión de pedidos de horno</h1>
            <p>Aquí puedes administrar tus pedidos de horno de manera fácil y rápida.</p>
        </div>
    );
};

export default function Routers() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profilePage" element={<ProfilePage />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/order/new" element={<OrderForm />} />
                    <Route path="/order/edit/:id" element={<OrderForm />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/new" element={<NewsForm />} />
                    <Route path="/news/edit/:id" element={<NewsForm />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}
