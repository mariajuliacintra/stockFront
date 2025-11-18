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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "./CustomModal";
import sheets from "../../services/axios";
import { useCategories } from "../hooks/useCategories";
import { useLocations } from "../hooks/useLocations";
import { useTechnicalSpecs } from "../hooks/useTechnicalSpecs";
import heic2any from "heic2any";

// --- [ 1. COMPONENTE AUXILIAR ] ---
const CustomModalComponent = ({
  open,
  onClose,
  title,
  message,
  type = "info",
}) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      message={message}
      type={type}
    />
  );
};

// --- [ 2. COMPONENTE PRINCIPAL ] ---

export default function AddItemModal({ open, onClose, idUser, onSuccess }) {
  const styles = getStyles();

  const [formData, setFormData] = useState({});
  const [technicalSpecs, setTechnicalSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });
  const [imagem, setImagem] = useState(null);
  const [userRole, setUserRole] = useState("");

  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [addingNewLocation, setAddingNewLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationCode, setNewLocationCode] = useState("");
  const [addingNewSpec, setAddingNewSpec] = useState(false);

  // Hooks (mantidos)
  const {
    categories,
    loadingCategories,
    savingNewCategory,
    fetchCategories,
    createCategory,
  } = useCategories(open, setModalInfo);

  const {
    locations,
    loadingLocations,
    savingNewLocation,
    fetchLocations,
    createLocation,
  } = useLocations(open, setModalInfo);

  const {
    availableSpecs,
    savingNewSpec,
    newSpecName,
    setNewSpecName,
    fetchTechnicalSpecs,
    handleNewSpec,
  } = useTechnicalSpecs(open, setModalInfo, setTechnicalSpecs);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isHEIC =
      file.type === "image/heic" ||
      file.type.includes("heic") ||
      file.type.includes("heif") ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHEIC) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });
        const finalBlob = Array.isArray(convertedBlob)
          ? convertedBlob[0]
          : convertedBlob;
        const baseName = file.name.split(".").slice(0, -1).join(".") || "image";
        const newFileName = `${baseName}.jpg`;

        const convertedFile = new File([finalBlob], newFileName, {
          type: "image/jpeg",
        });

        setImagem(convertedFile);
      } catch (error) {
        console.error("Erro na conversão HEIC:", error);
        setModalInfo({
          open: true,
          title: "Erro de Imagem!",
          message: "Não foi possível converter o arquivo HEIC. Tente JPEG/PNG.",
          type: "error",
        });
      }
    } else {
      setImagem(file);
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
        message: "Informe ao menos uma especificação técnica",
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
        message:
          error.response?.data?.details ||
          "Erro desconhecido ao adicionar item.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }

    if (imagem && newItemId) {
      try {
        const imageData = new FormData();
        imageData.append("image", imagem);
        await sheets.insertImageWithFormData(newItemId, imageData);
        await sheets.insertImage(newItemId, imagem);
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
        {/* 🎯 WRAPPER: Controla a posição central e a altura máxima */}
        <Box sx={styles.absoluteWrapper}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={styles.modalFormBox}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              color="#A31515"
              sx={styles.titleStyle}
            >
              Adicionar Novo Item
            </Typography>

            {/* Divisor 1: Informações Básicas */}
            <Typography
              variant="h6"
              mt={1}
              mb={1}
              color="#555"
              fontWeight="bold"
              sx={styles.sectionTitle}
            >
              Informações Básicas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              label="SAP Code"
              name="sapCode"
              fullWidth
              required
              variant="filled"
              value={formData.sapCode || ""}
              onChange={handleFormChange}
              sx={styles.filledTextField}
            />
            <TextField
              label="Nome"
              name="name"
              fullWidth
              required
              variant="filled"
              value={formData.name || ""}
              onChange={handleFormChange}
              sx={styles.filledTextField}
            />
            <TextField
              label="Marca"
              name="brand"
              fullWidth
              required
              variant="filled"
              value={formData.brand || ""}
              onChange={handleFormChange}
              sx={styles.filledTextField}
            />
            <TextField
              label="Descrição"
              name="description"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={formData.description || ""}
              onChange={handleFormChange}
              sx={styles.outlinedTextField}
            />

            {/* Divisor 2: Estoque e Categoria */}
            <Typography
              variant="h6"
              mt={3}
              mb={1}
              color="#555"
              fontWeight="bold"
              sx={styles.sectionTitle}
            >
              Estoque e Categoria
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* SELECT DE CATEGORIA */}
            <FormControl fullWidth variant="filled" sx={styles.filledTextField}>
              <InputLabel>Categoria</InputLabel>
              <Select
                required
                name="fkIdCategory"
                value={formData.fkIdCategory || ""}
                onChange={(e) => {
                  if (e.target.value === "newCategory") {
                    setAddingNewCategory(true);
                    setFormData({ ...formData, fkIdCategory: "" });
                  } else {
                    handleFormChange(e);
                    setAddingNewCategory(false);
                  }
                }}
              >
                {loadingCategories ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                  </MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat.idCategory} value={cat.idCategory}>
                      {cat.categoryValue}
                    </MenuItem>
                  ))
                )}
                {userRole === "manager" && (
                  <MenuItem
                    value="newCategory"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    Adicionar nova categoria...
                  </MenuItem>
                )}
              </Select>

              {addingNewCategory && (
                <Box
                  display="flex"
                  gap={1}
                  alignItems="center"
                  mt={2}
                  p={1}
                  sx={styles.newInputBox}
                >
                  <TextField
                    label="Nova Categoria"
                    value={formData.newCategoryName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newCategoryName: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={async () => {
                      const newCategory = await createCategory(
                        formData.newCategoryName
                      );

                      if (newCategory?.idCategory) {
                        await fetchCategories();
                        setFormData({
                          ...formData,
                          fkIdCategory: newCategory.idCategory,
                          newCategoryName: "",
                        });
                      }

                      setAddingNewCategory(false);
                    }}
                    disabled={
                      savingNewCategory || !formData.newCategoryName?.trim()
                    }
                    sx={styles.saveActionButton}
                  >
                    {savingNewCategory ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setAddingNewCategory(false);
                      setFormData({ ...formData, newCategoryName: "" });
                    }}
                    color="error"
                    sx={styles.cancelActionButton}
                  >
                    Cancelar
                  </Button>
                </Box>
              )}
            </FormControl>

            <TextField
              label="Quantidade"
              name="quantity"
              type="number"
              fullWidth
              variant="filled"
              value={formData.quantity || ""}
              onChange={handleFormChange}
              required
              InputProps={{ inputProps: { min: 0 } }}
              sx={styles.filledTextField}
            />
            <TextField
              label="Estoque Mínimo"
              name="minimumStock"
              type="number"
              fullWidth
              variant="filled"
              value={formData.minimumStock || ""}
              onChange={handleFormChange}
              required
              InputProps={{ inputProps: { min: 0 } }}
              sx={styles.filledTextField}
            />

            {/* SELECT DE LOCALIZAÇÃO */}
            <FormControl fullWidth variant="filled" sx={styles.filledTextField}>
              <InputLabel>Localização</InputLabel>
              <Select
                name="fkIdLocation"
                value={formData.fkIdLocation || ""}
                onChange={(e) => {
                  if (e.target.value === "newLocation") {
                    setAddingNewLocation(true);
                    setFormData({ ...formData, fkIdLocation: "" });
                  } else {
                    handleFormChange(e);
                    setAddingNewLocation(false);
                  }
                }}
              >
                {loadingLocations ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                  </MenuItem>
                ) : (
                  locations.map((loc) => (
                    <MenuItem key={loc.idLocation} value={loc.idLocation}>
                      {loc.place} - {loc.code}
                    </MenuItem>
                  ))
                )}

                {userRole === "manager" && (
                  <MenuItem
                    value="newLocation"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    Adicionar nova localização...
                  </MenuItem>
                )}
              </Select>

              {addingNewLocation && (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  mt={2}
                  p={1}
                  sx={styles.newInputBox}
                >
                  <TextField
                    label="Nome da Localização (Ex: Armário A)"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    fullWidth
                    required
                    size="small"
                  />
                  <TextField
                    label="Código/Bloco (Ex: B1)"
                    value={newLocationCode}
                    onChange={(e) => setNewLocationCode(e.target.value)}
                    fullWidth
                    required
                    size="small"
                  />

                  <Box display="flex" gap={1} alignItems="center">
                    <Button
                      variant="contained"
                      onClick={async () => {
                        const newLocation = await createLocation(
                          newLocationName,
                          newLocationCode
                        );

                        if (newLocation?.idLocation) {
                          await fetchLocations();
                          setFormData({
                            ...formData,
                            fkIdLocation: newLocation.idLocation,
                          });
                        }

                        setNewLocationName("");
                        setNewLocationCode("");
                        setAddingNewLocation(false);
                      }}
                      disabled={
                        savingNewLocation ||
                        !newLocationName.trim() ||
                        !newLocationCode.trim()
                      }
                      sx={styles.saveActionButton}
                    >
                      {savingNewLocation ? (
                        <CircularProgress size={20} color="inherit" />
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
                      color="error"
                      sx={styles.cancelActionButton}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              )}
            </FormControl>
            <TextField
              label="Data de Validade (Opcional)"
              name="expirationDate"
              type="date"
              fullWidth
              variant="filled"
              value={formData.expirationDate || ""}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              sx={styles.filledTextField}
            />

            {/* Divisor 3: Especificações Técnicas */}
            <Typography
              variant="h6"
              mt={3}
              mb={1}
              color="#555"
              fontWeight="bold"
              sx={styles.sectionTitle}
            >
              Especificações Técnicas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* SELECT DE ESPECIFICAÇÃO */}
            <FormControl
              fullWidth
              variant="outlined"
              sx={styles.outlinedTextField}
            >
              <InputLabel>Adicionar Especificação (obrigatório)</InputLabel>
              <Select
                value=""
                onChange={(e) => {
                  if (e.target.value === "new" && userRole === "manager") {
                    setAddingNewSpec(true);
                  } else {
                    handleSelectSpec(e.target.value);
                  }
                }}
                label="Adicionar Especificação (obrigatório)"
              >
                <MenuItem disabled>Selecione ou adicione...</MenuItem>
                {availableSpecs.map((spec) => (
                  <MenuItem
                    key={spec.idTechnicalSpec}
                    value={spec.idTechnicalSpec}
                  >
                    {spec.technicalSpecKey}
                  </MenuItem>
                ))}
                {userRole === "manager" && (
                  <MenuItem
                    value="new"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    Adicionar nova especificação...
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            {addingNewSpec && userRole === "manager" && (
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                mt={2}
                p={1}
                sx={styles.newInputBox}
              >
                <TextField
                  label={"Nova Especificação"}
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={async () => {
                    await handleNewSpec();
                    setAddingNewSpec(false);
                  }}
                  disabled={savingNewSpec || !newSpecName.trim()}
                  sx={styles.saveActionButton}
                >
                  {savingNewSpec ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Salvar"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAddingNewSpec(false);
                    setNewSpecName("");
                  }}
                  color="error"
                  sx={styles.cancelActionButton}
                >
                  Cancelar
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
                sx={{ width: "100%" }} // Garantir largura total
              >
                <TextField
                  label={spec.technicalSpecKey}
                  value={spec.value}
                  onChange={(e) =>
                    handleTechnicalChange(spec.idTechnicalSpec, e.target.value)
                  }
                  sx={{ flex: 1 }}
                  required
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveSpec(spec.idTechnicalSpec)}
                  aria-label={`Remover ${spec.technicalSpecKey}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {/* Divisor 4: Imagem */}
            <Typography
              variant="h6"
              mt={3}
              mb={1}
              color="#555"
              fontWeight="bold"
              sx={styles.sectionTitle}
            >
              Imagem
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={styles.imageUploadBox}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "#555", fontWeight: 500 }}
              >
                Imagem do item (Opcional)
              </Typography>
              <label
                htmlFor="upload-image"
                style={styles.imageUploadLabel}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#7c0f0f")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#A31515")}
              >
                {imagem ? "Alterar Imagem" : "Selecionar Imagem"}
                <span style={{ fontWeight: "bold", marginLeft: "8px" }}>+</span>
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
                  Arquivo selecionado: **{imagem.name}**
                </Typography>
              )}
              {imagem && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => setImagem(null)}
                  sx={{ mt: 1 }}
                >
                  Remover Imagem
                </Button>
              )}
            </Box>

            {/* Botões de ação do form */}
            <Box
              mt={4}
              display="flex"
              justifyContent="flex-end"
              gap={1}
              sx={styles.formActionsBox}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                color="error"
                sx={styles.cancelFinalButton}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={styles.submitFinalButton}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Adicionar Item"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <CustomModalComponent
        open={modalInfo.open}
        onClose={() => setModalInfo({ ...modalInfo, open: false })}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </>
  );
}

// --- [ FUNÇÕES DE ESTILIZAÇÃO ] ---

function getStyles() {
  const primaryRed = "#A31515";
  const baseHeight = 40;
  const baseFontSize = 14;

  return {
    absoluteWrapper: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",

      width: { xs: "95%", sm: "80%", md: "60%" },
      maxWidth: { xs: "95%", sm: "80%", md: "50%" },
      maxHeight: "95vh",

      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
        backgroundColor: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: "3px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },

      p: { xs: 1, sm: 0 },
      "@media (max-width: 600px)": {
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        maxHeight: "calc(95vh - 20px)",
        width: "100%",
        padding: "0 0",
      },
    },

    modalFormBox: {
      width: { xs: "85%", sm: "90%" },
      bgcolor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      p: { xs: 3, md: 4 },
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
    },

    // 2. Estilo do Título e Seções
    titleStyle: {
      fontSize: { xs: "1.5rem", sm: "1.75rem" },
    },
    sectionTitle: {
      fontSize: { xs: "0.95rem", sm: "1.25rem" },
      mt: { xs: 2, sm: 3 },
      mb: 1,
    },

    // --- 3. Estilos dos Campos de Texto (Densidade Otimizada) ---
    filledTextField: {
      mt: { xs: 1, sm: 2 },
      mb: { xs: 1, sm: 1 },

      "& .MuiFilledInput-root": {
        paddingTop: "6px",
        paddingBottom: "6px",
      },
      "& .MuiInputBase-input": {
        padding: "8px 10px",
        fontSize: "14px",
      },
      "& .MuiInputLabel-root": {
        fontSize: "14px",
        transform: "translate(12px, 10px) scale(1)",
        "&.MuiInputLabel-shrink": {
          transform: "translate(12px, -9px) scale(0.75)",
        },
      },
    },
    outlinedTextField: {
      mt: { xs: 1, sm: 2 },
      mb: { xs: 1, sm: 1 },
    },

    // --- 4. Estilos de Botões de Ação (Adicionar/Cancelar) ---
    saveActionButton: {
      backgroundColor: primaryRed,
      color: "#fff",
      height: 30,
      fontSize: 12,
      "&:hover": { backgroundColor: "#7c0f0f" },
    },
    cancelActionButton: {
      height: 30,
      fontSize: 12,
    },
    newInputBox: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      flexDirection: { xs: "column", sm: "row" },
      width: "100%",
      gap: { xs: 1, sm: 1 },
    },

    // --- 5. Estilos Finais de Ação do Formulário ---
    formActionsBox: {
      justifyContent: { xs: "space-between", sm: "flex-end" },
      width: "100%",
      gap: 1,
      mt: 4,
    },
    submitFinalButton: {
      backgroundColor: primaryRed,
      height: baseHeight,
      fontSize: baseFontSize,
      "&:hover": { backgroundColor: "#7c0f0f" },
      width: { xs: "calc(50% - 5px)", sm: "auto" },
    },
    cancelFinalButton: {
      height: baseHeight,
      width: { xs: "calc(50% - 5px)", sm: "auto" },
      fontSize: baseFontSize,
    },

    // --- 6. Estilos de Upload de Imagem ---
    imageUploadBox: {
      border: "2px dashed #ccc",
      borderRadius: "8px",
      p: 2,
      textAlign: "center",
      mt: 2,
      mb: 2,
      transition: "0.3s",
      "&:hover": { borderColor: primaryRed, backgroundColor: "#fef8f8" },
    },
    imageUploadLabel: {
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: primaryRed,
      border: "1px solid #A31515",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      color: "#fff",
      transition: "all 0.3s",
    },
  };
}
