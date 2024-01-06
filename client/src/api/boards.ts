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

export interface CreateBoardI {
  name: string;
}

export const findBoard = async (alias: string) => {
  const response = await api.get(`/boards/${alias}`);
  return response.data;
};
