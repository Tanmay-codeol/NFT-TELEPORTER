
export interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  metadataHash: string;
}

export const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "Cosmic Voyager #1",
    description: "A cosmic being traveling between dimensions and chains.",
    image: "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=1956&auto=format&fit=crop",
    metadataHash: "QmT1JyPXkBrAVnHMKyYzBZWUeYHkfGAMyehUVp9LZJRhR1"
  },
  {
    id: 2,
    name: "Cyber Punk Nomad #42",
    description: "A digital nomad wandering through the blockchains of the metaverse.",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=2070&auto=format&fit=crop",
    metadataHash: "QmT2JyPXkBrAVnHMKyYzBZWUeYHkfGAMyehUVp9LZJRhR2"
  },
  {
    id: 3,
    name: "Digital Wanderer #87",
    description: "A formless entity that can move freely between digital realms.",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop",
    metadataHash: "QmT3JyPXkBrAVnHMKyYzBZWUeYHkfGAMyehUVp9LZJRhR3"
  },
  {
    id: 4,
    name: "Quantum Shifter #19",
    description: "A quantum being that exists simultaneously on multiple chains.",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop",
    metadataHash: "QmT4JyPXkBrAVnHMKyYzBZWUeYHkfGAMyehUVp9LZJRhR4"
  }
];

export const fetchUserNFTs = async (address: string): Promise<NFT[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNFTs);
    }, 1000);
  });
};
