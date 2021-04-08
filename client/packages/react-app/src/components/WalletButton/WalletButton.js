import React from "react";
import { MetaMaskButton } from 'rimble-ui';
import { useHistory } from "react-router-dom";

const WalletButton = ({ provider, loadWeb3Modal, logoutOfWeb3Modal }) => {

    const history = useHistory();

    const handleButtonState = () => {
        if (!provider) {
            loadWeb3Modal();
        } else {
            logoutOfWeb3Modal();
        }

        history.push("/");
    }

    return (
        <MetaMaskButton.Outline
            size="small"
            onClick={handleButtonState}
            style={{marginRight: '20px'}}
        >
             <text style={{fontFamily: 'Fjalla One', fontWeight: 500, fontSize: 14 }}> {!provider ? "Connect Wallet" : "Disconnect Wallet"} </text>
        </MetaMaskButton.Outline>
    );
}

export default WalletButton;