import { useState, useEffect } from "react";
import sheets from "../../services/axios";


export const useTechnicalSpecs = (isOpen, setModalInfo, setTechnicalSpecs) => {
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [savingNewSpec, setSavingNewSpec] = useState(false);
  const [newSpecName, setNewSpecName] = useState("");
  const [refresh, setRefresh] = useState(0);

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
    if (!newSpecName.trim()) return null;

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
      return null;
    }

    try {
      setSavingNewSpec(true);

      const response = await sheets.createTechnicalSpec({ technicalSpecKey });

      const data = response.data;

      if (response.data.success) {
        setNewSpecName("");

        await fetchTechnicalSpecs();

        const createdSpec = data.technicalSpec?.[0];
        const createdId = createdSpec?.technicalSpecId;
        const keyForDisplay = createdSpec?.technicalSpecKey || technicalSpecKey;
        if (createdId && createdId > 0) {
          setTechnicalSpecs((prevSpecs) => [
            ...prevSpecs,
            {
              idTechnicalSpec: createdId,
              technicalSpecKey: keyForDisplay,
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
          setModalInfo({
            open: true,
            title: "Erro de Retorno de ID!",
            message:
              data.message ||
              "Erro ao criar especificação técnica: ID não retornado.",
            type: "error",
          });
          return null;
        }
      } else {
        setModalInfo({
          open: true,
          title: "Erro!",
          message: data.message || "Falha ao criar especificação.",
          type: "error",
        });
        return null;
      }
    } catch (erro) {
      const serverErrorDetail =
        erro.response?.data?.details ||
        "Erro de Internal Server (500). Verifique o log do seu servidor.";
      setModalInfo({
        open: true,
        title: "Erro Crítico de Criação!",
        message: `Falha ao criar especificação: ${serverErrorDetail}`,
        type: "error",
      });
      return null;
    } finally {
      setSavingNewSpec(false);
      setRefresh(refresh + 1);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTechnicalSpecs();
    }
  }, [isOpen, refresh]);

  return {
    availableSpecs,
    savingNewSpec,
    newSpecName,
    setNewSpecName,
    fetchTechnicalSpecs,
    handleNewSpec,
  };
};
