
import React from 'react';
import Header from '@/components/Header';
import TeleportPanel from '@/components/TeleportPanel';
import MerkleTreeSpec from '@/components/MerkleTreeSpec';
import { Web3Provider } from '@/contexts/Web3Context';

const Index = () => {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-dark-space">
        {/* Background elements */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ethereum/10 rounded-full filter blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-polygon/10 rounded-full filter blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
          <Header />
          
          <main className="container px-4 py-8">
            <TeleportPanel />
            <MerkleTreeSpec />
            
            <footer className="mt-12 text-center text-sm text-muted-foreground pb-8">
              <p>ChainHop NFT Teleporter — Built with Ethereum & Polygon</p>
              <p className="mt-1">Merkle proof-based cross-chain NFT bridging without relying on third-party bridges</p>
            </footer>
          </main>
        </div>
      </div>
    </Web3Provider>
  );
};

export default Index;
