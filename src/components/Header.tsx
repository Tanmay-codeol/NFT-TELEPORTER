
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto py-6 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-ethereum to-polygon p-2 rounded-md mr-3">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">ChainHop</h1>
          <p className="text-xs text-muted-foreground">NFT Teleporter</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <a 
          href="https://github.com/Tanmay-codeol/NFT-TELEPORTER" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            GitHub
          </Button>
        </a>
        <a 
          href="https://github.com/Tanmay-codeol/NFT-TELEPORTER" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            Docs
          </Button>
        </a>
      </div>
    </header>
  );
};

export default Header;
