import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import BallotIcon from '@mui/icons-material/Ballot';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import './layout.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge } from '@mui/material';

function Layout({ children }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();
    const userMenu = [
        {
            name: "Головна",
            path: "/",
            icon: <HomeIcon />
        },
        {
            name: "Записи",
            path: "/appointments",
            icon: <BallotIcon />
        },
    ];

    const adminMenu = [
        {
            name: "Головна",
            path: "/",
            icon: <HomeIcon />
        },
        {
            name: "Додати лікаря",
            path: "/apply-doctor",
            icon: <PersonAddAlt1Icon />
        },
        {
            name: "Користувачі",
            path: "/admin/users",
            icon: <PeopleOutlineIcon />
        },
        {
            name: "Лікарі",
            path: "/admin/doctors",
            icon: <LocalHospitalIcon />
        },
    ];

    const doctorMenu = [
        {
            name: "Головна",
            path: "/",
            icon: <HomeIcon />
        },
        {
            name: "Записи",
            path: "/doctor/appointments",
            icon: <BallotIcon />
        },
        {
            name: "Профіль",
            path: `/doctor/profile/${user?._id}`,
            icon: <PersonIcon />
        },
    ];

    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className={`${collapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                    <div className="sidebar-header">
                        <h1 className={`${collapsed && "logo-collapsed"}`}>HEALTH</h1>
                    </div>
                    <div className="menu">
                        {menuToBeRendered.map(menu => {
                            const isActive = location.pathname === menu.path;
                            return <div className={`d-flex menu-item ${isActive && "active-menu-item"}`}>
                                {menu.icon}
                                {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                            </div>
                        })}
                        <div className='d-flex menu-item' onClick={() => {
                            localStorage.clear();
                            navigate("/login")
                        }}>
                            <LogoutIcon />
                            {!collapsed && <Link to="/login">Вийти</Link>}
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className="header">
                        {collapsed ? (
                            <div onClick={() => setCollapsed(false)}>
                                <MenuIcon className='header-action-icon' />
                            </div>
                        ) : (
                            <div onClick={() => {
                                setCollapsed(true);
                            }}>
                                <CloseIcon className='header-action-icon' />
                            </div>
                        )}
                        <div className="d-flex align-items-center px-4">
                            <div className='mx-4' onClick={() => navigate("/notifications")}>
                                <Badge badgeContent={user?.unseenNotifications.length} color="primary">
                                    <NotificationsIcon className='header-action-icon' />
                                </Badge>

                            </div>
                            <Link className='anchor' to="/profile">{user?.name}</Link>
                        </div>
                    </div>
                    <div className="body">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Layout;