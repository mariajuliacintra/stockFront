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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import sheets from "../../services/axios";

const CustomModal = ({ open, onClose, title, message, type = "info" }) => {
  const iconProps =
    {
      success: { IconComponent: CheckCircleOutlineIcon, color: "#4CAF50" },
      error: { IconComponent: ErrorOutlineIcon, color: "#F44336" },
      info: { IconComponent: InfoOutlinedIcon, color: "#2196F3" },
    }[type] || {};
  const IconComponent = iconProps.IconComponent;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "white",
          borderRadius: "15px",
          boxShadow: "0 8px 12px rgba(0,0,0,0.15)",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {IconComponent && (
          <IconComponent
            sx={{ fontSize: "5rem", color: iconProps.color, mb: 2 }}
          />
        )}
        <Typography variant="h6" fontWeight="bold" mb={1}>
          {title}
        </Typography>
        <Typography sx={{ color: "#666", mb: 2 }}>{message}</Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ width: "60%", backgroundColor: iconProps.color }}
        >
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default function AddItemModal({ open, onClose, idUser, itemId }) {
  const [formData, setFormData] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [technicalSpecs, setTechnicalSpecs] = useState([""]);
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    if (open) fetchLocations();
  }, [open]);

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await sheets.getLocations();
      setLocations(response.data.locations);
    } catch {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Falha ao carregar localizações",
        type: "error",
      });
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTechnicalChange = (index, value) => {
    const updated = [...technicalSpecs];
    updated[index] = value;
    setTechnicalSpecs(updated);
  };

  const addTechnicalSpec = () => setTechnicalSpecs([...technicalSpecs, ""]);
  const removeTechnicalSpec = (index) =>
    setTechnicalSpecs(technicalSpecs.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Monta objeto technicalSpecs com chaves 1,2,3...
    const techSpecsObj = {};
    technicalSpecs.forEach((value, index) => {
      if (value.trim()) techSpecsObj[index + 1] = value.trim();
    });

    if (Object.keys(techSpecsObj).length === 0) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Informe ao menos uma TechnicalSpec",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const payload = {
      sapCode: formData.sapCode || "",
      name: formData.name || "",
      aliases: formData.aliases || "",
      brand: formData.brand || "",
      description: formData.description || "",
      technicalSpecs: techSpecsObj,
      minimumStock: Number(formData.minimumStock || 0),
      fkIdCategory: formData.fkIdCategory || null,
      quantity: Number(formData.quantity || 0),
      expirationDate: formData.expirationDate || "",
      fkIdLocation: Number(formData.fkIdLocation || 0),
      fkIdUser: Number(idUser),
    };

    Object.keys(payload).forEach(
      (key) =>
        (payload[key] === "" || payload[key] === null) && delete payload[key]
    );

    try {
      const response = await sheets.postAddItem(payload);
      setModalInfo({
        open: true,
        title: "Sucesso!",
        message: response.data?.message || "Item adicionado!",
        type: "success",
      });
      setFormData({});
      setTechnicalSpecs([""]);
      onClose();
    } catch (error) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: error.response?.data?.message || "Erro ao adicionar item",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
    try {
      if (!imagem) return;

      // Cria FormData para envio
      const formDataImg = new FormData();
      formDataImg.append("imagem", imagem);

      // Chama a API
      const response = await sheets.insertImage(itemId, formDataImg);

      // Feedback da API
      if (response.data?.message) {
        console.log(response.data.message);
      } else {
        alert("Imagem enviada com sucesso!");
      }
    } catch (err) {
      console.error(err);
      console.log(err.response?.data?.message || "Erro ao enviar a imagem");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        sx={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ ...modalStyle, maxHeight: "90vh", overflowY: "auto" }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Adicionar Novo Item
          </Typography>

          <TextField
            label="SAP Code"
            name="sapCode"
            fullWidth
            value={formData.sapCode || ""}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Nome"
            name="name"
            fullWidth
            value={formData.name || ""}
            onChange={handleFormChange}
            margin="normal"
            required
          />
          <TextField
            label="Apelidos"
            name="aliases"
            fullWidth
            value={formData.aliases || ""}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Marca"
            name="brand"
            fullWidth
            value={formData.brand || ""}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Descrição"
            name="description"
            fullWidth
            value={formData.description || ""}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Quantidade"
            name="quantity"
            type="number"
            fullWidth
            value={formData.quantity || ""}
            onChange={handleFormChange}
            margin="normal"
            required
          />
          <TextField
            label="Data de Validade"
            name="expirationDate"
            type="date"
            fullWidth
            value={formData.expirationDate || ""}
            onChange={handleFormChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Estoque Mínimo"
            name="minimumStock"
            type="number"
            fullWidth
            value={formData.minimumStock || ""}
            onChange={handleFormChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="fkIdCategory"
              value={formData.fkIdCategory || ""}
              onChange={handleFormChange}
            >
              <MenuItem value={1}>Ferramenta</MenuItem>
              <MenuItem value={2}>Material</MenuItem>
              <MenuItem value={3}>Produto</MenuItem>
              <MenuItem value={4}>Equipamento</MenuItem>
              <MenuItem value={5}>Matéria-prima</MenuItem>
              <MenuItem value={6}>Diversos</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Localização</InputLabel>
            <Select
              name="fkIdLocation"
              value={formData.fkIdLocation || ""}
              onChange={handleFormChange}
            >
              {loadingLocations ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  Carregando...
                </MenuItem>
              ) : (
                locations.map((loc) => (
                  <MenuItem key={loc.idLocation} value={loc.idLocation}>
                    {loc.place}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
          />

          <Typography variant="subtitle1" mt={2}>
            Technical Specs
          </Typography>
          {technicalSpecs.map((value, idx) => (
            <Box key={idx} display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                label={`Valor ${idx + 1}`}
                value={value}
                onChange={(e) => handleTechnicalChange(idx, e.target.value)}
                sx={{ flex: 1 }}
                required={idx === 0}
              />
              {idx > 0 && (
                <IconButton
                  onClick={() => removeTechnicalSpec(idx)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addTechnicalSpec}
            sx={{ mt: 1 }}
          >
            Adicionar Technical Spec
          </Button>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Adicionar"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomModal
        open={modalInfo.open}
        onClose={() => setModalInfo({ ...modalInfo, open: false })}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 500 },
  bgcolor: "white",
  borderRadius: "15px",
  boxShadow: "0 8px 12px rgba(0,0,0,0.15)",
  p: 4,
  display: "flex",
  flexDirection: "column",
};
