import { Typography } from "antd";
import { BoardI } from "../types/board";
import { ColumnI } from "../types/column";

import Column from "./Column";
import { DndContext } from "@dnd-kit/core";

interface BoardProps {
  board: BoardI;
}

const columns: ColumnI[] = [
  { id: 1, name: "To Do", boardId: 1 },
  { id: 2, name: "In Progress", boardId: 1 },
  { id: 3, name: "Done", boardId: 1 },
];

const Board = ({ board }: BoardProps) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100%",
        padding: 20,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DndContext>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Title level={4}>jhhj</Typography.Title>
          <Typography.Text>#jjdsjdjs</Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {columns.map((col) => (
            <Column column={col} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Board;
