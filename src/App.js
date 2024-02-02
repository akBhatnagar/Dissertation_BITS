import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HeaderMenu from './components/HeaderMenu';
import FooterMenu from './components/FooterMenu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import bgImage from './assets/bg-image.jpg'

function App() {
  return (
      <div className='App'>
        <img className='absolute w-full h-full object-cover mix-blend-overlay bg-center' src={bgImage} alt="/" />
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login />} />
            <Route exact path='/dashboard' element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
        <FooterMenu />
      </div>
  );
}

export default App;
