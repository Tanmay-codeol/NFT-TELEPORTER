
export const MerkleVerifierABI = [
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
	}
];
export const MerkleVerifierAddress = "0x059C8f0182fBF12728F9C7020a4784C9305AdDE9"; 