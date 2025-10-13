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

export default function AddItemModal({ open, onClose, idUser, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [locations, setLocations] = useState([]);
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [technicalSpecs, setTechnicalSpecs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });
  const [imagem, setImagem] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [addingNewSpec, setAddingNewSpec] = useState(false);
  const [newSpecName, setNewSpecName] = useState("");
  const [savingNewSpec, setSavingNewSpec] = useState(false);
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [savingNewCategory, setSavingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingNewLocation, setAddingNewLocation] = useState(false);
  const [savingNewLocation, setSavingNewLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationCode, setNewLocationCode] = useState("");

  useEffect(() => {
    if (open) {
      fetchLocations();
      fetchCategories();
      fetchTechnicalSpecs();
    }

    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, [open]);

  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await sheets.getLocations();
      setLocations(response.data.locations);
    } catch {
      const errorMessage = error?.response?.data?.error;
      setModalInfo({
        open: true,
        title: "Error!",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoadingLocations(false);
    }
  };

  const createLocation = async (locationName, locationCode) => {
    try {
      const response = await sheets.createLocation({
        place: locationName,
        code: locationCode,
      });
      fetchLocations();

      setModalInfo({
        open: true,
        title: "Sucesso!",
        message: response.data.message,
        type: "success",
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao criar localização:", error);
      const errorMessage = error?.response?.data?.error;
      setModalInfo({
        open: true,
        title: "Error!",
        message: errorMessage,
        type: "error",
      });
      return null;
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

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await sheets.getCategories();
      setCategories(response.data.categories);
    } catch {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Falha ao carregar categorias",
        type: "error",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setSavingNewCategory(true);

      const response = await sheets.createCategory({
        categoryValue: newCategoryName.trim(),
      });
      const data = response.data;

      if (data.success) {
        setNewCategoryName("");
        setAddingNewCategory(false);
        await fetchCategories();
        setModalInfo({
          open: true,
          title: "Sucesso!",
          message: "Categoria criada com sucesso!",
          type: "success",
        });
        fetchCategories();
        return data.data?.[0];
      } else {
        setModalInfo({
          open: true,
          title: "Erro!",
          message: data.message || "Falha ao criar categoria",
          type: "error",
        });
      }
    } catch (erro) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: erro.response?.data?.details || "Falha ao criar categoria",
        type: "error",
      });
    } finally {
      setSavingNewCategory(false);
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

  const handleFileChange = (e) => setImagem(e.target.files[0]);

  const handleNewSpec = async () => {
    if (!newSpecName.trim()) return;

    try {
      setSavingNewSpec(true);
      const technicalSpecKey = newSpecName.trim();
      const response = await sheets.createTechnicalSpec({ technicalSpecKey });
      const data = response.data;

      if (data.success) {
        setNewSpecName("");
        setAddingNewSpec(false);
        await fetchTechnicalSpecs();

        const createdSpec = data.technicalSpec?.[0];
        if (createdSpec?.technicalSpecId) {
          setTechnicalSpecs((prevSpecs) => [
            ...prevSpecs,
            {
              idTechnicalSpec: createdSpec.technicalSpecId,
              technicalSpecKey: createdSpec.technicalSpecKey,
              value: "",
            },
          ]);
        } else {
          setModalInfo({
            open: true,
            title: "Erro!",
            message: "ID da nova especificação não retornou corretamente",
            type: "error",
          });
        }
      } else {
        setModalInfo({
          open: true,
          title: "Erro!",
          message: data.message,
          type: "error",
        });
      }
    } catch (erro) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: erro.response?.data?.details || "Falha ao criar especificação",
        type: "error",
      });
    } finally {
      setSavingNewSpec(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const techSpecsObj = {};
    technicalSpecs.forEach((prevSpecs) => {
      if (prevSpecs.value.trim())
        techSpecsObj[prevSpecs.idTechnicalSpec] = prevSpecs.value.trim();
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
      const data = response.data;

      // Verifica success
      if (data.success === true) {
        newItemId = data.data[0]?.itemId;

        setModalInfo({
          open: true,
          title: "Sucesso!",
          message: data.message || "Item adicionado!",
          type: "success",
        });

        setFormData({});
        setTechnicalSpecs([]);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        // success === false
        setModalInfo({
          open: true,
          title: "Erro!",
          message: data.message || "Falha ao adicionar item",
          type: "error",
        });
      }
    } catch (error) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: error.response?.data?.details,
        type: "error",
      });
    } finally {
      setLoading(false);
    }

    if (imagem && newItemId) {
      try {
        const responseImg = await sheets.insertImage(newItemId, imagem);
      } catch (err) {
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              required 
              name="fkIdCategory"
              value={formData.fkIdCategory || ""}
              onChange={(e) => {
                if (e.target.value === "newCategory") {
                  setAddingNewCategory(true);
                  setFormData({ ...formData, fkIdCategory: "" }); // limpa valor
                } else {
                  handleFormChange(e);
                  setAddingNewCategory(false);
                }
              }}
            >
              {loadingCategories ? (
                <MenuItem disabled>
                  <CircularProgress size={20} /> Carregando...
                </MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat.idCategory} value={cat.idCategory}>
                    {cat.categoryValue}
                  </MenuItem>
                ))
              )}
              {userRole === "manager" && (
                <MenuItem value="newCategory">
                  Adicionar nova categoria...
                </MenuItem>
              )}
            </Select>

            {addingNewCategory && (
              <Box display="flex" gap={1} alignItems="center" mt={1}>
                <TextField
                  label="Nova Categoria"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  fullWidth
                  required 
                />
                <Button
                  variant="contained"
                  onClick={async () => {
                    const response = await createCategory(newCategoryName);
                    const createdCategoryId = response?.categoryId;

                    if (createdCategoryId) {
                      const newCategory = {
                        idCategory: createdCategoryId,
                        categoryValue: newCategoryName,
                      };

                      setCategories((prev) => [...prev, newCategory]);
                      setFormData({
                        ...formData,
                        fkIdCategory: createdCategoryId,
                      });
                    }

                    setNewCategoryName("");
                    setAddingNewCategory(false);
                  }}
                  disabled={savingNewCategory}
                >
                  {savingNewCategory ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Salvar"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAddingNewCategory(false);
                    setNewCategoryName("");
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            )}
          </FormControl>
          <TextField
            label="SAP Code"
            name="sapCode"
            fullWidth
            required 
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
            required 
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
            required 
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Localização</InputLabel>
            <Select
              name="fkIdLocation"
              value={formData.fkIdLocation || ""}
              onChange={(e) => {
                if (e.target.value === "newLocation") {
                  setAddingNewLocation(true);
                  setFormData({ ...formData, fkIdLocation: "" }); // limpa seleção
                } else {
                  handleFormChange(e);
                  setAddingNewLocation(false);
                }
              }}
            >
              {loadingLocations ? (
                <MenuItem disabled>
                  <CircularProgress size={20} /> Carregando...
                </MenuItem>
              ) : (
                locations.map((loc) => (
                  <MenuItem key={loc.idLocation} value={loc.idLocation}>
                    {loc.place} - {loc.code}
                  </MenuItem>
                ))
              )}

              {userRole === "manager" && (
                <MenuItem value="newLocation">
                  Adicionar nova localização...
                </MenuItem>
              )}
            </Select>

            {addingNewLocation && (
              <Box display="flex" flexDirection="column" gap={1} mt={1}>
                <TextField
                  label="Nova Localização"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  fullWidth
                  required 
                />
                <TextField
                  label="Bloco"
                  value={newLocationCode}
                  onChange={(e) => setNewLocationCode(e.target.value)}
                  fullWidth
                  required 
                />

                <Box display="flex" gap={1} alignItems="center">
                  <Button
                    variant="contained"
                    onClick={async () => {
                      const response = await createLocation(
                        newLocationName,
                        newLocationCode
                      );

                      const createdLocationId = response?.locationId;

                      if (createdLocationId) {
                        const newLocation = {
                          idLocation: createdLocationId,
                          place: newLocationName,
                          code: newLocationCode,
                        };

                        setLocations((prev) => [...prev, newLocation]);
                        setFormData({
                          ...formData,
                          fkIdLocation: createdLocationId,
                        });
                      }

                      setNewLocationName("");
                      setNewLocationCode("");
                      setAddingNewLocation(false);
                    }}
                    disabled={savingNewLocation}
                  >
                    {savingNewLocation ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Salvar"
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      setAddingNewLocation(false);
                      setNewLocationName("");
                      setNewLocationCode("");
                    }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            )}
          </FormControl>
          {/* Campo de upload estilizado */}
          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
              mt: 2,
              mb: 2,
              transition: "0.3s",
              "&:hover": { borderColor: "#1976d2", backgroundColor: "#f9f9f9" },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "#555", fontWeight: 500 }}
            >
              Imagem do item que deseja adicionar
            </Typography>

            <label
              htmlFor="upload-image"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                color: "#333",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
            >
              Adicione a imagem <span style={{ fontWeight: "bold" }}>+</span>
            </label>

            <input
              id="upload-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "#777" }}
            >
              Máximo suportado 5MB
            </Typography>

            {imagem && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "#4CAF50", fontWeight: 500 }}
              >
                Arquivo selecionado: {imagem.name}
              </Typography>
            )}
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Especificações Técnicas</InputLabel>
            <Select
              value=""
              onChange={(e) => {
                if (e.target.value === "new" && userRole === "manager") {
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
              {userRole === "manager" && (
                <MenuItem value="new">Adicionar nova especificação...</MenuItem>
              )}
            </Select>

            {addingNewSpec && userRole === "manager" && (
              <Box display="flex" gap={1} alignItems="center" mt={1}>
                <TextField
                  label="Nova Especificação"
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  onClick={handleNewSpec}
                  disabled={savingNewSpec}
                >
                  {savingNewSpec ? <CircularProgress size={20} /> : "Salvar"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAddingNewSpec(false);
                    setNewSpecName("");
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            )}
          </FormControl>

          {/* Lista de specs selecionadas */}
          {technicalSpecs.map((spec, prevSpecs) => (
            <Box
              key={spec.idTechnicalSpec}
              display="flex"
              gap={1}
              alignItems="center"
              mt={1}
            >
              <TextField
                label={ prevSpecs.technicalSpecKey}
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
          {/* Botões de ação do form */}
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
