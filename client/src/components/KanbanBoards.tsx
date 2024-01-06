import { Button, Form, Input, Typography } from "antd";
import { BoardI } from "../types/board";
import Board from "./Board";

const board: BoardI = {
  id: 1,
  name: "First board",
};

const KanbanBoards = () => {
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
      <div>
        <Form style={{ display: "flex" }}>
          <Form.Item style={{ width: "100%" }}>
            <Input />
          </Form.Item>
          <Form.Item style={{ marginLeft: 20 }}>
            <Button>Load</Button>
          </Form.Item>
        </Form>
      </div>
      <Board board={board} />
    </div>
  );
};

export default KanbanBoards;
