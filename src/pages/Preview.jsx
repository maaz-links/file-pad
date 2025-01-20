import { Container, Row, Col } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import PreviewItem from "../components/PreviewItem"
import img_1 from '../assets/img/preview/img-1.png'
import img_2 from '../assets/img/preview/img-2.png'
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../layouts/Context';
import axios from 'axios';
import { handleDownload } from "../functions/Common";

export default function Preview() {

  //const { currentUID, setCurrentUID, mirror, paste, setPaste } = useOutletContext();
  const {
    mirrorslist, setMirrorslist,
    expireslist, setExpireslist,
    currentUID, setCurrentUID,
    burnAfterRead, setBurnAfterRead,
    expiryDateIncrement, setExpiryDateIncrement,
    mirror, setMirror,
    paste, setPaste,
  } = useContext(GlobalContext);

  const itemTemp = (pitemid, ptitle, imgsrc, pastelink, downloadsrc) => {
    return {
      itemid: pitemid,
      title: ptitle,
      img: imgsrc,
      paste: pastelink,
      location: downloadsrc,
      action: [
        // {
        //   icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        //     <path d="M8.33325 11.0241C8.45125 11.2174 8.59134 11.4003 8.75342 11.569C9.75967 12.6162 11.2934 12.78 12.4646 12.0601C12.6816 11.9267 12.8861 11.7631 13.0726 11.569L15.7721 8.75948C16.9648 7.51818 16.9648 5.50561 15.7721 4.2643C14.5793 3.02298 12.6456 3.02299 11.4528 4.2643L10.8583 4.88313" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
        //     <path d="M9.14184 15.1167L8.547 15.7357C7.3543 16.977 5.42051 16.977 4.2278 15.7357C3.03507 14.4943 3.03507 12.4818 4.2278 11.2405L6.92731 8.431C8.12003 7.18967 10.0538 7.18966 11.2465 8.431C11.4086 8.59958 11.5486 8.7825 11.6666 8.97566" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
        //   </svg>),
        //   name: 'Get share link',
        //   url: ''
        // },
        {
          icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
            <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>),
          name: 'Download File',
          url: '',
          event: (e) => handleDownload(pitemid, downloadsrc, e)
        },
        {
          icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.25 4.58331L15.7336 12.9376C15.6016 15.072 15.5357 16.1392 15.0007 16.9066C14.7361 17.2859 14.3956 17.6061 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.284 4.98223 16.904C4.4474 16.1355 4.38287 15.0667 4.25384 12.9293L3.75 4.58331" stroke="white" strokeLinecap="round" />
            <path d="M2.5 4.58335H17.5M13.3797 4.58335L12.8109 3.4098C12.433 2.63024 12.244 2.24045 11.9181 1.99736C11.8458 1.94344 11.7693 1.89547 11.6892 1.85394C11.3283 1.66669 10.8951 1.66669 10.0287 1.66669C9.14067 1.66669 8.69667 1.66669 8.32973 1.86179C8.24842 1.90503 8.17082 1.95494 8.09774 2.011C7.76803 2.26394 7.58386 2.66798 7.21551 3.47607L6.71077 4.58335" stroke="white" strokeLinecap="round" />
            <path d="M7.91675 13.75V8.75" stroke="white" strokeLinecap="round" />
            <path d="M12.0833 13.75V8.75" stroke="white" strokeLinecap="round" />
          </svg>),
          name: 'Delete File',
          url: '',
          event: () => console.log('delete', pitemid)
        },
      ]
    }
  }

  const [mirrorForPaste] = useState(mirror);
  const [items, setItems] = useState([]);
  //const [images, setImages] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [inputTitles, setInputTitles] = useState([]);



  useEffect(() => {
    if (currentUID) {
      console.log(items);
      axios.post(`http://localhost:8000/api/upload/attachments/preview/${currentUID}`)
        .then(async (response) => {
          console.log(response.data);

          const myData = response.data.data || [];

          const transformedData = myData.map((data) => {
            return itemTemp(data.id, 'title', data.thumbnail, `${mirrorForPaste[1]}/file/${data.file_uid}`, data.file_detail);
          });
          const transformedTitles = myData.map((data) => {
            return { id: data.id, title: data.title };
          });
          setItems(transformedData);
          setInputTitles(transformedTitles);
          setPaste(`${mirror[1]}/files/${currentUID}`); //Sets paste value that will display on <Top>
          //setCurrentUID(''); //Reset current UID to default
          //setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching images:', error);
          //setLoading(false);
        });
    }
  }, []);

  const copyToClipboard = async (giventext) => {

    try {
      await navigator.clipboard.writeText(giventext);
      toast.success(`Link copied to Clipboard: ${giventext}`, {
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

  // Handle title change for each image
  const handleTitleChange = (index, id, event) => {
    let changeTitles = inputTitles;
    let data = changeTitles.find(data => data.id === id);
    if (data) {
      data.title = event.target.value;
      setInputTitles(changeTitles);
    }
  };
  //   const handleTitleChange = (index,id, event) => {
  //     const newTitles = [...titles];
  //     newTitles[index] = event.target.value;
  //     setTitles(newTitles);
  //     console.log(titles);
  // };

  // Handle form submission
  const handleSubmit = async (event) => {
    console.log(inputTitles);
    //return;
    event.preventDefault();
    //const testdata = [{ id: '60', title: 'amogus' },{ id: '61', title: 'sus' }];
    try {
      const response = await axios.put('http://localhost:8000/api/upload/titles', {
        items: inputTitles,
      });
      console.log('Updated items:', response.data.updatedItems);
    } catch (error) {
      console.error('Error updating titles:', error);
    }
  };

  const fileInputRef = useRef(null);  // Create a ref to the hidden file input

  const handleLinkClick = (e) => {
    e.preventDefault();  // Prevent default link behavior
    fileInputRef.current.click();  // Trigger click on the hidden file input
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;  // Get the selected files
    // files.forEach((file, index) => {
    //   console.log(file);
    // });
    console.log(files[0]);  // Log the selected files (or handle them as needed)
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Create a FormData instance to append the file
      const formData = new FormData();
      formData.append("filesupload", file);
      formData.append('file_burn_after_read', burnAfterRead);
      formData.append('uid', currentUID);
      try {
        // Make an individual Axios request for each file
        const response = axios.post("http://localhost:8000/api/upload/single", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
      promises.push(response);
    }
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

  // const tools = [
  //   {
  //     icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  //       <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
  //       <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  //     </svg>),
  //     title: 'Download Now',
  //     url: '',
  //   },
  //   {
  //     icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  //       <path d="M16.25 4.58331L15.7336 12.9376C15.6016 15.072 15.5357 16.1392 15.0007 16.9066C14.7361 17.2859 14.3956 17.6061 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.284 4.98223 16.904C4.4474 16.1355 4.38287 15.0667 4.25384 12.9293L3.75 4.58331" stroke="white" strokeLinecap="round" />
  //       <path d="M2.5 4.58335H17.5M13.3797 4.58335L12.8109 3.4098C12.433 2.63024 12.244 2.24045 11.9181 1.99736C11.8458 1.94344 11.7693 1.89547 11.6892 1.85394C11.3283 1.66669 10.8951 1.66669 10.0287 1.66669C9.14067 1.66669 8.69667 1.66669 8.32973 1.86179C8.24842 1.90503 8.17082 1.95494 8.09774 2.011C7.76803 2.26394 7.58386 2.66798 7.21551 3.47607L6.71077 4.58335" stroke="white" strokeLinecap="round" />
  //       <path d="M7.91675 13.75V8.75" stroke="white" strokeLinecap="round" />
  //       <path d="M12.0833 13.75V8.75" stroke="white" strokeLinecap="round" />
  //     </svg>),
  //     title: 'Delete image',
  //     url: '',
  //   },
  //   {
  //     icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  //       <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
  //       <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  //     </svg>),
  //     title: 'Share link',
  //     url: '',
  //   },
  // ]

  return (
    <div className='preview'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="preview-inner w-full mx-auto d-flex flex-wrap flex-row-reverse">
              <div className="preview-right">
                <p className="fs-6 mb-3 mb-lg-4 text-uppercase fw-medium">Image Tools</p>
                <div className="d-flex flex-column gap-2 gap-md-3">
                  {/* {tools.map((item, index) => (
                    <a onClick={item.url} href='#' key={index} className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                      {item.icon}
                      <span className="d-block ps-1">{item.title}</span>
                    </a>
                  ))} */}
                  <a href='#' onClick={handleLinkClick} className="d-flex w-100 align-items-center gap-2 fs-6 lh-base"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
                    <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg><span className="d-block ps-1">Unused</span></a>
                  <input
                    type="file"
                    ref={fileInputRef}  // Attach the ref to the file input
                    style={{ display: 'none' }}  // Hide the input
                    multiple
                    onChange={handleFileChange}  // Handle file selection
                  />
                  <a href='#' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.25 4.58331L15.7336 12.9376C15.6016 15.072 15.5357 16.1392 15.0007 16.9066C14.7361 17.2859 14.3956 17.6061 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.284 4.98223 16.904C4.4474 16.1355 4.38287 15.0667 4.25384 12.9293L3.75 4.58331" stroke="white" strokeLinecap="round" />
                    <path d="M2.5 4.58335H17.5M13.3797 4.58335L12.8109 3.4098C12.433 2.63024 12.244 2.24045 11.9181 1.99736C11.8458 1.94344 11.7693 1.89547 11.6892 1.85394C11.3283 1.66669 10.8951 1.66669 10.0287 1.66669C9.14067 1.66669 8.69667 1.66669 8.32973 1.86179C8.24842 1.90503 8.17082 1.95494 8.09774 2.011C7.76803 2.26394 7.58386 2.66798 7.21551 3.47607L6.71077 4.58335" stroke="white" strokeLinecap="round" />
                    <path d="M7.91675 13.75V8.75" stroke="white" strokeLinecap="round" />
                    <path d="M12.0833 13.75V8.75" stroke="white" strokeLinecap="round" />
                  </svg><span className="d-block ps-1">Unused</span></a>
                  <a onClick={(e) => { copyToClipboard(paste); handleSubmit(e) }} href='#' className="d-flex w-100 align-items-center gap-2 fs-6 lh-base"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
                    <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg><span className="d-block ps-1">Share link</span></a>
                </div>
              </div>
              <div className="preview-left d-grid mt-4 mt-md-0">
                <PreviewItem items={items} handleTitleChange={handleTitleChange} copyToClipboard={copyToClipboard} />

              </div>
            </div>
          </Col>

        </Row>
      </Container>
      <ToastContainer />
    </div>
  )
}
