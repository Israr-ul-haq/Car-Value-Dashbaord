import React from 'react'
import Header from '../components/Common/Header/Header';
import Footer from '../components/Common/Footer/Footer';
import Sidebar from '../components/Common/Sidebar/Sidebar';

const WebLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      {children}
      <Footer />
    </>
  )
}


export default WebLayout;