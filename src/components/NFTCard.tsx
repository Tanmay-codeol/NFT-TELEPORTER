
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Check, Loader2 } from 'lucide-react';

interface NFTCardProps {
  id: number;
  name: string;
  image: string;
  isTeleported: boolean;
  isInProgress: boolean;
  onTeleport: () => void;
  onClaim?: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  name,
  image,
  isTeleported,
  isInProgress,
  onTeleport,
  onClaim
}) => {
  return (
    <Card className="overflow-hidden border border-border/40 backdrop-blur-sm bg-card/70 hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-medium text-foreground/90">{name}</CardTitle>
          <Badge variant={isTeleported ? "secondary" : "outline"} className="text-xs">
            {isTeleported ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Teleported
              </>
            ) : (
              `ID: ${id}`
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className={`rounded-md overflow-hidden relative ${isInProgress ? 'animate-teleport' : ''}`}>
          <img
            src={image}
            alt={name}
            className="w-full aspect-square object-cover"
          />
          {isInProgress && (
            <div className="absolute inset-0 flex items-center justify-center teleport-portal">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        {isTeleported ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClaim}
            disabled={!onClaim}
          >
            {onClaim ? "Claim on Polygon" : "Teleported"}
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-ethereum to-polygon hover:opacity-90 hover:shadow-md transition-all"
            onClick={onTeleport}
            disabled={isInProgress}
          >
            {isInProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Teleporting...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Teleport to Polygon
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
