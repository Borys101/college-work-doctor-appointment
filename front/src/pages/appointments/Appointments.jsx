import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';

function Appointments() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setIsError] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const getDoctorsData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/users/get-appointments-by-user-id", {
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
        getDoctorsData();
    }, []);
    return (
        <Layout>
            <TableContainer component={Paper}>
                <Table aria-label="simple table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>ПІБ лікаря</StyledTableCell>
                            <StyledTableCell align="center">Номер телефону</StyledTableCell>
                            <StyledTableCell align="center">Дата, час</StyledTableCell>
                            <StyledTableCell align="center">Статус</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments?.map((appointment) => (
                            <TableRow key={appointment.name}>
                                <TableCell component="th" scope="row" align='center'>
                                    {appointment.doctorInfo.lastName} {appointment.doctorInfo.firstName} {appointment.doctorInfo.fatherName}
                                </TableCell>
                                <TableCell align="center">{appointment.doctorInfo.phoneNumber}</TableCell>
                                <TableCell align="center">{moment(appointment.date).format('DD-MM-YYYY')} {moment(appointment.time).format('HH:mm')}</TableCell>
                                <TableCell align="center">{appointment.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    );
}

export default Appointments;