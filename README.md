# Masquerade


## Create NFTs with secrets

### Built for the Chainlink Spring 2021 Hackathon
 &nbsp;     
 ## What is it?
Masquerade is a platform which leverages Chainlink to build NFTs which hide a secret - encrypted information encoded directly into the image. Simply provide an image and your plaintext data and Masquerade will handle the rest, minting you a shiny new NFT with your information safely stored within!

As an NFT, your token is able to be freely transferred and traded. When you want to redeem the information, simply return to the portal and burn the token to unlock the encoded data - delivered by the Masquerade Bot on Telegram.

 &nbsp; 

## How does it work?

### Minting

Visit the Masquerade portal, provide an image file and your plaintext data, then submit. Your request will be sent to the Masquerade External Initiator (`masq_ei`), which will construct the Chainlink request payload and trigger the Masquerade External Adapter (`masq_ea`). Within this External Adapter, the following process occurs:

1. User secret is encrpyted using the Google KMS platform.
2. Encrypted buffer is then encoded into the user image via steganography.
3. Image is uploaded and pinned to IPFS.
4. Metadata is constructed using image IPFS hash and user data, then uploaded and pinned to IPFS.
5. Masquerade smart contract is called with metadata hash as tokenUri to mint brand new NFT!

At the end of this process is in control of the new NFT, which can be viewed and traded on [Opensea](https://testnets.opensea.io/assets/masquerade-v4).

 &nbsp; 


### Burning

When the owner of a token wants to unlock the secrets of their newly gifted/purchased NFT, they can visit the Masquerade redeem portal and initiate the burning process:

1. User interacts with the Masquerade Delivery Bot (`masq_tg`) - a [Telegram bot](https://t.me/MasqueradeDeliveryBot) which will provide a safe chat ID to receive secrets.
2. Users goes to the Masquerade web portal and selects the NFT to burn and provides the Telegram chat ID.
3. Smart contract calls Chainlink node and initiates the decode function in the Masquerade External Adapter (`masq_ea`).
4. NFT metadata is parsed and the image is retrieved from IPFS.
5. Encrypted message is decoded from image.
6. Message is decrpyted using Google KMS.
7. Message is sent to user via Telegram Delivery Bot (`masq_tg`)
8. If successful, IPFS data from token is unpinned.
9. Callback to smart contract burns the user token so data can no longer be decoded.

 &nbsp; 

## Technology Used
- Chainlink Nodes, External Initiators, External Adapters.
- Data encrpytion using Google KMS platform.
- Image encoding using process of [steganography](https://en.wikipedia.org/wiki/Steganography).
- IPFS for image/metadata hosting.
- create-eth-app for front-end.
- NFT smart contracts (ERC721) from OZ.
- Polygon (MATIC) L2.
- Message delivery via Telegram Bot.

 &nbsp; 

## Deliverables
- Masquerade Web App - https://masquerade.tech - (`client/react-app`)
- Masquerade External Adapter (`masq_ea`)
- Masquerade External Initiator (`masq_ei`)
- Masquerade Delivery Bot (`masq_tg`)