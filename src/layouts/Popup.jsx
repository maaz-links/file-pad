import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./Context";

export default function Popup() {

    const { popupMsg, setPopupMsg } = useContext(GlobalContext);
    const [openPopup, setOpenPopup] = useState(false);
    //const [msg, setMsg] = useState(popupMsg);

    const handleModal = () => {
        setOpenPopup(!openPopup)
        setPopupMsg('')
    }

    useEffect(() => {
        if (popupMsg) {
            setOpenPopup(true);
        }
    }, [popupMsg])


    return (
        <>
            {openPopup && (
                <div className="bg-shape">
                    <div className="Modal">
                        <div className="header d-flex align-items-center justify-content-between">
                            <div className="d-flex gap-12">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4.43484 8.06909C6.44624 4.50997 7.45193 2.7304 8.832 2.27232C9.59117 2.02031 10.409 2.02031 11.1682 2.27232C12.5483 2.7304 13.5539 4.50997 15.5653 8.06909C17.5768 11.6282 18.5824 13.4078 18.2808 14.8578C18.1148 15.6555 17.7058 16.379 17.1126 16.9248C16.0343 17.9167 14.0229 17.9167 10.0001 17.9167C5.97729 17.9167 3.96589 17.9167 2.88755 16.9248C2.29432 16.379 1.88541 15.6555 1.71943 14.8578C1.41774 13.4078 2.42344 11.6282 4.43484 8.06909Z" stroke="#DDDFE7" strokeWidth="1.25" />
                                    <path d="M10.2017 14.1667V10.8333C10.2017 10.4405 10.2017 10.2441 10.0797 10.122C9.95766 10 9.76124 10 9.36841 10" stroke="#DDDFE7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.99341 7.5H10.0009" stroke="#DDDFE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className='mb-0'>Error</p>
                            </div>
                            <button className='bg-transparent border-0 p-0 close' onClick={handleModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="d-flex flex-column gap-2 gap-md-4 align-items-center wrap mb-md-3" >
                            <h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 pt-md-2'>An Error Occured</h3>
                            <p className='mb-0 text-center fs-6'>{popupMsg}</p>
                            {/* <div className="d-flex justify-content-center">
                                <button className='btn bg-green'>Send Email</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}