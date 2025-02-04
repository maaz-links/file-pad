import { Container, Row, Col } from "react-bootstrap";
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../layouts/Context';
import axios from 'axios';
import Preview from "./Preview";

export default function FilesCall(props) {
    const {givenUID, singleFile, requiredPassword} = props;

    const {
        mirrorslist, setMirrorslist,
        expireslist, setExpireslist,
        currentUID, setCurrentUID,
        burnAfterRead, setBurnAfterRead,
        expiryDateIncrement, setExpiryDateIncrement,
        mirror, setMirror,
        paste, setPaste,
    } = useContext(GlobalContext);

    const [data, setData] = useState([]);
    //const [checkSubmitted, setCheckSubmitted] = useState(0); // rerender for file modification
    const rerenderItems = () => {
        //setCheckSubmitted(checkSubmitted + 1);
        return;
    }

    const [mirrorForPaste, setMirrorForPaste] = useState(mirror);
    const [currentUIDpreview] = useState(givenUID);

    //Brings Files thumbnail into preview. and when new files are submitted or existing ones are deleted using 'Add more'
    useEffect(() => {
        if (givenUID) {
            const fetchurl = (singleFile ? 'attachsingle' : 'attachments')
            const bringFiles = async () => {
              try {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/${fetchurl}/${givenUID}`, {
                  requiredPassword: requiredPassword,
                });
                setData(response.data.data);
                setPaste('');
                console.log(response);
                console.log(response.data.data);
              } catch (err) {
                console.error("Error fetching data:", err);
              }
            }
            bringFiles();
          }
    }, []
    );

    if (data.length === 0) {
        return (
            <div className='create py-3 py-md-4'>
                <Container style={{ minHeight: "600px", }} fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="create-top d-flex justify-content-between align-items-center mb-4 mb-lg-5">
                                <h3 className='mb-0'>No data found</h3>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    else {
        return (
            <Preview data={data}
                mirrorForPaste={mirrorForPaste}
                currentUIDpreview={currentUIDpreview}
                rerenderItems={rerenderItems} />
        )
    }
}