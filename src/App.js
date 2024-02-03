import Views from './Views';
import { BrowserRouter } from 'react-router-dom';

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
