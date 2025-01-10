import { Col, Container, Row } from 'react-bootstrap'
import logo from '../assets/img/logo.png'
import { Link } from 'react-router-dom'

export default function Footer() {
  const links = [
    {
      name: 'Terms',
      url: '/terms'
    },
    {
      name: 'Privacy',
      url: '/privacy'
    },
    {
      name: 'Contact',
      url: '/contact'
    },
  ]
  return (
    <div className='footer py-3 py-lg-4'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center justify-content-mds-between">
              <div className='d-flex align-items-center gap-2'>
                <p className='text-uppercase'>Powered by</p>
                <img src={logo} alt="" />
              </div>
              <div className="d-flex align-items-center flex-wrap gap-2 mx-auto">
                {links.map((item,index) =>(
                  <Link to={item.url} key={index} className='text-capitalize'>{item.name}</Link>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
