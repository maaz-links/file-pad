import { useParams } from "react-router-dom";
import { useState } from "react";
import Authentication from "./Authentication";
import TextCall from "./TextCall";

export default function TextEntity(){
  const { dynamicValue } = useParams();
  //return <Home dynamicValue={dynamicValue} singleFile={0}/>
  const [dataCall, setDataCall] = useState(false);
  const [requiredPassword, setRequiredPassword] = useState('');

  
  if(!dataCall){
    return <Authentication dynamicValue={dynamicValue} singleFile={0} setDataCall={setDataCall}
            requiredPassword={requiredPassword} setRequiredPassword={setRequiredPassword}/>
  }
  else{
    return <TextCall givenUID={dynamicValue} requiredPassword={requiredPassword}/>
  }
}