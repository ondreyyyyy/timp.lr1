import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then(response => setUsers(response.data))
            .catch(err => {
                setError('Ошибка загрузки пользователей.');
            });
    }, []);

    const register = async ({ username, email, password }) => {
        setError(null);

        const usernameExists = users.some(user => user.username === username);
        const emailExists = users.some(user => user.email === email);

        if (usernameExists) return { success: false, message: 'Имя пользователя уже занято' };
        if (emailExists) return { success: false, message: 'Почта уже используется' };

        try {
            const response = await axios.post('http://localhost:5000/users', { username, email, password });
            setUsers(prev => [...prev, response.data]);
            return { success: true };
        } catch (err) {
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        return { success: false, message: 'Ошибка регистрации: некорректные данные (400).' };
                    case 500:
                        return { success: false, message: 'Ошибка сервера (500). Попробуйте позже.' };
                    default:
                        return { success: false, message: `Не удалось зарегистрироваться (${err.response.status}).` };
                }
            }
            return { success: false, message: 'Ошибка соединения с сервером.' };
        }
    };

    const login = async (username, password) => {
        setError(null);

        try {
            const response = await axios.get(`http://localhost:5000/users?username=${username}&password=${password}`);
            if (response.data.length > 0) {
                setIsAuthenticated(true);
                setCurrentUser(response.data[0]);
                return { success: true };
            } else {
                return { success: false, message: 'Неверный логин или пароль' };
            }
        } catch (err) {
            if (err.response) {
                switch (err.response.status) {
                    case 500:
                        return { success: false, message: 'Ошибка сервера при входе (500).' };
                    default:
                        return { success: false, message: `Не удалось выполнить вход (${err.response.status}).` };
                }
            }
            return { success: false, message: 'Ошибка соединения с сервером.' };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, currentUser, error }}>
            {children}
        </AuthContext.Provider>
    );
};