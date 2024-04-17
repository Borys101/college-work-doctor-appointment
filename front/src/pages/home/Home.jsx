import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import './home.css';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import Spinner from '../../components/spinner/Spinner';

function Home() {
    const [ doctors, setDoctors ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const getData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/users/get-all-approved-doctors", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
            if (response.data.success) {
                setDoctors(response.data.data);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsError(true);
        }
    }
    useEffect(() => {
        getData();
    }, [])
    return (
        <Layout>
            {isError ? <ErrorMessage /> : null}
            {isLoading ? <Spinner /> : null}
            {doctors && <div className='container'>
                <div className='row'>
                    {doctors.map(doctor => (
                        <div className='d-flex mx-3 doctor-card mt-3 flex-wrap'>
                            <div>
                                <div className='mx-3 mt-3'><img src={doctor.photo} alt='Фото' width={109} height={123}/></div>
                            </div>
                            <div>
                                <h2 className='mb-0 mt-3'>{doctor.lastName} {doctor.firstName}</h2>
                                <h2 className='mb-1'>{doctor.fatherName}</h2>  
                                <div>{doctor.specialization}</div> 
                            </div>
                            <button onClick={() => navigate(`/book-appointment/${doctor._id}`)} className='make-appointment-button'>Записатися</button>
                        </div>
                    ))}
                </div>
            </div>}
        </Layout>
    );
}

export default Home;