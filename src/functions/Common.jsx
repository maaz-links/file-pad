import axios from "axios";

const handleDownload = async (downloadid,title,ext,event) => {
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
       link.setAttribute('download', `${title}.${ext}`); //or any other extension
       document.body.appendChild(link);
       link.click();
    });
  };

  export const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop() : ''; // Returns the last part after the dot
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
    if(!path){return false};
    const lastSegment = path.split('/').pop();
  
    // Check if the last segment contains a dot (.)
    // and that it's not the first character (to avoid hidden files like .gitignore)
    return lastSegment.includes('.') && lastSegment.indexOf('.') !== 0;
  }

  export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


export {handleDownload, formatDateReadable, checkIfThumbnailhasFile}