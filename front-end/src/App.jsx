import Receiver from "./components/Receiver";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Hero from "./components/Hero";
import Sender from "./components/Sender";
function App() {

  return (
    
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Hero/>} />
    <Route path="/sender" element={<Sender/>} />
    <Route path="/receiver" element={<Receiver/>} />

    </Routes>
    </BrowserRouter>
    
  )
}

export default App
