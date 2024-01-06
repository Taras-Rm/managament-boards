import { CardI } from "../types/card";
import { Card as CardAntd } from "antd";

interface CardProps {
  card: CardI;
}

const Card = ({ card }: CardProps) => {
  return <CardAntd style={{ marginBottom: 10 }}>Card</CardAntd>;
};

export default Card;
