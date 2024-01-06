import api from "./api";

export interface CreateBoardI {
  name: string;
}

export const createBoard = async ({ name }: CreateBoardI) => {
    console.log(name)
  const response = await api.post("/boards", {
    name,
  });
  return response.data;
};
