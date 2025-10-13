import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomModal from "../components/mod/CustomModal";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderPrincipal from "../components/layout/HeaderPrincipal";
import Footer from "../components/layout/Footer";
import api from "../services/axios";
import ModalDescription from "../components/mod/ModalDescription";
import AddItemModal from "../components/mod/AddItemModal";

function Itens() {
  const [search, setSearch] = useState("");
  const [allItens, setAllItens] = useState([]);
  const [itens, setItens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const refreshItens = async () => {
    try {
      const response = await api.getItens();
      const data = Array.isArray(response.data.items)
        ? response.data.items
        : [];
      setAllItens(data); 
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Erro ao carregar a lista de itens"
      );
      setAllItens([]); 
      setItens([]); 
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      const data = Array.isArray(response.data.categories)
        ? response.data.categories
        : [];
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleFilter = () => {
    let filtered = allItens;

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.some(
          (category) => item.fkIdCategory === category.idCategory 
        )
      );
    }

    setItens(filtered);
    
    if (allItens.length > 0 && filtered.length === 0) {
      setErrorMessage("Nenhum item encontrado com o filtro atual.");
    } else if (allItens.length === 0) {
      setErrorMessage("Nenhum item cadastrado no sistema.");
    } else {
      setErrorMessage("");
    }
  };

  const handleOpenModal = (itemId) => {
    setSelectedItem(itemId);
    setModalOpen(true);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (
        prevSelectedCategories.some(
          (cat) => cat.idCategory === category.idCategory
        )
      ) {
        return prevSelectedCategories.filter(
          (cat) => cat.idCategory !== category.idCategory
        );
      } else {
        return [...prevSelectedCategories, category];
      }
    });
  };

  const handleOpenModalAdd = () => {
    setDrawerOpen(false);
    setModalAddOpen(true);
  };

  const handleCloseModalAdd = () => {
    setModalAddOpen(false);
  };

  const idUser = localStorage.getItem("idUsuario");

  useEffect(() => {
    document.title = "Itens | SENAI";
    
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          refreshItens(), 
          fetchCategories(), 
        ]);
      } catch (error) {
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [allItens, search, selectedCategories, categories]);


  const getTitle = (item) => item.name || "";
  
  const getSpecs = (item) => {
    const specs = item.technicalSpecs;
    if (!specs || !Array.isArray(specs)) return "";
    
    return specs.map((spec) => spec.technicalSpecValue).join(", ");
  };

  const getCategoryName = (item) => {
    if (!item.fkIdCategory || categories.length === 0) return "";
    const category = categories.find(cat => cat.idCategory === item.fkIdCategory);
    return category ? category.categoryValue : "";
  };
  


  const CardItem = ({ item, index, onOpenModal }) => {
    const title = getTitle(item) || `Item ${item.idItem ?? index}`;
    const specsRaw = getSpecs(item);
    const specsPreview =
      specsRaw.length > 140 ? specsRaw.slice(0, 140) + "..." : specsRaw;
    const categoryName = getCategoryName(item);

    return (
      <Card key={item.idItem ?? index} sx={styles.card} elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", alignItems: "row", gap: 2, mb: 1 }}>
            <Box sx={styles.iconContainer}>
              <Add sx={styles.icon} />
            </Box>
            <Typography sx={styles.cardTitle}>{title}</Typography>
          </Box>

          <Typography sx={{ fontWeight: 600, mb: 0.5, mt: -5 }}>
            Especificação técnica:
          </Typography>
          {specsPreview ? (
            <Typography sx={styles.specs}>{specsPreview}</Typography>
          ) : (
            <Typography
              sx={{ ...styles.specs, fontStyle: "italic", color: "#777" }}
            >
              — Nenhuma especificação cadastrada.
            </Typography>
          )}

          {categoryName && (
            <Typography sx={{ mt: 1, fontWeight: 500 }}>
              Categoria: {categoryName}
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-start", mt: 1, p: 0 }}>
          <Button
            size="small"
            sx={styles.verMaisButton}
            onClick={() => onOpenModal(item.idItem)}
          >
            Ver mais
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={styles.pageContainer}>
      <HeaderPrincipal />
      <Box sx={styles.content}>
        <Typography variant="h4" gutterBottom sx={styles.headerTitle}>
          Itens
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            maxWidth: 1000,
            mx: "auto",
            p: 1,
            borderRadius: "8px",
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ color: "#a31515" }}
          >
            <MenuIcon />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Filtro de produto ex: chave"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              borderRadius: 20,
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
          />
        </Box>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { backgroundColor: "#a31515", color: "#fff", width: 240 },
          }}
        >
          <Typography sx={{ p: 2, fontWeight: "bold" }}>
            Filtro Avançado
          </Typography>
          <List>
            {categories.map((cat) => (
              <ListItem
                key={cat.idCategory}
                button
                onClick={() => handleSelectCategory(cat)}
              >
                <Checkbox
                  checked={selectedCategories.some(
                    (category) => category.idCategory === cat.idCategory
                  )}
                  sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                />
                <ListItemText primary={cat.categoryValue} />
              </ListItem>
            ))}
            <ListItem button onClick={handleOpenModalAdd}>
              <ListItemText
                primary="+ Adicionar Item"
                sx={{ fontWeight: "bold", cursor: "pointer", color: "#fff" }}
              />
            </ListItem>
          </List>
        </Drawer>

        <Box sx={styles.cardsGrid}>
          {itens.length > 0 ? (
            itens.map((item, idx) => (
              <CardItem
                item={item}
                key={item.idItem ?? idx}
                index={idx}
                onOpenModal={handleOpenModal}
              />
            ))
          ) : (
            <Typography sx={{ textAlign: "center", width: "100%", mt: 4 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>

      <Footer />

      <ModalDescription
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedItem}
        idUser={idUser}
        onSuccess={(msg) => setSuccessMessage(msg)}
        onError={(msg) => setErrorModalMessage(msg)}
        onItemDeleteSuccess={refreshItens} 
      />

      {/* Modal de sucesso */}
      {successMessage && (
        <CustomModal
          open={!!successMessage}
          onClose={() => setSuccessMessage("")}
          title="Sucesso"
          message={successMessage}
          type="success"
        />
      )}

      {/* Modal de erro */}
      {errorModalMessage && (
        <CustomModal
          open={!!errorModalMessage}
          onClose={() => setErrorModalMessage("")}
          title="Erro"
          message={errorModalMessage}
          type="error"
        />
      )}

      <AddItemModal
        open={modalAddOpen}
        onClose={handleCloseModalAdd}
        idUser={idUser}
        itemId={selectedItem}
        onSuccess={() => refreshItens()}
      />
    </Box>
  );
}

export default Itens;

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  content: { flex: 1, p: { xs: 2, md: 3 } },
  headerTitle: { textAlign: "center", mb: 4 },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "28px 60px",
    paddingLeft: "30px",
    paddingRight: "30px",
    marginTop: "24px",
    width: "100%",
    boxSizing: "border-box",
    justifyItems: "center",
  },
  card: {
    width: "100%",
    minHeight: 150,
    maxWidth: "30vw",
    borderRadius: "10px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "visible",
    padding: "18px",
    backgroundColor: "#fff",
  },
  iconContainer: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 10,
  },
  icon: { fontSize: 34, color: "#6c757d" },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#222",
    mt: 0.5,
    ml: 5,
  },
  specs: {
    fontSize: "0.95rem",
    color: "#444",
    textAlign: "left",
    lineHeight: 1.3,
  },
  verMaisButton: {
    backgroundColor: "rgba(177,16,16,1)",
    "&:hover": { backgroundColor: "rgba(150,14,14,1)" },
    color: "#fff",
    textTransform: "none",
    borderRadius: "18px",
    padding: "6px 18px",
  },
};