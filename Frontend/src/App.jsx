/* eslint-disable no-unused-vars */
// import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Templates from './pages/Templates';
import Insights from './pages/Insight';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AuthContext from './context/AuthContext';
import { useContext } from 'react';


function App() {

  const { protect } = useContext(AuthContext);
  console.log(protect)

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Hero/>} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
               path="/dashboard" 
              element={protect ? <Dashboard /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
