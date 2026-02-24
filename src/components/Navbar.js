import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Главная</NavLink>
                <NavLink to="/detail" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Детали</NavLink>
                <NavLink to="/edit" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Редактирование</NavLink>
                <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Добавление</NavLink>
                <NavLink to="/delete" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Удаление</NavLink>
            </div>
            <button className="btn btn-danger navbar-logout" onClick={logout}>Выйти</button>
        </nav>
    );
};

export default Navbar;