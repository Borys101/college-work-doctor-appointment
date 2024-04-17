import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import Spinner from '../../../components/spinner/Spinner';

function UsersList() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setIsError] = useState(false);
    const [users, setUsers] = useState([]);
    const getUsersData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/admin/get-all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    const blockUser = async (user) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/admin/delete-user", { deleteUserId: user._id, email: user.email }, { headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            } })
            setIsLoading(false);
            if (response.data.success) {
                getUsersData();
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
        getUsersData();
    }, []);
    return (
        <Layout>
            {isLoading ? <Spinner /> : null}
            {!isLoading && <TableContainer component={Paper}>
                <Table aria-label="simple table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Ім'я</StyledTableCell>
                            <StyledTableCell align="center">Електрона пошта</StyledTableCell>
                            <StyledTableCell align="center">Дата реєстрації</StyledTableCell>
                            <StyledTableCell align="center">Дії з користувачем</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.name}>
                                <TableCell component="th" scope="row" align='center'>
                                    {user.name}
                                </TableCell>
                                <TableCell align="center">{user.email}</TableCell>
                                <TableCell align="center">{moment(user.createdAt).format("DD-MM-YYYY")}</TableCell>
                                <TableCell align="center">{user.isAdmin ? null : <div className='anchor' onClick={() => blockUser(user)}>Заблокувати</div>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Layout>
    );
}

export default UsersList;