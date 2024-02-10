import Views from './Views';
import { BrowserRouter } from 'react-router-dom';

function App() {

  var pageTitle = "Expense Management App";
  var pageChangedTitle = "Don't go away.! 😠";

  window.onload = function () {
    document.title = pageTitle;
    document.addEventListener('visibilitychange', function (e) {
      document.title = document.hidden ? pageChangedTitle : pageTitle;
    });
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Views />
      </BrowserRouter>
    </div>
  );
}

export default App;
