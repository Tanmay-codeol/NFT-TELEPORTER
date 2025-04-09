
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MerkleTreeSpec: React.FC = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 bg-card/80 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Protocol Specifications</CardTitle>
        <CardDescription>
          How the ChainHop NFT Teleporter works under the hood
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3 className="font-medium mb-1">Merkle Proof System</h3>
          <p className="text-muted-foreground">
            The teleporter uses a Merkle tree-based proof system to verify that an NFT was legitimately burned on Ethereum before minting on Polygon.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Process Flow:</h4>
          <ol className="list-decimal ml-5 space-y-2 text-muted-foreground">
            <li>
              <span className="text-foreground font-medium">Burn on Ethereum:</span> The NFT is burned on Ethereum and a TeleportInitiated event is emitted with token data.
            </li>
            <li>
              <span className="text-foreground font-medium">Event Tracking:</span> A relayer service monitors Ethereum for these events and collects them.
            </li>
            <li>
              <span className="text-foreground font-medium">Merkle Tree Creation:</span> The relayer constructs a Merkle tree from the events and publishes the root to Polygon.
            </li>
            <li>
              <span className="text-foreground font-medium">Proof Generation:</span> When a user wants to claim their NFT on Polygon, they request a proof for their specific token.
            </li>
            <li>
              <span className="text-foreground font-medium">Verification & Minting:</span> The Polygon contract verifies the proof against the root and mints the identical NFT.
            </li>
          </ol>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">Metadata Integrity</h3>
          <p className="text-muted-foreground">
            The NFT's metadata hash is included in the teleport event to ensure the exact same metadata is used when minting on Polygon.
          </p>
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium mb-1">Security Considerations</h3>
          <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
            <li>Merkle roots are immutable once published, preventing replay attacks</li>
            <li>Only the original owner can claim the teleported NFT</li>
            <li>Metadata integrity is verified using cryptographic hashes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerkleTreeSpec;
