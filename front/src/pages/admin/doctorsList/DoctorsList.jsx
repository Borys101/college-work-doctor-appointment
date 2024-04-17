import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import Spinner from '../../../components/spinner/Spinner';

function DoctorsList() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setIsError] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const getDoctorsData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/admin/get-all-doctors", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    const deleteDoctorAccess = async (doctor) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/admin/delete-doctor-access", { email: doctor.email, doctorId: doctor._id }, { headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            } })
            setIsLoading(false);
            if (response.data.success) {
                getDoctorsData();
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
            {isLoading ? <Spinner /> : null}
            {!isLoading && <TableContainer component={Paper}>
                <Table aria-label="simple table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>ПІБ</StyledTableCell>
                            <StyledTableCell align="center">Електрона пошта</StyledTableCell>
                            <StyledTableCell align="center">Номер телефону</StyledTableCell>
                            <StyledTableCell align="center">Дії з лікарем</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors?.map((doctor) => (
                            <TableRow key={doctor.name}>
                                <TableCell component="th" scope="row" align='center'>
                                    {doctor.lastName} {doctor.firstName} {doctor.fatherName}
                                </TableCell>
                                <TableCell align="center">{doctor.email}</TableCell>
                                <TableCell align="center">{doctor.phoneNumber}</TableCell>
                                <TableCell align="center"><div className='anchor' onClick={() => deleteDoctorAccess(doctor)}>Видалити права лікаря</div></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Layout>
    );
}

export default DoctorsList;