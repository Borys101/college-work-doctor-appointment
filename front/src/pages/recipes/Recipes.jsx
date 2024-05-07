import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import Spinner from '../../components/spinner/Spinner';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import './recipes.css';
import moment from 'moment';
import ModalPrescription from '../../components/modalPrescriptions/ModalPrescriptions';

const Recipes = () => {
    const [oldRecipes, setOldRecipes] = useState([]);
    const [newRecipes, setNewRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [openModalIndex, setOpenModalIndex] = useState(null);
    const handleOpen = (index) => setOpenModalIndex(index);
    const handleClose = () => setOpenModalIndex(null);

    const getRecipes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/users/get-recipes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false);
            if (response.data.success) {
                const currentDate = moment();
                response.data.data.forEach(recipe => {
                    const recipeDate = moment(recipe[recipe.length - 1]);
                    if (currentDate.diff(recipeDate, 'days') < 7) {
                        setNewRecipes(prevState => [...prevState, recipe]);
                    } else {
                        setOldRecipes(prevState => [...prevState, recipe]);
                    }
                });
            }
        } catch (error) {
            setIsLoading(false);
            setIsError(true);
        }
    }

    useEffect(() => {
        getRecipes();
    }, []);

    return (
        <Layout>
            {isLoading? <Spinner /> : null}
            {isError? <ErrorMessage /> : null}
            {newRecipes.length > 0 && (
            <>
                <h2 className='text-secondary mx-3'>Нові рецепти</h2>
                <hr className='hr-line mx-0' />
                <div className='d-flex mx-3 mt-3 flex-wrap'>
                {newRecipes.map((recipe, index) => (
                    <ModalPrescription key={index} isOpen={openModalIndex === index + recipe} handleOpen={() => handleOpen(index + recipe)}  handleClose={handleClose} date={moment(recipe[recipe.length - 1]).format('DD-MM-YYYY')} doctorPrescriptions={recipe}/>
                ))}
                </div>
            </>
            )}
            {oldRecipes.length > 0 && (
                <>
                    <h2 className='text-secondary mx-3 mt-4'>Старі рецепти</h2>
                    <hr className='hr-line mx-0' />
                    <div className='d-flex mx-3 mt-3 flex-wrap'>
                    {oldRecipes.map((recipe, index) => (
                        <ModalPrescription key={index} isOpen={openModalIndex === index + recipe} handleOpen={() => handleOpen(index + recipe)}  handleClose={handleClose} date={moment(recipe[recipe.length - 1]).format('DD-MM-YYYY')} doctorPrescriptions={recipe}/>
                    ))}
                    </div>
                </>
            )}
        </Layout>
    );
};

export default Recipes;