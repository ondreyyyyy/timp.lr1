import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './Pages.css';

const isoToDot = (isoDate) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

const Form = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        type: '',
        guardCount: 0,
        status: 'Под охраной',
        lastInspection: '',
        hasAlarmSystem: true
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : name === 'guardCount'
                    ? Number(value)
                    : value
        }));
    };

    const validate = () => {
        if (!formData.name.trim()) return 'Название не может быть пустым.';
        if (!formData.address.trim()) return 'Адрес не может быть пустым.';
        if (!formData.type.trim()) return 'Тип не может быть пустым.';
        if (formData.guardCount < 0) return 'Количество охранников не может быть отрицательным.';
        if (!formData.status.trim()) return 'Статус не может быть пустым.';
        if (!formData.lastInspection) return 'Укажите дату последней проверки.';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        setLoading(true);

        const dataToSend = {
            ...formData,
            lastInspection: isoToDot(formData.lastInspection)
        };

        axios.post('http://localhost:5000/objects', dataToSend)
            .then(response => {
                navigate('/');
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.status) {
                        case 400:
                            setError('Некорректные данные. Проверьте введённые значения (400).');
                            break;
                        case 500:
                            setError('Ошибка сервера (500). Попробуйте позже.');
                            break;
                        default:
                            setError(`Не удалось добавить объект (${err.response.status}).`);
                    }
                } else {
                    setError('Ошибка соединения. Проверьте подключение к серверу.');
                }
                setLoading(false);
            });
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="form-panel">
            <h1>Добавить объект охраны</h1>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Название:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Адрес:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />

                <label>Тип:</label>
                <input type="text" name="type" value={formData.type} onChange={handleChange} required />

                <label>Количество охранников:</label>
                <input type="number" name="guardCount" value={formData.guardCount} onChange={handleChange} required />

                <label>Статус:</label>
                <input type="text" name="status" value={formData.status} onChange={handleChange} required />

                <label>Последняя проверка:</label>
                <input type="date" name="lastInspection" value={formData.lastInspection} onChange={handleChange} required />

                <div className="checkbox-row">
                    <input type="checkbox" name="hasAlarmSystem" checked={formData.hasAlarmSystem} onChange={handleChange} />
                    <label style={{ margin: 0 }}>Сигнализация</label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Добавить</button>
                </div>
            </form>
        </div>
    );
};

export default Form;