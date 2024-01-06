import api from "./api";

interface CreateCardI {
  title?: string;
  description?: string;
  columnId: number;
  boardId: number;
}

export const createCard = async ({
  title,
  description,
  columnId,
  boardId,
}: CreateCardI) => {
  const response = await api.post("/cards", {
    title,
    description,
    columnId,
    boardId,
  });
  return response.data;
};

export const deleteCard = async (cardId: number) => {
  const response = await api.delete(`/cards/${cardId}`);
  return response.data;
};
