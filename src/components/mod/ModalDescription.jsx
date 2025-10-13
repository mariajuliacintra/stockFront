import React, { useState, useEffect, useRef, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import { 
    Close as CloseIcon, 
    Image as ImageIcon,
    CloudUpload as UploadIcon,
    Delete as DeleteIcon 
} from "@mui/icons-material";
import api from "../../services/axios";

import DeleteConfirmationModal from "./DeleteConfirmationModal"; 


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
  onItemDeleteSuccess, 
}) {
  const fileInputRef = useRef(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idLot, setIdLot] = useState("");
  const [form, setForm] = useState({ quantity: "", action: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userRole = localStorage.getItem("userRole");

  
  const fetchItemById = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.getItensID(id);
      const item = response.data.item?.[0];
      if (item) {
        setItemDetails(item);
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
  }, [onError]);


  useEffect(() => {
    if (open) {
      setForm({ quantity: "", action: "" });
      setItemDetails(null);
      setIdLot("");
      setSelectedFile(null); 
      setIsConfirmingDelete(false); 
    }
  }, [open]);

  useEffect(() => {
    if (open && itemId) fetchItemById(itemId);
  }, [open, itemId, fetchItemById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !itemDetails?.idItem) {
      onError?.("Selecione um arquivo de imagem primeiro.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile); 
      
      const response = await api.postImage(itemDetails.idItem, formData); 

      if (response.data?.success) {
        onSuccess?.(`Imagem de "${itemDetails.name}" adicionada com sucesso!`);
        setSelectedFile(null);
        await fetchItemById(itemDetails.idItem); 
      } else {
        onError?.(response.data?.details || "Falha ao enviar a imagem.");
      }
    } catch (err) {
        console.error("Erro no upload da imagem:", err); 
        const status = err.response?.status;
        let errorMessage = "Erro de conexão ao enviar a imagem.";

        if (status === 404) {
            errorMessage = "Erro 404: Endpoint de upload não encontrado. Verifique a rota da API.";
        } else if (status === 413) {
            errorMessage = "Erro 413: Arquivo muito grande. O servidor rejeitou o envio.";
        } else if (err.response?.data?.error) {
             errorMessage = `Erro da API: ${err.response.data.error}`;
        }
      onError?.(errorMessage); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemDetails?.idItem) {
      onError?.("ID do item inválido para exclusão.");
      return;
    }

    setIsConfirmingDelete(false);
    setIsDeleting(true);

    try {
      const response = await api.deleteItem(itemDetails.idItem);

      if (response.data?.success) {
        onSuccess?.(response.data.message || `Item "${itemDetails.name}" excluído com sucesso!`);
        onItemDeleteSuccess?.(); 
        onClose?.();
      } else {
        onError?.(response.data?.details || "Ocorreu um erro na exclusão.");
      }
    } catch (err) {
      onError?.(err.response?.data?.error || "Erro inesperado na exclusão.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirm = async () => {
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
        onSuccess?.(response.data.message || "Operação realizada com sucesso!");
        onClose?.(); 
        
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
        {userRole === 'manager' && itemDetails && (
            <IconButton 
                aria-label="delete" 
                onClick={() => setIsConfirmingDelete(true)} 
                color="error"
                sx={{ position: "absolute", right: 45, top: 8 }}
                disabled={loading || isDeleting}
            >
                <DeleteIcon />
            </IconButton>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {loading && <Typography>Carregando detalhes...</Typography>}

        {itemDetails && (
          <Box display="flex" flexDirection="row" gap={3} alignItems="flex-start">
            <Box display="flex" flexDirection="column" alignItems="center">
              {itemDetails.image ? (
                <img
                  src={`data:${itemDetails.image.type};base64,${itemDetails.image.data}`}
                  alt={`Imagem de ${itemDetails.name}`}
                  style={{ maxWidth: "250px", height: "auto", borderRadius: "12px", objectFit: "cover", marginBottom: '16px' }}
                />
              ) : (
                <Box 
                  sx={{ 
                    width: 250, height: 200, backgroundColor: '#f0f0f0', 
                    borderRadius: '12px', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', mb: 2 
                  }}
                >
                  <ImageIcon sx={{ fontSize: 60, color: '#aaa' }} />
                </Box>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/png, image/jpeg" 
                style={{ display: 'none' }} 
              />

              {selectedFile ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={handleImageUpload} 
                  disabled={isUploading}
                  startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                  sx={{ mt: itemDetails.image ? 1 : 0 }}
                >
                  {isUploading ? "Enviando..." : `Enviar Imagem (${selectedFile.name.substring(0, 10)}...)`}
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => fileInputRef.current.click()}
                  startIcon={<UploadIcon />}
                  sx={{ mt: itemDetails.image ? 1 : 0 }}
                >
                  {itemDetails.image ? "Trocar Imagem" : "Adicionar Imagem"}
                </Button>
              )}
            </Box>

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
      
      <DeleteConfirmationModal
        open={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        itemName={itemDetails?.name}
        onConfirm={handleDeleteItem}
        isDeleting={isDeleting}
      />
    </Dialog>
  );
}