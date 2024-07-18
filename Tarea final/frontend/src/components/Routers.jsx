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
import AdminDashboard from './AdminDashboard';
import EditUser from './EditUser';
import Home from './Home';

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
                    <Route path="/admin" element={<AdminDashboard />}/>
                    <Route path="/admin/edit/:id" element={<EditUser/>} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}
