import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Este é o código do seu serviço de API que deve ser usado.
import sheets from "../../services/axios";


// Componente CustomModal simplificado para este exemplo
const CustomModal = ({ open, onClose, title, message, type = "info" }) => {
  const iconProps = {
    success: { IconComponent: CheckCircleOutlineIcon, color: "#4CAF50" },
    error: { IconComponent: ErrorOutlineIcon, color: "#F44336" },
    info: { IconComponent: InfoOutlinedIcon, color: "#2196F3" },
  }[type] || {};

  const IconComponent = iconProps.IconComponent;

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'white',
    borderRadius: '15px',
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {IconComponent && (
          <IconComponent sx={{ fontSize: '7rem', color: iconProps.color, mb: '16px' }} />
        )}
        <Typography id="modal-title" variant="h5" component="h2" fontWeight="bold" color="#333" mb={1}>
          {title}
        </Typography>
        <Typography id="modal-description" sx={{ color: '#666', mb: 2 }}>
          {message}
        </Typography>
        <Button 
          variant="contained" 
          onClick={onClose} 
          sx={{
            width: '80%',
            paddingY: '12px',
            borderRadius: '10px',
            backgroundColor: iconProps.color,
            color: '#fff',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: '600',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: iconProps.color,
              opacity: 0.9,
            },
          }}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

// Estilo aprimorado para o modal principal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 400 },
  maxHeight: "90vh", // Limita a altura para caber na tela
  overflowY: 'auto', // Adiciona rolagem vertical quando necessário
  bgcolor: "white",
  borderRadius: "15px",
  boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

const formFields = {
  tool: ["name", "aliases", "brand", "quantity", "expirationDate", "batchNumber"],
  material: ["name", "aliases", "brand", "description", "technicalSpecs", "quantity", "expirationDate", "batchNumber"],
  product: ["name", "aliases", "brand", "quantity", "expirationDate", "batchNumber"],
  equipment: ["name", "aliases", "brand", "description", "technicalSpecs", "quantity", "batchNumber"],
  rawMaterial: ["name", "aliases", "brand", "quantity", "batchNumber"],
  diverses: ["name", "aliases", "quantity", "batchNumber"],
};

const fieldLabels = {
  name: "Nome",
  aliases: "Apelidos (opcional)",
  brand: "Marca",
  quantity: "Quantidade",
  expirationDate: "Data de Validade (AAAA-MM-DD)",
  batchNumber: "Número do Lote",
  description: "Descrição",
  technicalSpecs: "Especificações Técnicas",
};

export default function AddItemModal({ open, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ open: false, title: "", message: "", type: "info" });
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Função para buscar localizações da API
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await sheets.getLocations();
      setLocations(response.data);
    } catch (error) {
      console.error("Erro ao buscar localizações:", error);
      const errorMessage = error.response?.data?.message;
      setModalInfo({ open: true, title: "Erro!", message: errorMessage, type: "error" });
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLocations();
    }
  }, [open]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setFormData({ fkIdLocation: "" });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModalInfo = () => {
    setModalInfo({ ...modalInfo, open: false });
  };
  
  // Função para fechar e resetar o modal
  const handleCloseAndReset = () => {
    setSelectedCategory("");
    setFormData({});
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const fkIdUser = "12345";
    const payload = {
      ...formData,
      fkIdUser,
      fkIdLocation: Number(formData.fkIdLocation),
      quantity: Number(formData.quantity)
    };

    // Remove campos com valores vazios antes de enviar para evitar erros 400
    for (const key in payload) {
      if (payload[key] === "" || payload[key] === null) {
        delete payload[key];
      }
    }
    
    try {
      const response = await sheets.postAddItem(selectedCategory, payload);
      // Pega a mensagem de sucesso diretamente da resposta da API
      const successMessage = response.data?.message || "Operação realizada com sucesso.";
      setModalInfo({ open: true, title: "Sucesso!", message: successMessage, type: "success" });
      handleCloseAndReset();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      // Pega a mensagem de erro diretamente da resposta da API com um fallback
      const errorMessage = error.response?.data?.message || "Ocorreu um erro inesperado ao adicionar o item.";
      setModalInfo({ open: true, title: "Erro!", message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (!selectedCategory) return null;
    return formFields[selectedCategory].map((field) => (
      <TextField
        key={field}
        name={field}
        label={fieldLabels[field]}
        type={field === "quantity" ? "number" : "text"}
        fullWidth
        required={field !== "aliases"}
        value={formData[field] || ""}
        onChange={handleFormChange}
        margin="normal"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: '#F3F4F6',
          },
        }}
      />
    ));
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseAndReset} sx={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" component="h2" mb={2} fontWeight="bold" textAlign="center">
            Adicionar Novo Item
          </Typography>
          <FormControl fullWidth margin="normal" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F3F4F6', }, }}>
            <InputLabel id="category-select-label">Selecione a Categoria</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              label="Selecione a Categoria"
              onChange={handleCategoryChange}
              required
            >
              <MenuItem value="tool">Ferramenta</MenuItem>
              <MenuItem value="material">Material</MenuItem>
              <MenuItem value="product">Produto</MenuItem>
              <MenuItem value="equipment">Equipamento</MenuItem>
              <MenuItem value="rawMaterial">Matéria-prima</MenuItem>
              <MenuItem value="diverses">Diversos</MenuItem>
            </Select>
          </FormControl>

          {renderFormFields()}

          {selectedCategory && (
            <FormControl fullWidth margin="normal" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F3F4F6', }, }}>
              <InputLabel>Localização</InputLabel>
              <Select
                name="fkIdLocation"
                value={formData.fkIdLocation || ""}
                onChange={handleFormChange}
                label="Localização"
                disabled={loadingLocations}
              >
                {loadingLocations ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Carregando Localizações...
                  </MenuItem>
                ) : (
                  locations.map((loc) => (
                    <MenuItem key={loc.idLocation} value={loc.idLocation}>
                      {loc.place} - {loc.code}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          )}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleCloseAndReset} variant="outlined" sx={{
              borderRadius: '10px',
              textTransform: 'none',
              height: 48,
              fontWeight: 600,
              color: '#6B7280',
              borderColor: '#D1D5DB',
              '&:hover': {
                backgroundColor: '#F3F4F6',
                borderColor: '#6B7280',
              }
            }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{
              backgroundColor: '#DC2626',
              color: 'white',
              height: 48,
              fontWeight: '600',
              fontSize: 16,
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              '&:hover': {
                backgroundColor: '#B91C1C',
              },
            }}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Adicionar"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomModal
        open={modalInfo.open}
        onClose={handleCloseModalInfo}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </>
  );
}
