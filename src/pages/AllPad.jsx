import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry'
import pdf from '../assets/img/pdf.png'
import { useState } from 'react'

export default function AllDoc() {
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
  ]
  const [open, isOpen] = useState(false);
  const [open2, isOpen2] = useState(false);

  const [isDelete, setIsDelete] = useState(false)
  const [selectAllItem, setSelectAllItem] = useState(false)

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setIsDelete(false);
      setSelectAllItem(false);
    } else {
      setSelectedItems(table.map((_, index) => index));
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
    setSelectAll(updatedSelectedItems.length === table.length);
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
                <Expiry />
              </div>
              <div className="d-flex align-items-center gap-2">
                {(isDelete || selectAllItem) &&
                  <button className='expires-btn' onClick={() => isOpen(!open)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9.5 16.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M14.5 16.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                }
                {selectAllItem &&
                  <button className='expires-btn2 d-flex align-items-center gap-2'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="currentColor" />
                      <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Download  All</span>
                  </button>
                }
              </div>
            </div>
            <div className="overflow-auto">
              <table className='w-100' >
                <thead>
                  <tr>
                    <th>
                      <div className="d-flex align-content-center gap-27">
                        <label htmlFor="b" className='form-checkbox d-none d-lg-flex align-items-center flexWrap gap-2'>
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
                  {table.map((item, index) => (
                    <tr key={index}>
                      <td >
                        <div className="d-flex align-content-center gap-27">
                          <label htmlFor={index} className='form-checkbox d-none d-lg-flex align-items-center flexWrap gap-2'>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(index)}
                              onChange={() => handleSelectItem(index)}
                              id={index}
                              className='d-none' />
                            <span className='icon'></span>
                          </label>
                          <div className='d-flex align-content-center gap-14'>
                            <img src={pdf} alt="" /> {item.name}</div>
                        </div>
                      </td>
                      <td ><p>{item.date}</p></td>
                      <td ><p>{item.size}</p></td>
                      <td className='' >
                        <div className="d-flex align-items-center gap-1">
                          <button className='d-flex align-items-center gap-2' onClick={() => isOpen2(!open2)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.9534 9.20419C18.2067 9.55944 18.3334 9.7371 18.3334 10C18.3334 10.2629 18.2067 10.4406 17.9534 10.7959C16.815 12.3922 13.9077 15.8334 10.0001 15.8334C6.0924 15.8334 3.18516 12.3922 2.04678 10.7959C1.79342 10.4406 1.66675 10.2629 1.66675 10C1.66675 9.7371 1.79342 9.55944 2.04678 9.20419C3.18516 7.60789 6.0924 4.16669 10.0001 4.16669C13.9077 4.16669 16.815 7.60789 17.9534 9.20419Z" stroke="currentColor" strokeWidth="1.25" />
                              <path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="currentColor" strokeWidth="1.25" />
                            </svg>
                            <span>Preview</span>
                          </button>
                          <button className='d-flex align-items-center gap-2'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="currentColor" />
                              <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
          <Col xs={12}>
            <div className="list d-flex align-items-center gap-3">
              <div className="num d-flex d-xl-block flex-column gap-5 gap-md-3">
                <p className='text-858585'>1</p>
                <p className='text-858585'>2</p>
              </div>
              <div className="des">
                <p className='text-858585'>Your files deserve the best protection, We ne andustry-standard incryption for all transfers and store your data across multiple secure locations.</p>
                <p className='text-858585'>Rest eary knowing your content is safe and always available when you need</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {open && (
        <div className="bg-shape">
          <div className="Modal">
            <div className="header d-flex align-items-center justify-content-between">
              <div className="d-flex gap-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.43484 8.06909C6.44624 4.50997 7.45193 2.7304 8.832 2.27232C9.59117 2.02031 10.409 2.02031 11.1682 2.27232C12.5483 2.7304 13.5539 4.50997 15.5653 8.06909C17.5768 11.6282 18.5824 13.4078 18.2808 14.8578C18.1148 15.6555 17.7058 16.379 17.1126 16.9248C16.0343 17.9167 14.0229 17.9167 10.0001 17.9167C5.97729 17.9167 3.96589 17.9167 2.88755 16.9248C2.29432 16.379 1.88541 15.6555 1.71943 14.8578C1.41774 13.4078 2.42344 11.6282 4.43484 8.06909Z" stroke="#DDDFE7" strokeWidth="1.25" />
                  <path d="M10.2017 14.1667V10.8333C10.2017 10.4405 10.2017 10.2441 10.0797 10.122C9.95766 10 9.76124 10 9.36841 10" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.99341 7.5H10.0009" stroke="#DDDFE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className='mb-0 '>Confirm Deletation</p>
              </div>
              <button className='bg-transparent border-0 p-0 close' onClick={() => isOpen(!open)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className='fs-6'>You are about to delete 1 content items. Are you sure you want to proceed?</p>
            <div className="d-flex justify-content-end align-items-center gap-2">
              <button onClick={() => isOpen(!open)}>Cancel</button>
              <button className='bg-red'>Confirm Deletation</button>
            </div>
          </div>
        </div>
      )}
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
                <p className='mb-0'>Secret message</p>
              </div>
              <button className='bg-transparent border-0 p-0 close' onClick={() => isOpen2(!open2)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="d-flex flex-column gap-2 gap-md-4 align-items-center wrap mb-md-3" >
              <h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 mt-md-4 pt-md-2'>expirES</h3>
              <Expiry />
              <p className='mb-0 text-center fs-6'>This secret message can only be displayed once. Would you like to see it now?</p>
              <div className="form-box">
                <input type="password" placeholder='Password' className="form-control" />
              </div>
              <div className="d-flex justify-content-center">
                <button className='bg-green'>Yes, see it</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
