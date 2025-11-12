import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import {
    PersonOutline,
    Email,
    WorkOutline,
} from '@mui/icons-material';
import sheets from '../../services/axios';


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



const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '15px', 
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', 
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1, 
};

const EditUserModal = ({ open, onClose, user, onSuccess, onAlert }) => {
    const [editedUser, setEditedUser] = useState(user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {   
        setEditedUser(user);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = async () => {
        if (!editedUser || !editedUser.idUser) {
            onAlert('Não foi possível encontrar o usuário para atualização.', 'error');
            return;
        }
        
        const originalRole = user.role;
        const newRole = editedUser.role;
        const roleWasChanged = originalRole !== newRole;

        setLoading(true);
        try {
            const dataToUpdate = {
                name: editedUser.name,
                role: editedUser.role,
            };
            
            const response = await sheets.updateUser(editedUser.idUser, dataToUpdate);

            if (response.data.success) {
                
                const updatedUserData = {
                    idUser: editedUser.idUser,
                    name: editedUser.name,
                    role: editedUser.role,
                };
                onAlert(response.data.message || 'Usuário atualizado com sucesso!', 'success'); 
                if (roleWasChanged) {
                    setTimeout(() => {
                        onAlert(
                            'Privilégios do usuário foram atualizados! Por favor, deslogue e logue novamente no sistema para que os novos privilégios sejam aplicados.', 
                            'warning'
                        );
                    }, 2000);
                }
                
                updateLocalStorageRole(updatedUserData); 
                
                onSuccess();
                onClose();

            } else {
                onAlert(response.data.error || 'Erro ao atualizar usuário.', 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            onAlert(error.response?.data?.error || 'Erro interno do servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyles}>
                {/* ALTERAÇÃO APLICADA: Centralizando o Título */}
                <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2 }}>
                    Editar Usuário
                </Typography>

                {/* CAMPO NOME */}
                <TextField
                    label="Nome"
                    name="name"
                    value={editedUser?.name || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={getRegisterFieldStyles().textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutline sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                    }}
                />
                
                {/* CAMPO E-MAIL (Desabilitado) */}
                <TextField
                    label="E-mail"
                    name="email"
                    value={editedUser?.email || ''}
                    fullWidth
                    disabled
                    margin="normal"
                    sx={getRegisterFieldStyles().textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* CAMPO CARGO (SELECT) */}
                <TextField
                    select
                    label="Cargo"
                    name="role"
                    value={editedUser?.role || 'user'}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={getRegisterFieldStyles().textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <WorkOutline sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value="manager">Admin</MenuItem> 
                    <MenuItem value="user">Comum</MenuItem>
                </TextField>
                
                {/* Box de Botões */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        disabled={loading}
                        sx={{
                            ...getRegisterFieldStyles().buttonToLogin,
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
                    
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading}
                        sx={{...getRegisterFieldStyles().buttonCadastro, width: 'auto', padding: '0 16px', mt: 0}}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Salvar Alterações'}
                    </Button>
                    
                </Box>
            </Box>
        </Modal>
    );
};

function getRegisterFieldStyles() {
    return {
        textField: {
            mb: 1,
            "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                "& fieldset": {
                    borderColor: "transparent",
                },
                "&:hover fieldset": {
                    borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 0, 0, 0.5)",
                    borderWidth: "1px",
                },
            },
            "& .MuiInputBase-input": {
                padding: "8px 10px",
                fontSize: "14px",
                color: "#333",
            },
            "& .MuiInputLabel-root": {
                fontSize: "14px",
                color: "gray",
                "&.Mui-focused": {
                    color: "rgba(255, 0, 0, 1)",
                },
            },
        },
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

export default EditUserModal;