import axios from "axios";

export function checkPasswordRequirement(dynamicValue,singleFile,setPassopen,checkPassword,setErrorMsg) { //passOpen must be false
    const checkPassReq = async () => {
        try {
            const fetchurl = (singleFile ? 'checkpassrequirementone' : 'checkpassrequirement')
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/upload/${fetchurl}/${dynamicValue}`);
            const askPassword = response.data.message;
            if (askPassword == 'true') {
                setPassopen(true);
            }
            else if (askPassword == 'false') {
                checkPassword();
            }
            else {
                setErrorMsg("Incorrect Link or Password");
            }
        } catch (err) {
            setErrorMsg("Incorrect Link or Password")
            console.error("Error fetching data:", err);
        }
    }
    checkPassReq();
}