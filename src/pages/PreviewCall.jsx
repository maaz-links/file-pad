import { Container, Row, Col } from "react-bootstrap";
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../layouts/Context';
import axios from 'axios';
import Preview from "./Preview";
import ItemsList from "./ItemsList";

export default function PreviewCall() {

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
    const [checkSubmitted, setCheckSubmitted] = useState(0); // rerender for file modification
    const rerenderItems = () => {
        setCheckSubmitted(checkSubmitted + 1);
    }

    const [mirrorForPaste] = useState(mirror);
    const [currentUIDpreview] = useState(currentUID);

    const [errorMsg, setErrorMsg] = useState('')

    //Brings Files thumbnail into preview. and when new files are submitted or existing ones are deleted using 'Add more'
    useEffect(() => {
        if (currentUID) {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/attachments/preview/${currentUID}`)
                .then(async (response) => {
                    console.log(response.data);
                    setData(response.data.data);
                    if (response.data.data.length === 0) {
                        if(checkSubmitted){
                            setErrorMsg('All files deleted, Start over')
                        }else{
                            setErrorMsg('Oops! No file was uploaded, Start over')
                        }
                    }
                    else {
                        if (paste === '') {
                            setPaste(`${mirrorForPaste[1]}/files/${currentUID}`);
                        }
                    }
                    //setCurrentUID(''); //Reset current UID to default
                    //setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching images:', error);
                    setErrorMsg('Oops! No file was fetched, Start over...')
                    //setLoading(false);
                });
        }
    }, [checkSubmitted]);

    function isAllImagesOrVideos(data) {
        return data.every(item => item.mime.startsWith("image/") || item.mime.startsWith("video/"));
    }

    if (data.length === 0) {
        return (
            <div className='create py-3 py-md-4'>
                <Container style={{ minHeight: "600px", }} fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="create-top d-flex justify-content-between align-items-center mb-4 mb-lg-5">
                                <h3 className='mb-0'>{errorMsg}</h3>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    else {
        if(isAllImagesOrVideos(data))
        {
            return (
                <Preview data={data}
                    mirrorForPaste={mirrorForPaste}
                    currentUIDpreview={currentUIDpreview}
                    rerenderItems={rerenderItems} />
            )
        }
        else{
            return (
                <ItemsList data={data}
                    mirrorForPaste={mirrorForPaste}
                    currentUIDpreview={currentUIDpreview}
                    rerenderItems={rerenderItems} />
            )
        }
       
    }
}