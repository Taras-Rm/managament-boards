import { Button, Form, Input, Spin, Typography, message } from "antd";
import { BoardI } from "../../types/board";
import Board from "../Board/Board";
import CreateBoardModal from "./CreateBoardModal";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBoard, findBoard } from "../../api/boards";

const KanbanBoards = () => {
  const queryClient = useQueryClient();

  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] =
    useState<boolean>(false);

  const [alias, setAlias] = useState<string>("");

  // Find board by alias (hash)
  const { data: board, isLoading } = useQuery<BoardI>({
    queryKey: ["boards", alias],
    queryFn: () => findBoard(alias),
    enabled: !!alias,
    retry: 1,
  });

  const handleFindBoard = (values: any) => {
    setAlias(values.alias);
  };

  // Delete board mutation
  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      message.success("Board deleted!");
      if (board) {
        queryClient.setQueryData(["boards", board?.alias], () => {
          return null;
        });
      }
    },
    onError: () => {
      message.error("Failed to delete a board");
    },
  });

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
        padding: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography.Title style={{ textAlign: "center", marginBottom: 5 }}>
        Boards
      </Typography.Title>
      <Button
        style={{ width: 150, marginBottom: 20 }}
        onClick={() => setIsCreateBoardModalOpen(true)}
      >
        Craete new
      </Button>
      <div>
        <Form style={{ display: "flex" }} onFinish={handleFindBoard}>
          <Form.Item
            style={{ width: "100%" }}
            rules={[{ required: true, max: 10 }]}
            name={"alias"}
          >
            <Input placeholder="Enter board alias (max 10 characters)" />
          </Form.Item>
          <Form.Item style={{ marginLeft: 20 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{ width: 200, backgroundColor: "#3469D0" }}
            >
              Load
            </Button>
          </Form.Item>
        </Form>
      </div>
      {isLoading ? (
        <Spin style={{ marginTop: 40 }} size="large" />
      ) : board ? (
        <Board board={board} deleteBoardMutation={deleteBoardMutation} />
      ) : (
        <Typography.Text style={{ textAlign: "center", fontSize: 30 }}>
          Board not found
        </Typography.Text>
      )}
      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        setIsOpen={setIsCreateBoardModalOpen}
      />
    </div>
  );
};

export default KanbanBoards;
