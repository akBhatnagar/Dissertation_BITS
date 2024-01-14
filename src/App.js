import './App.css';

function App() {
  return (
    <div>
      <h1>
        <Menu/>
        <br/>
        <Title/>
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

export default App;
