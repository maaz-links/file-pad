import { Outlet } from "react-router-dom"
import Top from "./Top"
import Footer from "./Footer"
import { ToastContainer } from "react-toastify"

export default function Main() {

    return (
        <>
            <Top />
            <Outlet />
            <Footer />
            <ToastContainer />
        </>
    )
}
