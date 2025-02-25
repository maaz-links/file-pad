import { Container, Row, Col } from "react-bootstrap";
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../layouts/Context';
import axios from 'axios';
import Preview from "./Preview";
import ItemsList from "./ItemsList";
import TextView from "./TextView";
import { toast } from "react-toastify";

export default function PreviewCall() {

    const {
        mirrorslist, setMirrorslist,
        expireslist, setExpireslist,
        currentUID, setCurrentUID,
        burnAfterRead, setBurnAfterRead,
        expiryDateIncrement, setExpiryDateIncrement,
        mirror, setMirror,
        paste, setPaste,
        totalItemsinPre, setTotalItemsinPre
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
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/preview/${currentUID}`)
                .then(async (response) => {
                    console.log(response.data);
                    setData(response.data.data);
                    setTotalItemsinPre(response.data.data.length);
                    if (response.data.data.length === 0) {
                        if(checkSubmitted){
                            setErrorMsg('All contents deleted, Start over')
                        }else{
                            setErrorMsg('Oops! No content was uploaded, Start over')
                        }
                    }
                    else {
                        if (paste === '') {
                            //setPaste(`${mirrorForPaste[1]}/files/${currentUID}`);
                            setPaste(`${mirrorForPaste[1]}/${currentUID}`)
                            copyToClipboard(`${mirrorForPaste[1]}/${currentUID}`)
                        }
                    }
                    //setCurrentUID(''); //Reset current UID to default
                    //setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching content:', error);
                    setData([]);
                    setTotalItemsinPre(0);
                    if(checkSubmitted){
                        setErrorMsg('All contents deleted, Start over')
                    }else{
                        setErrorMsg('Oops! No content was fetched, Start over')
                    }
                    //setLoading(false);
                });
        }
    }, [checkSubmitted]);

    const copyToClipboard = async (giventext) => {

        try {
          await navigator.clipboard.writeText(giventext);
          toast.success(`Link copied to Clipboard`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          console.log('Content copied to clipboard');
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      }

    function isAllImagesOrVideos(data) {
        return data.every(item => item.mime.startsWith("image/") || item.mime.startsWith("video/"));
    }

    if (data.length === 0) {
        return (
            <div className='create py-3 py-md-4'>
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="create-top list d-flex align-items-center gap-3">  {/*create-top makes text allcaps */}
                                <div className="des" style={{ maxWidth: "none" }}>
                                    <p className='text-858585'>
                                        <h3 className='mb-0'>{errorMsg}</h3>
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    else if(data[0].content){
        return (
            <TextView data={data}
                    currentUIDpreview={currentUIDpreview}
                    rerenderItems={rerenderItems} />
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