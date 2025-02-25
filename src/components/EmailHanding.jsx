import { useState, useContext } from "react"
import { GlobalContext } from "../layouts/Context";
import axios from "axios";
import { toast } from "react-toastify";
import Paste from "./Paste";

export default function EmailHandling() {

    const { paste } = useContext(GlobalContext);
    const [openMailDialog, setOpenMailDialog] = useState(false);
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        console.log('email', email);
    }

    const handleModal = () => {
        setOpenMailDialog(!openMailDialog)
        setEmail('')
    }

    const callEmailAPI = () => {
        const sendmsg = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/send-email`, {
                    recipient: email,
                    pastelink: paste,
                    subject: subject,
                });
                console.log(response);
                try {
                    if (response.status == 200) {
                        toast.success(`Email successfully sent`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }else{
                        toast.error(`Error sending Email`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                } catch (err) {
                    console.error('wat happun', err);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        sendmsg();
        handleModal();
    }


    return (<>
        <button onClick={handleModal} className='btn d-inline-flex gap-2 align-items-center px-20'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.33301 4L5.94169 6.61131C7.64074 7.574 8.35861 7.574 10.0577 6.61131L14.6663 4" stroke="currentColor" strokeLinejoin="round" />
                <path d="M1.34352 8.98439C1.3871 11.0281 1.40889 12.0499 2.16298 12.8069C2.91706 13.5639 3.96656 13.5902 6.06556 13.6429C7.35921 13.6755 8.64014 13.6755 9.93381 13.6429C12.0328 13.5902 13.0823 13.5639 13.8364 12.8069C14.5905 12.0499 14.6123 11.0281 14.6558 8.98439C14.6699 8.32725 14.6699 7.67405 14.6558 7.01692C14.6123 4.97322 14.5905 3.95138 13.8364 3.19443C13.0823 2.43747 12.0328 2.41111 9.93381 2.35837C8.64014 2.32586 7.35921 2.32586 6.06555 2.35836C3.96656 2.41109 2.91706 2.43746 2.16297 3.19442C1.40889 3.95137 1.3871 4.97322 1.34351 7.01692C1.3295 7.67405 1.32951 8.32725 1.34352 8.98439Z" stroke="currentColor" strokeLinejoin="round" />
            </svg> Email
        </button>
        {openMailDialog && (
            <div className="bg-shape">
                <div className="Modal">
                    <div className="header d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-12">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.33301 4L5.94169 6.61131C7.64074 7.574 8.35861 7.574 10.0577 6.61131L14.6663 4" stroke="currentColor" strokeLinejoin="round" />
                                <path d="M1.34352 8.98439C1.3871 11.0281 1.40889 12.0499 2.16298 12.8069C2.91706 13.5639 3.96656 13.5902 6.06556 13.6429C7.35921 13.6755 8.64014 13.6755 9.93381 13.6429C12.0328 13.5902 13.0823 13.5639 13.8364 12.8069C14.5905 12.0499 14.6123 11.0281 14.6558 8.98439C14.6699 8.32725 14.6699 7.67405 14.6558 7.01692C14.6123 4.97322 14.5905 3.95138 13.8364 3.19443C13.0823 2.43747 12.0328 2.41111 9.93381 2.35837C8.64014 2.32586 7.35921 2.32586 6.06555 2.35836C3.96656 2.41109 2.91706 2.43746 2.16297 3.19442C1.40889 3.95137 1.3871 4.97322 1.34351 7.01692C1.3295 7.67405 1.32951 8.32725 1.34352 8.98439Z" stroke="currentColor" strokeLinejoin="round" />
                            </svg>
                            <p className='mb-0'>Send Email</p>
                        </div>
                        <button className='bg-transparent border-0 p-0 close' onClick={handleModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15.8342 4.16669L4.16748 15.8334M4.16748 4.16669L15.8342 15.8334" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="d-flex flex-column gap-2 gap-md-4 align-items-center wrap mb-md-3" >
                        <h3 className='text-uppercase mb-md-2 pb-md-1 mt-2 pt-md-2'>Email Pastelink</h3>
                        <Paste enableActions={false}/>
                        <p className='mb-0 text-center fs-6'>Enter Recipient Email Address. <br/>
                        You can enter multiple Recipient's Email Addresses seperated by comma.</p>
                        <div className="form-box">
                            <input type="email" onChange={handleEmailChange} placeholder='e.g. john@doe.com, file@pad.com ' className="form-control" />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button onClick={callEmailAPI} className='btn bg-green'>Send Email</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>)
}