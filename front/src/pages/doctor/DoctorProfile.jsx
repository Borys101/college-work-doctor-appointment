import React, { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import dayjs from 'dayjs';
import Spinner from '../../components/spinner/Spinner';

function DoctorProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [ doctor, setDoctor ] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { user } = useSelector(state => state.user);
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: doctor
    });
    const allDays = [{ name: "Пн", value: "Mon" },
    { name: "Вт", value: "Tue" },
    { name: "Cр", value: "Wed" },
    { name: "Чт", value: "Thur" },
    { name: "Пт", value: "Fri" },];
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/doctor/update-doctor-profile", {
                ...data,
                email: user.email
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setIsLoading(false);
            if (response.data.success) {
                navigate("/")
            } else {
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong");
        }
    }
    const getDoctorData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/doctor/get-doctor-info-by-user-id", { email: user.email }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                dispatch(setDoctor(response.data.data));
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getDoctorData();
    }, [user])
    useEffect(() => {
        if (doctor) {
          Object.keys(doctor).forEach(key => {
            setValue(key, doctor[key]);
          });
        }
      }, [doctor, setValue]);
    return (
        <Layout>
            {isLoading ? <Spinner /> : null}
            {!isLoading && <div>
                <h1 className='mx-3 pt-2'>Профіль лікаря</h1>
            <hr className='hr-line' />
            {doctor && <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className='mx-3 text-secondary '>Персональна інформація</h2>
                <div className='container'>
                    <div className='row'>
                        <Controller
                            name='firstName'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='firstName'
                                    size='small'
                                    placeholder="Ім'я"
                                    className='mx-3 col-sm' />)}
                        />
                        <Controller
                            name='lastName'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='lastName'
                                    size='small'
                                    placeholder="Прізвище"
                                    className='mx-3 col-sm' />)}
                        />
                        <Controller
                            name='fatherName'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='fatherName'
                                    size='small'
                                    placeholder="По-батькові"
                                    className='mx-3 col-sm' />)}
                        />
                    </div>
                    <div className='row mt-3'>
                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='email'
                                    name='email'
                                    size='small'
                                    placeholder="Електрона пошта"
                                    className='mx-3 col-sm' />)}
                        />
                        <Controller
                            name='phoneNumber'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='phoneNumber'
                                    size='small'
                                    placeholder="Номер телефону"
                                    className='mx-3 col-sm' />)}
                        />
                        <Controller
                            name='photo'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='photo'
                                    size='small'
                                    placeholder='Посилання на фотографію'
                                    className='mx-3 col-sm'
                                />)}
                        />
                    </div>
                </div>
                <hr className='hr-line' />
                <h2 className='mx-3 text-secondary '>Професійна інформація</h2>
                <div className="container">
                    <div className='row'>
                        <Controller
                            name='specialization'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='specialization'
                                    size='small'
                                    placeholder="Спеціалізація"
                                    className='mx-3 col-sm' />)}
                        />
                        <Controller
                            name='experience'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='experience'
                                    size='small'
                                    placeholder="Досвід роботи"
                                    className='mx-3 col-sm' />)}
                        />
                        <Controller
                            name='placeOfStudy'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type='text'
                                    name='placeOfStudy'
                                    size='small'
                                    placeholder="Місце навчання"
                                    className='mx-3 col-sm' />)}
                        />
                    </div>
                </div>
                <hr className='hr-line' />
                <h2 className='mx-3 text-secondary '>Робочі дні та часи</h2>
                <div className='container'>
                    <div className='row'>
                        <Controller
                            name='days'
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <FormGroup row className='col-sm'>
                                    {allDays.map(item => (
                                        <FormControlLabel
                                            key={item.value}
                                            label={item.name}
                                            control={(
                                                <Checkbox
                                                    name={`days[${item.value}]`}
                                                    checked={value ? value.includes(item.value) : false}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        const selectedValue = item.value;

                                                        let updatedValue = [];
                                                        if (isChecked) {
                                                            updatedValue = [...(value || []), selectedValue];
                                                        } else {
                                                            updatedValue = (value || []).filter(val => val !== selectedValue);
                                                        }

                                                        onChange(updatedValue);
                                                    }}
                                                />
                                            )}
                                        />
                                    ))}
                                </FormGroup>
                            )}
                        />
                        <Controller
                            name='startOfWork'
                            control={control}
                            render={({ field }) => (
                                <div className='mx-3 col-sm'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker {...field}
                                            type='text'
                                            name='startOfWork'
                                            size='small'
                                            value={field.value ? dayjs(field.value) : null}
                                            format='HH:mm'
                                            ampm={false}
                                             />
                                    </DemoContainer>
                                </LocalizationProvider>
                                </div>)}
                        />
                        <Controller
                            name='endOfWork'
                            control={control}
                            render={({ field }) => (
                                <div className='mx-3 col-sm'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker {...field}
                                            type='text'
                                            name='endOfWork'
                                            size='small'
                                            format='HH:mm'
                                            ampm={false}
                                            value={field.value ? dayjs(field.value) : null}
                                             />
                                    </DemoContainer>
                                </LocalizationProvider>
                                </div>)}
                        />
                    </div>
                    <div className='d-flex flex-row-reverse mt-3 mx-1'>
                        <Button
                            type='submit'
                            variant='contained'
                            size='medium'
                        >
                            Готово
                        </Button>
                    </div>
                </div>
            </form>}
                </div>}
        </Layout>
    );
}

export default DoctorProfile;