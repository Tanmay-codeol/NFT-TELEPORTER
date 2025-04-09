// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EthereumNFT is ERC721 {
    using Strings for uint256;

    // Mapping from token ID to metadata
    mapping(uint256 => string) private _tokenMetadataHashes;

    string private _baseTokenURI;

    uint256 private _nextTokenId = 1;

    // Event emitted acc to assingmentt
    event TeleportInitiated(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 timestamp,
        string metadataHash
    );

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {
        _baseTokenURI = "ipfs://";
    }

    function mint(address to) public returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);

        // For demo purposes
        string memory metadataHash = string(
            abi.encodePacked("QmHash", tokenId.toString())
        );
        _tokenMetadataHashes[tokenId] = metadataHash;

        return tokenId;
    }

    function setTokenMetadataHash(
        uint256 tokenId,
        string memory metadataHash
    ) public {
        require(_exists(tokenId), "EthereumNFT: token does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "EthereumNFT: caller is not the owner"
        );
        _tokenMetadataHashes[tokenId] = metadataHash;
    }

    function getTokenMetadataHash(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_exists(tokenId), "EthereumNFT: token does not exist");
        return _tokenMetadataHashes[tokenId];
    }

    function teleportToPolygon(uint256 tokenId) public {
        require(_exists(tokenId), "EthereumNFT: token does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "EthereumNFT: caller is not the owner"
        );

        address owner = ownerOf(tokenId);
        string memory metadataHash = _tokenMetadataHashes[tokenId];

        // Emit event here
        emit TeleportInitiated(tokenId, owner, block.timestamp, metadataHash);

        // Burn
        _burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "EthereumNFT: URI query for nonexistent token"
        );

        string memory metadataHash = _tokenMetadataHashes[tokenId];
        return string(abi.encodePacked(_baseTokenURI, metadataHash));
    }

    function setBaseURI(string memory baseURI) public {
        _baseTokenURI = baseURI;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
