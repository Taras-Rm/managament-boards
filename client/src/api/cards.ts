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

interface EditCardI {
  title: string;
  description?: string;
  cardId: number;
}

export const editCard = async ({ title, description, cardId }: EditCardI) => {
  const response = await api.put(`/cards/${cardId}`, {
    title,
    description,
  });
  return response.data;
};

interface ChangeCardPositionI {
  cardId: number;
  boardId: number;
  toColumnId: number;
  toPosition: number;
}

export const changeCardPosition = async ({
  cardId,
  boardId,
  toColumnId,
  toPosition,
}: ChangeCardPositionI) => {
  const response = await api.put(`/cards/${cardId}/position`, {
    toColumnId,
    toPosition,
    boardId,
  });
  return response.data;
};
