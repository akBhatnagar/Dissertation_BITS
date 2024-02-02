import Views from './Views';
import FooterMenu from './components/FooterMenu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import bgImage from './assets/bg-image.jpg'

function App() {
  return (
      <div className='App'>
        <BrowserRouter>
          <Views />
        </BrowserRouter>
      </div>
  );
}

export default App;
