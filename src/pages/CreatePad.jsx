import { useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import { Col, Container, Row } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Editor from '../components/Editor'
import song_icon from '../assets/img/song-icon.png'
import { IconFile } from '../components/IconFile'
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../layouts/Context';
import 
{formatBytes, formatDate, calculateAverageSpeed, 
  calculateSpeedAndTime, calculateTotalRemainingTime,
  calculateLoadedFiles, hhmmss,} from '../functions/FileUploading';

import { sizeValidation } from '../functions/GlobalCheck';

export default function CreatePad() {

  //const { burnAfterRead, expiryDateIncrement, mirror, setCurrentUID } = useOutletContext();
  //Get values from <top> component
  const {  
    mirrorslist, setMirrorslist,
    expireslist,setExpireslist,
    currentUID, setCurrentUID,
    burnAfterRead, setBurnAfterRead,
    expiryDateIncrement, setExpiryDateIncrement,
    mirror,setMirror,
    paste,setPaste,
    password,setPassword,
    onefilemax,multifilemax,setPopupMsg
    
} = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false); //For upload button, unused
  const [textSubmitting, setTextSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(''); //For message, only for testing
  const [files, setFiles] = useState([]); //files to upload
  const [badFiles,setBadFiles] = useState([]);

  const [progress, setProgress] = useState({}); //progress of each file
  const [overallProgress, setOverallProgress] = useState(0); //average progress of all files
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [totalRemainingTime, setTotalRemainingTime] = useState(0);
  const [uploadDetails, setUploadDetails] = useState([]); //speed and remaining time of each file


  const Navigate = useNavigate(); //For redirect
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropItem, setDropItem] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [fullScreenEdit, setFullScreenEdit] = useState(false);

  const onDrop = (selectedFiles) => {

    const [acceptedFiles,unacceptedFiles] = sizeValidation(selectedFiles,onefilemax);
    if (acceptedFiles.length < 1){
      setPopupMsg(`Selected file(s) exceed the maximum allowed size of ${formatBytes(onefilemax)} each.`);
      return;
    }
    const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > multifilemax){
      setPopupMsg(`The total upload size exceeds the maximum limit of ${formatBytes(multifilemax)}.`);
      return;
    }
    if (!isValidPassword(password)){
      setPopupMsg(`Password field must not contain blank spaces.`);
      return;
    }
    //console.log(acceptedFiles);
    setUploadModal(true)
    setFiles(acceptedFiles); //insreting files in state
    setBadFiles(unacceptedFiles);

    //console.log(acceptedFiles); //log
    setIsDragOver(false)
    //setFiles([...e.target.files]);
    setOverallProgress(0);
    setTotalRemainingTime(0);
    setAvgSpeed(0);
    setPaste('');

    //Below code created by frontend dev: Doesnt have much purpose for now
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setDropItem(base64String);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = () => {
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf,.doc',
    onDragEnter,
    onDragLeave,
  });

  const isValidPassword = (password) => {
    return !/\s/.test(password); // Returns false if spaces are found
  };
  
 
  const handleSubmit = async () => {
    //event.preventDefault();
    setIsSubmitting(true);
    setResponseMessage('');

    

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    let loadedSize = 0;
    let avgSpeeder = 0;
    let timeLeft = 0;
    setProgress({});
    setUploadDetails([]);
    setOverallProgress(0);
    const startTimes = files.map(() => Date.now());
    const tempDetails = files.map((file) => ({
      name: file.name,
      speed: 0,
      remaining: 0,
    }));
    setUploadDetails(tempDetails);

    try {
      // First axios statement to create settings in backend
      //var currentuid = generateRandomString();
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/settings`, {
        expiry_date: formatDate(expiryDateIncrement[1]),//newDateFormatted,
        burn_after_read: burnAfterRead,
        password: password,
        //uid: currentuid,
        ip: mirror[1],
        //mirror[0]: Contains Text to display in frontend
        //mirror[1]: Contains IP Address to be sent
      });

      //console.log("Initial axios call successful:", response.data); //log
      setCurrentUID(response.data.uid);
      var currentuid = response.data.uid;
      const uploadFiles = async () => {
        const promises = [];  //to track for redirect
        files.forEach((file, index) => {
          const formData = new FormData();
          formData.append("filesupload", file);
          // formData.append('expiry_date', newDateFormatted);
          formData.append('file_burn_after_read', burnAfterRead);
          formData.append('uid', currentuid);
          // formData.append('ip', mirror[1]);

          const uploadPromise = axios
            .post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const { speed, remaining } = calculateSpeedAndTime(
                  loaded,
                  total,
                  startTimes[index]
                );

                setProgress((prevProgress) => {
                  const updProg = {
                    ...prevProgress,
                    [file.name]: { loaded, total },
                  };
                  //console.log('prog', updProg); //log
                  loadedSize = calculateLoadedFiles(updProg);
                  return updProg;
                });

                setUploadDetails((prevDetails) => {
                  const updatedDetails = [...prevDetails];
                  updatedDetails[index] = { name: file.name, speed, remaining };
                  //console.log('wat', updatedDetails); //log
                  avgSpeeder = calculateAverageSpeed(updatedDetails);
                  timeLeft = calculateTotalRemainingTime(updatedDetails);
                  return updatedDetails;
                });

                const overallProgressValue = Math.round((loadedSize / totalSize) * 100);
                setOverallProgress(overallProgressValue);
                setAvgSpeed(avgSpeeder);
                setTotalRemainingTime(timeLeft);
              },
            })
            .then(() => {
              setResponseMessage('Files uploaded successfully!');
              console.log(`${file.name} uploaded successfully.`);
            })
            .catch((err) => {
              // Handle error response
              setResponseMessage('Error uploading files. Please try again.');
              //console.error(err);
              console.error(`Error uploading ${file.name}:`, err);
            })
            .finally(() => {
              setIsSubmitting(false);
              //setUploadModal(false)
            });
          promises.push(uploadPromise);
        });
        Promise.all(promises)
          .then(() => {
            // If All files uploaded successfully
            Navigate('/preview'); // Redirect to /preview
          })
          .catch(() => {
            // Handle any errors, for example file upload failed
            setResponseMessage('Error uploading some files. Please try again.');
          });
      };

      await uploadFiles();
    } catch (error) {
      console.error("Initial axios call failed:", error);
      setResponseMessage("Error in initial setup. File upload canceled.");
    }
  };

  useEffect(() => {
    if (uploadModal || (files.length > 0)) { //This triggers file Uploading
      handleSubmit();
    }
    if (uploadModal || fullScreenEdit) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }


  }, [uploadModal, fullScreenEdit])

  useEffect(() => {
    setPaste('');
    setPassword('');
    setBurnAfterRead('0');
  }, [])
  

  const toggleFullScreen = () => {
    setFullScreenEdit(!fullScreenEdit)
  };

  // useEffect(() => {
  //   if (uploadModal) {
  //     setInterval(() => Navigate('/preview'), 3000)
  //   } else {
  //     return;
  //   }
  //   return () => {
  //     return;
  //   }
  // }, [uploadModal, Navigate])



  const [textValue, setTextValue] = useState('');
  const [isTextEmpty, setIsTextEmpty] = useState(true);

  const handleTextSubmit = () => {
    if (isTextEmpty){
      setPopupMsg(`Content cannot be empty. Please enter text before creating.`);
      return;
    }
  
    if (!isValidPassword(password)){
      setPopupMsg(`Password field must not contain blank spaces.`);
      return;
    }
    setTextSubmitting(true);
    const formData = new FormData();
    formData.append('textupload', textValue);
    formData.append('expiry_date', formatDate(expiryDateIncrement[1]));
    formData.append('burn_after_read', burnAfterRead);
    formData.append('password', password);
    formData.append('ip', mirror[1]);

    // Send the POST request using Axios
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/textupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        //console.log('Response:', response.data);
        //const textpaste = `${mirror[1]}/text/${response.data.uid}`;
        //setPaste(textpaste)
        setCurrentUID(response.data.uid);
        Navigate('/preview');
        // try {
        //   navigator.clipboard.writeText(textpaste);
        //   toast.success(`Link copied to Clipboard: ${textpaste}`, {
        //     position: "top-right",
        //     autoClose: false,
        //     hideProgressBar: false,
        //     closeOnClick: false,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        //   });
        //   console.log('Content copied to clipboard');
        // } catch (err) {
        //   console.error('Failed to copy: ', err);
        // }
      })
      .catch((error) => {
        console.error('Error:', error);
        setPopupMsg(`Failed to create. Please check your internet connection and try again.`);
      })
      .finally(() => {
        setTextSubmitting(false);
      });
  }

  // useEffect(() => {
  //   if(paste !== ''){
      
  //   }

  // },[paste])

  
  return (
    <>
      <div className='home px-2 my-4'>
        <div className={`home-shape position-fixed z-3 bg-opacity-25 top-0 left-0 w-100 h-100 bg-black ${isDragOver ? 'blurred' : ''}`}></div>
        <Container fluid>
          <Row className='mb-3 mb-md-4'>
            <Col xs={12} lg={6}>
              <div className={`doc-upload ${isDragOver ? 'blurred position-relative z-3' : ''}`}>
                <div {...getRootProps()} className={`doc-upload-inner`}>
                  <input {...getInputProps()} id="upload_doc" className="d-none"/>
                  <div className="doc-upload-info text-center">
                    <svg width="84" height="76" viewBox="0 0 84 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.8786 23.2599C21.5996 22.9813 21.3784 22.6505 21.2274 22.2863C21.0764 21.9221 20.9987 21.5317 20.9987 21.1375C20.9987 20.7432 21.0764 20.3529 21.2274 19.9887C21.3784 19.6245 21.5996 19.2936 21.8786 19.015L39.8782 1.01534C40.1568 0.736418 40.4877 0.515144 40.8519 0.364174C41.2161 0.213204 41.6065 0.135498 42.0007 0.135498C42.3949 0.135498 42.7853 0.213204 43.1495 0.364174C43.5137 0.515144 43.8445 0.736418 44.1232 1.01534L62.1228 19.015C62.6857 19.5779 63.002 20.3414 63.002 21.1375C63.002 21.9336 62.6857 22.697 62.1228 23.2599C61.5599 23.8228 60.7964 24.1391 60.0004 24.1391C59.2043 24.1391 58.4408 23.8228 57.8779 23.2599L45.0006 10.3789V42.1371C45.0006 42.9327 44.6846 43.6958 44.122 44.2584C43.5594 44.821 42.7963 45.137 42.0007 45.137C41.2051 45.137 40.442 44.821 39.8794 44.2584C39.3168 43.6958 39.0008 42.9327 39.0008 42.1371V10.3789L26.1235 23.2599C25.8449 23.5389 25.514 23.7601 25.1498 23.9111C24.7856 24.0621 24.3953 24.1398 24.001 24.1398C23.6068 24.1398 23.2164 24.0621 22.8522 23.9111C22.488 23.7601 22.1572 23.5389 21.8786 23.2599ZM83.9999 45.137V69.1366C83.9999 70.7279 83.3678 72.254 82.2426 73.3792C81.1174 74.5044 79.5913 75.1365 78 75.1365H6.00136C4.41009 75.1365 2.88399 74.5044 1.75879 73.3792C0.633594 72.254 0.00146484 70.7279 0.00146484 69.1366V45.137C0.00146484 43.5458 0.633594 42.0197 1.75879 40.8945C2.88399 39.7693 4.41009 39.1371 6.00136 39.1371H31.5009C31.8987 39.1371 32.2802 39.2952 32.5615 39.5765C32.8428 39.8578 33.0009 40.2393 33.0009 40.6371V41.9346C33.0009 46.9783 37.1258 51.2307 42.1732 51.1369C44.5301 51.0917 46.7752 50.1236 48.4258 48.4407C50.0765 46.7578 51.001 44.4944 51.0005 42.1371V40.6371C51.0005 40.2393 51.1586 39.8578 51.4399 39.5765C51.7212 39.2952 52.1027 39.1371 52.5005 39.1371H78C79.5913 39.1371 81.1174 39.7693 82.2426 40.8945C83.3678 42.0197 83.9999 43.5458 83.9999 45.137ZM69.0002 57.1368C69.0002 56.2468 68.7363 55.3768 68.2418 54.6368C67.7474 53.8968 67.0446 53.32 66.2223 52.9794C65.4001 52.6388 64.4953 52.5497 63.6224 52.7234C62.7495 52.897 61.9477 53.3256 61.3184 53.9549C60.689 54.5842 60.2605 55.386 60.0868 56.2589C59.9132 57.1318 60.0023 58.0366 60.3429 58.8589C60.6835 59.6811 61.2603 60.3839 62.0003 60.8784C62.7403 61.3728 63.6103 61.6367 64.5003 61.6367C65.6937 61.6367 66.8383 61.1626 67.6822 60.3187C68.5261 59.4748 69.0002 58.3303 69.0002 57.1368Z" fill="#C2C2C2" />
                    </svg>
                    <h4 className="text-uppercase">Drag & Drop or Click to Upload</h4>
                    <p>Quickly share your files and download links anonymously & encrypted</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} lg={6} className='mt-4 mt-lg-0'>
              <div className={`doc-create overflow-hidden ${fullScreenEdit ? 'full-screen position-fixed bottom-0 end-0' : ''}`}>
                <Editor onClick={() => toggleFullScreen()} textValue={textValue} setTextValue={setTextValue} setIsTextEmpty={setIsTextEmpty} />
                <button onClick={handleTextSubmit} disabled={textSubmitting} className='btn bg-white position-absolute bottom-0 end-0 m-2 m-md-3 m-lg-4'>Create</button>
              </div>
            </Col>
          </Row>
        </Container>
        {/* <ToastContainer /> */}
      </div>
      {uploadModal &&
        <div className="doc-modal position-fixed top-0 left-0 w-100 vh-100 d-flex flex-column z-3"
        style={{
          overflowY: "auto", // Enable vertical scrolling
          padding: "2rem 0"
        }}>
          <div className="mx-auto doc-modal-inner">

            {/* This component is declared below 
                It gives overall status of all files uploading*/}
            <UploadOverview length={files.length} avgSpeed={avgSpeed} totalRemainingTime={hhmmss(totalRemainingTime)} overallProgress={overallProgress} />

            {files.map((file, index) => (
              <div key={file.name} className="doc-modal-body">
                <div className="doc-modal-uploading d-flex gap-3 flex-wrap align-items-center justify-content-between">
                  <div className="left d-flex align-items-center gap-2" >
                    <div className="icon" >
                      {/* <img src={song_icon}  alt="" /> */}
                      <img src={IconFile(file.name)} alt="" />
                    </div>
                    <div className="ps-1">
                      <h6 className='mb-0 lh-base text-uppercase'
                        style={{                   // Ensure file name is contained if its large
                          maxWidth: '400px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis' // (...)
                        }}>{file.name}</h6>
                      <p className='text-uppercase lh-base'>{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <div className="right d-grid align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H5C4.22343 3 3.83515 3 3.52886 3.12687C3.12048 3.29603 2.79603 3.62048 2.62687 4.02886C2.5 4.33515 2.5 4.72343 2.5 5.5C2.5 6.27657 2.5 6.66485 2.62687 6.97114C2.79603 7.37952 3.12048 7.70398 3.52886 7.87313C3.83515 8 4.22343 8 5 8H15C15.7766 8 16.1648 8 16.4712 7.87313C16.8795 7.70398 17.204 7.37952 17.3732 6.97114C17.5 6.66485 17.5 6.27657 17.5 5.5C17.5 4.72343 17.5 4.33515 17.3732 4.02886C17.204 3.62048 16.8795 3.29603 16.4712 3.12687C16.1648 3 15.7766 3 15 3Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 8H5C4.22343 8 3.83515 8 3.52886 8.12687C3.12048 8.29602 2.79603 8.62048 2.62687 9.02883C2.5 9.33517 2.5 9.72342 2.5 10.5C2.5 11.2766 2.5 11.6648 2.62687 11.9712C2.79603 12.3795 3.12048 12.704 3.52886 12.8732C3.83515 13 4.22343 13 5 13H15C15.7766 13 16.1648 13 16.4712 12.8732C16.8795 12.704 17.204 12.3795 17.3732 11.9712C17.5 11.6648 17.5 11.2766 17.5 10.5C17.5 9.72342 17.5 9.33517 17.3732 9.02883C17.204 8.62048 16.8795 8.29602 16.4712 8.12687C16.1648 8 15.7766 8 15 8Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 13H5C4.22343 13 3.83515 13 3.52886 13.1268C3.12048 13.296 2.79603 13.6205 2.62687 14.0288C2.5 14.3352 2.5 14.7234 2.5 15.5C2.5 16.2766 2.5 16.6648 2.62687 16.9712C2.79603 17.3795 3.12048 17.704 3.52886 17.8732C3.83515 18 4.22343 18 5 18H15C15.7766 18 16.1648 18 16.4712 17.8732C16.8795 17.704 17.204 17.3795 17.3732 16.9712C17.5 16.6648 17.5 16.2766 17.5 15.5C17.5 14.7234 17.5 14.3352 17.3732 14.0288C17.204 13.6205 16.8795 13.296 16.4712 13.1268C16.1648 13 15.7766 13 15 13Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 5.5H5.00833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 10.5H5.00833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 15.5H5.00833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.5 5.5H7.50833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.5 10.5H7.50833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.5 15.5H7.50833" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h6 className="mb-0 pl-1">{mirror[0]}</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.2502 11.3333L14.1668 8M11.6668 13C11.6668 13.9205 10.9207 14.6667 10.0002 14.6667C9.07966 14.6667 8.3335 13.9205 8.3335 13C8.3335 12.0795 9.07966 11.3333 10.0002 11.3333C10.9207 11.3333 11.6668 12.0795 11.6668 13Z" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M5 10.5C5 7.73857 7.23857 5.5 10 5.5C10.9107 5.5 11.7646 5.74348 12.5 6.16891" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M2.0835 10.5001C2.0835 6.76809 2.0835 4.90212 3.24286 3.74274C4.40224 2.58337 6.26821 2.58337 10.0002 2.58337C13.7321 2.58337 15.5981 2.58337 16.7574 3.74274C17.9169 4.90212 17.9169 6.76809 17.9169 10.5001C17.9169 14.232 17.9169 16.098 16.7574 17.2573C15.5981 18.4167 13.7321 18.4167 10.0002 18.4167C6.26821 18.4167 4.40224 18.4167 3.24286 17.2573C2.0835 16.098 2.0835 14.232 2.0835 10.5001Z" stroke="#E3DFDF" strokeWidth="1.25" />
                      </svg>
                      <h6 className="mb-0 pl-1">{uploadDetails[index]?.speed} KB/s</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.04798 8.60657L2.53784 8.45376C4.33712 3.70477 9.503 0.999917 14.5396 2.34474C19.904 3.77711 23.0904 9.26107 21.6565 14.5935C20.2227 19.926 14.7116 23.0876 9.3472 21.6553C5.36419 20.5917 2.58192 17.2946 2 13.4844" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8V12L14 14" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h6 className="mb-0 pl-1">{hhmmss(uploadDetails[index]?.remaining)}</h6>
                    </div>

                    <div className="d-flex align-items-center gap-2 justify-content-end">
                      {/* <button className='btn' disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? 'Uploading...' : 'Upload'}</button>
                    <button className='btn' onClick={() => setUploadModal(false)}>Cancel</button> */}
                      {/* These buttons arent needed */}
                    </div>
                  </div>
                </div>
                {/* Bytes loaded/Total Bytes * 100 */}
                <ProgressBar now={(progress[file.name]?.loaded / progress[file.name]?.total) * 100 || 0} />
              </div>
            ))}

            {badFiles.map((file, index) => (
              <div key={file.name} className="doc-modal-body">
                <div className="doc-modal-uploading d-flex gap-3 flex-wrap align-items-center justify-content-between">
                  <div className="left d-flex align-items-center gap-2" >
                    <div className="icon" >
                      {/* <img src={song_icon}  alt="" /> */}
                      <img src={IconFile(file.name)} alt="" />
                    </div>
                    <div className="ps-1">
                      <h6 className='mb-0 lh-base text-uppercase'
                        style={{                   // Ensure file name is contained if its large
                          maxWidth: '400px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis' // (...)
                        }}>{file.name}</h6>
                      <p className='text-uppercase lh-base'>{formatBytes(file.size,0)}</p>
                    </div>
                  </div>
                  <div className="right align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.43484 8.06909C6.44624 4.50997 7.45193 2.7304 8.832 2.27232C9.59117 2.02031 10.409 2.02031 11.1682 2.27232C12.5483 2.7304 13.5539 4.50997 15.5653 8.06909C17.5768 11.6282 18.5824 13.4078 18.2808 14.8578C18.1148 15.6555 17.7058 16.379 17.1126 16.9248C16.0343 17.9167 14.0229 17.9167 10.0001 17.9167C5.97729 17.9167 3.96589 17.9167 2.88755 16.9248C2.29432 16.379 1.88541 15.6555 1.71943 14.8578C1.41774 13.4078 2.42344 11.6282 4.43484 8.06909Z" stroke="#DDDFE7" strokeWidth="1.25" />
                        <path d="M10.2017 14.1667V10.8333C10.2017 10.4405 10.2017 10.2441 10.0797 10.122C9.95766 10 9.76124 10 9.36841 10" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.99341 7.5H10.0009" stroke="#DDDFE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h6 className="mb-0 pl-1">Error uploading file. File size cannot exceed {formatBytes(onefilemax)}</h6>
                    </div>
                  </div>
                </div>
                {/* Bytes loaded/Total Bytes * 100 */}
                <ProgressBar variant="danger" now={100} />
              </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}

function UploadOverview({ length, avgSpeed, totalRemainingTime, overallProgress }) {
  const uploadFileInfofer = [
    {
      icon: `<svg class="position-relative" style="top:-3px" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.3119 2.22946H8.65596L6.73242 0.305908H1.92355C0.865596 0.305908 0 1.1715 0 2.22946V6.07655H19.2355V4.153C19.2355 3.09505 18.3699 2.22946 17.3119 2.22946Z" fill="#AFAFAF"/>
<path d="M17.3119 2.22931H1.92355C0.865596 2.22931 0 3.09491 0 4.15286V13.7706C0 14.8285 0.865596 15.6941 1.92355 15.6941H17.3119C18.3699 15.6941 19.2355 14.8285 19.2355 13.7706V4.15286C19.2355 3.09491 18.3699 2.22931 17.3119 2.22931Z" fill="#AFAFAF"/>
</svg>`,
      title: 'Destination',
      value: 'Files'
    },
    {
      icon: `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.2601 8.75002V8.33335C17.2601 5.19065 17.2601 3.61931 16.2838 2.643C15.3075 1.66669 13.7362 1.66669 10.5934 1.66669H9.76017C6.61753 1.66669 5.0462 1.66669 4.06989 2.64299C3.09358 3.61929 3.09356 5.19062 3.09354 8.3333L3.09351 12.0834C3.09348 14.8229 3.09347 16.1927 3.85007 17.1146C3.98861 17.2834 4.14339 17.4382 4.31219 17.5768C5.23415 18.3334 6.60391 18.3334 9.34342 18.3334" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.42676 5.83331H13.9268" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.42676 10H11.4268" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.26 16.6667V14.1667C17.26 12.9755 16.1408 11.6667 14.76 11.6667C13.3793 11.6667 12.26 12.9755 12.26 14.1667V17.0834C12.26 17.7737 12.8197 18.3334 13.51 18.3334C14.2003 18.3334 14.76 17.7737 14.76 17.0834V14.1667" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>`,
      title: 'Total Files',
      value: `${length} Files`
    },
    {
      icon: `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3676 10.8333L14.2843 7.5M11.7843 12.5C11.7843 13.4205 11.0381 14.1667 10.1176 14.1667C9.19709 14.1667 8.45093 13.4205 8.45093 12.5C8.45093 11.5795 9.19709 10.8333 10.1176 10.8333C11.0381 10.8333 11.7843 11.5795 11.7843 12.5Z" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round"/>
<path d="M5.11768 10C5.11768 7.23857 7.35625 5 10.1177 5C11.0284 5 11.8823 5.24348 12.6177 5.66891" stroke="#E3DFDF" strokeWidth="1.25" strokeLinecap="round"/>
<path d="M2.20093 10C2.20093 6.26803 2.20093 4.40205 3.36029 3.24268C4.51967 2.08331 6.38564 2.08331 10.1176 2.08331C13.8495 2.08331 15.7155 2.08331 16.8749 3.24268C18.0343 4.40205 18.0343 6.26803 18.0343 10C18.0343 13.7319 18.0343 15.5979 16.8749 16.7573C15.7155 17.9167 13.8495 17.9167 10.1176 17.9167C6.38564 17.9167 4.51967 17.9167 3.36029 16.7573C2.20093 15.5979 2.20093 13.7319 2.20093 10Z" stroke="#E3DFDF" strokeWidth="1.25"/>
</svg>`,
      title: 'avg speed',
      value: `${avgSpeed.toFixed(2)} KB/s`
    },
    {
      icon: `<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.10682 8.60657L2.59668 8.45376C4.39596 3.70477 9.56184 0.999917 14.5984 2.34474C19.9628 3.77711 23.1492 9.26107 21.7153 14.5935C20.2815 19.926 14.7704 23.0876 9.40604 21.6553C5.42303 20.5917 2.64076 17.2946 2.05884 13.4844" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.0588 8V12L14.0588 14" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>`,
      title: 'remaining time',
      value: `${totalRemainingTime}`
    },
    {
      icon: `<svg class="position-relative" style="top:-2px" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.66675 13.3334L13.3334 6.66669M8.33341 7.50002C8.33341 7.96025 7.96031 8.33335 7.50008 8.33335C7.03985 8.33335 6.66675 7.96025 6.66675 7.50002C6.66675 7.03979 7.03985 6.66669 7.50008 6.66669C7.96031 6.66669 8.33341 7.03979 8.33341 7.50002ZM13.3334 12.357C13.3334 12.8173 12.9603 13.1904 12.5001 13.1904C12.0398 13.1904 11.6667 12.8173 11.6667 12.357C11.6667 11.8968 12.0398 11.5237 12.5001 11.5237C12.9603 11.5237 13.3334 11.8968 13.3334 12.357Z" stroke="#E3DFDF" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="#E3DFDF" strokeWidth="1.5"/>
</svg>`,
      title: 'progress',
      value: `${overallProgress}%`
    },
  ]

  return (
    <>
      <div className="doc-modal-header d-flex flex-wrap gap-3 justify-content-between">
        {uploadFileInfofer.map((item, index) => (
          <div key={index} className=''>
            <div className="d-flex align-items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: item.icon }}></span>
              <h6 className='text-uppercase ps-md-1 mb-0'>{item.title}</h6>
            </div>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
