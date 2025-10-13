import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import CustomModal from "../mod/CustomModal"; 

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem("tokenUsuario");
  return !!token;  // Retorna true se o token existir, caso contrário, false
};

const ProtectedRouter = ({ children }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Seu token foi expirado, faça login novamente!");

  useEffect(() => {
    if (!isAuthenticated()) {
      setModalOpen(true);

      // Após o delay, redireciona para a página inicial
      const timer = setTimeout(() => {
        setIsRedirecting(true);  // Ativa o redirecionamento após o tempo do modal
      }, 3000); // 3 segundos de delay (ajuste o tempo conforme necessário)

      // Limpeza do timer
      return () => clearTimeout(timer);
    }
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
    // Limpa o token e redireciona
    localStorage.clear();
    window.location.href = "/login";
  };

  // Se estiver redirecionando, mostre um componente de carregamento (ou uma mensagem)
  if (isRedirecting) {
    return <div>Redirecionando... (Aguarde)</div>;
  }

  return (
    <>
      {modalOpen && (
        <CustomModal
          open={modalOpen}
          title="Erro de autenticação"
          message={errorMessage}
          onClose={handleModalClose}
          isError={true}
        />
      )}

      {isRedirecting ? (  
        <Navigate to="/" />
      ) : (
        isAuthenticated() ? children : null
      )}
    </>
  );
};

export default ProtectedRouter;
