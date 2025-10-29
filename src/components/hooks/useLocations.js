import { useState, useEffect } from 'react';
import sheets from '../../services/axios'; 

/**
 * Hook para gerenciar localizações (fetch e criação).
 * @param {boolean} isOpen - O modal está aberto?
 * @param {function} setModalInfo - Função para exibir mensagens de feedback.
 * @returns {object} {locations, loadingLocations, savingNewLocation, fetchLocations, createLocation}
 */
export const useLocations = (isOpen, setModalInfo) => {
    const [locations, setLocations] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [savingNewLocation, setSavingNewLocation] = useState(false);

    const fetchLocations = async () => {
        try {
            setLoadingLocations(true);
            const response = await sheets.getLocations();
            setLocations(response.data.locations);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Falha ao carregar localizações";
            setModalInfo({
                open: true,
                title: "Erro!",
                message: errorMessage,
                type: "error",
            });
        } finally {
            setLoadingLocations(false);
        }
    };

    const createLocation = async (locationName, locationCode) => {
        try {
            setSavingNewLocation(true); 

            // A chamada agora está correta, enviando o objeto que o backend espera: { place: "Nome", code: "Código" }
            const response = await sheets.createLocation({ 
                place: locationName.trim(), 
                code: locationCode.trim(),   
            });
            
            const data = response.data;

            if (data.success) {
                 setModalInfo({
                    open: true,
                    title: "Sucesso!",
                    message: data.message || "Localização criada com sucesso!",
                    type: "success",
                });
                return data.data?.[0]; 
            } else {
                setModalInfo({
                    open: true,
                    title: "Erro!",
                    message: data.message || "Falha ao criar localização",
                    type: "error",
                });
                return null;
            }

        } catch (error) {
            console.error("Erro ao criar localização:", error);
            const errorMessage = error.response?.data?.error || "Falha ao criar localização";
            setModalInfo({
                open: true,
                title: "Erro!",
                message: errorMessage,
                type: "error",
            });
            return null;
        } finally {
            setSavingNewLocation(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLocations();
        }
    }, [isOpen]);

    return { locations, loadingLocations, savingNewLocation, fetchLocations, createLocation };
};
