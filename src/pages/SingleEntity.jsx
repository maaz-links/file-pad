import { useParams } from "react-router-dom";
import Home from "./Home";

export default function SingleEntity() {
  const { dynamicValue } = useParams();
  return <Home dynamicValue={dynamicValue} singleFile={1} />
}