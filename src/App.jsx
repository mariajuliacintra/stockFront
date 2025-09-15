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
import Itens from "./pages/Itens";
import DefaultLayout from "./components/layout/DefaultLayout";
import Transacoes from "./pages/Transacoes";

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
          <Route path="/perfil" element={<Perfil />} />
          <Route
            path="/principal"
            element={
              <ProtectedRouter>
                <Itens />
              </ProtectedRouter>
            }
          />
          <Route path="/AtualizarPerfil" element={<AtualizarPerfil />} />
                    <Route
            path="/transacoes"
            element={
              <ProtectedRouter>
                <Transacoes />
              </ProtectedRouter>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
