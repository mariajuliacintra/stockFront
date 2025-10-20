import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress
  } from '@mui/material';
  import { useState } from 'react';
  import api from '../../services/axios';
  
  const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    p: 4,
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };
  
  
  const DeleteUserModal = ({ open, onClose, user, onSuccess, onAlert }) => {
    const registerFieldStyles = getRegisterFieldStyles();
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
        if (!user || !user.idUser) {
            onAlert('Não foi possível encontrar o usuário para exclusão.', 'error'); 
            onClose(); 
            return;
        }
  
        setLoading(true);
        try {
            const response = await api.deleteUser(user.idUser);
  
            if (response.data.success) {
                onAlert(response.data.message || 'Usuário excluído com sucesso!', 'success');
                onSuccess();
                onClose(); 
            } else {
                onAlert(response.data.error || 'Erro ao excluir usuário.', 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            onAlert(error.response?.data?.error || 'Erro interno do servidor ao tentar excluir o usuário.', 'error');
        } finally {
            setLoading(false);
        }
    };
  
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyles}>
                <Typography variant="h6" component="h2">
                    Confirmar Exclusão
                </Typography>
                
                <Typography sx={{ mt: 2 }}>
                    Tem certeza que deseja excluir o usuário 
                    <strong style={{ marginLeft:"10px" }}>
                        {user?.name}
                    </strong>
                  ? Esta ação <strong style={{ fontWeight: 'bold' }}>não pode ser desfeita</strong>.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    
                    {/* BOTÃO CANCELAR */}
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        disabled={loading}
                        sx={{
                            ...registerFieldStyles.buttonToLogin,
                            border: '1px solid rgba(255, 0, 0, 1)',
                            color: 'rgba(255, 0, 0, 1)',
                            backgroundColor: 'transparent',
                            borderRadius: '8px', 
                            height: 30, 
                            fontWeight: 600,
                            fontSize: 14,
                            padding: '0 16px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.04)',
                                border: '1px solid rgba(255, 0, 0, 1)',
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    
                    {/* BOTÃO EXCLUIR */}
                    <Button 
                        onClick={handleDelete} 
                        variant="contained" 
                        color="error" 
                        disabled={loading}
                        sx={{...registerFieldStyles.buttonCadastro, width: 'auto', padding: '0 16px', mt: 0}}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Excluir'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
  };
  
  // Funções de Estilo
  function getRegisterFieldStyles() {
    return {
        buttonCadastro: {
            "&.MuiButton-root": {
                border: "none",
                boxShadow: "none",
                "&:hover": {
                    backgroundColor: "rgba(200, 0, 0, 1)",
                },
            },
            color: "white",
            backgroundColor: "rgba(255, 0, 0, 1)",
            height: 30,
            fontWeight: 600,
            fontSize: 14,
            borderRadius: 8,
            textTransform: "none",
        },
        buttonToLogin: {
            color: "rgba(255, 0, 0, 1)",
            backgroundColor: "transparent",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            textTransform: "none",
        }
    };
  }
  
  export default DeleteUserModal;