import React, { useState } from 'react';
import { Box, Button, FormControl, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import './register.css'
import axios from 'axios';
import toast from 'react-hot-toast';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import Spinner from '../../components/spinner/Spinner';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: false,
        }));
    };

    const handleSubmit = async () => {
        const validEmail = validateEmail(formData.email);
        if (formData.name && validEmail && formData.password) {
            try {
                setIsLoading(true);
                const response = await axios.post('/api/users/register', formData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    navigate("/login");
                } else {
                    toast.error(response.data.message);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setIsError(true);
                toast.error("Щось пішло не так")
            }
        } else {
            setErrors({
                name: !formData.name,
                email: !validEmail,
                password: !formData.password,
            });
        }
    };
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };
    return (
        <div className='authentication'>
            {isError ? <ErrorMessage /> : null}
            {isLoading ? <Spinner /> : null}
            {!isError && !isLoading && (
                <div className='authentication-form card p-3'>
                    <h1 className='card-title'>Раді Вас Вітати</h1>
                    <FormControl>
                        <TextField type='text' name='name' size='small' label="Ім'я" placeholder="Ім'я" className='mt-3 mb-3' onChange={handleChange} error={errors.name}></TextField>
                        <TextField type='email' name='email' size='small' label="Електрона пошта" placeholder="Електрона пошта" className='mt-3 mb-3' onChange={handleChange} error={errors.email}></TextField>
                        <TextField type='password' name='password' size='small' label="Пароль" placeholder="Пароль" className='mt-3 mb-3' onChange={handleChange} error={errors.password}></TextField>
                        <Button color='primary' variant='contained' className='mt-4' type='submit' onClick={handleSubmit}>Зареєструватися</Button>
                        <Link to="/login" className='mt-2 text-center'>Вже маєте акаунт? Натисніть, щоб увійти</Link>
                    </FormControl>
                </div>
            )}
        </div>
    );
}

export default Register;