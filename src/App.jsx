import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import store from "./redux/store";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <>
      <AuthProvider store={store}>
        <Navbar></Navbar>
        <main className="w-full min-h-screen px-1 py-6">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </AuthProvider>
    </>
  );
}

export default App;
