import React, { useState } from "react";
import Menu from '../../components/demo/menu/menu'
import Questions from '../../components/diagnostic/questions'
import './diagnostic.css'

function Test() {
  const [answer, setAnswer] = useState([]);
  return (
    <div className = "Inquestion">
      <Questions answer={answer} setAnswer={setAnswer}/>
      <Menu/>
    </div>
  )
}

export default Test