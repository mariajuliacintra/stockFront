import React, { createContext, useState, useEffect, useContext } from 'react';
import sheets from '../services/axios'; // 🚨 ATENÇÃO: Corrija o caminho conforme a sua estrutura de pastas

const UserContext = createContext();

// Intervalo de tempo para verificar o perfil do usuário no servidor (em milissegundos)
const POLLING_INTERVAL = 30000; // 30 segundos

export function UserProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getLocalAuthData = () => {
        const id = localStorage.getItem("idUsuario");
        const role = localStorage.getItem("userRole");
        return { id, role };
    };

    const fetchAndSyncRole = async (id) => {
        if (!id) return;

        try {
            // Usa o método da sua API para buscar o perfil completo do usuário
            const response = await sheets.getUserProfile(id); 
            const newRole = response.data?.role; 

            if (newRole && newRole !== userRole) {
                // Se a função mudou no servidor, atualiza o contexto e o localStorage
                setUserRole(newRole);
                localStorage.setItem("userRole", newRole);
                console.log(`Função atualizada para: ${newRole}`);
            }
        } catch (error) {
            console.error("Erro na sincronização de função do usuário:", error);
            // Se houver erro (ex: 401), pode forçar o logout ou manter o estado atual.
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Efeito para carregar o estado inicial e configurar o polling
    useEffect(() => {
        const { id, role } = getLocalAuthData();
        
        if (id) {
            setUserId(id);
            setUserRole(role);
            
            // 🛑 Configura o Polling: Verifica a função do usuário periodicamente no servidor
            fetchAndSyncRole(id); // Primeira checagem imediata

            const intervalId = setInterval(() => {
                fetchAndSyncRole(id);
            }, POLLING_INTERVAL);

            // Cleanup: Limpa o intervalo quando o componente é desmontado
            return () => clearInterval(intervalId);
        } else {
            setIsLoading(false);
        }
    }, []);

    // Função que permite ao manager alterar o role (opcional, se precisar de atualização imediata após a ação do manager)
    const updateRoleLocally = (newRole) => {
        setUserRole(newRole);
        localStorage.setItem("userRole", newRole);
    };

    return (
        <UserContext.Provider value={{ userId, userRole, isLoading, updateRoleLocally }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook Customizado para fácil consumo
export const useUser = () => useContext(UserContext);