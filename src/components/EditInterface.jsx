import React, {useState,useEffect, useContext} from "react";
import axios from "axios";
import { sizeValidation } from "../functions/FileUploading";
import { GlobalContext } from "../layouts/Context";

export default function EditInterface(props) {

    const { currentUID, editRef, fileUID, rerenderItems
    //  , children 
    } = props;

    const {onefilemax} = useContext(GlobalContext);
  
    const [files, setFiles] = useState([]);
  
    useEffect(() => {
      if (files.length > 0) {
        handleSubmit();
      }
    }, [files])
    const handleFileChange = async (e) => {
      console.log(onefilemax);
      const files = sizeValidation([e.target.files[0]],onefilemax);  // Get the selected files
      console.log('myfileuid',fileUID);
      setFiles(files);
    };
    const handleSubmit = async () => {
      try {
        var currentuid = currentUID;
        const uploadFiles = async () => {
          const promises = [];  //to track for redirect
          //for (let i = 0; i < files.length; i++) {
  
          for (let i = 0; i < 1; i++) { //Only one file
            const file = files[i];
            const formData = new FormData();
            formData.append("filesupload", file);
            // formData.append('expiry_date', newDateFormatted);
            formData.append('uid', currentuid);
            // formData.append('ip', mirror[1]);
  
            const uploadPromise = axios
              .post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/editsingle/${fileUID}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then(() => {
                //setResponseMessage('Files uploaded successfully!');
                console.log(`${file.name} uploaded successfully and updated.`);
              })
              .catch((err) => {
                // Handle error response
                //setResponseMessage('Error uploading files. Please try again.');
                console.error(err);
                console.error(`Error uploading ${file.name}:`, err);
              })
              .finally(() => {
                //setIsSubmitting(false);
                //setUploadModal(false)
              });
            promises.push(uploadPromise);
            console.log(uploadPromise);
          };
          console.log('loop ended', promises)
          Promise.all(promises)
            .then(() => {
              console.log('goto preview')
              rerenderItems();
              setFiles([]);
  
              // If All files uploaded successfully
              //Navigate('/preview', { replace: true }); // Redirect to /preview
            })
            .catch((error) => {
              console.log('wat happened?', error)
              setFiles([]);
              // Handle any errors, for example file upload failed
              //setResponseMessage('Error uploading some files. Please try again.');
            });
        };
  
        await uploadFiles();
      } catch (error) {
        console.error("Initial axios call failed:", error);
        //setResponseMessage("Error in initial setup. File upload canceled.");
      }
    };
  
    return (
      <>
        <input
          type="file"
          ref = {editRef}
          style={{ display: 'none' }}  // Hide the input
          onChange={handleFileChange}  // Handle file selection
        />
      </>
    )
  }
  