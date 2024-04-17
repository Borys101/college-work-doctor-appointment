import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'
import './bookAppointment.css';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import toast from 'react-hot-toast';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import dayjs from 'dayjs';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import Spinner from '../../components/spinner/Spinner';
function BookAppointment() {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const [ doctor, setDoctor ] = useState(null);
    const [ date, setDate ] = useState();
    const [ time, setTime ] = useState();
    const [ timesBooked, setTimesBooked ] = useState([]);
    const params = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const getDoctorData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/doctor/get-doctor-info-by-id", { doctorId: params.doctorId }, {
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

    const bookNow = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/users/book-appointment", {
                doctorId: params.doctorId,
                userId: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setIsLoading(false);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/appointments");
            }
        } catch (error) {
            toast.error("Помилка у бронюванні");
            setIsLoading(false);
        }
    }
    const isAvailableDayOfWeek = (date) => {
        const dayOfWeek = date.weekdayShort;
        return !doctor.days.includes(dayOfWeek);
      };
    const isAvailableTime = async () => {
        try {
            const response = await axios.post("/api/users/get-booked-appointment-by-date", { date: date, doctorId: doctor._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.success) {
                const data = response.data.data;
                data.map(elem => timesBooked.push(dayjs(elem.time).format('HH:mm')));
                
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    const isTimeDisabled = (timeValue) => {
        const formattedValue = timeValue.format('HH:mm');
        return timesBooked.includes(formattedValue);
    }
    useEffect(() => {
        getDoctorData();
    }, [user])
    useEffect(() => {
        isAvailableTime();
    }, [date])
    return (
        <Layout>
            {isError ? <ErrorMessage /> : null}
            {isLoading ? <Spinner /> : null}
            {!isLoading && !isError && doctor && (
                <div className='booking'>
                    <div>
                        <h2 className='page-title'>{doctor.lastName} {doctor.firstName} {doctor.fatherName}</h2>
                        <p className='working-time'>{moment(doctor.startOfWork).format('HH:mm')}-{moment(doctor.endOfWork).format('HH:mm')}</p>
                        <p className='booking-choose'>Оберіть час запису</p>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='uk'>
                                <DemoContainer components={['TimePicker']}>
                                    <DatePicker
                                        type='text'
                                        name='startOfWork'
                                        size='small'
                                        label='Оберіть дату'
                                        className='date-picker'
                                        shouldDisableDate={isAvailableDayOfWeek}
                                        disablePast
                                        onChange={value => setDate(`${value.c.day}-${value.c.month}-${value.c.year}`)}
                                            />
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                        type='text'
                                        name='startOfWork'
                                        size='small'
                                        label='Оберіть час'
                                        className='time-picker'
                                        minTime={dayjs().hour(new Date(doctor.startOfWork).getHours()).minute(0).second(0)}
                                        maxTime={dayjs().hour(new Date(doctor.endOfWork).getHours() - 1).minute(30)}
                                        shouldDisableTime={isTimeDisabled}
                                        ampm={false}
                                        timeSteps={{ minutes: 30 }}
                                        onChange={value => {
                                            setTime(value.format("HH:mm"))
                                        }}
                                            />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <button className='booking-button' onClick={bookNow}>Записатися</button>
                    </div>
                    <div>
                        <div><img src={doctor.photo} alt='Фото' width={400} height={300}/></div>
                        <div className='doctor-information'>
                            <h4>Інформація про лікаря</h4>
                            <p>Спеціалізація: {doctor.specialization}</p>
                            <p>Досвід роботи (роки): {doctor.experience}</p>
                            <p>Email: {doctor.email}</p>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default BookAppointment;