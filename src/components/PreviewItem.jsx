import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { checkIfThumbnailhasFile } from '../functions/Common';
import { IconFile } from './IconFile';
import axios from 'axios';
import EditInterface from './EditInterface';

export default function PreviewItem(
    { data, copyToClipboard, setPaste, handleDownload, confirmDeletion, currentUID, rerenderItems, ...props }
) {

    const location = useLocation();

    const [dropdown, setDropdown] = useState(null);
    const dropdownRefs = useRef([]);
    const toggleDropdown = (index) => {
        setDropdown(dropdown === index ? null : index);
    };
    const handleClickOutside = (event) => {
        if (
            dropdown !== null && // A dropdown is open
            dropdownRefs.current[dropdown] && // Ref exists for the current dropdown
            !dropdownRefs.current[dropdown].contains(event.target) // Click outside the dropdown
        ) {
            setDropdown(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdown]);


    const [fileUIDtoEdit, setFileUIDtoEdit] = useState('');
    const editRef = useRef(null);
    const handleEditFile = (e, file_uid) => {
        e.preventDefault();  // Prevent default link behavior
        console.log('asdf',file_uid);
        setFileUIDtoEdit(file_uid);
        editRef.current.click();  // Trigger click on the hidden file input
    }


    if (data.length == 0) {
        return null;
    }
    return (
        <>
        {data.map((item, index) => (
            <div className='preview-item d-grid' {...props} key={index}>
                <div className="form-box d-none d-md-block">
                   {(location.pathname === '/preview') ? 
                   <TitleForm id={item.id} title={item.title} item={item} /> : 
                   <h6 className="fw-medium lh-base mb-0 text-white">{item.title}</h6>}
                </div>
                <div className="position-relative z-1">
                    <div ref={(el) => (dropdownRefs.current[index] = el)} className="preview-item-actions position-absolute top-0 end-0 z-2">
                        <div className='d-flex align-items-center gap-2'>
                            <a href='#' onClick={() => setPaste(`${item.ip}/file/${item.file_uid}`)} className='border-0 p-0 d-flex align-items-center justify-content-center'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.229C10.1416 13.4609 10.3097 13.6804 10.5042 13.8828C11.7117 15.1395 13.5522 15.336 14.9576 14.4722C15.218 14.3121 15.4634 14.1157 15.6872 13.8828L18.9266 10.5114C20.3578 9.02184 20.3578 6.60676 18.9266 5.11718C17.4953 3.6276 15.1748 3.62761 13.7435 5.11718L13.03 5.85978" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M10.9703 18.14L10.2565 18.8828C8.82526 20.3724 6.50471 20.3724 5.07345 18.8828C3.64218 17.3932 3.64218 14.9782 5.07345 13.4886L8.31287 10.1172C9.74413 8.62761 12.0647 8.6276 13.4959 10.1172C13.6904 10.3195 13.8584 10.539 14 10.7708" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </a>
                            <button onClick={() => toggleDropdown(index)} className='border-0 p-0 d-flex align-items-center justify-content-center'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.9958 12H12.0048" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17.9998 12H18.0088" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.99976 12H6.00874" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        {dropdown === index &&
                            <div className="list d-grid gap-2 gap-md-3 position-absolute top-full end-0 w-100"
                                onClick={() => {
                                    setTimeout(() => setDropdown(null), 200); // Close dropdown after 200ms
                                }}
                            >
                                {(location.pathname === '/preview') && 
                                <a href='javascript:void(0)' onClick={(e) => handleEditFile(e, item.file_uid)}
                                        className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.6783 4.9853L13.8464 3.81717C14.4916 3.17203 15.5376 3.17203 16.1828 3.81717C16.8278 4.46231 16.8278 5.50829 16.1828 6.15344L15.0146 7.32157M12.6783 4.9853L5.81678 11.8469C4.94569 12.718 4.51014 13.1535 4.21356 13.6842C3.91698 14.215 3.61859 15.4682 3.33325 16.6666C4.53166 16.3813 5.78491 16.0829 6.31566 15.7863C6.84641 15.4897 7.28195 15.0542 8.15304 14.1831L15.0146 7.32157M12.6783 4.9853L15.0146 7.32157" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.16675 16.6667H14.1667" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" />
                                        </svg>
                                        <span className="d-block ps-1">Edit Image</span>
                                    </a>}
                                <a href='#' onClick={() => setPaste(`${item.ip}/file/${item.file_uid}`)}
                                    className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.33325 11.0241C8.45125 11.2174 8.59134 11.4003 8.75342 11.569C9.75967 12.6162 11.2934 12.78 12.4646 12.0601C12.6816 11.9267 12.8861 11.7631 13.0726 11.569L15.7721 8.75948C16.9648 7.51818 16.9648 5.50561 15.7721 4.2643C14.5793 3.02298 12.6456 3.02299 11.4528 4.2643L10.8583 4.88313" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
                                        <path d="M9.14184 15.1167L8.547 15.7357C7.3543 16.977 5.42051 16.977 4.2278 15.7357C3.03507 14.4943 3.03507 12.4818 4.2278 11.2405L6.92731 8.431C8.12003 7.18967 10.0538 7.18966 11.2465 8.431C11.4086 8.59958 11.5486 8.7825 11.6666 8.97566" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
                                    </svg>
                                    <span className="d-block ps-1">Get Sharelink</span>
                                </a>
                                <a href='javascript:void(0)' onClick={(e) => handleDownload(item.id, item.file_detail, e)}
                                    className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="white" strokeWidth="1.25" />
                                        <path d="M10.0001 13.3334V6.66669M10.0001 13.3334C9.41658 13.3334 8.32636 11.6714 7.91675 11.25M10.0001 13.3334C10.5836 13.3334 11.6738 11.6714 12.0834 11.25" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="d-block ps-1">Download File</span>
                                </a>
                                {(location.pathname === '/preview') && 
                                <a href='javascript:void(0)' onClick={() => confirmDeletion([item.file_uid])}
                                    className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.25 4.58331L15.7336 12.9376C15.6016 15.072 15.5357 16.1392 15.0007 16.9066C14.7361 17.2859 14.3956 17.6061 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.284 4.98223 16.904C4.4474 16.1355 4.38287 15.0667 4.25384 12.9293L3.75 4.58331" stroke="white" strokeLinecap="round" />
                                        <path d="M2.5 4.58335H17.5M13.3797 4.58335L12.8109 3.4098C12.433 2.63024 12.244 2.24045 11.9181 1.99736C11.8458 1.94344 11.7693 1.89547 11.6892 1.85394C11.3283 1.66669 10.8951 1.66669 10.0287 1.66669C9.14067 1.66669 8.69667 1.66669 8.32973 1.86179C8.24842 1.90503 8.17082 1.95494 8.09774 2.011C7.76803 2.26394 7.58386 2.66798 7.21551 3.47607L6.71077 4.58335" stroke="white" strokeLinecap="round" />
                                        <path d="M7.91675 13.75V8.75" stroke="white" strokeLinecap="round" />
                                        <path d="M12.0833 13.75V8.75" stroke="white" strokeLinecap="round" />
                                    </svg>
                                    <span className="d-block ps-1">Delete File</span>
                                </a>}

                            </div>
                        }
                    </div>
                    {(/^video\//.test(item.mime)) ? 
                        (<div className="preview-item-img position-relative rounded-3 bg-dark">
                            {/* <img src={IconFile(item.file_detail)} className='position-absolute top-50 start-50 object-fit-cover' alt="" /> */}
                            <video className='position-absolute top-0 start-0 w-100 h-100 ' controls>
                                <source src={item.file_location} type="video/mp4" />
                                {/* <source src={item.file_location} type="video/ogg" /> */}
                                Your browser does not support the video tag.
                            </video>
                        </div>)

                    :
                    checkIfThumbnailhasFile(item.thumbnail) ?
                        (<div className="preview-item-img position-relative">
                            <img src={item.thumbnail} className='position-absolute top-0 start-0 w-100 h-100 object-fit-cover' alt="" />
                        </div>) :
                        (<div className="preview-item-img position-relative rounded-3 bg-dark">
                            <img src={IconFile(item.file_detail)} className='position-absolute top-50 start-50 object-fit-cover' alt="" />
                        </div>)
                    }
                </div>
            </div>
        ))}
        {(location.pathname === '/preview') && <EditInterface currentUID={currentUID} editRef={editRef} fileUID={fileUIDtoEdit} rerenderItems={rerenderItems}/>}
        </>
    )
}

function TitleForm({ item }) {
    const [currentInput, setCurrentInput] = useState('')

    useEffect(() => {
        setCurrentInput(item.title)
    }, [item]);

    function handleMyTitleChange(e) {
        console.log(currentInput);
        setCurrentInput(e.target.value);
    }
    async function handleUpdateTitle(e) {
        e.preventDefault();
        console.log(currentInput)
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/upload/titles`, {
                items: [{ id: item.id, title: currentInput }],
            });
            console.log('Updated items:', response.data.updatedItems);
        } catch (error) {
            console.error('Error updating titles:', error);
        }
    }

    return (
        <>
            <form onSubmit={handleUpdateTitle}>
                <input type="text" placeholder='Title' className="form-control"
                    my-data={item.id}
                    value={currentInput}
                    onChange={(e) => handleMyTitleChange(e)} />
            </form>
        </>
    )
}