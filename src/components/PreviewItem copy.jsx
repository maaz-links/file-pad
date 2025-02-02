import { useState, useRef, useEffect } from 'react';
import { checkIfThumbnailhasFile } from '../functions/Common';
import { IconFile } from './IconFile';
import axios from 'axios';

export default function PreviewItem({ data, items, copyToClipboard, ...props }) {
    const [dropdown, setDropdown] = useState(null);

    // //Close dropdown when unfocused. ref={dropdownRef} is used in root element of dropdown 
    // const dropdownRef = useRef(null);
    // const handleClickOutside = (event) => {
    //     console.log(dropdownRef.current)
    //     console.log(event.target)
    //     console.log(dropdownRef.current.contains(event.target))
    //     console.log(dropdown)
    //     console.log(dropdown !== null)
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //         console.log('why');
    //         //setTimeout(() => setDropdown(null),1000);
    //         setDropdown(null);
    //     }
    // };
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

    if (items.length == 0) {
        return null;
    }
    return (
        items.map((item, index) => (
            <div className='preview-item d-grid' {...props} key={index}>
                {/* <h6 className="fw-medium lh-base mb-0" onClick={() => console.log(inputTitles2)} >{item.title}</h6> */}
                <div className="form-box d-none d-md-block">
                    {/* <input type="text" placeholder='Title' className="form-control"
                        my-data={item.itemid}
                        //value={inputTitles[index].title}
                        onChange={(e) => handleTitleChange(index, item.itemid, e)} /> */}
                    <TitleForm id={item.itemid} title={item.title} item={item} />
                </div>
                <div className="position-relative z-1">
                    <div ref={(el) => (dropdownRefs.current[index] = el)} className="preview-item-actions position-absolute top-0 end-0 z-2">
                        <div className='d-flex align-items-center gap-2'>
                            <a href='#' onClick={item.paste} className='border-0 p-0 d-flex align-items-center justify-content-center'>
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
                                {item.action.map((a, i) => (
                                    <a href={a.url ? a.url : 'javascript:void(0)'} onClick={a.event}
                                        // href={a.url} 
                                        key={i} className="d-flex w-100 align-items-center gap-2 fs-6 lh-base">
                                        {a.icon}
                                        <span className="d-block ps-1">{a.name}</span>
                                    </a>
                                ))}
                            </div>
                        }
                    </div>
                    {checkIfThumbnailhasFile(item.img) ?
                        (<div className="preview-item-img position-relative">
                            <img src={item.img} className='position-absolute top-0 start-0 w-100 h-100 object-fit-cover' alt="" />
                        </div>) :
                        (<div className="preview-item-img position-relative rounded-3 bg-dark">
                            <img src={IconFile(item.location)} className='position-absolute top-50 start-50 object-fit-cover' alt="" />
                        </div>)
                    }
                </div>
            </div>
        ))
    )
}

function TitleForm({item}) {
    const [currentInput, setCurrentInput] = useState('')

    useEffect(() => {
        setCurrentInput(item.title)
    }, [item]);

    function handleMyTitleChange(e) {
        console.log(currentInput);
        setCurrentInput(e.target.value);
    }
    async function handleUpdateTitle(e){
        e.preventDefault();
        console.log(currentInput)
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/upload/titles`, {
              items: [{id: item.itemid, title: currentInput}],
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