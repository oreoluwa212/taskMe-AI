import React from 'react'

function SubmitBtn(props) {
  return (
    <button onClick={props.click} style={props.style} type={props.type} className='submit-btn w-full py-2 mt-4 text-white'>{props.btntext}</button>
  )
}

export default SubmitBtn;