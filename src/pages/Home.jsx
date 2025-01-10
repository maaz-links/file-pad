
import { Col, Container, Row } from 'react-bootstrap'
import Expiry from '../components/Expiry'

export default function Home() {

  const table = [
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
    {
      name: 'anononymos.pdf',
      date: '02 Dec 2024',
      size: '1 MB',

    },
  ]
  return (
    <div className='create py-3 py-md-4'>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="create-top d-flex justify-content-between align-items-center mb-4 mb-lg-5">
              <h3 className='mb-0'>expiry will be</h3>
              <Expiry />
            </div>
            <div className="overflow-auto">
              <table className='w-100' >
                <thead>
                  <tr>
                    {["Symbol", "File name", "Upload Date", "Size"].map((item, index) => (
                      <th key={index}><p>{item}</p></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.map((item, index) => (
                    <tr key={index}>
                      <td ><p>{(index + 1).toString().padStart(2, '0')}</p></td>
                      <td ><p>{item.name}</p></td>
                      <td ><p>{item.date}</p></td>
                      <td >
                        <div className="d-flex justify-content-between align-items-center">
                          <p>{item.size}</p>
                          <button className='ms-4'>Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>

  )
}
