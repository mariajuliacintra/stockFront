import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import sheets from "../services/axios";
import Header from "../components/layout/HeaderPerfil";

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Buscar as transações
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await sheets.getTransacoes();
        setTransacoes(res.data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Abrir modal de confirmação
  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setSelectedId(null);
    setOpenConfirm(false);
  };

  const handleDelete = async () => {
    try {
      await sheets.deleteTransacao(selectedId);
      setTransacoes((prev) => prev.filter((t) => t.id !== selectedId));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      handleCloseConfirm();
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #a00000, #ff0000)",
        minHeight: "100vh",
        display: "flex",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Header />
      <Box
        sx={{
          backgroundColor: "white",
          p: 3,
          borderRadius: 3,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        {/* Título */}
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
        >
          Meus Transações
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : transacoes.length === 0 ? (
          <Typography textAlign="center" color="textSecondary">
            Nenhuma transação encontrada.
          </Typography>
        ) : (
          transacoes.map((t, index) => (
            <Box key={t.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Pedido {index + 1}
              </Typography>
              <Typography variant="body2">
                Nome do Item: {t.nomeItem}
              </Typography>
              <Typography variant="body2">
                Tipo do Item: {t.tipoItem}
              </Typography>
              <Typography variant="body2">
                Tipo de Ação: {t.tipoAcao}
              </Typography>
              <Typography variant="body2">
                Quantidade: {t.quantidade}
              </Typography>
              <Typography variant="body2">
                Data do Pedido: {t.dataPedido}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={1}>
                <IconButton size="small" color="primary">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleOpenConfirm(t.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>

              {index < transacoes.length - 1 && <Divider sx={{ my: 1.5 }} />}
            </Box>
          ))
        )}

        {/* Modal de confirmação */}
        <Dialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          PaperProps={{
            sx: { borderRadius: 3, p: 2, textAlign: "center" },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Confirmar exclusão
          </DialogTitle>
          <DialogContent>
            <Typography>Tem certeza que deseja apagar este pedido?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
            <Button
              onClick={handleCloseConfirm}
              variant="contained"
              sx={{
                backgroundColor: "gray",
                borderRadius: 5,
                px: 3,
                "&:hover": { backgroundColor: "#555" },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              sx={{
                backgroundColor: "red",
                borderRadius: 5,
                px: 3,
                "&:hover": { backgroundColor: "#b30000" },
              }}
            >
              Apagar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Transacoes;


function getStyles() {
  return {
    pageLayout: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }
}
}
