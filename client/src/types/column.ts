import { CardI } from "./card";

export type ColumnI = {
  id: number;
  name: string;
  boardId: number;
  position: number;
  cards?: CardI[];
};
