import { Button, Popconfirm, Spin, Typography, message } from "antd";
import { BoardI } from "../../types/board";
import { ColumnI } from "../../types/column";
import Column from "../Column";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteBoard, getBoardColumnsCards } from "../../api/boards";
import EditBoardModal from "./EditBoardModal";
import { useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { changeCardPosition } from "../../api/cards";

interface BoardProps {
  board: BoardI;
  deleteBoardMutation: UseMutationResult<any, Error, number, unknown>;
}

const Board = ({ board, deleteBoardMutation }: BoardProps) => {
  const queryClient = useQueryClient();

  const [isEditBoardModalOpen, setIsEditBoardModalOpen] =
    useState<boolean>(false);

  // Get board columns cards
  const { data: columnsCards, isLoading } = useQuery<ColumnI[]>({
    queryKey: ["boards", board.id, "columns", "cards"],
    queryFn: () => getBoardColumnsCards(board.id),
  });

  const handleDeleteBoard = () => {
    deleteBoardMutation.mutate(board.id);
  };

  // Change card position mutation
  const changeCardPositionMutation = useMutation({
    mutationFn: changeCardPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", board.id, "columns", "cards"],
      });
    },
    onError: () => {
      message.error("Failed to change card position");
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Call to api for position update
    changeCardPositionMutation.mutate({
      cardId: Number(result.draggableId),
      boardId: board.id,
      toColumnId: Number(result.destination.droppableId),
      toPosition: result.destination.index + 1,
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F5F5",
        height: "100%",
        padding: 20,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Title level={3}>{board.name}</Typography.Title>
          <Typography.Text strong>#{board.alias}</Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
            marginBottom: 10,
          }}
        >
          {isLoading ? (
            <Spin spinning />
          ) : (
            columnsCards &&
            columnsCards.map((column) => (
              <Droppable key={column.id} droppableId={`${column.id}`}>
                {(provided) => (
                  <Column key={column.id} column={column} provided={provided} />
                )}
              </Droppable>
            ))
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={() => setIsEditBoardModalOpen(true)}
            style={{ backgroundColor: "#3469D0" }}
          >
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
            <Button danger style={{ marginLeft: 10 }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </DragDropContext>

      <EditBoardModal
        isOpen={isEditBoardModalOpen}
        setIsOpen={setIsEditBoardModalOpen}
        board={board}
      />
    </div>
  );
};

export default Board;
