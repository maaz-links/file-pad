import React from 'react'
import { Link } from 'react-router-dom'

export default function Error() {
  return (
    <div className='d-flex align-items-center justify-content-center w-100 vh-100'>
      <div className="my-auto text-center">
        <h1 className='display-1 fw-bold mb-4'>Ops page not found</h1>
        <Link to="/" className='btn'>Back To Home</Link>
      </div>
    </div>
  )
}
