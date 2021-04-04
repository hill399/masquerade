import React, { useEffect, useState } from "react";
import { Button } from "../components";
import { Fragment } from "react";

export const Redeem = (props) => {

    const ORACLE_ADDRESS = '0xAcC3247110cab6e2886e38a7167Cc36983b20233';
    const JOB_ID = 'bf87439dd0db4caf94e488596ca42ca8';

    const { provider, signer, masqueradeContract } = props;

    const [ownerTokenURIs, setOwnerTokenURIs] = useState([]);
    const [selectedToken, setSelectedToken] = useState(0);

    useEffect(() => {
        const getOwnedTokens = async () => {
            const address = await signer.getAddress();
            const balance = await masqueradeContract.balanceOf(address);

            if (balance) {
                const ownedArray = [];
                const tokenCount = await masqueradeContract.getLastTokenId();

                for (let i = 1; i <= tokenCount; i++) {
                    const tokenOwner = await masqueradeContract.ownerOf(i);

                    if (tokenOwner === address) {
                        ownedArray.push(i);
                    }
                }

                await getOwnerTokenURIs(ownedArray);
            }
        }

        const getOwnerTokenURIs = async (tokenIds) => {
            const ownerTokenURIs = {};

            for (let id of tokenIds) {
                const tokenURI = await masqueradeContract.tokenURI(id);
                ownerTokenURIs[id] = {
                    ...JSON.parse(tokenURI),
                    id
                }
            }

            setOwnerTokenURIs(ownerTokenURIs);
        }

        if (provider && signer) {
            getOwnedTokens()
        }

    }, [provider, signer]);


    const handleDropdownChange = (e) => {
        setSelectedToken(e.target.value);
    }

    const handleTokenApproval = async () => {
        await masqueradeContract.connect(signer).approve(masqueradeContract.address, selectedToken);
    }

    const handleTokenRedeem = async () => {
        await masqueradeContract.connect(signer).requestNFTDecode(ORACLE_ADDRESS, JOB_ID, '445554915', selectedToken);
    }


    const TokenDropdown = () => {
        let items = [];
        for (let i in ownerTokenURIs) {
            items.push(<option key={i} value={ownerTokenURIs[i].id}>{ownerTokenURIs[i].name}</option>);
        }

        return (
            <select value={selectedToken} onClick={handleDropdownChange}>
                {items}
            </select>
        )
    }

    return (
        <Fragment>
            <h1> Redeem </h1>
            <TokenDropdown />
            <Button onClick={() => handleTokenApproval()}>
                Approve
        </Button>
            <Button onClick={() => handleTokenRedeem()}>
                Redeem
        </Button>
        </Fragment>
    )
}