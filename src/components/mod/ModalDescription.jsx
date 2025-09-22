import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Buffer } from "buffer";
import { useState, useEffect } from "react";
import api from "../../services/axios"; // garante que está importando

const tipoAcoes = [
  { label: "Retirar", value: "retirar" },
  { label: "Adicionar", value: "adicionar" },
];

export default function ModalDescription({ open, onClose, itemId }) {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchItemById = async (id) => {
      if (!id) return;

      setLoading(true);
      setErrorMessage("");

      try {
        const response = await api.getItensID(id);
        if (Array.isArray(response.data.item) && response.data.item.length > 0) {
          setItemDetails(response.data.item[0]); // pegar o primeiro item do array
          console.log("imagem: ", response.data.item[0].image);
          console.log("imagem: ", response.data.item.image.data); 
        } else {
          setErrorMessage("Item não encontrado.");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.error
        );
      } finally {
        setLoading(false);
      }
    };

    if (open && itemId) {
      fetchItemById(itemId);
    }
  }, [open, itemId]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "20px" } }}
    >
      <DialogTitle>
        {itemDetails ? `Nome da Ferramenta: ${itemDetails.name}` : "Carregando..."}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && <Typography>Carregando detalhes...</Typography>}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        {itemDetails && (
          <>
            {/* Imagem */}
            {itemDetails.image ? (
              <Box display="flex" justifyContent="center" mb={3}>
                <img
                  src={`data:${itemDetails.image.type};base64,${itemDetails.image.data}`}
                  alt="imagem da ferramenta"
                  style={{ maxWidth: "250px", borderRadius: "12px", objectFit: "cover" }}
                />
              </Box>
            ) : (
              <Typography sx={{ fontStyle: "italic", color: "text.secondary", mb: 2 }}>
                Essa ferramenta não possui imagem.
              </Typography>
            )}

            <Typography>Marca: {itemDetails.brand || "—"}</Typography>
            <Typography>Descrição: {itemDetails.description || "—"}</Typography>
            <Typography>
              Especificações Técnicas:{" "}
              {itemDetails.technicalSpecs?.length > 0
                ? itemDetails.technicalSpecs.map((spec) => spec.technicalSpecValue).join(", ")
                : "—"}
            </Typography>
            <Typography>Quantidade: {itemDetails.totalQuantity || "—"}</Typography>
            <Typography>Número do SAP: {itemDetails.sapCode || "—"}</Typography>

            {/* Inputs */}
            <Box mt={3}>
              <Typography>Quantidade</Typography>
              <TextField
                fullWidth
                defaultValue=""
                placeholder="Selecione a quantidade"
                type="number"
              />

              <Typography mt={2} gutterBottom>
                Tipo da Ação
              </Typography>
              <TextField select fullWidth defaultValue="">
                {tipoAcoes.map((acao) => (
                  <MenuItem key={acao.value} value={acao.value}>
                    {acao.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box
              mt={4}
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Button variant="contained" color="error">
                Editar
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
