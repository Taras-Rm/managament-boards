import { Button, Spin, Typography, message } from "antd";
import { BoardI } from "../../types/board";
import { ColumnI } from "../../types/column";

import Column from "../Column";
import { DndContext } from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoardColumns } from "../../api/boards";
import { deleteCard } from "../../api/cards";
import EditBoardModal from "./EditBoardModal";
import { useState } from "react";

interface BoardProps {
  board: BoardI;
}

const Board = ({ board }: BoardProps) => {
  const queryClient = useQueryClient();

  const [isEditBoardModalOpen, setIsEditBoardModalOpen] =
    useState<boolean>(false);

  const { data: columns, isLoading } = useQuery<ColumnI[]>({
    queryKey: ["boards", board.alias, "columns"],
    queryFn: () => getBoardColumns(board.id),
  });

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
          <Typography.Title level={3}>{board.name}</Typography.Title>
          <Typography.Text strong>#{board.alias}</Typography.Text>
          <Button type="primary" onClick={() => setIsEditBoardModalOpen(true)}>
            Edit
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          {isLoading ? (
            <Spin spinning />
          ) : (
            columns &&
            columns.map((col) => <Column key={col.id} column={col} />)
          )}
        </div>
      </DndContext>
      <EditBoardModal
        isOpen={isEditBoardModalOpen}
        setIsOpen={setIsEditBoardModalOpen}
        board={board}
      />
    </div>
  );
};

export default Board;
