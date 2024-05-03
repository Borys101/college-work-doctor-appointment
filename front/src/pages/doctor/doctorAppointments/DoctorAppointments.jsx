import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import Spinner from '../../../components/spinner/Spinner';
import ErrorMessage from '../../../components/errorMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import './doctorAppointments.css';

function DoctorAppointments() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const getAppointmentsData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            const response = await axios.get("/api/doctor/get-appointments-by-doctor-id", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (error) {
            setIsLoading(false);
            setIsError(true);
        }
    }
    const changeAppointmentStatus = async (appointment, status) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/doctor/change-appointment-status", 
                { appointmentId: appointment._id, status: status },
                {headers : {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }}
            )
            setIsLoading(false);
            if (response.data.success) {
                getAppointmentsData();
            }
        } catch (error) {
            setIsLoading(false);
        }
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: '#1976D3',
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
    useEffect(() => {
        getAppointmentsData();
    }, []);
    return (
        <Layout>
            {isError ? <ErrorMessage /> : null}
            {isLoading ? <Spinner /> : null}
            {!isLoading && <TableContainer component={Paper}>
                <Table aria-label="simple table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Ім'я пацієнта</StyledTableCell>
                            <StyledTableCell align="center">Електронна пошта</StyledTableCell>
                            <StyledTableCell align="center">Дата, час</StyledTableCell>
                            <StyledTableCell align="center">Статус</StyledTableCell>
                            <StyledTableCell align="center">Дії</StyledTableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {appointments?.map((appointment) => (
                                <TableRow key={appointment.name} onClick={() => navigate(`detail-info/${appointment._id}`)} className='appointment-row'>
                                    <TableCell component="th" scope="row" align='center'>
                                        {appointment.userInfo.name}
                                    </TableCell>
                                    <TableCell align="center">{appointment.userInfo.email}</TableCell>
                                    <TableCell align="center">{moment(appointment.date).format('DD-MM-YYYY')} {moment(appointment.time).format('HH:mm')}</TableCell>
                                    <TableCell align="center">{appointment.status}</TableCell>
                                    <TableCell align="center">
                                        {appointment.status === "Очікує" && (
                                            <div className='d-flex justify-content-center'>
                                                <span className='anchor px-2' onClick={() => changeAppointmentStatus(appointment, "Схвалено")}>Схвалити</span>
                                                <span className='anchor' onClick={() => changeAppointmentStatus(appointment, "Заблоковано")}>Заблокувати</span>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </TableContainer>}
        </Layout>
    );
}

export default DoctorAppointments;