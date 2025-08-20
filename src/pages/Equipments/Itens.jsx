import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import HeaderPrincipal from "../../components/layout/HeaderPrincipal";
import Footer from "../../components/layout/Footer";
import sheets from "../../services/axios";

function Itens() {
  // Use o hook 'useLocation' para acessar o objeto 'state'
  const location = useLocation();
  // Acessa a propriedade 'category' do objeto 'state'.
  // O '?' garante que o código não falhe se 'state' for nulo.
  const category = location.state?.category;

  const [search, setSearch] = useState("");
  const [itens, setItens] = useState([]);

  // Função para buscar os itens da categoria
  const fetchItens = async (filter = "") => {
    // Retorna se a categoria não estiver definida,
    // prevenindo requisições indesejadas.
    if (!category) return;
    try {
      const response = await sheets.getItens(
        category,
        filter ? { nome: filter } : {}
      );
      setItens(response.data);
      console.log("Itens recebidos:", response.data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    }
  };

  // O 'useEffect' irá buscar os itens sempre que a 'category' mudar
  // (o que acontece na navegação).
  useEffect(() => {
    if (!category) return;
    document.title = `${category} | SENAI`;
    fetchItens();
  }, [category]);

  const handleFilter = () => {
    fetchItens(search);
  };

  // Se a categoria não estiver presente, mostra uma mensagem de carregamento.
  if (!category) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h5">Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderPrincipal />
      <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {category}
        </Typography>

        {/* Filtro */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            maxWidth: 800,
            mx: "auto",
            alignItems: "center",
            p: 1,
            borderRadius: "8px",
          }}
        >
          <TextField
            fullWidth
            placeholder={`Filtrar ${category}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleFilter}
            sx={{
              backgroundColor: "#a31515",
              "&:hover": { backgroundColor: "#8c1010" },
              borderRadius: "5px",
              height: "40px",
              px: 3,
            }}
          >
            FILTRAR
          </Button>
        </Box>

        {/* Lista de itens */}
        <Box sx={{ mt: 2 }}>
          {itens.length > 0 ? (
            itens.map((item) => (
              <div key={item.id}>{item.nome}</div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Nenhum item encontrado.
            </p>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Itens;
