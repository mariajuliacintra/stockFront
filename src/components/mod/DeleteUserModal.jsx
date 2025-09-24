import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress
  } from '@mui/material';
  import { useState } from 'react';
  import api from '../../services/axios';
  
  // Estilos da Modal Box - Mantendo a consistência (15px de raio e box-shadow)
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
  
  // ALTERADO: Props alteradas para usar onAlert em vez de onError
  const DeleteUserModal = ({ open, onClose, user, onSuccess, onAlert }) => {
    const registerFieldStyles = getRegisterFieldStyles();
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
        if (!user || !user.idUser) {
            // CORRIGIDO: Chamando onAlert com severity 'error'
            onAlert('Não foi possível encontrar o usuário para exclusão.', 'error'); 
            onClose(); // Fecha em caso de erro de lógica
            return;
        }
  
        setLoading(true);
        try {
            const response = await api.deleteUser(user.idUser);
  
            if (response.data.success) {
                // CORRIGIDO: 1. Chamando onAlert com severity 'success'
                onAlert(response.data.message || 'Usuário excluído com sucesso!', 'success');
                // CORRIGIDO: 2. Chamando onSuccess para recarregar a lista
                onSuccess();
                // CORRIGIDO: 3. Fechando a modal após o sucesso
                onClose(); 
            } else {
                // CORRIGIDO: Chamando onAlert com severity 'error'
                onAlert(response.data.error || 'Erro ao excluir usuário.', 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            // CORRIGIDO: Chamando onAlert com severity 'error'
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