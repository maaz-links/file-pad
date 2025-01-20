import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Home from "./Home";
import axios from "axios";

export default function SingleEntity(){

    const { dynamicValue } = useParams();

  return <Home dynamicValue={dynamicValue} singleFile={1}/>
}