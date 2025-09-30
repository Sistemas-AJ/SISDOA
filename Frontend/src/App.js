import './App.css';
import Slidebar from './components/Slidebar/Slidebar';

function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      <Slidebar />
      <div style={{ flex: 1 }}>
        <header className="App-header">
          <h1>Adrian Estubo aca</h1>
        </header>
      </div>
    </div>
  );
}

export default App;
