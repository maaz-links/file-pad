import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry';

export default function Authentication({ dynamicValue, singleFile, setDataCall, requiredPassword, setRequiredPassword, setDataType }) {

    const [passopen, setPassopen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    //const [requiredPassword, setRequiredPassword] = useState('');
    const [verified, setVerified] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [expiry, setExpiry] = useState(0);
    const [toBurn, setToBurn] = useState(true);
    const [verifyUID, setVerifyUID] = useState('');

    const [burnopen, setBurnopen] = useState(false);
    const handleRequiredPasswordChange = (event) => {
        setRequiredPassword(event.target.value);
    }

    useEffect(() => {
        if (dynamicValue) {
            checkPasswordRequirement(dynamicValue, singleFile, setPassopen)
        }
    }, [])

    function checkPasswordRequirement(dynamicValue, singleFile, setPassopen) { //passOpen must be false
        const checkPassReq = async () => {
            try {
                const fetchurl = (singleFile ? 'checkpassrequirementone' : 'checkpassrequirement')
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/upload/${fetchurl}/${dynamicValue}`);
                setVerifyUID(response.data.settinguid);
                setExpiry(response.data.expiry);
                setToBurn(response.data.burn_after_read);
                setDataType(response.data.type);
                const askPassword = response.data.message;
                if (askPassword == 'true') {
                    setPassopen(true);
                }
                else if (askPassword == 'false') {
                    setVerified(true);
                    //setErrorMsg("Good");
                }
                else {
                    setErrorMsg("Paste either doesn't exist, has expired, burned or has been deleted.");
                }
                const burnWarning = response.data.burn_after_read;
                if (burnWarning){
                    setBurnopen(true);
                }
                else{
                    //setErrorMsg('Data time');
                }
            } catch (err) {
                setErrorMsg("Paste either doesn't exist, has expired, burned or has been deleted.")
                console.error("Error fetching data:", err);
            }
        }
        checkPassReq();
    }

    useEffect(() => {
        if(verified && !toBurn){
            setDataCall(true);
            //setErrorMsg('Data time')
        }
    }, [verified])
    

    const checkPassword = () => {
        setIsSubmitting(true);
        const bringFiles = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/verifypass/${verifyUID}`, {
                    requiredPassword: requiredPassword,
                });
                if (response.data.message == "OK") {
                    setVerified(true);
                    //setErrorMsg("Good");
                }
                else {
                    setErrorMsg("The Password is Incorrect");
                }

            } catch (err) {
                setErrorMsg("The Password is Incorrect")
                console.error("Error fetching data:", err);
            }
            setIsSubmitting(false);
            setPassopen(false) 
        }
        bringFiles();
    }

    const backdrop = <>
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
                </Col>
            </Row>
        </Container>
    </>
    if (verified) {
        return (
            <div className='create py-3 py-md-4'>
                {backdrop}
                {burnopen && (
                    <div className="bg-shape">
                        <div className="Modal">
                            <div className="header d-flex align-items-center justify-content-between">
                                <div className="d-flex gap-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M4.43484 8.06909C6.44624 4.50997 7.45193 2.7304 8.832 2.27232C9.59117 2.02031 10.409 2.02031 11.1682 2.27232C12.5483 2.7304 13.5539 4.50997 15.5653 8.06909C17.5768 11.6282 18.5824 13.4078 18.2808 14.8578C18.1148 15.6555 17.7058 16.379 17.1126 16.9248C16.0343 17.9167 14.0229 17.9167 10.0001 17.9167C5.97729 17.9167 3.96589 17.9167 2.88755 16.9248C2.29432 16.379 1.88541 15.6555 1.71943 14.8578C1.41774 13.4078 2.42344 11.6282 4.43484 8.06909Z" stroke="#DDDFE7" strokeWidth="1.25" />
                                        <path d="M10.2017 14.1667V10.8333C10.2017 10.4405 10.2017 10.2441 10.0797 10.122C9.95766 10 9.76124 10 9.36841 10" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9.99341 7.5H10.0009" stroke="#DDDFE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className='mb-0'>Secret Message</p>
                                </div>
                                <button className='bg-transparent border-0 p-0 close' onClick={() => {setErrorMsg('No data fetched');setBurnopen(!burnopen)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="d-flex flex-column gap-2 gap-md-4 align-items-center wrap mb-md-3" >
                                {(expiry < (Date.now()/1000 + 259200000*60)) && <><h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 mt-md-4 pt-md-2'>Expires</h3>
                                <Expiry unix={expiry} /></>}
                                <p className='mb-0 text-center fs-6'>This secret message can only be displayed once. Would you like to see it now?</p>
                                <div className="d-flex justify-content-center">
                                    <button onClick={() => {setDataCall(true);
                                            //setErrorMsg('Data time'); 
                                            setBurnopen(false) }} className='btn bg-green'>Yes, see it</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='create py-3 py-md-4'>
            {backdrop}
            {passopen && (
                <div className="bg-shape">
                    <div className="Modal">
                        <div className="header d-flex align-items-center justify-content-between">
                            <div className="d-flex gap-12">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4.43484 8.06909C6.44624 4.50997 7.45193 2.7304 8.832 2.27232C9.59117 2.02031 10.409 2.02031 11.1682 2.27232C12.5483 2.7304 13.5539 4.50997 15.5653 8.06909C17.5768 11.6282 18.5824 13.4078 18.2808 14.8578C18.1148 15.6555 17.7058 16.379 17.1126 16.9248C16.0343 17.9167 14.0229 17.9167 10.0001 17.9167C5.97729 17.9167 3.96589 17.9167 2.88755 16.9248C2.29432 16.379 1.88541 15.6555 1.71943 14.8578C1.41774 13.4078 2.42344 11.6282 4.43484 8.06909Z" stroke="#DDDFE7" strokeWidth="1.25" />
                                    <path d="M10.2017 14.1667V10.8333C10.2017 10.4405 10.2017 10.2441 10.0797 10.122C9.95766 10 9.76124 10 9.36841 10" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.99341 7.5H10.0009" stroke="#DDDFE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className='mb-0'>Password Dialog</p>
                            </div>
                            {/* <button className='bg-transparent border-0 p-0 close' onClick={() => setPassopen(!passopen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button> */}
                        </div>
                        <div className="d-flex flex-column gap-2 gap-md-4 align-items-center wrap mb-md-3" >
                        {(expiry < (Date.now()/1000 + 259200000*60)) && <><h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 mt-md-4 pt-md-2'>Expires</h3>
                            <Expiry unix={expiry} /></>}
                            {!isSubmitting ? <>
                            <p className='mb-0 text-center fs-6'>This message is password protected.<br /> Enter Password</p>
                            <div className="form-box">
                            <form onSubmit={() => { checkPassword();}}>
                                <input type="password" onChange={handleRequiredPasswordChange} 
                                placeholder='Password' className="form-control" 
                                />
                                </form>
                            </div>
                            <div className="d-flex justify-content-center">
                                <button onClick={() => { checkPassword();}} className='btn bg-green'>
                                    Submit Password</button>
                            </div>
                            </> :
                            <>
                            <h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 mt-md-4 pt-md-2'>Please Wait...</h3>
                            </>}
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}
