import { useState } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Lock } from "@mui/icons-material";
import sheets from "../../services/axios"; // Assumindo que o path está correto

/**
 * Componente para verificação de código de segurança (após atualização de perfil, como e-mail).
 *
 * @param {object} props
 * @param {string} props.email O e-mail para onde o código foi enviado.
 * @param {(success: boolean, message: string, updatedUser: object | null) => void} props.onResult Função de callback com o resultado da verificação.
 * @param {() => void} props.onClose Função para fechar o modal ou página de verificação.
 */
export default function PerfSecuryCode({ email, onResult, onClose }) {
  const registerFieldStyles = getRegisterFieldStyles();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    // Evita múltiplas requisições se já estiver carregando ou o código for inválido
    if (loading || code.length < 6) return;

    setLoading(true);
    try {
      // 🚀 Endpoint de Atualização de Perfil:
      // A função 'postVerifyUpdate' no seu `sheets` (axios) deve estar configurada
      // para chamar a rota de verificação de atualização no backend (ex: 'user/verify-update').
      const response = await sheets.postVerifyUpdate({ code, email });
      const mensagem = response.data?.message;
      const updatedUser = response.data?.data; // O objeto de usuário atualizado

      if (response.data?.success) {
        // Sucesso: Repassa o objeto de usuário atualizado para que o perfil possa ser atualizado.
        onResult(true, mensagem, updatedUser);
      } else {
        onResult(false, mensagem, null);
      }
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro de conexão ou no servidor.";
      onResult(false, mensagemErro, null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        bgcolor: "white",
        borderRadius: "15px",
        p: 4,
        position: "relative",
        textAlign: "center",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Fechar"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "rgba(255, 0, 0, 1)",
          "&:hover": {
            bgcolor: "rgba(255, 0, 0, 0.05)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        component="h3"
        variant="body1"
        sx={{ mb: 1, fontWeight: 600, fontSize: "1rem", color: "#333" }}
      >
        Verificação de Segurança
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
        Digite o código de 6 dígitos enviado para:
        <br />
        <strong>{email}</strong>
      </Typography>

      {/* CAMPO DO CÓDIGO */}
      <TextField
        placeholder="Código de 6 dígitos"
        fullWidth
        value={code}
        onChange={(e) =>
          // Filtra apenas números e limita a 6 dígitos
          setCode(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))
        }
        sx={registerFieldStyles.textField}
        inputProps={{
          style: {
            textAlign: "center",
            letterSpacing: "3px",
            // Ajuste para centralizar visualmente a entrada com o adorno
            marginLeft: "-30px",
          },
        }}
        InputProps={{
          startAdornment: (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Lock sx={{ color: "gray", mr: 1 }} />
            </Box>
          ),
        }}
      />

      {/* BOTÃO CONFIRMAR */}
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
        {loading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          "Confirmar Código"
        )}
      </Button>
    </Box>
  );
}

// O objeto de estilos que você já forneceu para manter a consistência visual
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
    },
  };
}