// pages/EquipamentosPage.jsx
import { useEffect, useState } from "react";
import { Box, Paper, TextField, Button } from "@mui/material";
import HeaderCards from "../../components/layout/HeaderCards";
import Footer from "../../components/layout/Footer";

function Others() {
  useEffect(() => {
    document.title = "Diversos | SENAI";
  }, []);

  const [search, setSearch] = useState("");

  const handleFilter = () => {
    console.log("Filtro enviado:", search);
    // Aqui você vai chamar a API com o search
    // ex: axios.get(`/equipamentos?nome=${search}`)
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderCards />

      <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
        {/* Campo + Botão */}
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
            placeholder="Filtro de produto ex: chave"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#0000",
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
      </Box>

      <Footer />
    </Box>
  );
}

export default Others;
