import { Outlet } from "react-router-dom"
import Top from "./Top"
import Footer from "./Footer"
import { useEffect, useState } from "react";
import axios from "axios";

export default function Main() {
    const expireslist = [1,2,3,4,5];    //Select # of days after which data should expires
    const [mirrorslist, setMirrorslist] = useState([]); //Select Mirror, filled by API
    // const mirrorslist = [               //Select Mirror, each associated with particular IP;
    //     ['Mirror 1','192.168.1.2'],
    //     ['Mirror 2','71.168.1.2'],
    //     ['Mirror 3','223.168.1.2'],
    //   ];

    const [currentUID, setCurrentUID] = useState('');
    const [burnAfterRead, setBurnAfterRead] = useState('0'); //Laravel API needs '0' or '1', nor true or false
    const [expiryDateIncrement, setExpiryDateIncrement] = useState(expireslist[0]); //index to 1
    const [mirror,setMirror] = useState(['','']); // index to ['Mirror 1','192.168.1.2']
    const [paste,setPaste] =useState('');

    // These states are manipulated by <Top> component and are needed in <CreatePad> component via Outlet context
    useEffect(() => {
        const fetchMirrorsData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/upload/mirrors'); // Replace with your API endpoint
                console.log(response.data);
                const mirrorsData = response.data.mirror || []; // Assuming API returns a 'mirror' field

                // Transform the data to match the desired format (assuming the API provides 'title' and 'domain')
                const transformedMirrors = mirrorsData.map((mirror) => {
                    return [mirror.title, mirror.domain];
                });

                setMirrorslist(transformedMirrors);  // Update the mirrorslist state
                setMirror(transformedMirrors[0] || []);  // Set default mirror (first item)

            } catch (error) {
                console.error('Error fetching mirrors data:', error);
                // Optionally, handle the error state
            }
        };

        fetchMirrorsData();  // Call the function to fetch the data
    }, []);
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
            paste={paste}
            />
            <Outlet context={{ 
                burnAfterRead, 
                expiryDateIncrement, 
                mirror, 
                currentUID, 
                setCurrentUID,
                setPaste 
                }} />
            <Footer />
        </>
    )
}
