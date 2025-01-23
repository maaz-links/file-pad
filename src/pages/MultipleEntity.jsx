import { useParams } from "react-router-dom";
import Home from "./Home";

export default function MultipleEntity(){
  const { dynamicValue } = useParams();
  return <Home dynamicValue={dynamicValue} singleFile={0}/>
}