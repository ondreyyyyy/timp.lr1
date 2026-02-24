import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './Pages.css';

const Detail = () => {
    const { id } = useParams();

    const [objects, setObjects] = useState([]);
    const [object, setObject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/objects/${id}`)
                .then(response => {
                    setObject(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        setError('Объект не найден (404).');
                    } else if (err.response && err.response.status === 500) {
                        setError('Внутренняя ошибка сервера (500).');
                    } else {
                        setError('Ошибка загрузки данных.');
                    }
                    setLoading(false);
                });
        } else {
            axios.get('http://localhost:5000/objects')
                .then(response => {
                    setObjects(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Ошибка загрузки списка объектов.');
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (!id) {
        return (
            <div className="page-container">
                <h1 className="page-title">Выберите объект для просмотра</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="select-list">
                    {objects.map(obj => (
                        <Link to={`/detail/${obj.id}`} key={obj.id} className="select-item">
                            <span className="select-item-name">{obj.name}</span>
                            <span className="select-item-type">{obj.type}</span>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    if (!object) {
        return (
            <div className="form-panel">
                <h1>{error || 'Объект не найден'}</h1>
                <Link to="/detail" className="back-link">Назад</Link>
            </div>
        );
    }

    return (
        <div className="detail-page">
            <h1>Подробная информация об объекте</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="detail-card">
                <table>
                    <tbody>
                        <tr><td><strong>ID</strong></td><td>{object.id}</td></tr>
                        <tr><td><strong>Название</strong></td><td>{object.name}</td></tr>
                        <tr><td><strong>Адрес</strong></td><td>{object.address}</td></tr>
                        <tr><td><strong>Тип</strong></td><td>{object.type}</td></tr>
                        <tr><td><strong>Количество охранников</strong></td><td>{object.guardCount}</td></tr>
                        <tr><td><strong>Статус</strong></td><td>{object.status}</td></tr>
                        <tr><td><strong>Последняя проверка</strong></td><td>{object.lastInspection}</td></tr>
                        <tr><td><strong>Сигнализация</strong></td><td>{object.hasAlarmSystem ? 'Есть' : 'Нет'}</td></tr>
                    </tbody>
                </table>
            </div>
            <Link to="/detail" className="back-link">Назад</Link>
        </div>
    );
};

export default Detail;