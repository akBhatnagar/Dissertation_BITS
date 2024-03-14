import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Friends from './components/Friends';
import NotFound from './components/NotFound';
import SignUp from './components/SignUp';
import Groups from './components/Groups';

const Views = () => {
    return (
        <Routes>
            <Route index element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/friends' element={<Friends />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}

export default Views;