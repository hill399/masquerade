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

import logoMain from "./icons/logo-main.jpg";

const App = () => {
  //const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [signer, setSigner] = useState(null);
  const [masqueradeContract, setMasqueradeContract] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (provider) {
      const masqueradeContract = new Contract(addresses.masquerade, abis.masquerade, provider);
      setMasqueradeContract(masqueradeContract);
      setSigner(provider.getSigner());
    }

  }, [provider]);

  const handleLogoClick = () => {
    history.push('/');
  }

  return (
    <Fragment>
      <Header style={{ paddingRight: '10px' }}>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body style={{ padding: '100px' }}>
        <img src={logoMain} alt="Masquerade" style={{height: '200px', width: '200px', cursor: "pointer", paddingBottom: '10px'}} onClick={handleLogoClick}/>
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
