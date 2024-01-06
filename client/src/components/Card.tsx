import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  EditTwoTone,
} from "@ant-design/icons";
import { CardI } from "../types/card";
import { Card as CardAntd, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCard } from "../api/cards";
import { useForm } from "antd/es/form/Form";

interface CardProps {
  card: CardI;
  handleDeleteCard: (cardId: number) => void;
  boardId: number;
}

const Card = ({ card, handleDeleteCard, boardId }: CardProps) => {
  const queryClient = useQueryClient();
  const [form] = useForm();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const editCardMutation = useMutation({
    mutationFn: editCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId, "columns", card.columnId, "cards"],
      });
      setIsEditMode(false);
    },
    onError: () => {
      message.error("Failed to edit a card");
    },
  });

  const handleEditCard = (values: any, cardId: number) => {
    editCardMutation.mutate({
      title: values.title,
      description: values.description,
      cardId: cardId,
    });
  };

  if (isEditMode) {
    return (
      <CardAntd style={{ marginBottom: 10 }} bodyStyle={{ padding: 10 }}>
        <Form
          form={form}
          initialValues={card}
          onFinish={(values) => handleEditCard(values, card.id)}
        >
          <Form.Item
            name={"title"}
            rules={[{ required: true }]}
            style={{ margin: 0, marginBottom: "10px" }}
          >
            <Input placeholder="Title..." />
          </Form.Item>
          <Form.Item
            name={"description"}
            style={{ margin: 0, marginBottom: "10px" }}
          >
            <Input.TextArea
              placeholder="Description..."
              autoSize={{ minRows: 2, maxRows: 2 }}
            />
          </Form.Item>
          <Form.Item style={{ margin: 0, textAlign: "center" }}>
            <CheckCircleTwoTone
              twoToneColor={"#00ac00"}
              style={{ cursor: "pointer" }}
              onClick={() => form.submit()}
            />
          </Form.Item>
        </Form>
      </CardAntd>
    );
  }

  return (
    <CardAntd style={{ marginBottom: 10 }} bodyStyle={{ padding: 10 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography.Text strong style={{ marginBottom: 5 }}>
          {card.title}
        </Typography.Text>
        {card.description ? (
          <Typography.Text>{card.description}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">No description...</Typography.Text>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <EditTwoTone
            twoToneColor="blue"
            style={{ cursor: "pointer" }}
            onClick={() => setIsEditMode(true)}
          />
          <DeleteTwoTone
            twoToneColor="red"
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteCard(card.id)}
          />
        </div>
      </div>
    </CardAntd>
  );
};

export default Card;
