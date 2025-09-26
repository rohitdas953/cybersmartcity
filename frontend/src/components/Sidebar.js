import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMap, FaExclamationTriangle, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FaHome /> },
    { path: '/map', name: 'City Map', icon: <FaMap /> },
    { path: '/incidents', name: 'Incidents', icon: <FaExclamationTriangle /> },
    { path: '/analytics', name: 'Analytics', icon: <FaChartBar /> },
  ];

  return (
    <motion.div 
      className="w-64 bg-dark-light h-full shadow-lg"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-center mb-8 mt-4">
          <motion.div 
            className="text-primary text-2xl font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaCog className="mr-2 animate-spin-slow text-primary" />
            <span>CyberShield</span>
          </motion.div>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-dark hover:text-white'}`
                  }
                >
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="mr-3"
                  >
                    {item.icon}
                  </motion.div>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4">
        <div className="bg-dark p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">System Status</span>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-success mr-1"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Threat Level</span>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-warning mr-1"></div>
              <span className="text-xs text-gray-500">Moderate</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;