import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './Pages.css';

const dotToIso = (dotDate) => {
    if (!dotDate) return '';
    const parts = dotDate.split('.');
    if (parts.length !== 3) return dotDate;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const isoToDot = (isoDate) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setObject(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked
                : name === 'guardCount' ? Number(value)
                : name === 'lastInspection' ? isoToDot(value)
                : value
        }));
    };

    const validate = () => {
        if (!object.name.trim()) return 'Название не может быть пустым.';
        if (!object.address.trim()) return 'Адрес не может быть пустым.';
        if (!object.type.trim()) return 'Тип не может быть пустым.';
        if (object.guardCount < 0) return 'Количество охранников не может быть отрицательным.';
        if (!object.status.trim()) return 'Статус не может быть пустым.';
        if (!object.lastInspection) return 'Укажите дату последней проверки.';
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

        axios.put(`http://localhost:5000/objects/${id}`, object)
            .then(response => {
                setObject(response.data);
                navigate('/');
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.status) {
                        case 400:
                            setError('Некорректные данные. Проверьте введённые значения (400).');
                            break;
                        case 500:
                            setError('Внутренняя ошибка сервера (500). Попробуйте позже.');
                            break;
                        default:
                            setError(`Ошибка обновления (${err.response.status}).`);
                    }
                } else {
                    setError('Ошибка соединения с сервером.');
                }
                setLoading(false);
            });
    };

    if (loading) {
        return <Spinner />;
    }

    if (!id) {
        return (
            <div className="page-container">
                <h1 className="page-title">Выберите объект для редактирования</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="select-list">
                    {objects.map(obj => (
                        <Link to={`/edit/${obj.id}`} key={obj.id} className="select-item">
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
                <Link to="/edit" className="back-link">Назад</Link>
            </div>
        );
    }

    return (
        <div className="form-panel">
            <h1>Редактирование объекта</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Название:</label>
                <input type="text" name="name" value={object.name} onChange={handleChange} required />

                <label>Адрес:</label>
                <input type="text" name="address" value={object.address} onChange={handleChange} required />

                <label>Тип:</label>
                <input type="text" name="type" value={object.type} onChange={handleChange} required />

                <label>Количество охранников:</label>
                <input type="number" name="guardCount" value={object.guardCount} onChange={handleChange} required />

                <label>Статус:</label>
                <input type="text" name="status" value={object.status} onChange={handleChange} required />

                <label>Последняя проверка:</label>
                <input type="date" name="lastInspection" value={dotToIso(object.lastInspection)} onChange={handleChange} required />

                <div className="checkbox-row">
                    <input type="checkbox" name="hasAlarmSystem" checked={object.hasAlarmSystem || false} onChange={handleChange} />
                    <label style={{ margin: 0 }}>Сигнализация</label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                </div>
            </form>
            <Link to="/edit" className="back-link">Назад</Link>
        </div>
    );
};

export default Edit;