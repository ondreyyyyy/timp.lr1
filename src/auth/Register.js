import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Spinner from '../components/Spinner';
import './Auth.css';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirm: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.username || !form.email || !form.password || !form.confirm) {
            setError('Все поля должны быть заполнены');
            return;
        }

        if (/\s/.test(form.username)) {
            setError('Имя пользователя не должно содержать пробелы');
            return;
        }

        if (/\s/.test(form.password)) {
            setError('Пароль не должен содержать пробелы');
            return;
        }

        if (!validateEmail(form.email)) {
            setError('Введите корректный email');
            return;
        }

        if (form.password.length < 4) {
            setError('Пароль должен быть не менее 4 символов');
            return;
        }

        if (form.password !== form.confirm) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        const result = await register({
            username: form.username,
            email: form.email,
            password: form.password
        });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="auth-container">
            <h1>Регистрация</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Имя пользователя:</label>
                <input name="username" value={form.username} onChange={handleChange} required />
                <label>Электронная почта:</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
                <label>Пароль:</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
                <label>Подтверждение пароля:</label>
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required />
                <button type="submit">Зарегистрироваться</button>
                <div className="back-link">
                    Уже зарегистрированы? <Link to="/login">Войти</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;