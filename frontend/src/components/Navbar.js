import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaShieldAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <motion.nav 
      className="bg-dark-light px-4 py-3 flex items-center justify-between shadow-md"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <motion.div 
          className="text-primary text-2xl font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <FaShieldAlt className="mr-2 text-primary" />
          <span>CyberShield</span>
        </motion.div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <FaBell className="text-gray-300 text-xl" />
            <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <FaUserCircle className="text-gray-300 text-2xl" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-300">Admin</p>
            <p className="text-xs text-gray-500">Security Analyst</p>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;