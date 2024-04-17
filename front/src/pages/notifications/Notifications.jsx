import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Tab, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../../redux/userSlice';
import Spinner from '../../components/spinner/Spinner';

function Notifications() {
    const [ currentTabIndex, setCurrentTabIndex ] = useState(0);
    const { user } = useSelector(state => state.user);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const markAllAsSeen = async () => {
         try {
            setIsLoading(true);
            const response = await axios.post("/api/users/mark-all-notifications-as-seen", { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                dispatch(setUser(response.data.data));
            } else {
                toast.error(response.data.message)
            }
         } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong")
         }
    }
    const deleteAll = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/users/delete-all-notifications", { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                dispatch(setUser(response.data.data));
            }
         } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong")
         }
    }

    const handleTabChange = (e, tabIndex) => {
        setCurrentTabIndex(tabIndex);
    }
    return (
        <Layout>
            {isLoading ? <Spinner /> : null}
            {!isLoading && <div>
                <h1 className="page-title">Повідомлення</h1>
            <Tabs value={currentTabIndex} onChange={handleTabChange}>
                <Tab label="Непрочитані"></Tab>
                <Tab label="Прочитані"></Tab>
            </Tabs>
            {currentTabIndex === 0 && (
                <div className="d-flex justify-content-end mx-3">
                    <p className="anchor" onClick={() => markAllAsSeen() }>Позначити усі як прочитані</p>
                </div>
            )}
            {currentTabIndex === 0 && (
                user?.unseenNotifications.map(notification => (
                    <div className="card-p-2">
                        <div className='card-text' onClick={() => navigate(notification.onClickPath)}>{notification.message}</div>
                    </div>
                ))
            )}
            {currentTabIndex === 1 && (
                <div className="d-flex justify-content-end mx-3">
                    <p className="anchor" onClick={() => deleteAll()}>Видалити всі</p>
                </div>
            )}
            {currentTabIndex === 1 && (
                user?.seenNotifications.map(notification => (
                    <div className="card-p-2">
                        <div className='card-text' onClick={() => navigate(notification.onClickPath)}>{notification.message}</div>
                    </div>
                ))
            )}
                </div>}
        </Layout>
    );
}

export default Notifications;