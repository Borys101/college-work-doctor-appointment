import React, { useState } from 'react';
import { Button, FormControl, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import '../register/register.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import Spinner from '../../components/spinner/Spinner';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
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
        if (validEmail && formData.password) {
            try {
                setIsLoading(true);
                const response = await axios.post('/api/users/login', formData);
                if (response.data.success) {
                    localStorage.setItem("token", response.data.data);
                    navigate("/");
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
                    <h1 className='card-title'>З поверненням</h1>
                    <FormControl>
                        <TextField type='email' name='email' size='small' label="Електрона пошта" placeholder="Електрона пошта" className='mt-3 mb-3' onChange={handleChange} error={errors.email}></TextField>
                        <TextField type='password' name='password' size='small' label="Пароль" placeholder="Пароль" className='mt-3 mb-3' onChange={handleChange} error={errors.password}></TextField>
                        <Button color='primary' variant='contained' className='mt-4' type='submit' onClick={handleSubmit}>Увійти</Button>
                        <Link to="/register" className='mt-2 text-center'>Не маєте акаунта? Натисніть, щоб зареєструватися</Link>
                    </FormControl>
                </div>
            )}
        </div>
    );
}

export default Login;