import { Box, Modal, Button, IconButton, Grid, TextField } from "@mui/material";
import {  Close as CloseIcon } from '@mui/icons-material';
import './modalPrescriptions.css';

export default function ModalPrescription(props) {
  const { isOpen, handleOpen, handleClose, date, doctorPrescriptions } = props;

    return (
      <div>
        <Button color="primary" variant="outlined" className='mt-2 button-prescriptions' onClick={handleOpen}>{date}</Button>
        <Modal
          open={isOpen}
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
          {doctorPrescriptions.slice(0, -1).map((info, index) => (
            <div>
              <div className="drug-flex-container">
                <TextField className={index === 0 ? "mt-3" : null} name="drugName" value={info.drugName} label="Назва препарату" placeholder="Назва препарату" fullWidth size="small" disabled />
                <TextField className={index === 0 ? "mt-3" : null} name="dosage" value={info.dosage} label="Дозування" placeholder="Дозування" size="small" fullWidth disabled/>
              </div>
              <TextField className="mt-3" name="takingRules" value={info.takingRules} label="Інструкції" placeholder="Інструкції з використання" fullWidth size="small" disabled />
              <hr className='hr-drugs-line' />
            </div>
          ))}
          </Box>
        </Modal>
      </div>
    );
  }