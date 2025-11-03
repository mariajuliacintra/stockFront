import { useState, useEffect } from "react";
import sheets from "../../services/axios";

/**
 * Hook para gerenciar especificações técnicas (fetch e criação).
 */
export const useTechnicalSpecs = (isOpen, setModalInfo, setTechnicalSpecs) => {
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [savingNewSpec, setSavingNewSpec] = useState(false);
  const [newSpecName, setNewSpecName] = useState("");

  const fetchTechnicalSpecs = async () => {
    try {
      const response = await sheets.getTechnicalSpecs();
      setAvailableSpecs(response.data.technicalSpecs);
    } catch (error) {
      setModalInfo({
        open: true,
        title: "Erro!",
        message: "Falha ao carregar especificações técnicas",
        type: "error",
      });
    }
  };

  const handleNewSpec = async () => {
    if (!newSpecName.trim()) return;

    const technicalSpecKey = newSpecName.trim();

    const exists = availableSpecs.some(
      (spec) =>
        spec.technicalSpecKey.toLowerCase() === technicalSpecKey.toLowerCase()
    );

    if (exists) {
      setModalInfo({
        open: true,
        title: "Atenção!",
        message: `A especificação técnica "${technicalSpecKey}" já existe na lista.`,
        type: "error",
      });
      setNewSpecName("");
      return;
    }

    try {
      setSavingNewSpec(true);

      const response = await sheets.createTechnicalSpec({ technicalSpecKey });

      const data = response.data;

      if (response.data.success) {
        setNewSpecName("");

        await fetchTechnicalSpecs();

        // Esperando a chave 'idTechnicalSpec' do backend
        const createdSpec = data.technicalSpec?.[0];
        const createdId = createdSpec?.technicalSpecId;
;
        if (createdId && createdId > 0) {
          setTechnicalSpecs((prevSpecs) => [
            ...prevSpecs,
            {
              idTechnicalSpec: createdId,
              technicalSpecKey: createdSpec.technicalSpecKey,
              value: "",
            },
          ]);
          setModalInfo({
            open: true,
            title: "Sucesso!",
            message: "Especificação criada e adicionada!",
            type: "success",
          });
          return createdSpec;
        } else {
          // Este erro captura problemas de AUTO_INCREMENT ou retorno incorreto do ID
          setModalInfo({
            open: true,
            title: "Erro de Retorno de ID!",
            message:
              error.response.data.details ||
              "Erro ao criar especificação técnica",
            type: "error",
          });
        }
      } else {
        setModalInfo({
          open: true,
          title: "Erro!",
          message: data.message || "Falha ao criar especificação.",
          type: "error",
        });
      }
    } catch (erro) {
      // Tratamento de erro aprimorado para exibir detalhes do erro SQL, se disponíveis
      const serverErrorDetail =
        erro.response?.data?.details ||
        "Erro de Internal Server (500). Verifique o log do seu servidor.";
      setModalInfo({
        open: true,
        title: "Erro Crítico de Criação!",
        message: `Falha ao criar especificação: ${serverErrorDetail}`,
        type: "error",
      });
    } finally {
      setSavingNewSpec(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTechnicalSpecs();
    }
  }, [isOpen]);

  return {
    availableSpecs,
    savingNewSpec,
    newSpecName,
    setNewSpecName,
    fetchTechnicalSpecs,
    handleNewSpec,
  };
};
