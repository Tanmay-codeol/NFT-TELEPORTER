
import React from 'react';
import { Loader2 } from 'lucide-react';

const EthereumLogo = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1_2)">
      <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#627EEA"/>
      <path d="M16.498 4V12.87L23.995 16.22L16.498 4Z" fill="white" fillOpacity="0.602"/>
      <path d="M16.498 4L9 16.22L16.498 12.87V4Z" fill="white"/>
      <path d="M16.498 21.9682V27.9952L24 17.6162L16.498 21.9682Z" fill="white" fillOpacity="0.602"/>
      <path d="M16.498 27.9952V21.9672L9 17.6162L16.498 27.9952Z" fill="white"/>
      <path d="M16.498 20.5731L23.995 16.2201L16.498 12.8721V20.5731Z" fill="white" fillOpacity="0.2"/>
      <path d="M9 16.2201L16.498 20.5731V12.8721L9 16.2201Z" fill="white" fillOpacity="0.602"/>
    </g>
    <defs>
      <clipPath id="clip0_1_2">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const PolygonLogo = () => (
  <svg viewBox="0 0 38 33" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.9103 0L0 10.9204V32.7611L5.95364 30.071V16.4125L18.9103 27.4432L37.8206 16.5228V5.60233L18.9103 0ZM29.4251 12.1314L24.7511 14.9318L20.0772 12.1314L24.7511 9.33102L29.4251 12.1314Z" fill="#8247E5"/>
  </svg>
);

interface NetworkIconProps {
  network: 'ethereum' | 'polygon';
  isConnected: boolean;
  isConnecting: boolean;
}

const NetworkIcon: React.FC<NetworkIconProps> = ({ network, isConnected, isConnecting }) => {
  return (
    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
      isConnected 
        ? network === 'ethereum' 
          ? 'bg-ethereum/10 glow-ethereum' 
          : 'bg-polygon/10 glow-polygon'
        : 'bg-gray-700/20'
    }`}>
      {isConnecting ? (
        <Loader2 className={`w-5 h-5 animate-spin ${
          network === 'ethereum' ? 'text-ethereum' : 'text-polygon'
        }`} />
      ) : (
        network === 'ethereum' ? <EthereumLogo /> : <PolygonLogo />
      )}
    </div>
  );
};

export default NetworkIcon;
