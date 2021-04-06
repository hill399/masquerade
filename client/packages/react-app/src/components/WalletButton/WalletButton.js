import React from "react";
import { MetaMaskButton } from 'rimble-ui';

const WalletButton = ({ provider, loadWeb3Modal, logoutOfWeb3Modal }) => {

    const handleButtonState = () => {
        if (!provider) {
            loadWeb3Modal();
        } else {
            logoutOfWeb3Modal();
        }
    }

    return (
        <MetaMaskButton.Outline
            size="small"
            onClick={handleButtonState}
            style={{marginLeft: '30px'}}
        >
            {!provider ? "Connect Wallet" : "Disconnect Wallet"}
        </MetaMaskButton.Outline>
    );
}

export default WalletButton;