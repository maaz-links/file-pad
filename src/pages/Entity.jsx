import { useParams } from "react-router-dom";
import { useState } from "react";
import Authentication from "./Authentication";
import FilesCall from "./FilesCall";
import TextCall from "./TextCall";

export default function Entity(){
  const { dynamicValue } = useParams();
  //return <Home dynamicValue={dynamicValue} singleFile={0}/>
  const [dataCall, setDataCall] = useState(false);
  const [dataType, setDataType] = useState(2);
  const [requiredPassword, setRequiredPassword] = useState('');

  
  if(!dataCall){
    return <Authentication dynamicValue={dynamicValue} singleFile={0} setDataCall={setDataCall}
            requiredPassword={requiredPassword} setRequiredPassword={setRequiredPassword} setDataType={setDataType}/>
  }
  else{
    if(dataType == 2){
      return <FilesCall givenUID={dynamicValue} singleFile={0} requiredPassword={requiredPassword}/>
    }
    else if (dataType == 1){
      return <TextCall givenUID={dynamicValue} singleFile={0} requiredPassword={requiredPassword}/>
    }
    else{
      return <div>No type</div>
    }
  
  }
}