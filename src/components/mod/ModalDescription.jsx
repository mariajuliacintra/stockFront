import React, { useState, useEffect } from "react";
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
import api from "../../services/axios";

const tipoAcoes = [
  { label: "Retirar", value: "retirar" },
  { label: "Adicionar", value: "adicionar" },
];

export default function ModalDescription({
  open,
  onClose,
  itemId,
  idUser,
  onSuccess,
  onError,
}) {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idLot, setIdLot] = useState("");
  const [form, setForm] = useState({ quantity: "", action: "" });

  useEffect(() => {
    if (open) {
      setForm({ quantity: "", action: "" });
      setItemDetails(null);
      setIdLot("");
    }
  }, [open]);

  useEffect(() => {
    const fetchItemById = async (id) => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.getItensID(id);
        const item = response.data.item?.[0];
        if (item) {
          setItemDetails(item);
          // lots pode ser array ou objeto — trata ambos os casos
          if (Array.isArray(item.lots) && item.lots.length > 0) {
            setIdLot(item.lots[0].idLot ?? item.lots[0].id ?? "");
          } else if (item.lots?.idLot) {
            setIdLot(item.lots.idLot);
          } else {
            setIdLot("");
          }
        } else {
          onError?.("Item não encontrado.");
        }
      } catch (err) {
        onError?.(err.response?.data?.error || "Erro ao buscar item.");
      } finally {
        setLoading(false);
      }
    };

    if (open && itemId) fetchItemById(itemId);
  }, [open, itemId, onError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    // validação básica
    if (!form.action || !form.quantity) {
      onError?.("Preencha a ação e a quantidade.");
      return;
    }
    if (!idLot) {
      onError?.("Lote não selecionado.");
      return;
    }

    try {
      let quantity = parseInt(form.quantity, 10);
      if (form.action === "retirar") quantity = quantity * -1;

      const payload = {
        quantity,
        isAjust: false,
        fkIdUser: idUser,
      };

      const response = await api.CreateLot(payload, idLot);

      if (response.data?.success) {
        // fecha o modal de edição e informa o pai
        onSuccess?.(response.data.message || "Operação realizada com sucesso!");
        onClose?.();

        // opcional: atualizar detalhes internos (não estritamente necessário
        // se você fechar o modal logo em seguida)
        try {
          const updatedItemResponse = await api.getItensID(itemId);
          const updatedItem = updatedItemResponse.data.item?.[0];
          if (updatedItem) {
            setItemDetails(updatedItem);
            if (Array.isArray(updatedItem.lots) && updatedItem.lots.length > 0) {
              setIdLot(updatedItem.lots[0].idLot ?? updatedItem.lots[0].id ?? "");
            }
          }
        } catch (e) {
          // não bloquear o fluxo se refresh falhar
          console.warn("Falha ao atualizar item após operação:", e);
        }
      } else {
        onError?.(response.data?.details || "Ocorreu um erro na operação.");
      }
    } catch (err) {
      onError?.(err.response?.data?.error || "Erro inesperado na operação.");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "20px" } }}>
      <DialogTitle>
        {itemDetails ? `Nome da Ferramenta: ${itemDetails.name}` : "Carregando..."}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && <Typography>Carregando detalhes...</Typography>}

        {itemDetails && (
          <Box display="flex" flexDirection="row" gap={3} alignItems="flex-start">
            {itemDetails.image && (
              <Box>
                <img
                  src={`data:${itemDetails.image.type};base64,${itemDetails.image.data}`}
                  alt="imagem da ferramenta"
                  style={{ marginTop: "70px", maxWidth: "250px", borderRadius: "12px", objectFit: "cover" }}
                />
              </Box>
            )}

            <Box display="flex" flexDirection="column" gap={1} flex={1}>
              <Typography>Marca: {itemDetails.brand || "—"}</Typography>
              <Typography>Descrição: {itemDetails.description || "—"}</Typography>
              <Typography>
                Especificações Técnicas:{" "}
                {itemDetails.technicalSpecs?.length > 0
                  ? itemDetails.technicalSpecs.map((s) => s.technicalSpecValue).join(", ")
                  : "—"}
              </Typography>
              <Typography>Quantidade: {itemDetails.totalQuantity ?? "—"}</Typography>
              <Typography>Número do SAP: {itemDetails.sapCode || "—"}</Typography>

              <Box mt={3}>
                <Typography>Quantidade</Typography>
                <TextField fullWidth name="quantity" value={form.quantity} onChange={handleChange} placeholder="Digite a quantidade" type="number" />

                <Typography mt={2} gutterBottom>Tipo da Ação</Typography>
                <TextField select fullWidth name="action" value={form.action} onChange={handleChange}>
                  {tipoAcoes.map((acao) => (
                    <MenuItem key={acao.value} value={acao.value}>
                      {acao.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box mt={4}>
                <Button variant="contained" color="error" fullWidth onClick={handleConfirm}>
                  Editar
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
