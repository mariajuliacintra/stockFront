import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import ProtectedRouter from "./components/secure/ProtectedRoute";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecSenha from "./pages/RecSenha";
import PageCards from "./pages/PageCards";
import Equipments from "./pages/Equipments";
import Material from "./pages/Material";
import Others from "./pages/Others";
import Products from "./pages/Products";
import Raw_material from "./pages/raw_material";
import Tools from "./pages/Tools";

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
            path="/principal"
            element={

                <PageCards />

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
