import { BoardI } from "../types/board";
import { ColumnI } from "../types/column";
import api from "./api";

export interface CreateBoardI {
  name: string;
}

export interface CreateBoardPesponseI {
  board: BoardI;
  columns: ColumnI[];
}

export const createBoard = async ({ name }: CreateBoardI) => {
  const response = await api.post("/boards", {
    name,
  });
  return response.data;
};

export interface EditBoardI {
  name: string;
  boardId: number;
}

export const editBoard = async ({ name, boardId }: EditBoardI) => {
  const response = await api.put(`/boards/${boardId}`, {
    name,
  });
  return response.data;
};

export const findBoard = async (alias: string) => {
  const response = await api.get(`/boards/${alias}`);
  return response.data;
};

export const getBoardColumns = async (boardId: number) => {
  const response = await api.get(`/boards/${boardId}/columns`);
  return response.data;
};

export const getBoardColumnCards = async (
  boardId: number,
  columnId: number
) => {
  const response = await api.get(
    `/boards/${boardId}/columns/${columnId}/cards`
  );
  return response.data;
};

export const deleteBoard = async (boardId: number) => {
  const response = await api.delete(`/boards/${boardId}`);
  return response.data;
};

export interface CreateBoardColumnsCardsPesponseI {
  columns: ColumnI[];
}

export const getBoardColumnsCards = async (boardId: number) => {
  const response = await api.get(`/boards/${boardId}/cards`);
  return response.data;
};
