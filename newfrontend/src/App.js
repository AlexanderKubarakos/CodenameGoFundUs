import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WalletConnect from './components/WalletConnect';
import { useAccount } from '@starknet-react/core';
import Home from './components/Home';
import NewFund from './components/NewFund';
import MyFund from './components/MyFund';
import JoinFund from './components/JoinFund';

function App() {
  const { address } = useAccount();

  return (
    <Router>
      <div className="flex w-[100dvw] h-[100dvh] ">
        <Routes>
          {/* Home route */}
          <Route path="/" element={!address ? <WalletConnect /> : <NewFund />} />
          
          {/* NewFund route */}
          <Route path="/MyFund/:id" element={address ? <MyFund /> : <WalletConnect />} />

            {/* NewFund route */}
            <Route path="/JoinFund/:id" element={address ? <JoinFund /> : <WalletConnect />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;