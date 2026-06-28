import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X, Sparkles } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bgColor font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-textColor/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Drawer container */}
          <div className="relative flex w-64 flex-col bg-white animate-slideRight">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-textColor/75 hover:text-accent rounded-lg border border-borderColor bg-bgColor"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-borderColor bg-white px-4 md:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-textColor/75 hover:text-accent outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-accent">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
            <span className="font-serif text-sm font-semibold tracking-wide text-textColor">
              Elena <span className="text-accent font-sans font-light">Beauty</span>
            </span>
          </div>

          <div className="w-8"></div> {/* Spacer for alignment */}
        </header>

        {/* Dynamic Page Outlet container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
