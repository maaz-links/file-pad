import { Outlet } from "react-router-dom"
import Top from "./Top"
import Footer from "./Footer"

export default function Main() {

    return (
        <>
            <Top />
            <Outlet />
            <Footer />
        </>
    )
}
