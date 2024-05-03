import { Box, Modal, Button, IconButton, Grid, TextField } from "@mui/material";
import { Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import './modalPills.css';
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ModalPills(props) {
    const { open, handleOpen, handleClose, currentAppointmentId, doctorPrescription } = props;
    const [prescriptions, setPrescriptions] = useState(doctorPrescription || [{ drugName: "", dosage: "", takingRules: "", index: 0 }]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const addDrugsButtonClick = () => {
      setPrescriptions(prevState => [...prevState, { drugName: "", dosage: "", takingRules: "", index: prevState.length }]);
    }

    const deleteDrug = (indexToDelete) => {
      const updatedDrugsInfo = prescriptions.filter(info => info.index !== indexToDelete);
      const updatedDrugsInfoWithNewIndex = updatedDrugsInfo.map((info, index) => ({ ...info, index }));
      setPrescriptions(updatedDrugsInfoWithNewIndex);
    }

    const handlePrescriptionChange = (e, index) => {
      const { value, name } = e.target;
      setPrescriptions(prevState => {
        const initState = [ ...prevState ];
        initState[index][name] = value;
        return initState;
      })
    }

    const savePrescriptions = async () => {
      try {
        setIsButtonDisabled(true);
        const correctPrescriptions = prescriptions.filter(presc => presc.drugName && presc.dosage && presc.takingRules);
        const response = await axios.post("/api/doctor/save-prescriptions", { currentAppointmentId, correctPrescriptions }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setIsButtonDisabled(false);
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        setIsButtonDisabled(false);
        toast.error(error.message);
      }
    }

    return (
      <div>
        <Button color="primary" variant="outlined" className='mt-3 button-prescriptions' onClick={handleOpen}>Додати рецепти</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='modal-content' sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Grid container justifyContent="flex-end">
              <Grid item>
                <IconButton 
                  aria-label="close" 
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
          </Grid>
          {prescriptions.map((info, index) => (
            <div>
              <div className="drug-flex-container">
                <TextField className={index === 0 ? "mt-3" : null} name="drugName" value={prescriptions[index].drugName} label="Назва препарату" placeholder="Назва препарату" fullWidth size="small" required onChange={(e) => handlePrescriptionChange(e, index)} />
                <TextField className={index === 0 ? "mt-3" : null} name="dosage" value={prescriptions[index].dosage} label="Дозування" placeholder="Дозування" size="small" fullWidth required onChange={(e) => handlePrescriptionChange(e, index)}/>
              </div>
              <TextField className="mt-3" name="takingRules" value={prescriptions[index].takingRules} label="Інструкції" placeholder="Інструкції з використання" fullWidth size="small" required onChange={(e) => handlePrescriptionChange(e, index)}/>
              <div className="d-flex justify-content-end">
                <Button variant="outlined" className="mt-3 delete-drug-button" size="small" startIcon={<DeleteIcon />} onClick={(e) => deleteDrug(index)}>Видалити</Button>
              </div>
              <hr className='hr-drugs-line' />
            </div>
          ))}
          <div className="drug-flex-container">
            <Button type="submit" variant="text" fullWidth onClick={addDrugsButtonClick}>Додати препарат</Button>
            <Button type="submit" variant="contained" fullWidth onClick={savePrescriptions} disabled={isButtonDisabled}>Зберегти рецепти</Button>
          </div>
          </Box>
        </Modal>
      </div>
    );
  }