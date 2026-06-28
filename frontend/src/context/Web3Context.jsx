// frontend/src/context/Web3Context.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Connect wallet
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isMetaMaskInstalled()) {
        const errorMsg = 'Please install MetaMask!';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Check if on Sepolia
      const TARGET_CHAIN_ID = 11155111; // Sepolia
      if (chainId !== TARGET_CHAIN_ID) {
        const errorMsg = `Please switch to Sepolia network. Current network: ${chainId}`;
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setChainId(chainId);
      setIsConnected(true);
      setError(null);

      return { success: true, address, chainId };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
    setError(null);
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask not installed');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }] // Sepolia chain ID in hex
      });
      return { success: true };
    } catch (error) {
      console.error('Error switching network:', error);
      return { success: false, message: error.message };
    }
  };

  // Auto-connect on mount (if already connected)
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!isMetaMaskInstalled()) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          const chainId = Number(network.chainId);

          setProvider(provider);
          setSigner(signer);
          setAddress(address);
          setChainId(chainId);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Auto-connect error:', error);
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        // Refresh signer
        if (provider) {
          const newSigner = provider.getSigner();
          setSigner(newSigner);
        }
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [provider]);

  const value = {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    isMetaMaskInstalled,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};