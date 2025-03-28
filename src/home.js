import './home.css';
import Header from './header';
import Footer from './footer';
import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  useEffect(() => {
    
  }, []);

  return (
    <div className="page_containter">
        <Header/>
        <main className="content">
        
        </main>
        <Footer/>
    </div>
  );
}
export default Home;