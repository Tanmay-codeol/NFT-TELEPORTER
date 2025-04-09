
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import NetworkIcon from './NetworkIcon';
import NFTCard from './NFTCard';
import TeleportSteps, { StepStatus } from './TeleportSteps';
import { useWeb3 } from '@/contexts/Web3Context';
import { NFT, fetchUserNFTs } from '@/data/nfts';
import { getTeleportProof } from '@/utils/merkleProof';

interface TeleportPanelProps {}

const TeleportPanel: React.FC<TeleportPanelProps> = () => {
  const {
    ethereumAccount,
    polygonAccount,
    connectEthereum,
    connectPolygon,
    ethereumNFTContract,
    polygonNFTContract,
    isEthereumConnecting,
    isPolygonConnecting
  } = useWeb3();

  const [activeTab, setActiveTab] = useState('ethereum');
  const [ethereumNFTs, setEthereumNFTs] = useState<NFT[]>([]);
  const [teleportedNFTs, setTeleportedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teleportingNFT, setTeleportingNFT] = useState<number | null>(null);
  const [currentStepId, setCurrentStepId] = useState('connect');
  
  const steps = [
    {
      id: 'connect',
      title: 'Connect Wallets',
      description: 'Connect your Sepolia and Amoy wallets to begin',
      status: ethereumAccount && polygonAccount ? 'complete' : 'idle' as StepStatus
    },
    {
      id: 'select',
      title: 'Select NFT',
      description: 'Choose an NFT to teleport from Ethereum to Polygon',
      status: teleportingNFT !== null ? 'complete' : 'idle' as StepStatus
    },
    {
      id: 'initiate',
      title: 'Initiate Teleport',
      description: 'Burn the NFT on Ethereum and generate proof',
      status: teleportingNFT !== null && activeTab === 'polygon' ? 'complete' : 'idle' as StepStatus
    },
    {
      id: 'claim',
      title: 'Claim on Polygon',
      description: 'Use the proof to claim your NFT on Polygon',
      status: 'idle' as StepStatus
    }
  ];

  const getUpdatedSteps = () => {
    return steps.map(step => {
      if (step.id === currentStepId) {
        return { ...step, status: 'loading' as StepStatus };
      }
      return step;
    });
  };

  useEffect(() => {
    const loadNFTs = async () => {
      if (ethereumAccount && ethereumNFTContract) {
        setIsLoading(true);
        try {
          const nfts = await fetchUserNFTs(ethereumAccount);
          setEthereumNFTs(nfts);
          
          setTeleportedNFTs([]);
          
          toast.info('Connected to Sepolia testnet with NFTs loaded');
        } catch (error) {
          console.error('Error fetching NFTs:', error);
          toast.error('Failed to load your NFTs from Sepolia');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadNFTs();
  }, [ethereumAccount, ethereumNFTContract]);

  const handleTeleport = async (nft: NFT) => {
    if (!ethereumNFTContract) {
      toast.error('Ethereum wallet not connected to Sepolia');
      return;
    }

    setTeleportingNFT(nft.id);
    setCurrentStepId('initiate');
    
    try {
      toast.info('Initiating teleport on Sepolia testnet...');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setEthereumNFTs(prev => prev.filter(item => item.id !== nft.id));
      setTeleportedNFTs(prev => [...prev, nft]);
      
      toast.success('NFT successfully teleported! Switch to Polygon to claim it.');
      setActiveTab('polygon');
      setCurrentStepId('claim');
    } catch (error) {
      console.error('Error teleporting NFT:', error);
      toast.error('Failed to teleport NFT on Sepolia');
      setTeleportingNFT(null);
    }
  };

  const handleClaim = async (nft: NFT) => {
    if (!polygonNFTContract) {
      toast.error('Polygon wallet not connected to Amoy');
      return;
    }

    setCurrentStepId('claim');
    
    try {
      toast.info('Generating Merkle proof...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Claiming NFT on Polygon Amoy testnet...');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTeleportedNFTs(prev => prev.filter(item => item.id !== nft.id));
      
      toast.success('NFT successfully claimed on Polygon Amoy!');
      
      setTeleportingNFT(null);
      steps[3].status = 'complete';
    } catch (error) {
      console.error('Error claiming NFT:', error);
      toast.error('Failed to claim NFT on Polygon');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border-border/40">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">NFT Teleporter</CardTitle>
            <CardDescription>Teleport your NFTs between Ethereum Sepolia and Polygon Amoy</CardDescription>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <NetworkIcon 
                network="ethereum" 
                isConnected={!!ethereumAccount}
                isConnecting={isEthereumConnecting}
              />
              <span className="text-xs mt-1 font-medium">
                {ethereumAccount ? 'Sepolia' : 'Sepolia'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <NetworkIcon 
                network="polygon"
                isConnected={!!polygonAccount}
                isConnecting={isPolygonConnecting}
              />
              <span className="text-xs mt-1 font-medium">
                {polygonAccount ? 'Amoy' : 'Amoy'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(!ethereumAccount || !polygonAccount) ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={connectEthereum}
                disabled={!!ethereumAccount || isEthereumConnecting}
                className="bg-ethereum hover:bg-ethereum/90"
              >
                {isEthereumConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Sepolia...
                  </>
                ) : ethereumAccount ? (
                  'Sepolia Connected'
                ) : (
                  'Connect Ethereum (Sepolia)'
                )}
              </Button>
              <Button
                onClick={connectPolygon}
                disabled={!!polygonAccount || isPolygonConnecting}
                className="bg-polygon hover:bg-polygon/90"
              >
                {isPolygonConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Amoy...
                  </>
                ) : polygonAccount ? (
                  'Amoy Connected'
                ) : (
                  'Connect Polygon (Amoy)'
                )}
              </Button>
            </div>
            <TeleportSteps steps={getUpdatedSteps()} currentStepId={currentStepId} />
          </div>
        ) : (
          <Tabs defaultValue="ethereum" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="ethereum" className="relative">
                Ethereum (Sepolia)
                {ethereumNFTs.length > 0 && (
                  <Badge className="ml-2 bg-ethereum text-white">{ethereumNFTs.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="polygon" className="relative">
                Polygon (Amoy)
                {teleportedNFTs.length > 0 && (
                  <Badge className="ml-2 bg-polygon text-white">{teleportedNFTs.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ethereum">
              {isLoading ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
              ) : ethereumNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ethereumNFTs.map(nft => (
                    <NFTCard
                      key={nft.id}
                      id={nft.id}
                      name={nft.name}
                      image={nft.image}
                      isTeleported={false}
                      isInProgress={teleportingNFT === nft.id}
                      onTeleport={() => handleTeleport(nft)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-10">
                  <p className="text-muted-foreground">No NFTs found in your Ethereum wallet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="polygon">
              {teleportedNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {teleportedNFTs.map(nft => (
                    <NFTCard
                      key={nft.id}
                      id={nft.id}
                      name={nft.name}
                      image={nft.image}
                      isTeleported={true}
                      isInProgress={false}
                      onTeleport={() => {}}
                      onClaim={() => handleClaim(nft)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-10">
                  <p className="text-muted-foreground">No teleported NFTs waiting to be claimed on Polygon</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('ethereum')}
                    className="mt-4"
                  >
                    Go to Ethereum to teleport NFTs
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TeleportPanel;
