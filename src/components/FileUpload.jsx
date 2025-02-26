import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
    const [isDragOver, setIsDragOver] = useState(false); 

    const onDrop = (acceptedFiles) => {
        setIsDragOver(false);
    };

    // Handle when file is dragged over or left
    const onDragEnter = () => {
        setIsDragOver(true);
    };

    const onDragOver = (event) => {
        event.preventDefault();  // Allow drop by preventing default behavior
    };

    const onDragLeave = () => {
        setIsDragOver(false);  // Reset drag over state when drag leaves the drop area
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.pdf,.doc',
        onDragEnter,
        onDragOver,
        onDragLeave,
    });

    return (
        <div>
            <div className={`home-shape position-fixed z-3 bg-opacity-25 top-0 left-0 w-100 h-100 bg-black ${isDragOver ? 'blurred' : ''}`}></div>
            <div className={`doc-upload ${isDragOver ? 'blurred' : ''}`}>
                <div {...getRootProps()} className={`doc-upload-inner ${isDragOver ? 'highlight' : ''}`}
                    onDragLeave={onDragLeave}>
                    <input {...getInputProps()} id="upload_doc" className="d-none" />
                    <div className="doc-upload-info text-center">
                        <svg width="84" height="76" viewBox="0 0 84 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.8786 23.2599C21.5996 22.9813 21.3784 22.6505 21.2274 22.2863C21.0764 21.9221 20.9987 21.5317 20.9987 21.1375C20.9987 20.7432 21.0764 20.3529 21.2274 19.9887C21.3784 19.6245 21.5996 19.2936 21.8786 19.015L39.8782 1.01534C40.1568 0.736418 40.4877 0.515144 40.8519 0.364174C41.2161 0.213204 41.6065 0.135498 42.0007 0.135498C42.3949 0.135498 42.7853 0.213204 43.1495 0.364174C43.5137 0.515144 43.8445 0.736418 44.1232 1.01534L62.1228 19.015C62.6857 19.5779 63.002 20.3414 63.002 21.1375C63.002 21.9336 62.6857 22.697 62.1228 23.2599C61.5599 23.8228 60.7964 24.1391 60.0004 24.1391C59.2043 24.1391 58.4408 23.8228 57.8779 23.2599L45.0006 10.3789V42.1371C45.0006 42.9327 44.6846 43.6958 44.122 44.2584C43.5594 44.821 42.7963 45.137 42.0007 45.137C41.2051 45.137 40.442 44.821 39.8794 44.2584C39.3168 43.6958 39.0008 42.9327 39.0008 42.1371V10.3789L26.1235 23.2599C25.8449 23.5389 25.514 23.7601 25.1498 23.9111C24.7856 24.0621 24.3953 24.1398 24.001 24.1398C23.6068 24.1398 23.2164 24.0621 22.8522 23.9111C22.488 23.7601 22.1572 23.5389 21.8786 23.2599ZM83.9999 45.137V69.1366C83.9999 70.7279 83.3678 72.254 82.2426 73.3792C81.1174 74.5044 79.5913 75.1365 78 75.1365H6.00136C4.41009 75.1365 2.88399 74.5044 1.75879 73.3792C0.633594 72.254 0.00146484 70.7279 0.00146484 69.1366V45.137C0.00146484 43.5458 0.633594 42.0197 1.75879 40.8945C2.88399 39.7693 4.41009 39.1371 6.00136 39.1371H31.5009C31.8987 39.1371 32.2802 39.2952 32.5615 39.5765C32.8428 39.8578 33.0009 40.2393 33.0009 40.6371V41.9346C33.0009 46.9783 37.1258 51.2307 42.1732 51.1369C44.5301 51.0917 46.7752 50.1236 48.4258 48.4407C50.0765 46.7578 51.001 44.4944 51.0005 42.1371V40.6371C51.0005 40.2393 51.1586 39.8578 51.4399 39.5765C51.7212 39.2952 52.1027 39.1371 52.5005 39.1371H78C79.5913 39.1371 81.1174 39.7693 82.2426 40.8945C83.3678 42.0197 83.9999 43.5458 83.9999 45.137ZM69.0002 57.1368C69.0002 56.2468 68.7363 55.3768 68.2418 54.6368C67.7474 53.8968 67.0446 53.32 66.2223 52.9794C65.4001 52.6388 64.4953 52.5497 63.6224 52.7234C62.7495 52.897 61.9477 53.3256 61.3184 53.9549C60.689 54.5842 60.2605 55.386 60.0868 56.2589C59.9132 57.1318 60.0023 58.0366 60.3429 58.8589C60.6835 59.6811 61.2603 60.3839 62.0003 60.8784C62.7403 61.3728 63.6103 61.6367 64.5003 61.6367C65.6937 61.6367 66.8383 61.1626 67.6822 60.3187C68.5261 59.4748 69.0002 58.3303 69.0002 57.1368Z" fill="#C2C2C2" />
                        </svg>
                        <h4 className="text-uppercase">Drag & Drop or Click to Upload</h4>
                        <p>Quickly share your files and download links anonymously & encrypted</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
