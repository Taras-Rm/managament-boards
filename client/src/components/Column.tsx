import { Button, Spin, Typography, message } from "antd";
import { CardI } from "../types/card";
import { ColumnI } from "../types/column";
import Card from "./Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoardColumnCards } from "../api/boards";
import { createCard, deleteCard } from "../api/cards";
import { useEffect, useRef } from "react";
import { Draggable, DroppableProvided } from "react-beautiful-dnd";

interface ColumnProps {
  column: ColumnI;
  provided: DroppableProvided;
}

const Column = ({ column, provided }: ColumnProps) => {
  const queryClient = useQueryClient();

  const columnRef = useRef<HTMLDivElement | null>(null);

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", column.boardId, "columns", "cards"],
      });
    },
    onError: () => {
      message.error("Failed to delete a card");
    },
  });

  const handleDeleteCard = (cardId: number) => {
    deleteCardMutation.mutate(cardId);
  };

  // Create card mutation
  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", column.boardId, "columns", "cards"],
      });
    },
    onError: () => {
      message.error("Failed to create new card");
    },
  });

  const handleCreateCard = () => {
    createCardMutation.mutate({
      columnId: column.id,
      boardId: column.boardId,
    });
  };

  // Scroll to the newest created card in the column
  useEffect(() => {
    if (columnRef.current && createCardMutation.isSuccess) {
      columnRef.current.scrollTop = columnRef.current.scrollHeight;
    }
  }, [column.cards]);

  return (
    <div
      style={{
        backgroundColor: "rgb(207 207 207)",
        width: "25%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "10px 10px 0 0",
        paddingTop: 10,
        border: "1px solid black",
      }}
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      <Typography.Title level={3} style={{ margin: 0 }}>
        {column.name}
      </Typography.Title>
      <div
        ref={columnRef}
        style={{
          height: "300px",
          width: "100%",
          padding: 10,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {column.cards &&
          column.cards.map((card, index) => (
            <Draggable key={card.id} draggableId={`${card.id}`} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                  style={{
                    ...provided.draggableProps.style,
                    opacity: snapshot.isDragging ? "0.5" : "1",
                  }}
                >
                  <Card
                    card={card}
                    handleDeleteCard={handleDeleteCard}
                    boardId={column.boardId}
                  />
                </div>
              )}
            </Draggable>
          ))}
        {provided.placeholder}
      </div>
      <div style={{ width: "100%" }}>
        <Button
          style={{ width: "100%", borderRadius: 0 }}
          onClick={handleCreateCard}
        >
          Add card
        </Button>
      </div>
    </div>
  );
};

export default Column;
