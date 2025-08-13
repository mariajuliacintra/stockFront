import { useState } from "react";
import { Button, TextField, CircularProgress, Box } from "@mui/material";
import sheets from "../../services/axios";

export default function SecuryCode({ email, onResult }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalCustom, setModalCustom] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await sheets.securyCodeApi(code, email);

      // pega a mensagem vinda da API
      const mensagem = response.data?.message;
      console.log(mensagem);

      if (response.data?.message) {
        onResult(true, mensagem);
      } else {
        onResult(false, mensagem);
      }
    } catch (error) {
      // tenta pegar mensagem de erro do backend
      const mensagemErro =
        error.response?.data?.mensage || error.response?.data?.error;
      onResult(false, mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: 400, padding: 4, textAlign: "center" }}>
      <TextField
        label="Código de verificação"
        placeholder="Digite o código recebido"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleVerify}
        disabled={loading || code.length === 0}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Verificar"}
      </Button>

      <CustomModal
        open={modalCustom.open}
        onClose={handleCloseCustomModal}
        title={modalCustom.title}
        message={modalCustom.message}
        type={modalCustom.type}
        buttonText="Fechar"
      />
    </Box>
  );
}
