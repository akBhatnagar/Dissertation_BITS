import './App.css';
import facebook from './facebook-icon.png';
import twitter from './twitter-icon.png';
import gmail from './gmail-icon.png';

function App() {
  return (
    <div>
      <h1>
        <Menu/>
        <br/>
        <Title/>
        <Footer/>
      </h1>
    </div>
  );
}

function Title() {
  return (
    <div>
      Integrated Personal Expense Management System with Collaborative Expenditure Allocation for Social Engagements
    </div>
  );
}

function Menu() {
  return (
      <div class="topnav">
        <a class="active" href="#home">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
      </div>
  );
}

function Footer() {
  return (
    <div>
      <footer>
        <div class="footer-content">
          <div class="social-icons">
            <a href="https://www.facebook.com"><img src={facebook} alt="Facebook"></img></a>
            <a href="https://www.twitter.com"><img src={twitter} alt="Twitter"></img></a>
            <a href="akshaybhatnagar1998@gmail.com"><img src={gmail} alt="Email"></img></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
