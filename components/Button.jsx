import React from 'react'

function Button({text, buttonClass, clickHandler}) {
  return (
    <button onClick={clickHandler} className={buttonClass}>{text}</button>
  )
}

export default Button;