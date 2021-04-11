import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Mint } from "./pages/Mint";
import { Redeem } from "./pages/Redeem";

import { Contract } from "@ethersproject/contracts";

import { Body, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import WalletButton from "./components/WalletButton/WalletButton";

import { addresses, abis } from "@project/contracts";
import { Fragment } from "react";

import { Flash } from 'rimble-ui';

import logoMain from "./icons/logo-main.jpg";
import logoGithub from "./icons/github.png";

const App = () => {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [signer, setSigner] = useState(null);
  const [masqueradeContract, setMasqueradeContract] = useState(null);
  const [waitingOnMint, setWaitingOnMint] = useState(false);
  const [waitingOnRedeem, setWaitingOnRedeem] = useState(false);
  const [invalidTx, setInvalidTx] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(null);

  const [flashState, setFlashState] = useState({
    enabled: false,
    text: ''
  });

  const history = useHistory();

  const flashTimeouts = [];

  useEffect(() => {
    if (provider) {
      const checkConnectedNetwork = async () => {
        const networkInfo = await provider.getNetwork();
        const correctNetworkId = (80001 === networkInfo.chainId);
        setCorrectNetwork(correctNetworkId);

        if (correctNetworkId) {
          const masqueradeContract = new Contract(addresses.masquerade, abis.masquerade, provider);
          setMasqueradeContract(masqueradeContract);
          setSigner(provider.getSigner());
        }
      }

      checkConnectedNetwork();
    }

  }, [provider]);


  useEffect(() => {

    const timedWarning = () => {
      setFlashState({
        enabled: false,
        text: ""
      })
    }

    if (waitingOnMint) {
      const openSeaLink = `https://testnets.opensea.io/assets/masquerade-v4`;
      setFlashState({
        enabled: true,
        text: <text>Token minting in progress, view it on <a href={openSeaLink}>Opensea.io</a></text>
      })
      setWaitingOnMint(false);
    }

    if (waitingOnRedeem) {
      setFlashState({
        enabled: true,
        text: "Token burn in progress..."
      })
      setWaitingOnRedeem(false);
    }

    if (invalidTx) {
      setFlashState({
        enabled: true,
        text: "Bad TX, check parameters..."
      })
      setInvalidTx(false);
    }

    if (correctNetwork) {
      flashTimeouts.push(setTimeout(timedWarning, 8000));
    } else {
      for (let timeout of flashTimeouts) {
        clearTimeout(timeout);
      }
      setFlashState({
        enabled: true,
        text: "Wrong network, connect to Mumbai testnet..."
      })
    }

  }, [waitingOnMint, waitingOnRedeem, invalidTx, correctNetwork, flashTimeouts]);

  const handleLogoClick = () => {
    history.push('/');
  }

  return (
    <Fragment>
      {flashState.enabled && <Flash style={{ minWidth: '900px' }} >
        {flashState.text}
      </Flash>}
      <Header style={{ paddingRight: '10px' }}>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body style={{ padding: '5px' }}>
        <img src={logoMain} alt="Masquerade" style={{ height: '400px', width: '400px', cursor: "pointer", paddingBottom: '10px' }} onClick={handleLogoClick} />
        <Switch>
          <Route path='/' exact render={() => <Home provider={provider} signer={signer} masqueradeContract={masqueradeContract} correctNetwork={correctNetwork} />} />
          {correctNetwork && <Route path='/mint' render={() => <Mint provider={provider} signer={signer} masqueradeContract={masqueradeContract} setWaitingOnMint={setWaitingOnMint} />} />}
          {correctNetwork && <Route path='/redeem' exact render={() => <Redeem provider={provider} signer={signer} masqueradeContract={masqueradeContract} setWaitingOnRedeem={setWaitingOnRedeem} setInvalidTx={setInvalidTx} />} />}
        </Switch>
        <img src={logoGithub} alt="visit-github" style={{ height: '50px', width: '50px', cursor: "pointer", paddingTop: '70px' }} onClick={() => window.open('http://github.com/hill399/Masquerade')} />
      </Body>
    </Fragment>
  );
}

export default App;
