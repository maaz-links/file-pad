import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry'
import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from 'dompurify';
import { GlobalContext } from '../layouts/Context';

export default function TextCall(props) {

  const {paste,setPaste} = useContext(GlobalContext);
  const {givenUID, requiredPassword} = props;
  
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (givenUID) {
      const bringFiles = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/showtexts/${givenUID}`, {
            requiredPassword: requiredPassword,
          });
          setData(response.data.data);
          if(paste === ''){
            setPaste(`${window.location.host + window.location.pathname}`);}
          console.log(response);
          console.log(response.data.data);
        } catch (err) {
          setErrorMsg("No data fetched")
          console.error("Error fetching data:", err);
        }
      }
      bringFiles();
    }
  }, [])

  return (
    <div className='create py-3 py-md-4'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            {(errorMsg !== '') &&
              <div className="create-top list d-flex align-items-center gap-3">  {/*create-top makes text allcaps */}
                <div className="des" style={{ maxWidth: "none" }}>
                  <p className='text-858585'>
                    <h3 className='mb-0'>{errorMsg}</h3>
                  </p>
                </div>
              </div>}

            {/* {(data.length !== 0) && <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data[0].content) }} />} */}
            {(data.length !== 0) &&
              <>
                <div className="create-top d-flex justify-content-between align-items-center mb-4 mb-lg-5">
                  <h3 className='mb-0'>expiry will be</h3><Expiry unix={data[0].expiry_date} />
                </div>
                <div className="list d-flex align-items-center gap-3">
                  <div className="des" style={{ maxWidth: "none" }}>
                    <p className='text-858585'>
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data[0].content) }} />
                    </p>
                  </div>
                </div>
              </>
            }
          </Col>
        </Row>
      </Container>
    </div>

  )
}
