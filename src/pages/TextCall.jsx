import { Col, Container, Row } from 'react-bootstrap'
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from '../layouts/Context';
import TextView from './TextView';

export default function TextCall(props) {

  const { paste, setPaste } = useContext(GlobalContext);
  const { givenUID, requiredPassword } = props;

  const [data, setData] = useState([]);
  const [currentUIDpreview] = useState(givenUID);
  const rerenderItems = () => {
    return;
  }

  useEffect(() => {
    if (givenUID) {
      const bringFiles = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/showtexts/${givenUID}`, {
            requiredPassword: requiredPassword,
          });
          setData(response.data.data);
          if (paste === '') {
            setPaste(`${window.location.host + window.location.pathname}`);
          }
          console.log(response);
          console.log(response.data.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      bringFiles();
    }
  }, [])

  if (data.length === 0) {
    return (
      <div className='create py-3 py-md-4'>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <div className="create-top list d-flex align-items-center gap-3">  {/*create-top makes text allcaps */}
                <div className="des" style={{ maxWidth: "none" }}>
                  <p className='text-858585'>
                    <h3 className='mb-0'>No Data Found</h3>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  else {
    return (<TextView data={data}
      currentUIDpreview={currentUIDpreview}
      rerenderItems={rerenderItems} />)
  }

  // return (
  //   <div className='create py-3 py-md-4'>
  //     <Container fluid>
  //       <Row>
  //         <Col xs={12}>
  //           {(errorMsg !== '') &&
  //             <div className="create-top list d-flex align-items-center gap-3">  {/*create-top makes text allcaps */}
  //               <div className="des" style={{ maxWidth: "none" }}>
  //                 <p className='text-858585'>
  //                   <h3 className='mb-0'>{errorMsg}</h3>
  //                 </p>
  //               </div>
  //             </div>}

  //           {/* {(data.length !== 0) && <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data[0].content) }} />} */}
  //           {(data.length !== 0) &&
  //             <>
  //               <div className="create-top d-flex gap-2 gap-md-4 align-items-center mb-4 mb-lg-5">
  //                 <h3 className='mb-0'>expires</h3><Expiry unix={data[0].expiry_date} />
  //               </div>
  //               <div className="list d-flex align-items-center gap-3">
  //                 <div className="des" style={{ maxWidth: "none" }}>
  //                   <p className='text-858585'>
  //                     <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data[0].content) }} />
  //                   </p>
  //                 </div>
  //               </div>
  //             </>
  //           }
  //         </Col>
  //       </Row>
  //     </Container>
  //   </div>

  // )
}
