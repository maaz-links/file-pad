import React from 'react'
import PropTypes from 'prop-types'
Row.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default function Row({children, className=""}) {
  return (
    <div className={`flex flex-wrap -mx-3 ${className}`}>
        {children}
    </div>
  )
}
