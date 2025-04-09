// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MerkleVerifier {
    bytes32 public currentMerkleRoot;

    event MerkleRootUpdated(bytes32 indexed root, uint256 indexed blockNumber);

    constructor() {
        // init epmty root
        currentMerkleRoot = bytes32(0);
    }

    // Update the Merkle root
    function updateMerkleRoot(bytes32 newRoot) public {
        // require(msg.sender == authorizedRelayer, "Not authorized"); // production

        currentMerkleRoot = newRoot;
        emit MerkleRootUpdated(newRoot, block.number);
    }

    function verify(
        bytes32 leaf,
        bytes32[] memory proof
    ) public view returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        return computedHash == currentMerkleRoot;
    }
}
