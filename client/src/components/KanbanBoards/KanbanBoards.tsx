import { Button, Form, Input, Spin, Typography } from "antd";
import { BoardI } from "../../types/board";
import Board from "../Board/Board";
import CreateBoardModal from "./CreateBoardModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findBoard } from "../../api/boards";

const KanbanBoards = () => {
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] =
    useState<boolean>(false);

  const [alias, setAlias] = useState<string>("");

  const { data: board, isLoading } = useQuery<BoardI>({
    queryKey: ["boards", alias],
    queryFn: () => findBoard(alias),
    retry: 1,
  });

  const handleFindBoard = (values: any) => {
    setAlias(values.alias);
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(207 207 207)",
        height: "100vh",
        padding: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography.Title style={{ textAlign: "center" }}>
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
            <Button htmlType="submit" type="primary" style={{ width: 200 }}>
              Load
            </Button>
          </Form.Item>
        </Form>
      </div>
      {isLoading ? (
        <Spin style={{ marginTop: 40 }} size="large" />
      ) : board ? (
        <Board board={board} />
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
