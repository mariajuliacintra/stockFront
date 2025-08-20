import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import ProtectedRouter from "./components/secure/ProtectedRoute";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecSenha from "./pages/RecSenha";
import Perfil from "./pages/Perfil"; 
import PageCards from "./pages/PageCards";
import Equipments from "./pages/Equipments/Equipments";
import Material from "./pages/Equipments/Material";
import Others from "./pages/Equipments/Others";
import Products from "./pages/Equipments/Products";
import Raw_material from "./pages/Equipments/Raw_material";
import Tools from "./pages/Equipments/Tools";

import DefaultLayout from "./components/layout/DefaultLayout";


const theme = createTheme({
  typography: {
    fontFamily: "'Roboto Mono', monospace",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <DefaultLayout>
                <Login />
              </DefaultLayout>
            }
          />
          <Route
            path="/register"
            element={
              <DefaultLayout>
                <Register />
              </DefaultLayout>
            }
          />
          <Route
            path="/recsenha"
            element={
              <DefaultLayout>
                <RecSenha />
              </DefaultLayout>
            }
          />
          <Route
            path="/perfil"
            element={
              <DefaultLayout>
                <Perfil />
              </DefaultLayout>
            }
          />
          <Route
            path="/principal"
            element={
              <ProtectedRouter>
                <PageCards />
              </ProtectedRouter>
            }
          />
          <Route
            path="/equipamentos"
            element={
                <Equipments />
            }
          />

          <Route
            path="/Material"
            element={
                <Material />
            }
          />

          <Route
            path="/Diversos"
            element={
                <Others />
            }
          />

          <Route
            path="/Produtos"
            element={
                <Products />
            }
          />

          <Route
            path="/materia-prima"
            element={
                <Raw_material />
            }
          />

          <Route
            path="/Ferramenta"
            element={
                <Tools />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
