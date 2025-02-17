import { Route, Routes} from "react-router-dom"
import Home from "./pages/home/home"
import Diagnostic from "./pages/diagnostic/diagnostic"
import Schedule from "./pages/schedule/schedule"
import Lesson from "./pages/lesson/lesson"
import Start from "./pages/diagnostic/start"
import Test from "./pages/diagnostic/test"
import Score from "./pages/diagnostic/score"

import './App.css'
import { useEffect } from "react"

function App() {

  return (
    <div className="App">
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/diagnostic" element={<Diagnostic/>}/>
          <Route path="/schedule" element={<Schedule/>}/>
          <Route path="/lesson" element={<Lesson/>}/>
          <Route path="/start" element={<Start/>}/>
          <Route path="/test" element={<Test/>}/>
          <Route path="/score" element={<Score/>}></Route>
        </Routes>
    </div>

  );
}

export default App;