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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import sheets from "../../services/axios";

// Modal de feedback
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

export default function AddItemModal({ open, onClose, idUser }) {
  const [formData, setFormData] = useState({});
  const [locations, setLocations] = useState([]);
  const [availableSpecs, setAvailableSpecs] = useState([]); // Lista completa da API
  const [technicalSpecs, setTechnicalSpecs] = useState([]); // Selecionadas
  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });
  const [imagem, setImagem] = useState(null);
  const [newSpecName, setNewSpecName] = useState(""); // Para criar nova spec
  const [addingNewSpec, setAddingNewSpec] = useState(false);

  useEffect(() => {
    if (open) {
      fetchLocations();
      fetchTechnicalSpecs();
    }
  }, [open]);

  // Fetch locations
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

  // Fetch technical specs
  const fetchTechnicalSpecs = async () => {
    try {
      const response = await sheets.getTechnicalSpecs();
      setAvailableSpecs(response.data.technicalSpecs);
    } catch {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Falha ao carregar especificações técnicas",
        type: "error",
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectSpec = (id) => {
    const spec = availableSpecs.find((s) => s.idTechnicalSpec === id);
    if (spec && !technicalSpecs.some((s) => s.idTechnicalSpec === id)) {
      setTechnicalSpecs([...technicalSpecs, { ...spec, value: "" }]);
    }
  };

  const handleTechnicalChange = (id, value) => {
    setTechnicalSpecs((prev) =>
      prev.map((spec) =>
        spec.idTechnicalSpec === id ? { ...spec, value } : spec
      )
    );
  };

  const handleRemoveSpec = (id) =>
    setTechnicalSpecs(technicalSpecs.filter((s) => s.idTechnicalSpec !== id));

  const handleAddNewSpec = async () => {
    if (!newSpecName.trim()) return;
    try {
      const response = await sheets.createTechnicalSpec({
        technicalSpecKey: newSpecName,
      });
      const createdSpec = response.data.technicalSpec;
      setAvailableSpecs([...availableSpecs, createdSpec]);
      setTechnicalSpecs([...technicalSpecs, { ...createdSpec, value: "" }]);
      setNewSpecName("");
      setAddingNewSpec(false);
    } catch (err) {
      console.error(err);
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Falha ao criar nova especificação",
        type: "error",
      });
    }
  };

  const handleFileChange = (e) => setImagem(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const techSpecsObj = {};
    technicalSpecs.forEach((spec) => {
      if (spec.value.trim())
        techSpecsObj[spec.idTechnicalSpec] = spec.value.trim();
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

    let newItemId = null;

    try {
      const response = await sheets.postAddItem(payload);
      newItemId = response.data?.itemId;

      setModalInfo({
        open: true,
        title: "Sucesso!",
        message: response.data?.message || "Item adicionado!",
        type: "success",
      });

      setFormData({});
      setTechnicalSpecs([]);
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

    if (imagem && newItemId) {
      try {
        const responseImg = await sheets.insertImage(newItemId, imagem);
        console.log(responseImg.data?.message || "Imagem enviada com sucesso!");
      } catch (err) {
        console.error("Erro ao enviar imagem:", err);
        setModalInfo({
          open: true,
          title: "Atenção!",
          message:
            err.response?.data?.details ||
            "Item criado, mas falha ao enviar imagem",
          type: "error",
        });
      }
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

          {/* Outros campos do formulário */}
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
                    {loc.place} - {loc.code}
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

          {/* Dropdown Technical Specs */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Especificações técnicas</InputLabel>
            <Select
              value=""
              onChange={(e) => {
                if (e.target.value === "new") {
                  setAddingNewSpec(true);
                } else {
                  handleSelectSpec(e.target.value);
                }
              }}
            >
              {availableSpecs.map((spec) => (
                <MenuItem
                  key={spec.idTechnicalSpec}
                  value={spec.idTechnicalSpec}
                >
                  {spec.technicalSpecKey}
                </MenuItem>
              ))}
              <MenuItem value="new">Adicionar especificação...</MenuItem>
            </Select>
          </FormControl>

          {addingNewSpec && (
            <Box display="flex" gap={1} mt={1} alignItems="center">
              <TextField
                label="Nova especificação"
                value={newSpecName}
                onChange={(e) => setNewSpecName(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddNewSpec}>
                Adicionar
              </Button>
            </Box>
          )}

          {/* Lista de specs selecionadas */}
          {technicalSpecs.map((spec) => (
            <Box
              key={spec.idTechnicalSpec}
              display="flex"
              gap={1}
              alignItems="center"
              mt={1}
            >
              <TextField
                label={spec.technicalSpecKey}
                value={spec.value}
                onChange={(e) =>
                  handleTechnicalChange(spec.idTechnicalSpec, e.target.value)
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveSpec(spec.idTechnicalSpec)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

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
