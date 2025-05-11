/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import {useEffect} from 'react';
import Templates from './pages/Templates';
import Insights from './pages/Insight';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';

function App() {


  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  
  // useEffect (()=>{
  //   const queryString=window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //   const codeParams = urlParams.get("code");
  //   console.log(codeParams);
  // },[]);

  const githubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
   };
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
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />

      </div>
    </Router>
  );
}

export default App;
