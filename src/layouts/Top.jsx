import { Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { GlobalContext } from "./Context"
import DropDownExpiry from '../components/DropDownExpiry'
import DropDownMirror from '../components/DropDownMirror'
import Paste from '../components/Paste'
import logo from '../assets/img/logo.png'
import { useContext } from 'react';

export default function Top() {
  const {
    mirrorslist, setMirrorslist,
    expireslist, setExpireslist,
    currentUID, setCurrentUID,
    burnAfterRead, setBurnAfterRead,
    expiryDateIncrement, setExpiryDateIncrement,
    mirror, setMirror,
    paste, setPaste,
    password, setPassword,
  } = useContext(GlobalContext);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    console.log('passw',password.length);
  }

  const location = useLocation();
  console.log(location);

  return (
    <div className='header py-3 py-md-3 py-lg-4 position-relative z-3'>
      <Container fluid  >
        <Row>
          <Col xs={12}>
            <div className="d-flex align-items-center gap-12">
              <Link to="/" className='me-2 me-md-3 me-xl-4 logo'><img src={logo} alt="" /></Link>
              <Link to="/" className='btn bg-white'>New</Link>
              {((location.pathname === '/preview')||
                (location.pathname.startsWith('/file'))||
                (location.pathname.startsWith('/text'))) ?
                <div className="w-100 d-none d-md-flex align-items-center gap-12">
                  {/* <Link to="/" className='btn d-inline-flex gap-2 align-items-center px-20'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 10C6 8.1144 6 7.1716 6.58579 6.58579C7.1716 6 8.1144 6 10 6H10.6667C12.5523 6 13.4951 6 14.0809 6.58579C14.6667 7.1716 14.6667 8.1144 14.6667 10V10.6667C14.6667 12.5523 14.6667 13.4951 14.0809 14.0809C13.4951 14.6667 12.5523 14.6667 10.6667 14.6667H10C8.1144 14.6667 7.1716 14.6667 6.58579 14.0809C6 13.4951 6 12.5523 6 10.6667V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11.3329 6.00065C11.3313 4.02926 11.3015 3.00812 10.7277 2.30894C10.6169 2.17391 10.4931 2.0501 10.3581 1.93929C9.62047 1.33398 8.52467 1.33398 6.33301 1.33398C4.14135 1.33398 3.04553 1.33398 2.30796 1.93929C2.17293 2.0501 2.04913 2.17391 1.93831 2.30894C1.33301 3.0465 1.33301 4.14233 1.33301 6.33398C1.33301 8.52565 1.33301 9.62145 1.93831 10.3591C2.04912 10.4941 2.17293 10.6179 2.30796 10.7287C3.00715 11.3025 4.02828 11.3323 5.99967 11.3339" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg> Clone
                  </Link> */}
                  <Link to="/" className='btn d-inline-flex gap-2 align-items-center px-20'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.33301 4L5.94169 6.61131C7.64074 7.574 8.35861 7.574 10.0577 6.61131L14.6663 4" stroke="currentColor" strokeLinejoin="round" />
                      <path d="M1.34352 8.98439C1.3871 11.0281 1.40889 12.0499 2.16298 12.8069C2.91706 13.5639 3.96656 13.5902 6.06556 13.6429C7.35921 13.6755 8.64014 13.6755 9.93381 13.6429C12.0328 13.5902 13.0823 13.5639 13.8364 12.8069C14.5905 12.0499 14.6123 11.0281 14.6558 8.98439C14.6699 8.32725 14.6699 7.67405 14.6558 7.01692C14.6123 4.97322 14.5905 3.95138 13.8364 3.19443C13.0823 2.43747 12.0328 2.41111 9.93381 2.35837C8.64014 2.32586 7.35921 2.32586 6.06555 2.35836C3.96656 2.41109 2.91706 2.43746 2.16297 3.19442C1.40889 3.95137 1.3871 4.97322 1.34351 7.01692C1.3295 7.67405 1.32951 8.32725 1.34352 8.98439Z" stroke="currentColor" strokeLinejoin="round" />
                    </svg> Email
                  </Link>
                  <Link to="/" className='btn d-inline-flex gap-2 align-items-center px-20'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4C2 3.05719 2 2.58579 2.29289 2.29289C2.58579 2 3.05719 2 4 2C4.94281 2 5.41421 2 5.70711 2.29289C6 2.58579 6 3.05719 6 4C6 4.94281 6 5.41421 5.70711 5.70711C5.41421 6 4.94281 6 4 6C3.05719 6 2.58579 6 2.29289 5.70711C2 5.41421 2 4.94281 2 4Z" stroke="currentColor" />
                      <path d="M2 12C2 11.0572 2 10.5858 2.29289 10.2929C2.58579 10 3.05719 10 4 10C4.94281 10 5.41421 10 5.70711 10.2929C6 10.5858 6 11.0572 6 12C6 12.9428 6 13.4142 5.70711 13.7071C5.41421 14 4.94281 14 4 14C3.05719 14 2.58579 14 2.29289 13.7071C2 13.4142 2 12.9428 2 12Z" stroke="currentColor" />
                      <path d="M2 8H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 2V5.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 4C10 3.05719 10 2.58579 10.2929 2.29289C10.5858 2 11.0572 2 12 2C12.9428 2 13.4142 2 13.7071 2.29289C14 2.58579 14 3.05719 14 4C14 4.94281 14 5.41421 13.7071 5.70711C13.4142 6 12.9428 6 12 6C11.0572 6 10.5858 6 10.2929 5.70711C10 5.41421 10 4.94281 10 4Z" stroke="currentColor" />
                      <path d="M14 8H10C9.0572 8 8.5858 8 8.29287 8.29287C8 8.5858 8 9.0572 8 10M8 11.8461V13.6923M10 10V11C10 11.9643 10.5225 12 11.3333 12C11.7015 12 12 12.2985 12 12.6667M10.6667 14H10M12 10C12.9428 10 13.4142 10 13.7071 10.2933C14 10.5866 14 11.0587 14 12.0029C14 12.9471 14 13.4191 13.7071 13.7125C13.4933 13.9265 13.1845 13.9844 12.6667 14" stroke="currentColor" strokeLinecap="round" />
                    </svg> QR Code
                  </Link>
                  {/* {location.pathname === "/preview" && paste !== '' &&
                    <Paste className='mx-auto d-none d-xl-flex' />
                  } */}
                  {paste !== '' &&
                    <Paste className='mx-auto d-none d-xl-flex' />
                  }
                </div>
                :
                <div className="d-flex align-items-center gap-12">

                  {/* This component is used to select expiry date increment */}
                  <DropDownExpiry className="d-none d-md-block" />

                  <label htmlFor="burn" className='form-checkbox d-none d-lg-flex align-items-center flex-wrap gap-2'>
                    <input type="checkbox" my-data={burnAfterRead} id="burn" className='d-none'
                      checked={burnAfterRead === '1'} onChange={() => setBurnAfterRead(burnAfterRead === '1' ? '0' : '1')} />
                    <span className='icon'></span>
                    <span className="text pl-1">Burn after reading</span>
                  </label>
                  <div className="form-box d-none d-md-block">
                    <input onChange={handlePasswordChange} type="password" placeholder='Password (Recommended)' className="form-control" />
                  </div>
                  {paste !== '' &&
                    <Paste className='ms-5 d-none d-xl-flex' /> //margin-left customized
                  }
                </div>
              }

              {/* {location.pathname === "/all-pad" &&
                <Paste className='mx-auto d-none d-xl-flex' />
              } */}

              {/* This component is used to select mirror */}
              <DropDownMirror className="ms-auto mirrors" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
