import { useState } from "react";
import { Button, TextField, CircularProgress, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import sheets from "../../services/axios";

export default function SecuryCode({ email, onResult, onClose }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await sheets.securyCodeApi(code, email);
      const mensagem = response.data?.message || "Código inválido";

      if (response.data?.success) {
        onResult(true, mensagem);
      } else {
        onResult(false, mensagem);
      }
    } catch (error) {
      const mensagemErro = error.response?.data?.message || error.response?.data?.error || "Erro desconhecido";
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
        borderRadius: 2.5, // arredondado como na imagem
        p: 4,
        position: "relative",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "#AF0707" }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ mb: 2, fontWeight: 600, fontSize: "1.2rem" }}>
        Digite o código enviado em seu E-mail
      </Box>

      <TextField
        placeholder="Digite o Código"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleVerify}
        disabled={loading || code.length === 0}
        sx={{
          bgcolor: "#AF0707",
          color: "white",
          borderRadius: 3,
          height: 45,
          "&:hover": { bgcolor: "#800000" },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Confirmar"}
      </Button>
    </Box>
  );
}