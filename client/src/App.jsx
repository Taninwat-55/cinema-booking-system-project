import { Outlet } from 'react-router-dom';
import './styles/App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
