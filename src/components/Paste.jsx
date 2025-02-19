import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { GlobalContext } from '../layouts/Context';
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Paste({ icon = "", btnText = "Delete Data", className = "" }) {

    const {
        mirrorslist, setMirrorslist,
        expireslist, setExpireslist,
        currentUID, setCurrentUID,
        burnAfterRead, setBurnAfterRead,
        expiryDateIncrement, setExpiryDateIncrement,
        mirror, setMirror,
        paste, setPaste,
        pasteDel, setPasteDel,
        totalItemsinPre, setTotalItemsinPre
    } = useContext(GlobalContext);

    const location = useLocation();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(paste);
            toast.success('Link copied to Clipboard', {
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
    return (
        <div className={`copy d-flex justify-content-between ${className}`}>
            <div className="d-flex align-items-center gap-2">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5" cy="12.5" r="12.5" fill="#17A34A" />
                    <path d="M8.854 13.5422L10.6769 15.3651L16.1457 9.63593" stroke="white" strokeWidth="1.17188" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className='text-ABB1AE'>{`Your paste is ${paste}`}</p>
                <button onClick={copyToClipboard} className='p-0 rounded-1 d-flex align-items-center justify-content-center text-ABB1AE'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.30322 7.36369C4.30322 6.06853 4.30322 5.42095 4.70558 5.01857C5.10796 4.61621 5.75554 4.61621 7.0507 4.61621H7.50861C8.80377 4.61621 9.45135 4.61621 9.85372 5.01857C10.2561 5.42095 10.2561 6.06853 10.2561 7.36369V7.8216C10.2561 9.11676 10.2561 9.76434 9.85372 10.1667C9.45135 10.5691 8.80377 10.5691 7.50861 10.5691H7.0507C5.75554 10.5691 5.10796 10.5691 4.70558 10.1667C4.30322 9.76434 4.30322 9.11676 4.30322 7.8216V7.36369Z" stroke="currentColor" strokeWidth="1.0303" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.96606 4.61658C7.96496 3.26249 7.94449 2.56111 7.55032 2.08086C7.47422 1.98811 7.38918 1.90307 7.29645 1.82696C6.78982 1.41119 6.03715 1.41119 4.53176 1.41119C3.02638 1.41119 2.27369 1.41119 1.76708 1.82696C1.67433 1.90307 1.58929 1.98811 1.51318 2.08086C1.09741 2.58747 1.09741 3.34016 1.09741 4.84554C1.09741 6.35093 1.09741 7.1036 1.51318 7.61024C1.58929 7.70296 1.67433 7.788 1.76708 7.8641C2.24733 8.25827 2.94871 8.27874 4.3028 8.27984" stroke="currentColor" strokeWidth="1.0303" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            {(location.pathname === '/preview') &&
                <>
                    {totalItemsinPre ? <button onClick={pasteDel} className='p-0 border-0 bg-transparent text-ABB1AE d-flex align-items-center gap'>
                        {icon}
                        {btnText}
                    </button>
                        :
                        <button className='p-0 border-0 bg-transparent text-ABB1AE d-flex align-items-center gap'>
                            <Link to="/">
                            <svg width="35px" height="26px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M25 38c-7.2 0-13-5.8-13-13 0-3.2 1.2-6.2 3.3-8.6l1.5 1.3C15 19.7 14 22.3 14 25c0 6.1 4.9 11 11 11 1.6 0 3.1-.3 4.6-1l.8 1.8c-1.7.8-3.5 1.2-5.4 1.2z" fill="white" stroke="none"/>
                            <path d="M34.7 33.7l-1.5-1.3c1.8-2 2.8-4.6 2.8-7.3 0-6.1-4.9-11-11-11-1.6 0-3.1.3-4.6 1l-.8-1.8c1.7-.8 3.5-1.2 5.4-1.2 7.2 0 13 5.8 13 13 0 3.1-1.2 6.2-3.3 8.6z" fill="white" stroke="none"/><path d="M18 24h-2v-6h-6v-2h8z" fill="white" stroke="none"/>
                            <path d="M40 34h-8v-8h2v6h6z" fill="white" stroke="none"/></svg>
                                {icon}
                                Start Over
                            </Link>
                        </button>}
                </>
            }
        </div>
    )
}
