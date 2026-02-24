import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './Pages.css';

const Home = () => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/objects')
            .then(response => {
                setObjects(response.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.status) {
                        case 404:
                            setError('Ресурс не найден (404).');
                            break;
                        case 500:
                            setError('Внутренняя ошибка сервера (500).');
                            break;
                        default:
                            setError(`Ошибка сервера (${err.response.status}).`);
                    }
                } else {
                    setError('Ошибка загрузки данных с сервера.');
                }
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Объекты охраны</h1>

            {error && <p className="error-message">{error}</p>}

            <div className="cards-grid">
                {objects.map(obj => (
                    <div key={obj.id} className="card">
                        <h3>{obj.name}</h3>
                        <p><strong>Тип:</strong> {obj.type}</p>
                        <p><strong>Адрес:</strong> {obj.address}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;