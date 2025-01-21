
import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry'
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { IconFile } from '../components/IconFile';
import { handleDownload, formatDateReadable, checkIfThumbnailhasFile } from '../functions/Common';

export default function Home({ dynamicValue, singleFile}) {

  const [open, isOpen] = useState(false);
  const [open2, isOpen2] = useState(false);
  const [passopen, setPassopen] = useState(true);
  const [previewSrc, setPreviewSrc] = useState('none');

  const [data, setData] = useState([]);
  const [requiredPassword, setRequiredPassword] = useState('');

  
  const handleRequiredPasswordChange = (event) => {
    setRequiredPassword(event.target.value);
    console.log('passw',requiredPassword.length);
  }
  const checkPassword = () => {
    console.log('verify',requiredPassword );
    if (dynamicValue) {
      const fetchurl = (singleFile ? 'attachsingle' : 'attachments') 
      //setData(dynamicValue);
      const bringFiles = async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/${fetchurl}/${dynamicValue}`,{
            requiredPassword: requiredPassword,
          });
          setData(response.data.data);
          console.log(response);
          console.log(response.data.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      bringFiles();
    }
  }


  function isVideoFile(filePath) {
    // Define a regular expression for common video file extensions
    const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpeg)$/i;

    // Test if the file path matches the video file extensions
    return videoExtensions.test(filePath);
  }

  return (
    <div className='create py-3 py-md-4'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="create-top d-flex justify-content-between align-items-center mb-4 mb-lg-5">
              {(data.length !== 0) && <><h3 className='mb-0'>expiry will be</h3><Expiry unix={data[0].expiry_date} /></>}
            </div>
            <div className="overflow-auto">
              <table className='w-100' >
                <thead>
                  <tr>
                    {["Symbol", "File name", "Upload Date", " "].map((item, index) => (
                      <th key={index}><p>{item}</p></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>

                      <td ><p>
                        {checkIfThumbnailhasFile(item.thumbnail) ?
                          (<img src={item.thumbnail} onClick={() => { isOpen2(!open2); setPreviewSrc(item.file_location) }} width="55px" className='object-fit-cover' alt="" />) :
                          (<img src={IconFile(item.file_detail)} alt="" />)
                        }</p></td>
                        {/* /{(index + 1).toString().padStart(2, '0')}/{item.id}</p></td> */}
                      <td ><p>{item.file_detail}</p></td>
                      <td ><p>{formatDateReadable(item.created_at)}</p></td>
                      <td >
                        <div className="d-flex justify-content-between align-items-center">
                          {/* <p>{item.size}</p> */}<p></p>
                          <button onClick={(e) => handleDownload(item.id, item.file_detail, e)} className='ms-4'>Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* {table.map((item, index) => (
                    <tr key={index}>
                      <td ><p>{(index + 1).toString().padStart(2, '0')}</p></td>
                      <td ><p>{item.name}</p></td>
                      <td ><p>{item.date}</p></td>
                      <td >
                        <div className="d-flex justify-content-between align-items-center">
                          <p>{item.size}</p>
                          <button className='ms-4'>Download</button>
                        </div>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </Container>
      {open2 && (
        <div className="bg-shape">
          <div className="Modal">
            <div className="header d-flex align-items-center justify-content-between">
              <div className="d-flex gap-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.43484 8.06909C6.44624 4.50997 7.45193 2.7304 8.832 2.27232C9.59117 2.02031 10.409 2.02031 11.1682 2.27232C12.5483 2.7304 13.5539 4.50997 15.5653 8.06909C17.5768 11.6282 18.5824 13.4078 18.2808 14.8578C18.1148 15.6555 17.7058 16.379 17.1126 16.9248C16.0343 17.9167 14.0229 17.9167 10.0001 17.9167C5.97729 17.9167 3.96589 17.9167 2.88755 16.9248C2.29432 16.379 1.88541 15.6555 1.71943 14.8578C1.41774 13.4078 2.42344 11.6282 4.43484 8.06909Z" stroke="#DDDFE7" strokeWidth="1.25" />
                  <path d="M10.2017 14.1667V10.8333C10.2017 10.4405 10.2017 10.2441 10.0797 10.122C9.95766 10 9.76124 10 9.36841 10" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.99341 7.5H10.0009" stroke="#DDDFE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className='mb-0'>Preview</p>
              </div>
              <button className='bg-transparent border-0 p-0 close' onClick={() => isOpen2(!open2)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }} >
              {!isVideoFile(previewSrc) ? (
                <div >
                  <img src={previewSrc} className='top-0 start-0 w-100 h-100 object-fit-cover' alt="" />
                </div>
              ) : (
                <iframe src={previewSrc}
                  style={{
                    width: '500px',
                    height: '500px',  
                    // minWidth: '640',
                    // minHeight: '480',
                    // maxWidth: '100%',
                    // maxHeight: '100%',
                    //aspectRatio: '16/9'  // Optional: to maintain a video aspect ratio
                  }}
                  title="Iframe Example"></iframe>
              )

              }


              {/* <h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 mt-md-4 pt-md-2'>expirES</h3>
              <Expiry />
              <p className='mb-0 text-center fs-6'>This secret message can only be displayed once. Would you like to see it now?</p>
              <div className="form-box">
                <input type="password" placeholder='Password' className="form-control" />
              </div>
              <div className="d-flex justify-content-center">
                <button className='bg-green'>Yes, see it</button>
              </div> */}
            </div>
          </div>
        </div>
      )}
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
                <p className='mb-0'>Secret message</p>
              </div>
              {/* <button className='bg-transparent border-0 p-0 close' onClick={() => setPassopen(!passopen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button> */}
            </div>
            <div className="d-flex flex-column gap-2 gap-md-4 align-items-center wrap mb-md-3" >
              <h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 mt-md-4 pt-md-2'>Enter Password</h3>
              {/* <Expiry />
              <p className='mb-0 text-center fs-6'>This secret message can only be displayed once. Would you like to see it now?</p> */}
              <div className="form-box">
                <input type="password" onChange={handleRequiredPasswordChange} placeholder='Password' className="form-control" />
              </div>
              <div className="d-flex justify-content-center">
                <button onClick={() => {checkPassword();setPassopen(false)}} className='bg-green'>Yes, see it</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
