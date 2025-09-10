import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Settings,
  Archive,
  Extension,
  Construction,
  Folder,
  Add,
  Park,
} from "@mui/icons-material";
import HeaderPrincipal from "../components/layout/HeaderPrincipal";
import Footer from "../components/layout/Footer";
import api from "../services/axios";
import ModalDescription from "../components/mod/ModalDescription";

function Itens() {
  const { category } = useParams();
  const [search, setSearch] = useState("");
  const [allItens, setAllItens] = useState([]);
  const [itens, setItens] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState();

  const categoryDisplay = {
    tool: "Ferramentas",
    material: "Materiais",
    product: "Produtos",
    equipment: "Equipamentos",
    rawMaterial: "Matéria-prima",
    diverses: "Diversos",
  };

  const categoryIcon = {
    tools: <Construction sx={styles.icon} />,
    materials: <Extension sx={styles.icon} />,
    products: <Archive sx={styles.icon} />,
    equipments: <Settings sx={styles.icon} />,
    rawMaterials: <Park sx={styles.icon} />,
    diverses: <Folder sx={styles.icon} />,
  };

  // Busca itens (usa params para query string)
  const fetchItens = async () => {
    if (!category) return;
    try {
      const response = await api.getItens(category);
      const data = Array.isArray(response.data) ? response.data : [];
      setAllItens(data);
      setItens(data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
      setItens([]);
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleFilter = () => {
    if (!search.trim()) {
      setItens(allItens);
      setErrorMessage("");
      return;
    }
    const filtered = allItens.filter((item) => {
      const nome = item.name || "";
      return nome.toLowerCase().includes(search.toLowerCase());
    });
    setItens(filtered);
    if (filtered.length === 0) {
      setErrorMessage("Nenhum item encontrado.");
    } else {
      setErrorMessage("");
    }
  };
  

  useEffect(() => {
    if (!category) return;
    document.title = `${categoryDisplay[category] || category} | SENAI`;
    fetchItens();
  }, [category]);


  // Extrai título e especificação de forma robusta (vários nomes de campo possíveis)
  const getTitle = (item) => item.name;
  const getSpecs = (item) => item.technicalSpecs;

  const CardItem = ({ item, index, onOpenModal }) => {
    const title = getTitle(item) || `Item ${index + 1}`;
    const specsRaw = getSpecs(item);
    const specs = specsRaw ? specsRaw : null;
    // Opcional: truncar especificação para exibir resumo
    const specsPreview =
      specs && specs.length > 140 ? specs.slice(0, 140) + "..." : specs;

    // id de fallback
    const id =
      item.idTool ||
      item.idMaterial ||
      item.idRawMaterial ||
      item.idEquipment ||
      item.idProduct ||
      item.idDiverses;

    return (
      <Card key={id} sx={styles.card} elevation={2}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", alignItems: "row", gap: 2, mb: 1 }}>
            <Box sx={styles.iconContainer}>
              {categoryIcon[category] || <Add sx={styles.icon} />}
            </Box>
            <Typography sx={styles.cardTitle}>{title}</Typography>
          </Box>

          <Typography sx={{ fontWeight: 600, mb: 0.5, mt: -5 }}>
            Especificação técnica:
          </Typography>
          {specs ? (
            <Typography sx={styles.specs}>{specsPreview}</Typography>
          ) : (
            <Typography
              sx={{ ...styles.specs, fontStyle: "italic", color: "#777" }}
            >
              — Nenhuma descrição cadastrada.
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-start", mt: 1, p: 0 }}>
          <Button
            size="small"
            sx={styles.verMaisButton}
            onClick={() => onOpenModal(item)}
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
          {categoryDisplay[category] || category}
        </Typography>

        <Box sx={styles.filterRow}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder={`Filtro de ${
              categoryDisplay[category] || category
            } ex: chave`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ borderRadius: 50, backgroundColor: "#fff" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFilter();
            }}
          />
          <Button
            variant="contained"
            onClick={handleFilter}
            sx={{
              backgroundColor: "#a31515",
              "&:hover": { backgroundColor: "#8c1010" },
              borderRadius: 2,
              ml: 1,
            }}
          >
            FILTRAR
          </Button>
        </Box>

        <Box sx={styles.cardsGrid}>
          {itens.length > 0 ? (
            itens.map((item, idx) => (
              <CardItem
                item={item}
                key={idx}
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
        item={selectedItem}
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
  filterRow: {
    display: "flex",
    gap: 1,
    maxWidth: 1000,
    mx: "auto",
    alignItems: "center",
    p: 1,
    borderRadius: "8px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px 12px",// Reduz o espaçamento entre os cards
    paddingLeft: "50px",
    paddingRight: "50px",
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
