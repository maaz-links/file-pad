import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry'
import { checkIfThumbnailhasFile, formatBytes, formatDateReadable } from '../functions/Common'
import { IconFile } from '../components/IconFile'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../layouts/Context';
import axios from 'axios';
import { handleDownload } from "../functions/Common";
import DeleteDialog from "../components/DeleteDialog";

export default function ItemsList({ data, mirrorForPaste, currentUIDpreview, rerenderItems }) {

  const {setPasteDel,
  } = useContext(GlobalContext);

  const location = useLocation();

  //array of file uids to delete
  const [toDelete, setToDelete] = useState([]);
  const confirmDeletion = (array) => {
    array.forEach(deleteFileUID => {
      setToDelete((prevArr) => [...prevArr, deleteFileUID])
    });
  }

  const delFunc = () => {
    var allFileUID = [];
    data.forEach(obj => {
      allFileUID.push(obj.file_uid)
    });
    confirmDeletion(allFileUID);
  }
  useEffect(() => {
    if (location.pathname === '/preview') {
      setPasteDel(() => delFunc);

      //Reset checkboxes
      setSelectedItems([]);
      setIsDelete(false);
      setSelectAllItem(false);
    }
  },
    [data]) //Updates function stored in context API

  const [previewSrc, setPreviewSrc] = useState('');

  function isVideoFile(filePath) {
    // Define a regular expression for common video file extensions
    const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpeg)$/i;

    // Test if the file path matches the video file extensions
    return videoExtensions.test(filePath);
  }

  const [isDelete, setIsDelete] = useState(false) //Delete button
  const [selectAllItem, setSelectAllItem] = useState(false) //For Download All button

  const [selectedItems, setSelectedItems] = useState([]); //Stores indexes
  const [selectAll, setSelectAll] = useState(false); //Big checkbox

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setIsDelete(false);
      setSelectAllItem(false);
    } else {
      setSelectedItems(data.map((_, index) => index));
      setIsDelete(true);
      setSelectAllItem(true);
    }
    setSelectAll(!selectAll);
  };


  const handleSelectItem = (index) => {
    const updatedSelectedItems = selectedItems.includes(index)
      ? selectedItems.filter((item) => item !== index)
      : [...selectedItems, index];
    setSelectedItems(updatedSelectedItems);
    setSelectAll(updatedSelectedItems.length === data.length);
    setSelectAllItem(updatedSelectedItems.length > 1);
    setIsDelete(updatedSelectedItems.length > 0);
  };




  return (
    <div className='py-4 create allPad'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="create-top d-flex flex-column flex-md-row text-center text-md-start gap-2 justify-content-center justify-content-md-between align-items-center mb-4 mb-lg-5">
              <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 align-items-md-center">
                <h3 className='mb-0'>expires</h3>
                <Expiry unix={data[0].expiry_date} />
              </div>
              {!location.pathname.startsWith('/file/') && <>
              <div className="d-flex align-items-center gap-2">
                {(location.pathname === '/preview') && (isDelete || selectAllItem) &&
                  <button className='expires-btn' 
                  //onClick={() => isOpen(!open)}
                  onClick={
                    () => {
                      var allFileUID = [];
                      selectedItems.forEach(i => {
                        allFileUID.push(data[i].file_uid)
                      });
                      confirmDeletion(allFileUID);
                    }
                  }
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9.5 16.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M14.5 16.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                }
                {//selectAllItem &&
                  <button onClick={
                    (e) => {
                      data.forEach(obj => {
                        handleDownload(obj.id, obj.file_detail, e);
                      });
                    }
                  }
                  className='expires-btn2 d-flex align-items-center gap-2'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="currentColor" />
                      <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Download  All</span>
                  </button>
                }
                {/* {<button className='expires-btn2 d-flex align-items-center gap-2'
                onClick={() => { setPaste(`${data[0].ip}/files/${currentUIDpreview}`) }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33325 11.0241C8.45125 11.2174 8.59134 11.4003 8.75342 11.569C9.75967 12.6162 11.2934 12.78 12.4646 12.0601C12.6816 11.9267 12.8861 11.7631 13.0726 11.569L15.7721 8.75948C16.9648 7.51818 16.9648 5.50561 15.7721 4.2643C14.5793 3.02298 12.6456 3.02299 11.4528 4.2643L10.8583 4.88313" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                    <path d="M9.14184 15.1167L8.547 15.7357C7.3543 16.977 5.42051 16.977 4.2278 15.7357C3.03507 14.4943 3.03507 12.4818 4.2278 11.2405L6.92731 8.431C8.12003 7.18967 10.0538 7.18966 11.2465 8.431C11.4086 8.59958 11.5486 8.7825 11.6666 8.97566" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                  <span>Get Sharelink</span>
                </button>} */}
              </div>
              </>}
            </div>
            
            <div className="overflow-auto">
              <table className='w-100' >
                <thead>
                  <tr>
                    <th>
                      <div className="d-flex align-content-center gap-27">
                        <label htmlFor="b"
                        style={{visibility: location.pathname === '/preview' ? 'visible' : 'hidden'}} 
                        className='form-checkbox d-none d-lg-flex align-items-center flexWrap gap-2'>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            id="b"
                            className='d-none' />
                          <span className='icon'></span>
                        </label>
                        <p>Type</p>
                      </div>
                    </th>
                    {["Upload Date", "Size", "Action"].map((item, index) => (
                      <th key={index}><p className=''>{item}</p></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td >
                        <div className="d-flex align-content-center gap-27">
                          <label htmlFor={index} 
                          style={{visibility: location.pathname === '/preview' ? 'visible' : 'hidden'}} 
                          className='form-checkbox d-none d-lg-flex align-items-center flexWrap gap-2'>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(index)}
                              onChange={() => handleSelectItem(index)}
                              id={index}
                              className='d-none' />
                            <span className='icon'></span>
                          </label>
                          <div className='d-flex align-content-center align-items-center gap-14'>
                            {checkIfThumbnailhasFile(item.thumbnail) && false ?
                              (<img src={item.thumbnail}
                                // onClick={() => { isOpen2(!open2); setPreviewSrc(item.file_location) }}
                                width="45px" className='object-fit-cover' alt="" />) :
                              (<img src={IconFile(item.file_detail)} alt="" />)
                            }

                            {item.title}</div>
                        </div>
                      </td>
                      <td ><p>{formatDateReadable(item.created_at)}</p></td>
                      <td ><p>{formatBytes(item.size, 0)}</p></td>
                      <td className='' >
                        <div className="d-flex align-items-center gap-1">
                          {(item.mime.startsWith("image/") || item.mime.startsWith("video/")) ? <button className='d-flex align-items-center gap-2'
                            onClick={() => {setPreviewSrc(item.file_location) }}

                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.9534 9.20419C18.2067 9.55944 18.3334 9.7371 18.3334 10C18.3334 10.2629 18.2067 10.4406 17.9534 10.7959C16.815 12.3922 13.9077 15.8334 10.0001 15.8334C6.0924 15.8334 3.18516 12.3922 2.04678 10.7959C1.79342 10.4406 1.66675 10.2629 1.66675 10C1.66675 9.7371 1.79342 9.55944 2.04678 9.20419C3.18516 7.60789 6.0924 4.16669 10.0001 4.16669C13.9077 4.16669 16.815 7.60789 17.9534 9.20419Z" stroke="currentColor" strokeWidth="1.25" />
                              <path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="currentColor" strokeWidth="1.25" />
                            </svg>
                            <span>Preview</span>
                          </button>
                            :
                            <button className='d-flex align-items-center gap-2' style={{visibility: 'hidden'}}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.9534 9.20419C18.2067 9.55944 18.3334 9.7371 18.3334 10C18.3334 10.2629 18.2067 10.4406 17.9534 10.7959C16.815 12.3922 13.9077 15.8334 10.0001 15.8334C6.0924 15.8334 3.18516 12.3922 2.04678 10.7959C1.79342 10.4406 1.66675 10.2629 1.66675 10C1.66675 9.7371 1.79342 9.55944 2.04678 9.20419C3.18516 7.60789 6.0924 4.16669 10.0001 4.16669C13.9077 4.16669 16.815 7.60789 17.9534 9.20419Z" stroke="currentColor" strokeWidth="1.25" />
                                <path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="currentColor" strokeWidth="1.25" />
                              </svg>
                              <span>Preview</span>
                            </button>
                          }
                          <button onClick={(e) => handleDownload(item.id, item.file_detail, e)} className='d-flex align-items-center gap-2'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="currentColor" />
                              <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Download</span>
                          </button>
                          {/* <button onClick={() => setPaste(`${item.ip}/file/${item.file_uid}`)} className='d-flex align-items-center gap-2 w-100'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.33325 11.0241C8.45125 11.2174 8.59134 11.4003 8.75342 11.569C9.75967 12.6162 11.2934 12.78 12.4646 12.0601C12.6816 11.9267 12.8861 11.7631 13.0726 11.569L15.7721 8.75948C16.9648 7.51818 16.9648 5.50561 15.7721 4.2643C14.5793 3.02298 12.6456 3.02299 11.4528 4.2643L10.8583 4.88313" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                              <path d="M9.14184 15.1167L8.547 15.7357C7.3543 16.977 5.42051 16.977 4.2278 15.7357C3.03507 14.4943 3.03507 12.4818 4.2278 11.2405L6.92731 8.431C8.12003 7.18967 10.0538 7.18966 11.2465 8.431C11.4086 8.59958 11.5486 8.7825 11.6666 8.97566" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                            </svg>
                            <span >Link</span>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </Container>
      <PreviewPopup previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>
      {(location.pathname === '/preview') && <DeleteDialog currentUID={currentUIDpreview} totalData={data.length} toDelete={toDelete} setToDelete={setToDelete} rerenderItems={rerenderItems} />}
    </div>
  )
}

export function PreviewPopup({previewSrc,setPreviewSrc}){

  const [open2, isOpen2] = useState(false);

  useEffect(() => {
    if(previewSrc){
      isOpen2(true);
    }
    else{
      isOpen2(false);
    }
  
  }, [previewSrc])
  

  function isVideoFile(filePath) {
    // Define a regular expression for common video file extensions
    const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpeg)$/i;

    // Test if the file path matches the video file extensions
    return videoExtensions.test(filePath);
  }

  return(
    <>
    {open2 && (
        <div className="bg-shape" 
        // style={{position:'fixed',overflow:'auto',}}
        >
          <div className="Modal" 
          style={{
            maxWidth:"80%",
            maxHeight: "100vh",  // Ensures the modal doesn't exceed viewport height
            //overflow: "auto",    // Enables scrolling inside the modal

          }}>
            <div className="header d-flex align-items-center justify-content-between">
              <div className="d-flex gap-12">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.9534 9.20419C18.2067 9.55944 18.3334 9.7371 18.3334 10C18.3334 10.2629 18.2067 10.4406 17.9534 10.7959C16.815 12.3922 13.9077 15.8334 10.0001 15.8334C6.0924 15.8334 3.18516 12.3922 2.04678 10.7959C1.79342 10.4406 1.66675 10.2629 1.66675 10C1.66675 9.7371 1.79342 9.55944 2.04678 9.20419C3.18516 7.60789 6.0924 4.16669 10.0001 4.16669C13.9077 4.16669 16.815 7.60789 17.9534 9.20419Z" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="currentColor" strokeWidth="1.25" />
                </svg>
                <p className='mb-0'>Preview</p>
              </div>
              <button className='bg-transparent border-0 p-0 close' 
              onClick={
                //() => isOpen2(!open2)
                () => setPreviewSrc('')
                }>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="d-flex justify-content-center align-items-center" >
              {!isVideoFile(previewSrc) ? (
                <div >
                  <img src={previewSrc} style={{maxHeight:'90vh'}} className='top-0 start-0 w-100 h-100 object-fit-cover' alt="" />
                </div>
              ) : (
                  <video style={{maxHeight:'90vh'}} controls>
                    <source src={previewSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  // <iframe src={previewSrc}
                  // style={{
                  //   width: '500px',
                  //   height: '500px',
                  //   // minWidth: '640',
                  //   // minHeight: '480',
                  //   // maxWidth: '100%',
                  //   // maxHeight: '100%',
                  //   //aspectRatio: '16/9'  // Optional: to maintain a video aspect ratio
                  // }}
                  // title="Iframe Example"></iframe>                
              )

              }

            </div>
          </div>
        </div>
      )}
    </>
  )

}
