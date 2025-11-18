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
        open: true,
        title: "Sucesso!",
        message: "Código validado. Agora digite sua nova senha.",
        isSuccess: true,
        type: "success",
        onClose: () => {
          setModalInfo({ ...modalInfo, open: false });
          setStep(2);
        }
      });
    } catch (error) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: error.response?.data?.error || "Código inválido.",
        isSuccess: false,
        type: "error",
        onClose: () => setModalInfo({ ...modalInfo, open: false })
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.postVerifyRecoveryPassword({ email, password: newPassword.password, confirmPassword: newPassword.confirmPassword }); 
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
    } catch (error) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: error.response?.data?.error || "Erro ao redefinir senha.",
        isSuccess: false,
        type: "error",
        onClose: () => setModalInfo({ ...modalInfo, open: false })
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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            
            // Definição para Desktop (padrão)
            width: 400, 
            maxWidth: 400, 
            p: 4, 
            
            bgcolor: 'white',
            borderRadius: '15px', 
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            
            // 🎯 MEDIA QUERY TRADICIONAL PARA MOBILE (sobrescreve o padrão)
            '@media (max-width: 600px)': {
              width: '80%', // Força 80% da largura da tela
              p: 3,         // Reduz o padding para 24px
            },
          }}
        >
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
                placeholder="Código de Verificação"
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                  },
                  '& .MuiInputLabel-root': {
                    display: 'none', 
                  },
                  '& .MuiInputBase-input': {
                    '@media (max-width: 600px)': {
                        padding: '10px 14px', 
                    },
                    textAlign: 'center', 
                    fontSize: '1rem', 
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                  },
                  '& .MuiInputBase-input::placeholder': {
                      textAlign: 'center',
                      color: 'rgba(0, 0, 0, 0.4)',
                      opacity: 1,
                  }
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
                  '& .MuiInputBase-input': {
                      '@media (max-width: 600px)': {
                          padding: '10px 14px', 
                      },
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
                  '& .MuiInputBase-input': {
                      '@media (max-width: 600px)': {
                          padding: '10px 14px', 
                      },
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