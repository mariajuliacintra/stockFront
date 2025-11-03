import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Modal,
    MenuItem,
    InputAdornment, 
    IconButton,
} from '@mui/material';
import {
    PersonOutline,
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    WorkOutline,
} from '@mui/icons-material';
import sheets from '../../services/axios';
import SecuryCode from './SecuryCode';

// Defina as opções de cargo fora do componente para melhor organização
const ROLES = [
    { value: 'user', label: 'Comum' },
    { value: 'manager', label: 'Admin' },
];

function CreateUserModal({ open, onClose, onSuccess, onAlert }) {
    const registerFieldStyles = getRegisterFieldStyles();
    // Cor primária do seu tema
    const PRIMARY_RED = "rgba(255, 0, 0, 1)"; 
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); 
    const [loading, setLoading] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);


    const handleCreateUser = async () => {
        // Validação básica no front
        if (!name || !email || !password || !confirmPassword || !role) {
            onAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            onAlert('As senhas digitadas não coincidem.', 'error');
            return;
        }

        setLoading(true);

        try {
            // Chamando o método de registro/criação
            const response = await sheets.registerUserByManager({
                name,
                email,
                password,
                confirmPassword,
                role,
            });

            if (response.data.success) {
                setShowCodeModal(true);
            } else {
                // Se a API retornar sucesso=false
                onAlert(response.data.error || 'Erro ao tentar criar usuário.', 'error');
            }
        } catch (error) {
            const apiErrorMessage = error.response?.data?.error || error.response?.data?.message;
            const apiDetailsMessage = error.response?.data?.details;
            
            let finalErrorMessage = apiErrorMessage || 'Erro de comunicação com a API. Verifique a conexão.';
            if (apiDetailsMessage) {
                finalErrorMessage += `: ${apiDetailsMessage}`;
            }
            
            onAlert(finalErrorMessage, 'error'); 
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationResult = async (success, message) => {
        setShowCodeModal(false);
        
        if (success) {
            onSuccess(); 
            onClose(); 
            onAlert(message || "Usuário criado e verificado com sucesso!", 'success'); 
        } else {
            onAlert(message || "Erro na verificação do código.", 'error');
        }
    };
    
    const handleClose = () => {
        // Resetar todos os estados ao fechar a modal
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('user');
        setLoading(false);
        setShowCodeModal(false);
        setMostrarSenha(false);
        setMostrarConfirmarSenha(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-user-modal-title"
            aria-describedby="create-user-modal-description"
        >
            <Box sx={modalStyles}>
                {/* ALTERAÇÃO 1: CENTRALIZAR O TÍTULO */}
                <Typography id="create-user-modal-title" variant="h6" component="h2" mb={2} textAlign="center" fontWeight={600}>
                    Criar Novo Usuário
                </Typography>
                
                {/* CAMPO NOME */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={registerFieldStyles.textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutline sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* CAMPO E-MAIL */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={registerFieldStyles.textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* CAMPO SENHA */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Senha"
                    type={mostrarSenha ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={registerFieldStyles.textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setMostrarSenha((prev) => !prev)}
                                    edge="end"
                                    sx={{ color: "gray" }}
                                >
                                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* CAMPO CONFIRMAR SENHA */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirmar Senha"
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={registerFieldStyles.textField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                                    edge="end"
                                    sx={{ color: "gray" }}
                                >
                                    {mostrarConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                
                {/* CAMPO CARGO (SELECT) - ESTILIZAÇÃO MELHORADA */}
                <TextField
                    select
                    label="Cargo"
                    fullWidth
                    margin="normal"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required 
                    sx={{
                        ...registerFieldStyles.textField,
                        // ALTERAÇÃO 2: Estilo específico para o Select. 
                        // O Select Icon (a seta) não tem uma prop 'sx' direta,
                        // mas podemos estilizar o componente através do `SelectProps` e do `className` no `getStyles`.
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <WorkOutline sx={{ color: "gray" }} />
                            </InputAdornment>
                        ),
                    }}
                    SelectProps={{
                        MenuProps: {
                            // Estilo para o menu suspenso (opcional)
                            PaperProps: {
                                sx: {
                                    borderRadius: '8px',
                                }
                            }
                        },
                        // Usando InputProps para garantir que o estilo do TextField seja aplicado
                        // e que a cor da seta use a cor de foco do seu tema.
                        sx: {
                            "& .MuiSelect-icon": {
                                color: "gray", // Cor do ícone padrão
                            },
                            "&.Mui-focused .MuiSelect-icon": {
                                color: PRIMARY_RED, // Cor do ícone quando focado
                            }
                        }
                    }}
                >
                    {ROLES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {/* BOTÃO CANCELAR */}
                    <Button 
                        onClick={handleClose} 
                        color="error" 
                        variant="outlined"
                        sx={{
                            ...registerFieldStyles.buttonToLogin,
                            border: `1px solid ${PRIMARY_RED}`,
                            color: PRIMARY_RED,
                            backgroundColor: 'transparent',
                            borderRadius: '8px', 
                            height: 30, 
                            fontWeight: 600,
                            fontSize: 14,
                            padding: '0 16px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.04)',
                                border: `1px solid ${PRIMARY_RED}`,
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    {/* BOTÃO CRIAR */}
                    <Button
                        onClick={handleCreateUser}
                        variant="contained"
                        sx={{
                            ...registerFieldStyles.buttonCadastro, 
                            backgroundColor: PRIMARY_RED,
                            width: 'auto', 
                            padding: '0 16px', 
                            mt: 0,
                            height: 30, // Consistente com o botão Cancelar
                        }}
                        disabled={loading || !name || !email || !password || !confirmPassword || !role} 
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Criar Usuário'}
                    </Button>
                </Box>

                {/* Modal de verificação de código */}
                <Modal open={showCodeModal} onClose={() => setShowCodeModal(false)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <SecuryCode
                            email={email}
                            onResult={handleVerificationResult}
                            onClose={() => setShowCodeModal(false)}
                        />
                    </Box>
                </Modal>
            </Box>
        </Modal>
    );
}

// Estilos específicos do Modal (a caixa que envolve o formulário)
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
};

// Função para extrair e adaptar os estilos de TextField e Button do seu componente Register
function getRegisterFieldStyles() {
    const PRIMARY_RED = "rgba(255, 0, 0, 1)";
    const FOCUS_RED_HALF = "rgba(255, 0, 0, 0.5)";

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
                    borderColor: FOCUS_RED_HALF,
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
                    color: PRIMARY_RED,
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
            backgroundColor: PRIMARY_RED,
            height: 30,
            fontWeight: 600,
            fontSize: 14,
            borderRadius: 8,
            textTransform: "none",
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

export default CreateUserModal;