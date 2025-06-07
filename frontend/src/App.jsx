import './assets/css/main.css';
import { BrowserRouter } from 'react-router-dom';
import Filter from './Filter';
import { Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Filter />} />
        <Route path="/:slug" element={<Filter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;