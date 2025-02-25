import { useState, useContext } from "react"
import QRCode from "react-qr-code";
import { GlobalContext } from "../layouts/Context";
import Paste from "./Paste";


export default function QRcode() {

    const { paste } = useContext(GlobalContext);
    const [openQR, setOpenQR] = useState(false);

    return (<>
        <button onClick={() => setOpenQR(!openQR)} className='btn d-inline-flex gap-2 align-items-center px-20'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4C2 3.05719 2 2.58579 2.29289 2.29289C2.58579 2 3.05719 2 4 2C4.94281 2 5.41421 2 5.70711 2.29289C6 2.58579 6 3.05719 6 4C6 4.94281 6 5.41421 5.70711 5.70711C5.41421 6 4.94281 6 4 6C3.05719 6 2.58579 6 2.29289 5.70711C2 5.41421 2 4.94281 2 4Z" stroke="currentColor" />
                <path d="M2 12C2 11.0572 2 10.5858 2.29289 10.2929C2.58579 10 3.05719 10 4 10C4.94281 10 5.41421 10 5.70711 10.2929C6 10.5858 6 11.0572 6 12C6 12.9428 6 13.4142 5.70711 13.7071C5.41421 14 4.94281 14 4 14C3.05719 14 2.58579 14 2.29289 13.7071C2 13.4142 2 12.9428 2 12Z" stroke="currentColor" />
                <path d="M2 8H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2V5.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 4C10 3.05719 10 2.58579 10.2929 2.29289C10.5858 2 11.0572 2 12 2C12.9428 2 13.4142 2 13.7071 2.29289C14 2.58579 14 3.05719 14 4C14 4.94281 14 5.41421 13.7071 5.70711C13.4142 6 12.9428 6 12 6C11.0572 6 10.5858 6 10.2929 5.70711C10 5.41421 10 4.94281 10 4Z" stroke="currentColor" />
                <path d="M14 8H10C9.0572 8 8.5858 8 8.29287 8.29287C8 8.5858 8 9.0572 8 10M8 11.8461V13.6923M10 10V11C10 11.9643 10.5225 12 11.3333 12C11.7015 12 12 12.2985 12 12.6667M10.6667 14H10M12 10C12.9428 10 13.4142 10 13.7071 10.2933C14 10.5866 14 11.0587 14 12.0029C14 12.9471 14 13.4191 13.7071 13.7125C13.4933 13.9265 13.1845 13.9844 12.6667 14" stroke="currentColor" strokeLinecap="round" />
            </svg> QR Code
        </button>
        {openQR && (
            <div className="bg-shape">
                <div className="Modal">
                    <div className="header d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-12">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4C2 3.05719 2 2.58579 2.29289 2.29289C2.58579 2 3.05719 2 4 2C4.94281 2 5.41421 2 5.70711 2.29289C6 2.58579 6 3.05719 6 4C6 4.94281 6 5.41421 5.70711 5.70711C5.41421 6 4.94281 6 4 6C3.05719 6 2.58579 6 2.29289 5.70711C2 5.41421 2 4.94281 2 4Z" stroke="currentColor" />
                                <path d="M2 12C2 11.0572 2 10.5858 2.29289 10.2929C2.58579 10 3.05719 10 4 10C4.94281 10 5.41421 10 5.70711 10.2929C6 10.5858 6 11.0572 6 12C6 12.9428 6 13.4142 5.70711 13.7071C5.41421 14 4.94281 14 4 14C3.05719 14 2.58579 14 2.29289 13.7071C2 13.4142 2 12.9428 2 12Z" stroke="currentColor" />
                                <path d="M2 8H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 2V5.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 4C10 3.05719 10 2.58579 10.2929 2.29289C10.5858 2 11.0572 2 12 2C12.9428 2 13.4142 2 13.7071 2.29289C14 2.58579 14 3.05719 14 4C14 4.94281 14 5.41421 13.7071 5.70711C13.4142 6 12.9428 6 12 6C11.0572 6 10.5858 6 10.2929 5.70711C10 5.41421 10 4.94281 10 4Z" stroke="currentColor" />
                                <path d="M14 8H10C9.0572 8 8.5858 8 8.29287 8.29287C8 8.5858 8 9.0572 8 10M8 11.8461V13.6923M10 10V11C10 11.9643 10.5225 12 11.3333 12C11.7015 12 12 12.2985 12 12.6667M10.6667 14H10M12 10C12.9428 10 13.4142 10 13.7071 10.2933C14 10.5866 14 11.0587 14 12.0029C14 12.9471 14 13.4191 13.7071 13.7125C13.4933 13.9265 13.1845 13.9844 12.6667 14" stroke="currentColor" strokeLinecap="round" />
                            </svg>
                            <p className='mb-0 '>QR Code</p>
                        </div>
                        <button className='bg-transparent border-0 p-0 close' onClick={() => setOpenQR(!openQR)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className=" d-flex align-items-center justify-content-center" >
                        <Paste enableActions={false}/>
                    </div>
                    <div className="d-flex align-items-center justify-content-center" style={{padding: '16px' }} >
                        <div style={{ background: 'white', padding: '8px' }}>
                        <QRCode value={paste} size={256} />
                        </div>
                        
                    </div>
                </div>
            </div>
        )}
    </>)
}