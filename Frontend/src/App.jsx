import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import {useEffect} from 'react';

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
    <div className="min-h-screen flex flex-col relative">
      {/* Grid background at the top of the page */}
      <div className="absolute inset-0 h-[50vh] pointer-events-none">
        <div className="relative h-full w-full bg-white">
          <div className="absolute bottom-0 left-0 right-0 top-0 
            bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] 
            bg-[size:14px_24px] 
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
          </div>
        </div>
      </div>
      <Navbar />
      <main className="flex-grow relative z-10">
        <Hero />
      </main>
      <button onClick={githubLogin}>Login with GitHub</button>
      <Footer />
    </div>
  );
}

export default App;