// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IMerkleVerifier {
    function verify(
        bytes32 leaf,
        bytes32[] memory proof
    ) external view returns (bool);
}

contract PolygonNFT is ERC721 {
    using Strings for uint256;

    address public merkleVerifier;

    mapping(uint256 => string) private _tokenMetadataHashes;

    string private _baseTokenURI;

    event TeleportCompleted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataHash
    );

    constructor(
        string memory name_,
        string memory symbol_,
        address merkleVerifier_
    ) ERC721(name_, symbol_) {
        merkleVerifier = merkleVerifier_;
        _baseTokenURI = "ipfs://";
    }

    // Function to receive a teleported NFT
    function receiveTeleport(bytes calldata proofData) public {
        (
            uint256 tokenId,
            address owner,
            string memory metadataHash,
            bytes32[] memory proof
        ) = abi.decode(proofData, (uint256, address, string, bytes32[]));

        bytes32 leaf = keccak256(
            abi.encodePacked(tokenId, owner, metadataHash)
        );

        // Verify the proof
        bool isValid = IMerkleVerifier(merkleVerifier).verify(leaf, proof);
        require(isValid, "PolygonNFT: Invalid proof");

        require(!_exists(tokenId), "PolygonNFT: Token already exists");

        _safeMint(owner, tokenId);

        _tokenMetadataHashes[tokenId] = metadataHash;

        emit TeleportCompleted(tokenId, owner, metadataHash);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "PolygonNFT: URI query for nonexistent token"
        );

        string memory metadataHash = _tokenMetadataHashes[tokenId];
        return string(abi.encodePacked(_baseTokenURI, metadataHash));
    }

    function setBaseURI(string memory baseURI) public {
        _baseTokenURI = baseURI;
    }
}
