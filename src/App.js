import './App.css';
import Nav from './components/nav/Nav';
import {BrowserRouter as Router ,Routes,Route } from 'react-router-dom'
import Welcome from './components/welcome/Welcome';
import Home from './components/home/Home';
import Chat from './components/chat/Chat';
function App() {
  return (
    <div className="App">
    <Router>
    
    <Nav />
    <Routes>
      <Route path='/' element={ <Welcome />} />
      <Route path='/Home' element={ <Home />} />
      <Route path='/Chat/:id' element={ <Chat />} />
    </Routes>
    </Router>
    </div>
  );
}

export default App;
