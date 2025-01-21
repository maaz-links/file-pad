import axios from "axios";

const handleDownload = async (downloadid,file_detail,event) => {
    event.preventDefault();
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/download`, {
            fileid: downloadid,
          }, // Request payloads
          {
            responseType: 'blob', // Important: Ensures the response is treated as a binary Blob
          }
        ).then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', file_detail); //or any other extension
       document.body.appendChild(link);
       link.click();
    });
  };


  function formatDateReadable(dateString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString); // Convert to Date object
  
    const day = date.getDate(); // Get day
    const month = months[date.getMonth()]; // Get month abbreviation
    const year = date.getFullYear(); // Get year
  
    return `${day} ${month} ${year}`;
  }


  function checkIfThumbnailhasFile(path) {
    // Extract the last part of the path
    const lastSegment = path.split('/').pop();
  
    // Check if the last segment contains a dot (.)
    // and that it's not the first character (to avoid hidden files like .gitignore)
    return lastSegment.includes('.') && lastSegment.indexOf('.') !== 0;
  }

export {handleDownload, formatDateReadable, checkIfThumbnailhasFile}