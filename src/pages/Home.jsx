
import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry'
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const { dynamicValue } = useParams();
  const [data, setData] = useState([]);
  const [currentUnix, setCurrentUnix] = useState(0);
  useEffect(() => {
    if (dynamicValue) {
      //setData(dynamicValue);
      const bringFiles = async () => {
        try {
          const response = await axios.post(`http://localhost:8000/api/upload/attachments/${dynamicValue}`);
          setData(response.data.data);
          console.log(response);
          console.log(response.data.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      bringFiles();
    }
  }, [dynamicValue]);

  function formatDateReadable(dateString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString); // Convert to Date object
  
    const day = date.getDate(); // Get day
    const month = months[date.getMonth()]; // Get month abbreviation
    const year = date.getFullYear(); // Get year
  
    return `${day} ${month} ${year}`;
  }
  const table = [
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
  ]
  const handleDownload = async (downloadid,file_detail,event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/api/download', {
            fileid: downloadid,
          }, // Request payload
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
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/download', {
  //       fileid: downloadid,
  //     }, // Request payload
  //     {
  //       responseType: 'blob', // Important: Ensures the response is treated as a binary Blob
  //     }
  //   );

  //   // Create a Blob URL for the file
  //   const blob = new Blob([response.data]);
  //   const url = window.URL.createObjectURL(blob);

  //   // Create a temporary anchor element and trigger the download
  //   const link = document.createElement('a');
  //   link.href = url;

  //   // Extract filename from response headers if available, or use a default name
  //   const contentDisposition = response.headers['content-disposition'];
  //   console.log(response.headers)
  //   const filename = contentDisposition
  //     ? contentDisposition.split('filename=')[1].replace(/"/g, '')
  //     : 'downloaded-file';

  //   link.download = filename; // Specify the filename for the downloaded file
  //   document.body.appendChild(link);
  //   link.click();

  //   // Clean up
  //   document.body.removeChild(link);
  //   window.URL.revokeObjectURL(url);
  // } catch (error) {
  //   console.error('Error downloading file:', error);
  //   alert('Failed to download file. Please try again.');
  // }
  //};
  // if(!data){
  //   return
  // }
  
  return (
    <div className='create py-3 py-md-4'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="create-top d-flex justify-content-between align-items-center mb-4 mb-lg-5">
              <h3 className='mb-0'>expiry will be </h3>
              {(data.length !== 0) && <Expiry unix={data[0].expiry_date} />}
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
                      <td ><p>{(index + 1).toString().padStart(2, '0')} {item.id}</p></td>
                      <td ><p>{item.file_detail}</p></td>
                      <td ><p>{formatDateReadable(item.created_at)}</p></td>
                      <td >
                        <div className="d-flex justify-content-between align-items-center">
                          {/* <p>{item.size}</p> */}<p></p>
                          <button onClick={(e) => handleDownload(item.id,item.file_detail, e)} className='ms-4'>Download</button>
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
    </div>

  )
}
