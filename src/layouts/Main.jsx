import { Outlet } from "react-router-dom"
import Top from "./Top"
import Footer from "./Footer"
import { useState } from "react";

export default function Main() {
    const expireslist = [1,2,3,4,5];    //Select # of days after which data should expires
    const mirrorslist = [               //Select Mirror, each associated with particular IP;
        ['Mirror 1','192.168.1.2'],
        ['Mirror 2','71.168.1.2'],
        ['Mirror 3','223.168.1.2'],
      ];
      
    const [burnAfterRead, setBurnAfterRead] = useState('0'); //Laravel API needs '0' or '1', nor true or false
    const [expiryDateIncrement, setExpiryDateIncrement] = useState(expireslist[0]); //index to 1
    const [mirror,setMirror] = useState(mirrorslist[0]); // index to ['Mirror 1','192.168.1.2']

    // These states are manipulated by <Top> component and are needed in <CreatePad> component via Outlet context

    return (
        <>
            <Top
            burnAfterRead={burnAfterRead}
            setBurnAfterRead={setBurnAfterRead}
            expiryDateIncrement={expiryDateIncrement}
            setExpiryDateIncrement={setExpiryDateIncrement}
            expireslist={expireslist}
            mirror={mirror}
            setMirror={setMirror}
            mirrorslist={mirrorslist}
            />
            <Outlet context={{ burnAfterRead, expiryDateIncrement, mirror }} />
            <Footer />
        </>
    )
}
