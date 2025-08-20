import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import api from "../../services/axios"
import CustomModal from "../mod/CustomModal"


// Estilo para o contêiner do modal
const modalContainerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Responsividade para telas menores
  maxWidth: 400, // Largura máxima para telas maiores
  bgcolor: 'white',
  borderRadius: '15px', // Bordas arredondadas
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Sombra suave
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const RecoveryModal = ({ open, onClose, email, modalInfo, setModalInfo }) => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState({ password: "", confirmPassword: "" });
  const [step, setStep] = useState(1);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleValidateCode = async () => {
    try {
      await api.postValidateRecoveryCode({ email, code });
      setModalInfo({
        open: true, // Adicionado para abrir o CustomModal
        title: "Sucesso!",
        message: "Código validado. Agora digite sua nova senha.",
        isSuccess: true,
        type: "success",
        onClose: () => { // Adicionado o onClose para fechar o CustomModal
            setModalInfo({ ...modalInfo, open: false });
            setStep(2);
        }
      });
      // setStep(2); // Removido daqui, pois será chamado no onClose do CustomModal
    } catch (error) {
      setModalInfo({
        open: true, // Adicionado para abrir o CustomModal
        title: "Erro!",
        message: error.response?.data?.error || "Código inválido.",
        isSuccess: false,
        type: "error",
        onClose: () => setModalInfo({ ...modalInfo, open: false }) // Adicionado o onClose para fechar o CustomModal
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.postRecoveryPassword({ email, password: newPassword.password, confirmPassword: newPassword.confirmPassword });
      setModalInfo({
        open: true, 
        title: "Sucesso!",
        message: "Senha alterada com sucesso.",
        isSuccess: true,
        type: "success",
        onClose: () => {
            setModalInfo({ ...modalInfo, open: false });
            onClose();
            window.location.href = '/login';
        }
      });
      // onClose(); // Removido daqui, pois será chamado no onClose do CustomModal
    } catch (error) {
      setModalInfo({
        open: true, // Adicionado para abrir o CustomModal
        title: "Erro!",
        message: error.response?.data?.error || "Erro ao redefinir senha.",
        isSuccess: false,
        type: "error",
        onClose: () => setModalInfo({ ...modalInfo, open: false }) // Adicionado o onClose para fechar o CustomModal
      });
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <Box sx={modalContainerStyle}>
          {/* Este título será o título principal do modal de recuperação, não o do alerta */}
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="#333"
            fontWeight="bold"
            mb={1}
            textAlign="center"
          >
            Redefinir Senha
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, textAlign: 'center', color: '#666' }}
          >
            {step === 1 ? 'Digite o código de verificação enviado para seu e-mail.' : 'Crie sua nova senha.'}
          </Typography>

          {step === 1 && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <TextField
                fullWidth
                label="Código de Verificação"
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleValidateCode}
                sx={{
                  "&.MuiButton-root": {
                    border: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "rgba(200, 0, 0, 1)",
                    },
                  },
                  color: "white",
                  backgroundColor: "rgba(255, 0, 0, 1)",
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 8,
                  textTransform: "none",
                }}
              >
                Validar Código
              </Button>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Nova Senha"
                type={mostrarSenha ? "text" : "password"}
                id="new-password"
                value={newPassword.password}
                onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setMostrarSenha((prev) => !prev)}
                        edge="end"
                      >
                        {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Nova Senha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                id="confirm-new-password"
                value={newPassword.confirmPassword}
                onChange={(e) => setNewPassword({...newPassword, confirmPassword: e.target.value})}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                        edge="end"
                      >
                        {mostrarConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleResetPassword}
                sx={{
                  "&.MuiButton-root": {
                    border: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "rgba(200, 0, 0, 1)",
                    },
                  },
                  color: "white",
                  backgroundColor: "rgba(255, 0, 0, 1)",
                  height: 40,
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 8,
                  textTransform: "none",
                }}
              >
                Redefinir Senha
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Usando o CustomModal para exibir as mensagens de alerta */}
      <CustomModal
        open={modalInfo.open}
        onClose={modalInfo.onClose}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </>
  );
};

export default RecoveryModal;
