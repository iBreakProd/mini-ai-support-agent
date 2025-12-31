import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home/home";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<></>} />
          <Route path="/orders" element={<></>} />
          <Route path="/support" element={<></>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
