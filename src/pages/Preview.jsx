import { Container, Row, Col } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import PreviewItem from "../components/PreviewItem"

import { Link, useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../layouts/Context';
import axios from 'axios';
import { handleDownload } from "../functions/Common";
import DeleteDialog from "../components/DeleteDialog";
import { PreviewPopup } from "./ItemsList";

export default function Preview({ data, mirrorForPaste, currentUIDpreview, rerenderItems }) {

  const {
    mirrorslist, setMirrorslist,
    expireslist, setExpireslist,
    currentUID, setCurrentUID,
    burnAfterRead, setBurnAfterRead,
    expiryDateIncrement, setExpiryDateIncrement,
    mirror, setMirror,
    paste, setPaste,
    pasteDel, setPasteDel,
  } = useContext(GlobalContext);

  const location = useLocation();

  //array of file uids to delete
  const [toDelete, setToDelete] = useState([]);
  const confirmDeletion = (array) => {
    array.forEach(deleteFileUID => {
      setToDelete((prevArr) => [...prevArr, deleteFileUID])
    });
  }

  //Toast message when clicked on sharelink, either for individual file or all files
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
    }
  },
    [data]) //Updates function stored in context API


  // To hide fixed container of Tools near the end of page
  const [isVisible, setIsVisible] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting); // Hide when endRef is visible
      },
      {
        root: null, // Observe relative to the viewport
        threshold: 0.5, // At least 50% of `endRef` should be visible
        rootMargin: "0px 0px -50% 0px", // Triggers when `endRef` reaches center
      }
    );

    if (endRef.current) {
      observer.observe(endRef.current);
    }

    return () => {
      if (endRef.current) {
        observer.unobserve(endRef.current);
      }
    };
  }, []);

  const [previewSrc, setPreviewSrc] = useState('');

  return (
    <>
      <div className='preview'>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <div className="preview-inner w-full mx-auto d-flex flex-wrap flex-row-reverse">
                <div className="preview-right">
                  {/* {!location.pathname.startsWith('/file/') && <div>
                    <p className="fs-6 mb-3 mb-lg-4 text-uppercase fw-medium">Tools</p>
                    <div className="d-flex flex-column gap-2 gap-md-3">
                      <a onClick={
                        (e) => {
                          data.forEach(obj => {
                            handleDownload(obj.id, obj.title, obj.extension, e);
                          });
                        }
                      }
                        href='javascript:void(0)' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
                          <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="d-block ps-1">Download All</span>
                      </a>
                      {(location.pathname === '/preview') && <a onClick={
                        () => {
                          var allFileUID = [];
                          data.forEach(obj => {
                            allFileUID.push(obj.file_uid)
                          });
                          confirmDeletion(allFileUID);
                        }
                      }
                        href='javascript:void(0)' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.25 4.58331L15.7336 12.9376C15.6016 15.072 15.5357 16.1392 15.0007 16.9066C14.7361 17.2859 14.3956 17.6061 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.284 4.98223 16.904C4.4474 16.1355 4.38287 15.0667 4.25384 12.9293L3.75 4.58331" stroke="white" strokeLinecap="round" />
                          <path d="M2.5 4.58335H17.5M13.3797 4.58335L12.8109 3.4098C12.433 2.63024 12.244 2.24045 11.9181 1.99736C11.8458 1.94344 11.7693 1.89547 11.6892 1.85394C11.3283 1.66669 10.8951 1.66669 10.0287 1.66669C9.14067 1.66669 8.69667 1.66669 8.32973 1.86179C8.24842 1.90503 8.17082 1.95494 8.09774 2.011C7.76803 2.26394 7.58386 2.66798 7.21551 3.47607L6.71077 4.58335" stroke="white" strokeLinecap="round" />
                          <path d="M7.91675 13.75V8.75" stroke="white" strokeLinecap="round" />
                          <path d="M12.0833 13.75V8.75" stroke="white" strokeLinecap="round" />
                        </svg>
                        <span className="d-block ps-1">Delete All</span>
                      </a>}
                      <a onClick={() => copyToClipboard(paste)
                        //() => { setPaste(`${data[0].ip}/files/${currentUIDpreview}`) }

                      } href='javascript:void(0)' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 13.229C10.1416 13.4609 10.3097 13.6804 10.5042 13.8828C11.7117 15.1395 13.5522 15.336 14.9576 14.4722C15.218 14.3121 15.4634 14.1157 15.6872 13.8828L18.9266 10.5114C20.3578 9.02184 20.3578 6.60676 18.9266 5.11718C17.4953 3.6276 15.1748 3.62761 13.7435 5.11718L13.03 5.85978" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M10.9703 18.14L10.2565 18.8828C8.82526 20.3724 6.50471 20.3724 5.07345 18.8828C3.64218 17.3932 3.64218 14.9782 5.07345 13.4886L8.31287 10.1172C9.74413 8.62761 12.0647 8.6276 13.4959 10.1172C13.6904 10.3195 13.8584 10.539 14 10.7708" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="d-block ps-1">Get Share link</span>
                      </a>
                    </div>
                  </div>} */}
                </div>
                <div className="preview-left d-grid mt-4 mt-md-0" style={{zIndex:'1'}}>
                  {(data.length == 0) && <><h3 className='mb-0'>No File Stored</h3></>}
                  <PreviewItem
                    data={data} copyToClipboard={copyToClipboard}
                    currentUID={currentUIDpreview} rerenderItems={rerenderItems}
                    setPaste={setPaste}
                    handleDownload={handleDownload} confirmDeletion={confirmDeletion}
                    setPreviewSrc={setPreviewSrc}
                  />
                  <div ref={endRef}></div>

                </div>
              </div>
            </Col>

          </Row>
        </Container>
        {(location.pathname === '/preview') && <DeleteDialog currentUID={currentUIDpreview} totalData={data.length} toDelete={toDelete} setToDelete={setToDelete} rerenderItems={rerenderItems} />}
      </div>

      <PreviewPopup previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>
      <div style={{ position: "fixed", top: '16vh', width: '100%', display: isVisible ? "block" : "none", }}>
        <div className="preview-inner w-full mx-auto d-flex flex-wrap flex-row-reverse">
          <div className="preview-right">
            {!location.pathname.startsWith('/file/') && <>
              <p className="fs-6 mb-3 mb-lg-4 text-uppercase fw-medium">Tools</p>
              <div className="d-flex flex-column gap-2 gap-md-3">
                <a onClick={
                  (e) => {
                    data.forEach(obj => {
                      handleDownload(obj.id, obj.title, obj.extension, e);
                    });
                  }
                }
                  href='javascript:void(0)' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
                    <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="d-block ps-1">Download All</span>
                </a>
                {(location.pathname === '/preview') && <a onClick={
                  () => {
                    var allFileUID = [];
                    data.forEach(obj => {
                      allFileUID.push(obj.file_uid)
                    });
                    confirmDeletion(allFileUID);
                  }
                }
                  href='javascript:void(0)' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.25 4.58331L15.7336 12.9376C15.6016 15.072 15.5357 16.1392 15.0007 16.9066C14.7361 17.2859 14.3956 17.6061 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.284 4.98223 16.904C4.4474 16.1355 4.38287 15.0667 4.25384 12.9293L3.75 4.58331" stroke="white" strokeLinecap="round" />
                    <path d="M2.5 4.58335H17.5M13.3797 4.58335L12.8109 3.4098C12.433 2.63024 12.244 2.24045 11.9181 1.99736C11.8458 1.94344 11.7693 1.89547 11.6892 1.85394C11.3283 1.66669 10.8951 1.66669 10.0287 1.66669C9.14067 1.66669 8.69667 1.66669 8.32973 1.86179C8.24842 1.90503 8.17082 1.95494 8.09774 2.011C7.76803 2.26394 7.58386 2.66798 7.21551 3.47607L6.71077 4.58335" stroke="white" strokeLinecap="round" />
                    <path d="M7.91675 13.75V8.75" stroke="white" strokeLinecap="round" />
                    <path d="M12.0833 13.75V8.75" stroke="white" strokeLinecap="round" />
                  </svg>
                  <span className="d-block ps-1">Delete All</span>
                </a>}
                <a onClick={() => copyToClipboard(paste)
                  //() => { setPaste(`${data[0].ip}/files/${currentUIDpreview}`) }

                } href='javascript:void(0)' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 13.229C10.1416 13.4609 10.3097 13.6804 10.5042 13.8828C11.7117 15.1395 13.5522 15.336 14.9576 14.4722C15.218 14.3121 15.4634 14.1157 15.6872 13.8828L18.9266 10.5114C20.3578 9.02184 20.3578 6.60676 18.9266 5.11718C17.4953 3.6276 15.1748 3.62761 13.7435 5.11718L13.03 5.85978" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10.9703 18.14L10.2565 18.8828C8.82526 20.3724 6.50471 20.3724 5.07345 18.8828C3.64218 17.3932 3.64218 14.9782 5.07345 13.4886L8.31287 10.1172C9.74413 8.62761 12.0647 8.6276 13.4959 10.1172C13.6904 10.3195 13.8584 10.539 14 10.7708" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="d-block ps-1">Get Share link</span>
                </a>
              </div>
            </>}
          </div></div>
      </div>
    </>
  )
}

