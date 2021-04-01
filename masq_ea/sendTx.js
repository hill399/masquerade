const Contract = require('web3-eth-contract');
const masqueradeABI = require('./Masquerade.json');
const Web3 = require('web3');

const MASQUERADE_ADDRESS = process.env.MASQUERADE_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const MUMBAI_PK = process.env.MUMBAI_PK;
const ADAPTER_ADDRESS = process.env.ADAPTER_ADDRESS;


// Ideally this would be handled by the Chainlink node - using the ethTx adapter.
// However been unable to correctly set the raw tx data in the result field.
// Is this a limitation of the ethTx adapter - result bytes32 too long for the node to handle?
const sendTx = async (address, metadata) => {
    const provider = new Web3.providers.HttpProvider(RPC_URL);
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const contract = new Contract(masqueradeABI, MASQUERADE_ADDRESS);
    contract.setProvider(provider);
    const tx = contract.methods.mintNFT(address, metadata);
    const gas = await tx.estimateGas({ from: ADAPTER_ADDRESS });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(ADAPTER_ADDRESS);

    const options = {
        to: contract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId
    }

    const signedTx = await web3.eth.accounts.signTransaction(
        options,
        MUMBAI_PK
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    
    return receipt.transactionHash;
}

module.exports.sendTx = sendTx;

