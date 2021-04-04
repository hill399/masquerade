import React, { useEffect, useState } from "react";
import { Route, Switch } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Mint } from "./pages/Mint";
import { Redeem } from "./pages/Redeem";

import { Contract } from "@ethersproject/contracts";
//import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import { Fragment } from "react";


const WalletButton = ({ provider, loadWeb3Modal, logoutOfWeb3Modal }) => {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

const App = () => {
  //const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [signer, setSigner] = useState(null);
  const [masqueradeContract, setMasqueradeContract] = useState(null);

  useEffect(() => {
    if (provider) {
      const masqueradeContract = new Contract(addresses.masquerade, abis.masquerade, provider);
      setMasqueradeContract(masqueradeContract);
      setSigner(provider.getSigner());
    }

  }, [provider]);

  return (
    <Fragment>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <Switch>
          <Route path='/' exact render={() => <Home provider={provider} signer={signer} masqueradeContract={masqueradeContract} />} />
          <Route path='/mint' exact render={() => <Mint provider={provider} signer={signer} masqueradeContract={masqueradeContract} />} />
          <Route path='/redeem' exact render={() => <Redeem provider={provider} signer={signer} masqueradeContract={masqueradeContract} />} />
        </Switch>
      </Body>
    </Fragment>
  );
}

export default App;
