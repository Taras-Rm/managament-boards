import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { CardI } from "../types/card";
import { Button, Card as CardAntd, Typography } from "antd";

interface CardProps {
  card: CardI;
  handleDeleteCard: (cardId: number) => void;
}

const Card = ({ card, handleDeleteCard }: CardProps) => {
  return (
    <CardAntd style={{ marginBottom: 10 }} bodyStyle={{ padding: 10 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography.Text strong>{card.title}</Typography.Text>
        <Typography.Text>{card.description}</Typography.Text>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <EditTwoTone twoToneColor="blue" style={{ cursor: "pointer" }} />
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
