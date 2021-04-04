//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Masquerade is ERC721, Ownable, ChainlinkClient {
    //uint256 constant private ORACLE_PAYMENT = 1 * LINK;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public masqueradeNode;

    event DecodeNFTFulfilled(
        bytes32 indexed requestId,
        uint256 indexed tokenId
    );

    modifier onlyMasqueradeNode {
        require(msg.sender == masqueradeNode, "Not authorised to mint");
        _;
    }

    constructor(address _node) public ERC721("Masquerade", "MASQ") {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        masqueradeNode = _node;
    }

    function mintNFT(address recipient, string memory tokenURI)
        public onlyMasqueradeNode
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

        function getLastTokenId()
        public
        view
        returns (uint256)
    {
        return _tokenIds.current();
    }


    function requestNFTDecode(address _oracle, string memory _jobId, string memory _chatId, uint256 _tokenId)
        public
    {
        require(msg.sender == ownerOf(_tokenId), "Sender is not owner of specified token");
        require(_isApprovedOrOwner(address(this), _tokenId), "Contract not approved to manage");
        string memory tokenURI =  tokenURI(_tokenId);
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillNFTDecode.selector);
        req.add("tokenURI", tokenURI);
        req.add("chatId", _chatId);
        req.addUint("tokenId", _tokenId);
        req.add("func", "decode");
        sendChainlinkRequestTo(_oracle, req, 0);
    }

    function fulfillNFTDecode(bytes32 _requestId, uint256 _tokenId)
        public
        recordChainlinkFulfillment(_requestId)
    {
        if ( _tokenId > 0) {
            _burn(_tokenId);
            emit DecodeNFTFulfilled(_requestId, _tokenId);
        }
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    )
        public
        onlyOwner
    {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }
}