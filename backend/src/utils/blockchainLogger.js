/**
 * Blockchain Logger Simulation
 * 
 * This module simulates logging security incidents to an immutable blockchain ledger.
 * In a real implementation, this would connect to an actual blockchain network
 * (e.g., using Ethereum, Hyperledger, or a private blockchain).
 */

// Simulated blockchain structure
let blockchainLedger = [];

// Generate a simple hash (in a real system, this would use proper cryptographic hashing)
const generateHash = (data, previousHash) => {
  const stringData = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < stringData.length; i++) {
    const char = stringData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16) + previousHash.substring(0, 8);
};

// Log an incident to the blockchain
const logIncident = (incident) => {
  const timestamp = new Date().toISOString();
  const previousHash = blockchainLedger.length > 0 
    ? blockchainLedger[blockchainLedger.length - 1].hash 
    : '0000000000000000';
  
  // Create a new block
  const newBlock = {
    index: blockchainLedger.length,
    timestamp,
    data: {
      ...incident,
      recordedAt: timestamp
    },
    previousHash,
    hash: ''
  };
  
  // Calculate the hash for this block
  newBlock.hash = generateHash(newBlock.data, previousHash);
  
  // Add to the ledger
  blockchainLedger.push(newBlock);
  
  return {
    blockIndex: newBlock.index,
    hash: newBlock.hash,
    timestamp
  };
};

// Verify the integrity of the blockchain
const verifyLedger = () => {
  // In a real blockchain, this would verify the entire chain
  // by recalculating hashes and checking against stored values
  
  for (let i = 1; i < blockchainLedger.length; i++) {
    const currentBlock = blockchainLedger[i];
    const previousBlock = blockchainLedger[i - 1];
    
    // Check if the stored previous hash matches the actual hash of the previous block
    if (currentBlock.previousHash !== previousBlock.hash) {
      return {
        valid: false,
        message: `Chain broken at block ${i}`,
        block: currentBlock
      };
    }
    
    // Recalculate the hash to ensure data hasn't been tampered with
    const recalculatedHash = generateHash(currentBlock.data, currentBlock.previousHash);
    if (recalculatedHash !== currentBlock.hash) {
      return {
        valid: false,
        message: `Block ${i} has been tampered with`,
        block: currentBlock
      };
    }
  }
  
  return {
    valid: true,
    message: 'Blockchain ledger is valid',
    blockCount: blockchainLedger.length
  };
};

// Get the entire ledger
const getLedger = () => {
  return blockchainLedger;
};

// Get a specific block by index
const getBlock = (index) => {
  if (index >= 0 && index < blockchainLedger.length) {
    return blockchainLedger[index];
  }
  return null;
};

// Initialize with a genesis block
if (blockchainLedger.length === 0) {
  const genesisBlock = {
    index: 0,
    timestamp: new Date().toISOString(),
    data: {
      message: 'Genesis Block - CyberShield Security Ledger Initialized'
    },
    previousHash: '0000000000000000',
    hash: ''
  };
  
  genesisBlock.hash = generateHash(genesisBlock.data, genesisBlock.previousHash);
  blockchainLedger.push(genesisBlock);
}

module.exports = {
  logIncident,
  verifyLedger,
  getLedger,
  getBlock
};