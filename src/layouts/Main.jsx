import { Outlet } from "react-router-dom"
import Top from "./Top"
import Footer from "./Footer"
import { ToastContainer } from "react-toastify"
import Popup from "./Popup"

export default function Main() {

    return (
        <>
            <Top />
            <Outlet />
            <Footer />
            <Popup />
            <ToastContainer />
        </>
    )
}
