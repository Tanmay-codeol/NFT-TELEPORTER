
import { keccak256 } from 'ethers';

//event data structure
export interface TeleportEvent {
  tokenId: number;
  owner: string;
  timestamp: number;
  metadataHash: string;
}

export function createLeaf(event: TeleportEvent): string {
  const packed = `${event.tokenId}:${event.owner}:${event.timestamp}:${event.metadataHash}`;
  return keccak256(Buffer.from(packed));
}

export function createMerkleTree(leaves: string[]): { root: string; tree: string[][] } {
  if (leaves.length === 0) {
    throw new Error("Cannot create Merkle tree with empty leaves");
  }

  let nodes: string[] = [...leaves];
  const tree: string[][] = [nodes.slice()];

  while (nodes.length > 1) {
    const levelNodes: string[] = [];
    
    for (let i = 0; i < nodes.length; i += 2) {
      if (i + 1 < nodes.length) {
        const nodeA = nodes[i];
        const nodeB = nodes[i + 1];
        const hash = keccak256(Buffer.from(nodeA + nodeB.slice(2))); 
        levelNodes.push(hash);
      } else {
        levelNodes.push(nodes[i]);
      }
    }
    
    tree.push(levelNodes.slice());
    nodes = levelNodes;
  }

  return { root: nodes[0], tree };
}

export function generateMerkleProof(leaf: string, leaves: string[]): string[] {
  const leafIndex = leaves.findIndex((l) => l === leaf);
  if (leafIndex === -1) {
    throw new Error("Leaf not found in the tree");
  }

  const { tree } = createMerkleTree(leaves);
  const proof: string[] = [];
  let currentIndex = leafIndex;

  for (let i = 0; i < tree.length - 1; i++) {
    const level = tree[i];
    const isEvenIndex = currentIndex % 2 === 0;
    
    const siblingIndex = isEvenIndex ? currentIndex + 1 : currentIndex - 1;
    
    if (siblingIndex < level.length) {
      proof.push(level[siblingIndex]);
    }
    
    currentIndex = Math.floor(currentIndex / 2);
  }

  return proof;
}

export function verifyMerkleProof(leaf: string, proof: string[], root: string): boolean {
  let hash = leaf;
  
  for (const proofElement of proof) {
    const [a, b] = [hash, proofElement].sort();
    hash = keccak256(Buffer.from(a + b.slice(2)));
  }
  
  return hash === root;
}

export function fetchTeleportEvents(): TeleportEvent[] {
  return [
    {
      tokenId: 1,
      owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      timestamp: Math.floor(Date.now() / 1000),
      metadataHash: "QmT1JyPXkBrAVnHMKyYzBZWUeYHkfGAMyehUVp9LZJRhR1"
    },
    {
      tokenId: 2,
      owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      metadataHash: "QmT2JyPXkBrAVnHMKyYzBZWUeYHkfGAMyehUVp9LZJRhR2"
    }
  ];
}

export function getTeleportProof(tokenId: number): { proof: string[]; leaf: string } {
  const events = fetchTeleportEvents();
  const targetEvent = events.find(event => event.tokenId === tokenId);
  
  if (!targetEvent) {
    throw new Error(`No teleport event found for token ID ${tokenId}`);
  }
  
  const leaves = events.map(event => createLeaf(event));
  const leaf = createLeaf(targetEvent);
  const proof = generateMerkleProof(leaf, leaves);
  
  return { proof, leaf };
}
