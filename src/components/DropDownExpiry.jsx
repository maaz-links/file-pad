import { useState } from "react";
import { GlobalContext } from "../layouts/Context";
import { useContext, useRef, useEffect } from 'react';

export default function DropDownExpiry({ className=""}) {
    const {  
        mirrorslist, setMirrorslist,
        expireslist,setExpireslist,
        currentUID, setCurrentUID,
        burnAfterRead, setBurnAfterRead,
        expiryDateIncrement, setExpiryDateIncrement,
        mirror,setMirror,
        paste,setPaste,
    } = useContext(GlobalContext);

    //Close dropdown when unfocused. ref={dropdownRef} is used in root element of dropdown 
    const dropdownRef = useRef(null);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setModal(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [modal, setModal] = useState(false);
    const handleClick = (e) => {
        setExpiryDateIncrement(e);
        setModal(false)
    }

    return (
        <div ref={dropdownRef} className={`page-dropdown position-relative z-1 ${className}`}>
            <button onClick={() => setModal(!modal)} className="w-100 d-flex align-items-center justify-content-between gap-2">
                <span my-data={expiryDateIncrement[1]}>
                {`Expires: ${expiryDateIncrement[0]}`}
                </span>
                <span className={`arrow ${modal ? '-scale-y-100' : ''}`}>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.1534 9.29001L12.2734 13.17L8.39343 9.29001C8.30085 9.19742 8.19093 9.12399 8.06997 9.07388C7.94901 9.02378 7.81936 8.99799 7.68843 8.99799C7.5575 8.99799 7.42785 9.02378 7.30688 9.07388C7.18592 9.12399 7.07601 9.19742 6.98343 9.29001C6.89085 9.38259 6.81741 9.4925 6.7673 9.61346C6.7172 9.73443 6.69141 9.86408 6.69141 9.99501C6.69141 10.1259 6.7172 10.2556 6.7673 10.3765C6.81741 10.4975 6.89085 10.6074 6.98343 10.7L11.5734 15.29C11.9634 15.68 12.5934 15.68 12.9834 15.29L17.5734 10.7C17.6661 10.6075 17.7397 10.4976 17.7899 10.3766C17.84 10.2557 17.8659 10.126 17.8659 9.99501C17.8659 9.86404 17.84 9.73436 17.7899 9.61338C17.7397 9.49241 17.6661 9.38252 17.5734 9.29001C17.1834 8.91001 16.5434 8.90001 16.1534 9.29001Z" fill="#E3DFDF" />
                    </svg>
                </span>
            </button>
            {modal &&
                <div className="list mt-1 p-2 position-absolute z-3 top-100 left-0 w-100 overflow-auto">
                    {expireslist.map((item, index) => (
                        <button onClick={() => handleClick(item)} key={index}>{`Expires: ${item[0]}`}</button>
                    ))}
                </div>
            }
        </div>
    )
}
