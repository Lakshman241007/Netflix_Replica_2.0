import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
