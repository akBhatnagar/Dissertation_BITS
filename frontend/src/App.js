import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import GetAllUsers from './components/GetAllUsers';
import AddUser from './components/AddUser';
import DeleteUser from './components/DeleteUser';
import FeedbackForm from './components/FeedbackForm';
import GetExpenses from './components/GetExpenses';
import AddExpense from './components/AddExpense';
import DeleteExpense from './components/DeleteExpense';
import EditExpense from './components/EditExpense';
import GetSharedExpenses from './components/GetSharedExpenses';
import AddSharedExpense from './components/AddSharedExpense';
import DeleteSharedExpense from './components/DeleteSharedExpense';
import EditSharedExpense from './components/EditSharedExpense';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Groups from './components/Groups';
import Friends from './components/Friends';
import Signup from './components/Signup';

const constants = require('./utils/Constants');

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path={constants.loginUrl} element={<Login />} />
        <Route path={constants.signupUrl} element={<Signup />} />
        <Route path={constants.dashboardUrl} element={<Dashboard />} />
        <Route path={constants.getFriendsUrl} element={<GetAllUsers />} />
        <Route path={constants.addFriendUrl} element={<AddUser />} />
        <Route path={constants.removeFriendUrl} element={<DeleteUser />} />
        <Route path={constants.addFeedbackUrl} element={<FeedbackForm />} />
        <Route path={constants.getExpenseByIdUrl} element={<GetExpenses />} />
        <Route path={constants.addExpenseUrl} element={<AddExpense />} />
        <Route path={constants.deleteExpenseUrl} element={<DeleteExpense />} />
        <Route path={constants.editExpenseUrl} element={<EditExpense />} />
        <Route path={constants.getSharedExpenseByIdUrl} element={<GetSharedExpenses />} />
        <Route path={constants.addSharedExpenseUrl} element={<AddSharedExpense />} />
        <Route path={constants.deleteSharedExpenseUrl} element={<DeleteSharedExpense />} />
        <Route path={constants.editSharedExpenseUrl} element={<EditSharedExpense />} />
        <Route path={constants.aboutUrl} element={<About />} />
        <Route path={constants.contactUrl} element={<Contact />} />
        <Route path={constants.getGroupsUrl} element={<Groups />} />
        <Route path={constants.friendsUrl} element={<Friends />} />
        {/* Add more routes for other pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
