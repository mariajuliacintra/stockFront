import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import { useState } from 'react';
import api from '../../services/axios';

// --- [ 1. FUNÇÕES AUXILIARES ] ---

const updateLocalStorageRole = (updatedUser) => {
    try {
        const currentUserString = localStorage.getItem('user');
        if (!currentUserString) return;

        const currentUser = JSON.parse(currentUserString);

        if (currentUser.idUser === updatedUser.idUser) {
            const updatedLocalStorageUser = { 
                ...currentUser, 
                role: updatedUser.role 
            };
            localStorage.setItem('user', JSON.stringify(updatedLocalStorageUser));
            
            window.dispatchEvent(new Event('storage'));
        }
    } catch (e) {
        console.error("Erro ao sincronizar a role no localStorage:", e);
    }
};


const DeleteUserModal = ({ open, onClose, user, onSuccess, onAlert }) => {
    const fieldStyles = getRegisterFieldStyles(); 
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
            onAlert(error.response?.data?.error || 'Erro interno do servidor ao tentar excluir o usuário.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={getModalStyles()}>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Confirmar Exclusão
                </Typography>
                
                {/* Texto de Confirmação */}
                <Typography sx={{ mt: 1, textAlign: 'center', color: '#666' }}>
                    Tem certeza que deseja excluir o usuário 
                    <strong style={{ marginLeft: "5px" }}>
                        {user?.name}
                    </strong>
                    ? Esta ação <strong style={{ fontWeight: 'bold' }}>não pode ser desfeita</strong>.
                </Typography>
                
                <Box sx={fieldStyles.buttonBox}>
                    
                    {/* BOTÃO CANCELAR */}
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        disabled={loading}
                        sx={getButtonStyles(true)}
                    >
                        Cancelar
                    </Button>
                    
                    {/* BOTÃO EXCLUIR */}
                    <Button 
                        onClick={handleDelete} 
                        variant="contained" 
                        color="error" 
                        disabled={loading}
                        sx={getButtonStyles(false)}
                    >
                        {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : 'Excluir'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
 
export default DeleteUserModal;

const getModalStyles = () => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    maxWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
    p: { xs: 3, sm: 4 },
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 1.5, sm: 2 }, 
    maxHeight: { xs: '90vh', sm: 'auto' }, 
    overflowY: 'auto',
});

const getButtonStyles = (isCancel) => {
    const PRIMARY_RED = 'rgba(255, 0, 0, 1)';
    const mobileHeight = 40;
    const mobileFontSize = 13;
    const desktopHeight = 30;
    const desktopFontSize = 14;

    const baseStyle = {
        height: { xs: mobileHeight, sm: desktopHeight },
        fontSize: { xs: mobileFontSize, sm: desktopFontSize },
        fontWeight: 600,
        borderRadius: '8px',
        textTransform: 'none',
        width: { xs: 'calc(50% - 8px)', sm: 'auto' }, 
        padding: { xs: '0 8px', sm: '0 16px' },
        mt: 0,
        flexGrow: 1,
    };

    if (isCancel) {
        return {
            ...baseStyle,
            variant: 'outlined',
            border: `1px solid ${PRIMARY_RED}`,
            color: PRIMARY_RED,
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.04)',
                border: `1px solid ${PRIMARY_RED}`,
            }
        };
    } else {
        return {
            ...baseStyle,
            variant: 'contained',
            backgroundColor: '#dc3545',
            color: 'white',
            '&:hover': {
                backgroundColor: '#c82333',
            }
        };
    }
};


function getRegisterFieldStyles() {
    const PRIMARY_RED = "rgba(255, 0, 0, 1)";

    const buttonCadastro = {
        "&.MuiButton-root": {
            border: "none",
            boxShadow: "none",
            "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
        },
        color: "white",
        backgroundColor: PRIMARY_RED,
        height: 30,
        fontWeight: 600,
        fontSize: 14,
        borderRadius: 8,
        textTransform: "none",
    };

    return {
        buttonCadastro: buttonCadastro,
        buttonBox: {
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: { xs: 1, sm: 2 }, 
            mt: 3, 
            width: '100%',
        },
        buttonToLogin: {
            color: PRIMARY_RED,
            backgroundColor: "transparent",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            textTransform: "none",
        }
    };
}