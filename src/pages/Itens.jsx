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
import sheets from "../services/axios";

function Itens() {
  const { category } = useParams();
  const [search, setSearch] = useState("");
  const [itens, setItens] = useState([]);

  const categoryDisplay = {
    tools: "Ferramentas",
    materials: "Materiais",
    products: "Produtos",
    equipments: "Equipamentos",
    rawMaterials: "Matéria-prima",
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
  const fetchItens = async (filter = "") => {
    if (!category) return;
    try {
      const config = filter ? { params: { nome: filter } } : {};
      const response = await sheets.getItens(category, config);
      // resposta esperada: array no response.data
      setItens(Array.isArray(response.data) ? response.data : []);
      console.log("Itens recebidos:", response.data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      setItens([]);
    }
  };

  useEffect(() => {
    if (!category) return;
    document.title = `${categoryDisplay[category] || category} | SENAI`;
    fetchItens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleFilter = () => fetchItens(search);

  // Extrai título e especificação de forma robusta (vários nomes de campo possíveis)
  const getTitle = (item) => item.name;
  const getSpecs = (item) => item.technicalSpecs;

  const CardItem = ({ item, index }) => {
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
            onClick={() => console.log("ver mais", id)}
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
              <CardItem item={item} key={idx} index={idx} />
            ))
          ) : (
            <Typography sx={{ textAlign: "center", width: "100%", mt: 4 }}>
              Nenhum item encontrado.
            </Typography>
          )}
        </Box>
      </Box>

      <Footer />
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
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
    },
    gap: "60px",
    maxWidth: "85vw",
    width: "100%",
    justifyItems: "center",
    marginTop: "24px",
    mx: "auto",
  },
  card: {
    width: "100%",
    minHeight: 170,
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
