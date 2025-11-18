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


// --- [ 1. COMPONENTE PRINCIPAL ] ---

const EditUserModal = ({ open, onClose, user, onSuccess, onAlert }) => {
    
    const [editedUser, setEditedUser] = useState(user);
    const [loading, setLoading] = useState(false);
    
    // 🎯 Chama as funções de estilo na renderização
    const styleDefinitions = getModalStyles(); 
    
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
                
                // updateLocalStorageRole(updatedUserData); // Função removida
                
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
            {/* Usa a função de estilo responsivo */}
            <Box sx={styleDefinitions.modalContainer}> 
                
                <Typography variant="h6" component="h2" sx={styleDefinitions.titleStyle}>
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
                    sx={styleDefinitions.textField}
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
                    sx={styleDefinitions.textField}
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
                    sx={styleDefinitions.textField}
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
                
                {/* Box de Botões - Responsivo */}
                <Box sx={styleDefinitions.buttonBox}>
                    
                    {/* BOTÃO CANCELAR */}
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        disabled={loading}
                        sx={styleDefinitions.cancelButton}
                    >
                        Cancelar
                    </Button>
                    
                    {/* Botão Salvar Alterações */}
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading}
                        sx={styleDefinitions.saveButton}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Salvar Alterações'}
                    </Button>
                    
                </Box>
            </Box>
        </Modal>
    );
};

export default EditUserModal;

// --- [ 2. FUNÇÕES DE ESTILIZAÇÃO ] ---
function getModalStyles() {
    const senaiRed = 'rgba(255, 0, 0, 1)';
    const desktopHeight = 30; 
    const desktopFontSize = 14;
    const mobileHeight = 40; 
    const mobileFontSize = 13;

    const baseButtonCadastro = {
        "&.MuiButton-root": {
            border: "none",
            boxShadow: "none",
            "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
        },
        color: "white",
        backgroundColor: senaiRed,
        height: desktopHeight, 
        fontWeight: 600,
        fontSize: desktopFontSize,
        borderRadius: 8,
        textTransform: "none",
    };


    return {
        // 1. Estilo do Contêiner do Modal
        modalContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80%', sm: 400 },
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: '15px', 
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', 
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1, 
            maxHeight: { xs: '90vh', sm: 'auto' }, 
            overflowY: 'auto',
        },
        
        // 2. Estilo do Título
        titleStyle: {
            textAlign: 'center', 
            mb: 2,
            fontWeight: 600
        },
        
        // 3. Estilo dos Campos de Texto (TextField)
        textField: {
            "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
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
                "&.Mui-focused": { color: senaiRed },
            },
        },
        
        // 4. Estilo do Box de Botões
        buttonBox: {
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: { xs: 1, sm: 2 }, 
            mt: 3, 
            width: '100%',
        },
        
        // 5. Estilo Botão Salvar (Primário)
        saveButton: {
            ...baseButtonCadastro, 
            height: { xs: mobileHeight, sm: desktopHeight },
            fontSize: { xs: mobileFontSize, sm: desktopFontSize },
            width: { xs: 'calc(50% - 4px)', sm: 'auto' }, 
            mt: 0, 
        },
        
        // 6. Estilo Botão Cancelar (Secundário)
        cancelButton: {
            height: { xs: mobileHeight, sm: desktopHeight },
            fontSize: { xs: mobileFontSize, sm: desktopFontSize },
            width: { xs: 'calc(50% - 4px)', sm: 'auto' }, 
            mt: 0, 
            
            border: `1px solid ${senaiRed}`,
            color: senaiRed,
            backgroundColor: 'transparent',
            fontWeight: 600,
            borderRadius: 8, 
            textTransform: 'none',
            padding: { xs: '0 8px', sm: '0 16px' },

            '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.04)',
                border: `1px solid ${senaiRed}`,
            }
        },
    };
}