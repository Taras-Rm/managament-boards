import { Typography } from "antd";
import { CardI } from "../types/card";
import { ColumnI } from "../types/column";
import Card from "./Card";

interface ColumnProps {
  column: ColumnI;
}

const cards: CardI[] = [
  { id: 1, title: "First", description: "Descrp1", columnId: 1, position: 1 },
  { id: 2, title: "Second", description: "Descrp2", columnId: 1, position: 2 },
];

const Column = ({ column }: ColumnProps) => {
  return (
    <div
      style={{
        backgroundColor: "rgb(207 207 207)",
        width: "30%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
        paddingTop: 20,
      }}
    >
      <Typography.Title level={3}>{column.name}</Typography.Title>
      <div
        style={{
          height: "100%",
          width: "100%",
          padding: 10,
        }}
      >
        {cards.map((card) => (
          <Card card={card} />
        ))}
      </div>
    </div>
  );
};

export default Column;
