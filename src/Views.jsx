import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Friends from './components/Friends';
import NotFound from './components/NotFound';

const Views = () => {
    return (
        <Routes>
            <Route index element={<Login />} />
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/about' element={<About />} />
            <Route exact path='/contact' element={<Contact />} />
            <Route exact path='/friends' element={<Friends />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}

export default Views;