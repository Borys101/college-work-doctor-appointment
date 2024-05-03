import React from 'react';
import Layout from '../../../components/layout/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMessage from '../../../components/errorMessage/ErrorMessage';
import Spinner from '../../../components/spinner/Spinner';
import { useParams } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import moment from 'moment';
import './appointmentPage.css';
import Textarea from '@mui/joy/Textarea';
import ModalPills from '../../../components/modalPills/ModalPills';
import toast from 'react-hot-toast';

const AppointmentPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [doctorResponse, setDoctorResponse] = useState({
        complaints: '',
        diagnosis: '',
        diseases: '',
        allergies: '',
        examinationResult: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDoctorResponse(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const params = useParams();

    const getAppointmentData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await axios.post("/api/doctor/get-appointment-info", { appointmentId: params.appointmentId}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                setCurrentAppointment(response.data.data[0]);
                setDoctorResponse(response.data.data[0].doctorResponse);
            }
        } catch (error) {
            setIsLoading(false);
            setIsError(true);
        }
    }

    const saveResponse = async () => {
        try {
            setIsButtonDisabled(true);
            setIsError(false);
            const response = await axios.post("/api/doctor/save-response", { doctorResponse, currentAppointment }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsButtonDisabled(false);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            setIsButtonDisabled(false);
            setIsError(true);
        }
    }

    useEffect(() => {
        getAppointmentData();
    }, []);

    return (
        <Layout>
            {isError ? <ErrorMessage /> : null}
            {isLoading ? <Spinner /> : null}
            {!isLoading && <div>
                <h1 className='mx-3 pt-2'>Інформація про запис</h1>
                <hr className='hr-line' />
                <Grid container spacing={2} className='patient-info'>
                    <Grid xs={5}>
                        <h2 className='text-secondary'>Інформація про пацієнта</h2>
                        <div>
                            <p>Ім'я: {currentAppointment.userInfo?.name}</p>
                            <p>Email: {currentAppointment.userInfo?.email}</p>
                            <p>Дата: {moment(currentAppointment.date).format('DD-MM-YYYY')}</p>
                            <p>Час: {moment(currentAppointment.time).format('HH:mm')}</p>
                            <p>Коментар: {currentAppointment.comments}</p>
                            <Button color='primary' variant='contained' className='mt-5' onClick={saveResponse} disabled={isButtonDisabled}>Зберегти зміни</Button>
                        </div>
                    </Grid>
                    <Grid xs={7}>
                        <h2 className='text-secondary'>Опис</h2>

                            <div className='d-flex gap-4'>
                                <Textarea placeholder="Скарги" className="input-responses" minRows={3} name='complaints' size='lg' value={doctorResponse?.complaints} onChange={handleChange}></Textarea>
                                <Textarea placeholder="Діагноз" className="input-responses" minRows={3} name='diagnosis' value={doctorResponse?.diagnosis} onChange={handleChange}></Textarea>
                            </div>
                            <div className='d-flex mt-3 gap-4'>    
                                <Textarea placeholder="Tbs, венеричні захворювання, діабет, гепатит..." className='input-responses' size='lg' minRows={3} name='diseases' value={doctorResponse?.diseases} onChange={handleChange}></Textarea>
                                <Textarea placeholder="Алергії" className='input-responses' minRows={3} name='allergies' value={doctorResponse?.allergies} onChange={handleChange}></Textarea>
                            </div>
                            <Textarea placeholder="Результат огляду" className='mt-3 input-result' size='lg' minRows={3} name='examinationResult' value={doctorResponse?.examinationResult} onChange={handleChange}></Textarea>
                            <ModalPills open={open} handleOpen={handleOpen} handleClose={handleClose} currentAppointmentId={currentAppointment._id} doctorPrescription={doctorResponse.prescriptions}/>

                    </Grid>
                </Grid>
             </div>
            }
        </Layout>
    );
};

export default AppointmentPage;