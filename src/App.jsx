import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import ProtectedRouter from "./components/secure/ProtectedRoute";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecSenha from "./pages/RecSenha";
import Perfil from "./pages/Perfil"; 
import AtualizarPerfil from "./pages/AtualizarPerfil";
import PageCards from "./pages/PageCards";
import Itens from "./pages/Itens";
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
          {/* Rota da página inicial */}
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
              
                <Perfil />
              
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
            path="/:category"
            element={
              <ProtectedRouter>
                <Itens />
              </ProtectedRouter>
            }
          />
              
          <Route
            path="/AtualizarPerfil"
            element={
              
                <AtualizarPerfil />
              
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
