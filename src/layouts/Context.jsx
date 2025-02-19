import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
// Create a context with a default value
const GlobalContext = createContext();

// Create a provider component
const GlobalProvider = ({ children }) => {
  const [mirrorslist, setMirrorslist] = useState([]); //Select Mirror, filled by API
  const [expireslist,setExpireslist] = useState([]); //Select Duration, filled by API
  const [currentUID, setCurrentUID] = useState(''); //Used to handle preview page

  const [burnAfterRead, setBurnAfterRead] = useState('0'); //Laravel API needs '0' or '1', nor true or false
  const [password, setPassword] = useState('');

  const [expiryDateIncrement, setExpiryDateIncrement] = useState(['',1]); // Selected Duration for upload
  const [mirror,setMirror] = useState(['','']); // Selected Mirror for upload

  const [paste,setPaste] =useState(''); //Used in preview page to handle sharelink

  const [pasteDel, setPasteDel] = useState(()=>()=>{console.log('del')});
  const [totalItemsinPre, setTotalItemsinPre] = useState(0)

  const [onefilemax, setOnefilemax] = useState('1048576');
  const [multifilemax, setMultifilemax] = useState('2097152');

  const [popupMsg, setPopupMsg] = useState('');

  useEffect(() => {
    const fetchMirrorsData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/miscdata`);
            console.log(response.data);
            const mirrorsData = response.data.mirror || []; // Assuming API returns a 'mirror' field
            // Transform the data to match the desired format (assuming the API provides 'title' and 'domain')
            const transformedMirrors = mirrorsData.map((mirror) => {
                return [mirror.title, mirror.domain];
            });
            setMirrorslist(transformedMirrors);  // Update the mirrorslist state
            setMirror(transformedMirrors[0] || []);  // Set default mirror (first item)

            const expiryData = response.data.expire || []; // Assuming API returns a 'expiry' field
            // Transform the data to match the desired format (assuming the API provides 'title' and 'duration')
            const transformedExpiry = expiryData.map((expiry) => {
                return [expiry.title, expiry.duration];
            });
            console.log(transformedExpiry);
            setExpireslist(transformedExpiry);  
            setExpiryDateIncrement(transformedExpiry[0] || []); 

            setOnefilemax(response.data.upload_onefilemax);
            setMultifilemax(response.data.upload_multifilemax);

        } catch (error) {
            console.error('Error fetching mirrors data:', error);
            // Optionally, handle the error state
        }
    };

    fetchMirrorsData();  // Call the function to fetch the data
}, []);
  return (
    <GlobalContext.Provider value={{  
        mirrorslist, setMirrorslist,
        expireslist,setExpireslist,
        currentUID, setCurrentUID,
        burnAfterRead, setBurnAfterRead,
        expiryDateIncrement, setExpiryDateIncrement,
        mirror,setMirror,
        paste,setPaste,
        password,setPassword,
        pasteDel, setPasteDel,
        totalItemsinPre, setTotalItemsinPre,
        onefilemax, setOnefilemax,
        multifilemax, setMultifilemax,
        popupMsg, setPopupMsg,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };