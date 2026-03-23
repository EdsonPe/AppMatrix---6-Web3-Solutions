import React, { useState, useCallback } from 'react';
import { AppType } from './types';
import { APP_MODULES, MENU_ITEMS } from './constants';

// Header component defined at the top level
const Header = ({ onMenuToggle }: { onMenuToggle: () => void }) => (
    <header className="fixed top-0 left-0 right-0 bg-brand-dark/80 backdrop-blur-sm border-b border-gray-800 h-16 flex items-center px-4 z-30 md:relative md:bg-transparent md:backdrop-blur-none md:border-b-0">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
                <button onClick={onMenuToggle} className="md:hidden p-2 text-gray-400 hover:text-brand-accent transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <h1 className="text-xl font-bold text-white tracking-wider">
                    App<span className="text-brand-accent">Matrix</span>
                </h1>
            </div>
            <span className="font-mono text-sm text-gray-500">v1.0 – Offline Web3 Tools</span>
        </div>
    </header>
);

// Sidebar component defined at the top level
const Sidebar = ({ activeApp, onAppChange, isOpen, onClose }: { activeApp: AppType; onAppChange: (app: AppType) => void; isOpen: boolean; onClose: () => void; }) => {
    const handleAppClick = (app: AppType) => {
        onAppChange(app);
        onClose(); // Close sidebar on mobile after selection
    };

    return (
        <aside className={`fixed top-0 left-0 h-full w-64 bg-black/50 backdrop-blur-lg border-r border-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 md:w-60 md:flex-shrink-0`}>
            <nav className="p-4 pt-20 md:pt-6">
                <ul>
                    {MENU_ITEMS.map(({ id, label, icon }) => (
                        <li key={id} className="mb-2">
                            <button
                                onClick={() => handleAppClick(id)}
                                className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 text-left ${activeApp === id ? 'bg-brand-accent/10 text-brand-accent shadow-[0_0_15px_rgba(190,0,197,0.3)]' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
                            >
                                {icon}
                                <span className="ml-3 font-medium">{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};


export default function App() {
    const [activeApp, setActiveApp] = useState<AppType>(AppType.CodeAttestor);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleAppChange = useCallback((app: AppType) => {
        setActiveApp(app);
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);
    
    const ActiveAppComponent = APP_MODULES[activeApp];

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row">
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/60 z-30 md:hidden"></div>}
            <Sidebar activeApp={activeApp} onAppChange={handleAppChange} isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuToggle={toggleSidebar} />
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto mt-16 md:mt-0">
                    <div className="animate-fade-in">
                      <ActiveAppComponent />
                    </div>
                </main>
            </div>
        </div>
    );
}