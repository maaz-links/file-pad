import { useParams } from "react-router-dom";
import { useState } from "react";
import Home from "./Home";
import Authentication from "./Authentication";
import Preview from "./Preview";
import FilesCall from "./FilesCall";

export default function MultipleEntity(){
  const { dynamicValue } = useParams();
  //return <Home dynamicValue={dynamicValue} singleFile={0}/>
  const [dataCall, setDataCall] = useState(false);
  const [requiredPassword, setRequiredPassword] = useState('');

  
  if(!dataCall){
    return <Authentication dynamicValue={dynamicValue} singleFile={0} setDataCall={setDataCall}
            requiredPassword={requiredPassword} setRequiredPassword={setRequiredPassword}/>
  }
  else{
    return <FilesCall givenUID={dynamicValue} singleFile={0} requiredPassword={requiredPassword}/>
  }
}