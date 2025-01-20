import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Home from "./Home";
import axios from "axios";

export default function SingleEntity(){

    const { dynamicValue } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (dynamicValue) {
      //setData(dynamicValue);
      const bringFiles = async () => {
        try {
          const response = await axios.post(`http://localhost:8000/api/upload/attachsingle/${dynamicValue}`);
          setData(response.data.data);
          console.log(response);
          console.log(response.data.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      bringFiles();
    }
  }, [dynamicValue]);

  return <Home data={data}/>
}