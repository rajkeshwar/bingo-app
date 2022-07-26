

import './App.css';
import BingoGrid from './BingoGrid';

function App() {
  return (
    <div className="bg-gradient-to-r from-green-100 to-blue-300 min-h-screen flex items-center">
      <div className="w-full px-4">
        <BingoGrid size={5}/>
      </div>
    </div>
  );
}

export default App;
