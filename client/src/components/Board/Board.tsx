import { Button, Popconfirm, Spin, Typography, message } from "antd";
import { BoardI } from "../../types/board";
import { ColumnI } from "../../types/column";
import Column from "../Column";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBoard, getBoardColumns } from "../../api/boards";
import EditBoardModal from "./EditBoardModal";
import { useState } from "react";

interface BoardProps {
  board: BoardI;
}

const Board = ({ board }: BoardProps) => {
  const queryClient = useQueryClient();

  const [isEditBoardModalOpen, setIsEditBoardModalOpen] =
    useState<boolean>(false);

  // Get board columns
  const { data: columns, isLoading } = useQuery<ColumnI[]>({
    queryKey: ["boards", board.alias, "columns"],
    queryFn: () => getBoardColumns(board.id),
  });

  // Delete board mutation
  const deleteBoardMutation = useMutation({
    mutationFn: () => deleteBoard(board.id),
    onSuccess: () => {
      message.success("Board deleted!");
      queryClient.invalidateQueries({
        queryKey: ["boards", board.alias],
      });
    },
    onError: () => {
      message.error("Failed to delete a board");
    },
  });

  const handleDeleteBoard = () => {
    deleteBoardMutation.mutate();
  };

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
        <Popconfirm
          title="Delete the board"
          description="Are you sure to delete this board?"
          onConfirm={handleDeleteBoard}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
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
          columns && columns.map((col) => <Column key={col.id} column={col} />)
        )}
      </div>
      <EditBoardModal
        isOpen={isEditBoardModalOpen}
        setIsOpen={setIsEditBoardModalOpen}
        board={board}
      />
    </div>
  );
};

export default Board;
