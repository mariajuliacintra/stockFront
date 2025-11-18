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

    const getAvailableActions = () => {
      let acoes = [
        { label: "Entrada", value: "adicionar" },
        { label: "Retirar", value: "retirar" },
      ];
      if (userRole === 'manager') {
        acoes.push({ label: "Reajustar Total", value: "reajustar" });
      }
      return acoes;
    };
    
    const fetchItemById = useCallback(async (id) => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.getItensID(id);
        const item = response.data.item?.[0];
        if (item) {
          setItemDetails(item);
          
          const mainLot = (Array.isArray(item.lots) && item.lots.length > 0) 
            ? item.lots[0] 
            : (item.lots?.idLot ? item.lots : null);
          
          setIdLot(mainLot?.idLot ?? mainLot?.id ?? "");
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
      const quantityInput = parseInt(form.quantity, 10);
      if (!form.action || !quantityInput || quantityInput <= 0) {
        onError?.("Ação e quantidade válida (> 0) são obrigatórias.");
        return;
      }
      if (!idLot) {
        onError?.("Lote principal não identificado. Não é possível realizar a ação.");
        return;
      }

      try {
        let finalQuantityToSend;
        let isAjustAction = false;

        if (form.action === "reajustar") {
          finalQuantityToSend = quantityInput;
          isAjustAction = true;
          if (userRole !== 'manager') {
            onError?.("Ação de Reajuste permitida apenas para Gerentes.");
            return;
          }
        } else if (form.action === "retirar") {
          finalQuantityToSend = quantityInput * -1;
          isAjustAction = false;
        } else { 
          finalQuantityToSend = quantityInput;
          isAjustAction = false;
        }

        const payload = {
          quantity: finalQuantityToSend,
          isAjust: isAjustAction,
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
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm" 
        // REMOVIDO: fullScreen={isMobile}
        PaperProps={{ 
            sx: { 
                // Desktop/Tablet (sm e acima)
                borderRadius: "20px", 
                maxHeight: "95vh", 

                // 🎯 CORREÇÃO CRÍTICA: Media Query para Mobile (max-width: 600px)
                '@media (max-width: 600px)': {
                    width: '95%', 
                    maxHeight: '90vh', 
                    borderRadius: '12px', 
                },
            } 
        }}
      >
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
                  // Ajusta a posição no mobile para não colidir com o botão de fechar
                  sx={{ 
                      position: "absolute", 
                      right: { xs: 45, sm: 45 }, 
                      top: 8 
                  }}
                  disabled={loading || isDeleting}
              >
                  <DeleteIcon />
              </IconButton>
          )}
        </DialogTitle>

        <DialogContent dividers>
          {loading && <Typography>Carregando detalhes...</Typography>}

          {itemDetails && (
            // 🎯 CORREÇÃO 2: Layout responsivo: vertical em mobile (xs), horizontal em desktop (sm)
            <Box 
                display="flex" 
                flexDirection={{ xs: "column", sm: "row" }} 
                gap={3} 
                alignItems="flex-start"
            >
              
              {/* Box da Imagem e Upload */}
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center"
                // Garante que o box de imagem ocupe a largura total no mobile
                sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    mb: { xs: 2, sm: 0 } // Adiciona margem inferior no mobile antes dos detalhes
                }}
              >
                {itemDetails.image ? (
                  <img
                    src={`data:${itemDetails.image.type};base64,${itemDetails.image.data}`}
                    alt={`Imagem de ${itemDetails.name}`}
                    // Limita o tamanho máximo da imagem no mobile para caber
                    style={{ 
                        maxWidth: "100%", 
                        maxHeight: "250px", 
                        width: "auto", 
                        height: "auto", 
                        borderRadius: "12px", 
                        objectFit: "contain", 
                        marginBottom: '16px' 
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      width: { xs: '100%', sm: 250 }, 
                      height: 200, 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      mb: 2 
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

              {/* Box dos Detalhes e Formulário */}
              <Box 
                display="flex" 
                flexDirection="column" 
                gap={1} 
                flex={1}
                sx={{ 
                    width: { xs: '100%', sm: 'auto' } // Garante que detalhes ocupem o espaço restante
                }}
              >
                <Typography>Marca: {itemDetails.brand || "—"}</Typography>
                <Typography>Descrição: {itemDetails.description || "—"}</Typography>
                <Typography>
                  Especificações Técnicas:{" "}
                  {itemDetails.technicalSpecs?.length > 0
                    ? itemDetails.technicalSpecs.map((s) => s.technicalSpecValue).join(", ")
                    : "—"}
                </Typography>
                <Typography>Quantidade Total: {itemDetails.totalQuantity ?? "—"}</Typography>
                <Typography>Estoque Mínimo: {itemDetails.minimumStock ?? "—"}</Typography>
                <Typography>Número do SAP: {itemDetails.sapCode || "—"}</Typography>


                <Box mt={3}>
                  {/* Campo 1: Quantidade */}
                  <Typography gutterBottom>
                    {form.action === 'reajustar' ? 'Nova Quantidade Total' : 'Quantidade'}
                  </Typography>
                  <TextField 
                    fullWidth 
                    name="quantity" 
                    value={form.quantity} 
                    onChange={handleChange} 
                    placeholder={form.action === 'reajustar' ? 'Total Desejado' : 'Qtd. Movimentação'}
                    type="number"
                    inputProps={{ min: 1 }}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  {/* Campo 2: Tipo da Ação */}
                  <Typography gutterBottom>Tipo da Ação</Typography>
                  <TextField 
                    select 
                    fullWidth 
                    name="action" 
                    value={form.action} 
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                  >
                    {getAvailableActions().map((acao) => (
                      <MenuItem key={acao.value} value={acao.value}>
                        {acao.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box mt={4}>
                  <Button variant="contained" color="error" fullWidth onClick={handleConfirm} disabled={isDeleting || loading || isUploading}>
                    Confirmar Ação
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