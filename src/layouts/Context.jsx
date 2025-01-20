import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
// Create a context with a default value
const GlobalContext = createContext();

// Create a provider component
const GlobalProvider = ({ children }) => {
  //const expireslist = [1,2,3,4,5];    //Select # of days after which data should expires
  const [mirrorslist, setMirrorslist] = useState([]); //Select Mirror, filled by API
  //const [expirydurationlist, setExpiryDurationlist] = useState([]); //Select Mirror, filled by API
  const [expireslist,setExpireslist] = useState([]);
  const [currentUID, setCurrentUID] = useState('');
  const [burnAfterRead, setBurnAfterRead] = useState('0'); //Laravel API needs '0' or '1', nor true or false
  const [password, setPassword] = useState('');
  const [expiryDateIncrement, setExpiryDateIncrement] = useState(['',1]);
  const [mirror,setMirror] = useState(['','']);
  const [paste,setPaste] =useState('');
  useEffect(() => {
    const fetchMirrorsData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/upload/mirrorsexpiry');
            console.log(response.data);
            const mirrorsData = response.data.mirror || []; // Assuming API returns a 'mirror' field
            // Transform the data to match the desired format (assuming the API provides 'title' and 'domain')
            const transformedMirrors = mirrorsData.map((mirror) => {
                return [mirror.title, mirror.domain];
            });
            setMirrorslist(transformedMirrors);  // Update the mirrorslist state
            setMirror(transformedMirrors[0] || []);  // Set default mirror (first item)

            const expiryData = response.data.expire || []; // Assuming API returns a 'mirror' field
            // Transform the data to match the desired format (assuming the API provides 'title' and 'domain')
            const transformedExpiry = expiryData.map((expiry) => {
                return [expiry.title, expiry.duration];
            });
            console.log(transformedExpiry);
            setExpireslist(transformedExpiry);  // Update the mirrorslist state
            setExpiryDateIncrement(transformedExpiry[0] || []);  // Set default mirror (first item)

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

    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };