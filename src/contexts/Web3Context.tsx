import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { EthereumNFTABI, EthereumNFTAddress } from '../contracts/EthereumNFT';
import { PolygonNFTABI, PolygonNFTAddress } from '../contracts/PolygonNFT';
import { MerkleVerifierABI, MerkleVerifierAddress } from '../contracts/MerkleVerifier';

interface Web3ContextType {
  ethereumProvider: ethers.BrowserProvider | null;
  polygonProvider: ethers.BrowserProvider | null;
  ethereumAccount: string | null;
  polygonAccount: string | null;
  ethereumChainId: number | null;
  polygonChainId: number | null;
  connectEthereum: () => Promise<void>;
  connectPolygon: () => Promise<void>;
  disconnectEthereum: () => void;
  disconnectPolygon: () => void;
  ethereumNFTContract: ethers.Contract | null;
  polygonNFTContract: ethers.Contract | null;
  merkleVerifierContract: ethers.Contract | null;
  isEthereumConnecting: boolean;
  isPolygonConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType | null>(null);

const ETHEREUM_CHAIN_ID = 11155111; // Sepolia testnet
const POLYGON_CHAIN_ID = 80002; // Amoy testnet

const SEPOLIA_RPC_URL = "https://rpc.sepolia.org";
const AMOY_RPC_URL = "https://rpc-amoy.polygon.technology";

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ethereumProvider, setEthereumProvider] = useState<ethers.BrowserProvider | null>(null);
  const [polygonProvider, setPolygonProvider] = useState<ethers.BrowserProvider | null>(null);
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null);
  const [polygonAccount, setPolygonAccount] = useState<string | null>(null);
  const [ethereumChainId, setEthereumChainId] = useState<number | null>(null);
  const [polygonChainId, setPolygonChainId] = useState<number | null>(null);
  const [ethereumNFTContract, setEthereumNFTContract] = useState<ethers.Contract | null>(null);
  const [polygonNFTContract, setPolygonNFTContract] = useState<ethers.Contract | null>(null);
  const [merkleVerifierContract, setMerkleVerifierContract] = useState<ethers.Contract | null>(null);
  const [isEthereumConnecting, setIsEthereumConnecting] = useState(false);
  const [isPolygonConnecting, setIsPolygonConnecting] = useState(false);

  const setupEthereumProvider = async () => {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed');
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider;
    } catch (error) {
      console.error('Error setting up Ethereum provider:', error);
      toast.error('Failed to connect to Ethereum');
      return null;
    }
  };

  const setupPolygonProvider = async () => {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed');
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider;
    } catch (error) {
      console.error('Error setting up Polygon provider:', error);
      toast.error('Failed to connect to Polygon');
      return null;
    }
  };

  const connectEthereum = async () => {
    setIsEthereumConnecting(true);
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed');
        setIsEthereumConnecting(false);
        return;
      }
      
      const provider = await setupEthereumProvider();
      if (!provider) return;
      
      let accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      if (chainId !== ETHEREUM_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${ETHEREUM_CHAIN_ID.toString(16)}` }],
          });
          
          const updatedProvider = new ethers.BrowserProvider(window.ethereum);
          setEthereumProvider(updatedProvider);
          const updatedNetwork = await updatedProvider.getNetwork();
          setEthereumChainId(Number(updatedNetwork.chainId));
          
          if (accounts.length === 0) {
            const newAccounts = await updatedProvider.send("eth_requestAccounts", []);
            accounts = newAccounts;
          }
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${ETHEREUM_CHAIN_ID.toString(16)}`,
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: {
                      name: 'Sepolia ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: [SEPOLIA_RPC_URL],
                    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                  },
                ],
              });
              
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${ETHEREUM_CHAIN_ID.toString(16)}` }],
              });
              
              const updatedProvider = new ethers.BrowserProvider(window.ethereum);
              setEthereumProvider(updatedProvider);
              const updatedNetwork = await updatedProvider.getNetwork();
              setEthereumChainId(Number(updatedNetwork.chainId));
              
              const newAccounts = await updatedProvider.send("eth_requestAccounts", []);
              accounts = newAccounts;
            } catch (addError) {
              console.error('Error adding Sepolia network:', addError);
              toast.error('Failed to add Sepolia network');
              setIsEthereumConnecting(false);
              return;
            }
          } else {
            console.error('Failed to switch to Sepolia network:', switchError);
            toast.error('Failed to switch to Sepolia network');
            setIsEthereumConnecting(false);
            return;
          }
        }
      } else {
        setEthereumProvider(provider);
        setEthereumChainId(chainId);
      }
      
      if (accounts.length > 0) {
        setEthereumAccount(accounts[0]);
        
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(EthereumNFTAddress, EthereumNFTABI, signer);
        setEthereumNFTContract(nftContract);
        
        toast.success('Connected to Ethereum Sepolia');
      } else {
        toast.error('No Ethereum accounts found');
      }
    } catch (error) {
      console.error('Error connecting to Ethereum:', error);
      toast.error('Failed to connect to Ethereum');
    } finally {
      setIsEthereumConnecting(false);
    }
  };

  const connectPolygon = async () => {
    setIsPolygonConnecting(true);
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed');
        setIsPolygonConnecting(false);
        return;
      }
      
      const provider = await setupPolygonProvider();
      if (!provider) return;
      
      let accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      if (chainId !== POLYGON_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${POLYGON_CHAIN_ID.toString(16)}` }],
          });
          
          const updatedProvider = new ethers.BrowserProvider(window.ethereum);
          setPolygonProvider(updatedProvider);
          const updatedNetwork = await updatedProvider.getNetwork();
          setPolygonChainId(Number(updatedNetwork.chainId));
          
          if (accounts.length === 0) {
            const newAccounts = await updatedProvider.send("eth_requestAccounts", []);
            accounts = newAccounts;
          }
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
                    chainName: 'Polygon Amoy Testnet',
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18,
                    },
                    rpcUrls: [AMOY_RPC_URL],
                    blockExplorerUrls: ['https://www.oklink.com/amoy'],
                  },
                ],
              });
              
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${POLYGON_CHAIN_ID.toString(16)}` }],
              });
              
              const updatedProvider = new ethers.BrowserProvider(window.ethereum);
              setPolygonProvider(updatedProvider);
              const updatedNetwork = await updatedProvider.getNetwork();
              setPolygonChainId(Number(updatedNetwork.chainId));
              
              const newAccounts = await updatedProvider.send("eth_requestAccounts", []);
              accounts = newAccounts;
            } catch (addError) {
              console.error('Error adding Polygon Amoy network:', addError);
              toast.error('Failed to add Polygon Amoy network');
              setIsPolygonConnecting(false);
              return;
            }
          } else {
            console.error('Failed to switch to Polygon Amoy network:', switchError);
            toast.error('Failed to switch to Polygon Amoy network');
            setIsPolygonConnecting(false);
            return;
          }
        }
      } else {
        setPolygonProvider(provider);
        setPolygonChainId(chainId);
      }
      
      if (accounts.length > 0) {
        setPolygonAccount(accounts[0]);
        
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(PolygonNFTAddress, PolygonNFTABI, signer);
        setPolygonNFTContract(nftContract);
        
        const verifierContract = new ethers.Contract(MerkleVerifierAddress, MerkleVerifierABI, signer);
        setMerkleVerifierContract(verifierContract);
        
        toast.success('Connected to Polygon Amoy');
      } else {
        toast.error('No Polygon accounts found');
      }
    } catch (error) {
      console.error('Error connecting to Polygon:', error);
      toast.error('Failed to connect to Polygon');
    } finally {
      setIsPolygonConnecting(false);
    }
  };

  const disconnectEthereum = () => {
    setEthereumProvider(null);
    setEthereumAccount(null);
    setEthereumChainId(null);
    setEthereumNFTContract(null);
    toast.info('Disconnected from Ethereum');
  };

  const disconnectPolygon = () => {
    setPolygonProvider(null);
    setPolygonAccount(null);
    setPolygonChainId(null);
    setPolygonNFTContract(null);
    setMerkleVerifierContract(null);
    toast.info('Disconnected from Polygon');
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const numericChainId = parseInt(chainId, 16);
      
      if (numericChainId === ETHEREUM_CHAIN_ID) {
        if (accounts.length === 0) {
          disconnectEthereum();
        } else if (ethereumAccount !== accounts[0]) {
          setEthereumAccount(accounts[0]);
          
          if (ethereumProvider) {
            const signer = await ethereumProvider.getSigner();
            const nftContract = new ethers.Contract(EthereumNFTAddress, EthereumNFTABI, signer);
            setEthereumNFTContract(nftContract);
          }
        }
      } else if (numericChainId === POLYGON_CHAIN_ID) {
        if (accounts.length === 0) {
          disconnectPolygon();
        } else if (polygonAccount !== accounts[0]) {
          setPolygonAccount(accounts[0]);
          
          if (polygonProvider) {
            const signer = await polygonProvider.getSigner();
            const nftContract = new ethers.Contract(PolygonNFTAddress, PolygonNFTABI, signer);
            setPolygonNFTContract(nftContract);
            
            const verifierContract = new ethers.Contract(MerkleVerifierAddress, MerkleVerifierABI, signer);
            setMerkleVerifierContract(verifierContract);
          }
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      const numericChainId = parseInt(chainId, 16);
      
      if (numericChainId === ETHEREUM_CHAIN_ID) {
        if (ethereumProvider) {
          setEthereumChainId(numericChainId);
          toast.info('Switched to Ethereum Sepolia');
        }
      } else if (numericChainId === POLYGON_CHAIN_ID) {
        if (polygonProvider) {
          setPolygonChainId(numericChainId);
          toast.info('Switched to Polygon Amoy');
        }
      } else {
        if (ethereumChainId === ETHEREUM_CHAIN_ID) {
          disconnectEthereum();
          toast.warning('Disconnected from Ethereum due to network change');
        }
        if (polygonChainId === POLYGON_CHAIN_ID) {
          disconnectPolygon();
          toast.warning('Disconnected from Polygon due to network change');
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [ethereumProvider, polygonProvider, ethereumAccount, polygonAccount, ethereumChainId, polygonChainId]);

  const contextValue: Web3ContextType = {
    ethereumProvider,
    polygonProvider,
    ethereumAccount,
    polygonAccount,
    ethereumChainId,
    polygonChainId,
    connectEthereum,
    connectPolygon,
    disconnectEthereum,
    disconnectPolygon,
    ethereumNFTContract,
    polygonNFTContract,
    merkleVerifierContract,
    isEthereumConnecting,
    isPolygonConnecting
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

declare global {
  interface Window {
    ethereum: any;
  }
}
