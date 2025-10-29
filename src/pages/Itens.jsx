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
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomModal from "../components/mod/CustomModal";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderPrincipal from "../components/layout/HeaderPrincipal";
import Footer from "../components/layout/Footer";
import api from "../services/axios";
import ModalDescription from "../components/mod/ModalDescription";
import AddItemModal from "../components/mod/AddItemModal";

const DEFAULT_LIMIT = 15;

function Itens() {
  const [search, setSearch] = useState("");
  const [itens, setItens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  }); // Buscar categorias (mantido inalterado)

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
  }; // FUNÇÃO UNIFICADA: LIDA COM BUSCA INICIAL E FILTRAGEM COM PAGINAÇÃO

  const handleFilter = async (filterPage = 1) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const filterData = {
        name: search.trim() || "",
        idCategory: selectedCategories.map((cat) => cat.idCategory),
        page: filterPage,
        limit: DEFAULT_LIMIT,
      };

      const hasFilters =
        filterData.name !== "" || filterData.idCategory.length > 0;
      let response;
      if (hasFilters) {
        response = await api.filterItens(filterData);
      } else {
        response = await api.getItens({
          params: { page: filterPage, limit: DEFAULT_LIMIT },
        });
      }

      const itensList = response.data.items || [];
      const paginationData = response.data.pagination;

      setItens(itensList);
      setTotalPages(paginationData?.totalPages || 1);
      setPage(filterPage);

      setErrorMessage(itensList.length === 0 ? "Nenhum item encontrado." : "");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Erro ao carregar os itens. Verifique o console."
      );
      setItens([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }; // Handler para mudança de página

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    handleFilter(newPage);
  }; // Abre o modal de detalhes do item

  const handleOpenModal = (itemId) => {
    setSelectedItem(itemId);
    setModalOpen(true);
  }; // Selecionar ou desmarcar uma categoria

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
    handleFilter(1);
    fetchCategories();
  }, []);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    handleFilter(1);
  }, [search, selectedCategories]);

  const getTitle = (item) => item.name || "";
  const getSpecs = (item) =>
    item.technicalSpecs?.map((spec) => spec.technicalSpecValue).join(", ") ||
    "";

  const CardItem = ({ item, index, onOpenModal }) => {
    const title = getTitle(item) || `Item ${index + 1}`;
    const specsRaw = getSpecs(item);
    const specsPreview =
      specsRaw.length > 140 ? specsRaw.slice(0, 140) + "..." : specsRaw;

    return (
      <Card key={item.idItem ?? index} sx={styles.card} elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 1 }}>
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
              — Nenhuma descrição cadastrada.
            </Typography>
          )}

          {item.category?.value && (
            <Typography sx={{ mt: 1, fontWeight: 500 }}>
              Categoria: {item.category.value}
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
      <Box //scroll
        sx={{
          ...styles.content,
          overflowY: "auto",
          maxHeight: "calc(100vh - 150px)",
          paddingRight: "8px",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#fff",
            borderRadius: "8px",
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={styles.headerTitle}>
          Itens
        </Typography>
        {/* Filtro com menu hamburguer */}
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
        {/* Drawer lateral para categorias */}
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
        {/* Cards dos itens */}
        <Box sx={styles.cardsGrid}>
          {loading ? (
            <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
              <CircularProgress color="error" />
              <Typography sx={{ mt: 1, color: "#555" }}>
                Carregando Itens...
              </Typography>
            </Box>
          ) : itens.length > 0 ? (
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
              {errorMessage || "Nenhum item encontrado."}
            </Typography>
          )}
        </Box>
        {/* COMPONENTE DE PAGINAÇÃO */}
        {totalPages > 1 && !loading && (
          <Box sx={styles.paginationBox}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary" // 🛑 ESTILIZAÇÃO CORRIGIDA PARA USAR A CONSTANTE senaiRed
              sx={{
                "& .MuiPaginationItem-root": { color: styles.senaiRed },
                "& .Mui-selected": {
                  backgroundColor: styles.senaiRed,
                  color: "white",
                },
              }}
            />
          </Box>
        )}
      </Box>
      <Footer />

      <ModalDescription
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedItem}
        idUser={idUser}
        onSuccess={(msg) => setSuccessMessage(msg)}
        onError={(msg) => setErrorModalMessage(msg)}
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
        onSuccess={() => handleFilter(page)} // Chama o filtro na página atual após o sucesso
      />
    </Box>
  );
}

export default Itens;

// Estilos
const styles = {
  // 🛑 Adiciona a cor de marca para ser usada na paginação
  senaiRed: "#A31515",

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
  // 🛑 NOVO: Estilo para a caixa da paginação (igual ao UserManagement)
  paginationBox: {
    display: "flex",
    justifyContent: "center",
    mt: 3,
    py: 1,
  },
};
