import { useState, useEffect } from 'react';
import sheets from '../../services/axios'; // Assumindo que o arquivo axios está em '../services/axios'

/**
 * Hook para gerenciar categorias (fetch e criação).
 * @param {boolean} isOpen - O modal está aberto?
 * @param {function} setModalInfo - Função para exibir mensagens de feedback.
 * @returns {object} {categories, loadingCategories, savingNewCategory, fetchCategories, createCategory}
 */
export const useCategories = (isOpen, setModalInfo) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [savingNewCategory, setSavingNewCategory] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await sheets.getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            setModalInfo({
                open: true,
                title: "Erro!",
                message: "Falha ao carregar categorias.",
                type: "error",
            });
        } finally {
            setLoadingCategories(false);
        }
    };

    const createCategory = async (categoryName) => {
        if (!categoryName.trim()) return null;

        try {
            setSavingNewCategory(true);

            // A chamada agora está correta, enviando o objeto que o backend espera: { categoryValue: "Nome" }
            const response = await sheets.createCategory({
                categoryValue: categoryName.trim(),
            });
            const data = response.data;

            if (data.success) {
                setModalInfo({
                    open: true,
                    title: "Sucesso!",
                    message: "Categoria criada com sucesso!",
                    type: "success",
                });
                return data.data?.[0]; // Retorna o objeto da categoria criada
            } else {
                setModalInfo({
                    open: true,
                    title: "Erro!",
                    message: data.message || "Falha ao criar categoria",
                    type: "error",
                });
                return null;
            }
        } catch (erro) {
            setModalInfo({
                open: true,
                title: "Erro!",
                message: erro.response?.data?.details || "Falha ao criar categoria",
                type: "error",
            });
            return null;
        } finally {
            setSavingNewCategory(false);
            setRefresh(refresh+1);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen,refresh]);

    return { categories, loadingCategories, savingNewCategory, fetchCategories, createCategory };
};
