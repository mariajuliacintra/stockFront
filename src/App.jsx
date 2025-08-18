import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import ProtectedRouter from "./components/secure/ProtectedRoute";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecSenha from "./pages/RecSenha";
import PageCards from "./pages/PageCards";

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
              <ProtectedRouter>
                <PageCards />
              </ProtectedRouter>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
