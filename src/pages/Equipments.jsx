// pages/EquipamentosPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import HeaderCards from "../components/layout/HeaderCards";
import Footer from "../components/layout/Footer";
import sheets from "../services/axios";

function Itens() {
  const { category } = useParams(); // pega a categoria da rota
  const [search, setSearch] = useState("");
  const [itens, setItens] = useState([]);

  useEffect(() => {
    document.title = `${category} | SENAI`;
  }, [category]);

  const handleFilter = async () => {
    try {
      const response = await sheets.getItens(category, { nome: search });
      setItens(response.data);
      console.log("Itens filtrados:", response.data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderCards />
      <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
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
