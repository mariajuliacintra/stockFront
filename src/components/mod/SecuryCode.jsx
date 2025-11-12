import { useState } from "react";
import { Button, TextField, CircularProgress, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Lock } from "@mui/icons-material"; 
import sheets from "../../services/axios";

export default function SecuryCode({ email, onResult, onClose }) {
    const registerFieldStyles = getRegisterFieldStyles();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        try {
            const response = await sheets.securyCodeApi(code, email);
            const mensagem = response.data?.message;

            if (response.data?.success) {
                onResult(true, mensagem);
            } else {
                onResult(false, mensagem);
            }
        } catch (error) {
            const mensagemErro = error.response?.data?.message || error.response?.data?.error || "Erro de conexão.";
            onResult(false, mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: 400,
                bgcolor: "white",
                borderRadius: '15px',
                p: 4,
                position: "relative",
                textAlign: "center",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", 
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{ 
                    position: "absolute", 
                    top: 8, 
                    right: 8, 
                    color: "rgba(255, 0, 0, 1)", 
                    "&:hover": {
                        bgcolor: "rgba(255, 0, 0, 0.05)",
                    }
                }}
            >
                <CloseIcon />
            </IconButton>

            <Typography component="h3" variant="body1" sx={{ mb: 1, fontWeight: 600, fontSize: "1rem", color: '#333' }}>
                Verificação de Código
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
                Digite o código de 6 dígitos enviado para: <strong>{email}</strong>
            </Typography>

            {/* CAMPO DO CÓDIGO - Estilizado com getRegisterFieldStyles */}
            <TextField
                placeholder="Código de 6 dígitos"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))} // Limita a 6 dígitos numéricos
                sx={registerFieldStyles.textField}
                inputProps={{ style: { textAlign: 'center', letterSpacing: '3px', marginLeft:"-30px"} }}
                InputProps={{
                    startAdornment: (
                        <Box sx={{display: 'flex', alignItems: 'center' }}>
                            <Lock sx={{ color: "gray", mr: 1 }} />
                        </Box>
                    ),
                }}
            />
            
            {/* BOTÃO CONFIRMAR - Estilizado com buttonCadastro */}
            <Button
                variant="contained"
                fullWidth
                onClick={handleVerify}
                disabled={loading || code.length < 6}
                sx={{
                    ...registerFieldStyles.buttonCadastro,
                    height: 40, 
                    mt: 1,
                }}
            >
                {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Confirmar Código"}
            </Button>
        </Box>
    );
}

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