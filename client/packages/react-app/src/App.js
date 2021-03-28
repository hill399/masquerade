import React, { useEffect, useState } from "react";
import { Route, Switch } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Mint } from "./pages/Mint";
import { Redeem } from "./pages/Redeem";

import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
//import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
//import GET_TRANSFERS from "./graphql/subgraph";

/* async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider("https://rpc-mumbai.matic.today");
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const masquerade = new Contract(addresses.masquerade, abis.masquerade, defaultProvider);
  // A pre-defined address that owns some CEAERC20 tokens
  const tokenBalance = await masquerade.name();
  console.log({ tokenBalance: tokenBalance });
} */

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
  const [defaultProvider, setDefautProvider] = useState(null);
  const [masqueradeContract, setMasqueradeContract] = useState(null);

  /*   useEffect(() => {
      if (!loading && !error && data && data.transfers) {
        console.log({ transfers: data.transfers });
      }
    }, [loading, error, data]); */

  useEffect(() => {
    const defaultProvider = getDefaultProvider("https://rpc-mumbai.matic.today");
    setDefautProvider(defaultProvider);

    const masqueradeContract = new Contract(addresses.masquerade, abis.masquerade, defaultProvider);
    setMasqueradeContract(masqueradeContract);
  }, []);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <Switch>
          <Route path='/' exact render={() => <Home provider={defaultProvider} masqueradeContract={masqueradeContract} />} />
          <Route path='/mint' exact render={() => <Mint provider={defaultProvider} masqueradeContract={masqueradeContract} />} />
          <Route path='/redeem' exact render={() => <Redeem provider={defaultProvider} masqueradeContract={masqueradeContract} />} />
        </Switch>
      </Body>
    </div>
  );
}

export default App;
