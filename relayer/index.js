// This script listens for teleport events on Ethereum Sepolia and generates 
// Merkle proofs to be used on Polygon amoy

const { ethers } = require('ethers');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const ETHEREUM_NFT_ADDRESS = "0x88dB217D00548FF9FfCa6529Bf52cf5fb1c28873";
const MERKLE_VERIFIER_ADDRESS = "0x059C8f0182fBF12728F9C7020a4784C9305AdDE9";

const EthereumNFTABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadataHash",
        "type": "string"
      }
    ],
    "name": "TeleportInitiated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "teleportToPolygon",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const MerkleVerifierABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      }
    ],
    "name": "MerkleRootUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "currentMerkleRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "leaf",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "newRoot",
        "type": "bytes32"
      }
    ],
    "name": "updateMerkleRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const SEPOLIA_RPC_URL = "https://rpc.sepolia.org";
const MUMBAI_RPC_URL = "https://rpc-mumbai.maticvigil.com";

const ethereumProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const polygonProvider = new ethers.JsonRpcProvider(MUMBAI_RPC_URL);

const ethereumNFTContract = new ethers.Contract(
  ETHEREUM_NFT_ADDRESS,
  EthereumNFTABI,
  ethereumProvider
);

let teleportEvents = [];
let merkleTree = null;

function getPolygonSigner() {
  const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
  
  if (!PRIVATE_KEY) {
    throw new Error("Relayer private key not set");
  }
  
  return new ethers.Wallet(PRIVATE_KEY, polygonProvider);
}

// Create a leaf from teleport data
function createLeaf(tokenId, owner, metadataHash) {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256', 'address', 'string'],
      [tokenId, owner, metadataHash]
    )
  );
}

// Generate the Merkle tree 
function generateMerkleTree() {
  const leaves = teleportEvents.map(event => 
    createLeaf(event.tokenId, event.owner, event.metadataHash)
  );
  
  return new MerkleTree(leaves, keccak256, { sort: true });
}

// Submit the Merkle root 
async function submitMerkleRoot() {
  try {
    if (!merkleTree || teleportEvents.length === 0) {
      console.log("No teleport events to process");
      return;
    }
    
    const signer = getPolygonSigner();
    const verifierContract = new ethers.Contract(
      MERKLE_VERIFIER_ADDRESS,
      MerkleVerifierABI,
      signer
    );
    
    const root = merkleTree.getHexRoot();
    console.log(`Submitting Merkle root: ${root}`);
    
    const tx = await verifierContract.updateMerkleRoot(root);
    await tx.wait();
    
    console.log(`Root submitted successfully in tx: ${tx.hash}`);
  } catch (error) {
    console.error("Error submitting Merkle root:", error);
  }
}

// Generate proof as in assignment
function generateProof(tokenId, owner, metadataHash) {
  if (!merkleTree) {
    throw new Error("Merkle tree not generated yet");
  }
  
  const leaf = createLeaf(tokenId, owner, metadataHash);
  return merkleTree.getHexProof(leaf);
}

function getProofForTeleport(tokenId, owner, metadataHash) {
  const proof = generateProof(tokenId, owner, metadataHash);
  
  const proofData = ethers.AbiCoder.defaultAbiCoder().encode(
    ['uint256', 'address', 'string', 'bytes32[]'],
    [tokenId, owner, metadataHash, proof]
  );
  
  return proofData;
}

// Listen for events
async function startEventListener() {
  console.log("Starting teleport event listener...");
  
  const teleportEventInterface = ethereumNFTContract.interface.getEvent("TeleportInitiated");
  const teleportEventTopic = ethereumNFTContract.interface.getEventTopic(teleportEventInterface);
  
  ethereumProvider.on({
    address: ETHEREUM_NFT_ADDRESS,
    topics: [teleportEventTopic]
  }, async (log) => {
    try {
      const parsedLog = ethereumNFTContract.interface.parseLog({
        topics: log.topics,
        data: log.data
      });
      
      if (!parsedLog) return;
      
      const { tokenId, owner, timestamp, metadataHash } = parsedLog.args;
      
      console.log(`Teleport event detected for token #${tokenId}`);
      
      teleportEvents.push({
        tokenId,
        owner,
        timestamp,
        metadataHash
      });
      
      merkleTree = generateMerkleTree();
      await submitMerkleRoot();
      
      const proof = generateProof(tokenId, owner, metadataHash);
      console.log(`Proof for token #${tokenId}:`, proof);
      
      const proofData = ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'address', 'string', 'bytes32[]'],
        [tokenId, owner, metadataHash, proof]
      );
      
      console.log("Encoded proof data:", proofData);
    } catch (error) {
      console.error("Error processing teleport event:", error);
    }
  });
  
  console.log("Listening for teleport events...");
}

// Main function
async function main() {
  try {
    await startEventListener();
    
    // Keep the process running
    process.stdin.resume();
  } catch (error) {
    console.error("Error in relayer service:", error);
    process.exit(1);
  }
}

// Start the relayer
main();
