import React, { useEffect, useState } from "react";
import { Fragment } from "react";

import { RedeemForm } from "../components/RedeemForm/RedeemForm";

import axios from "axios";

export const Redeem = (props) => {

    const { provider, signer, masqueradeContract, setWaitingOnRedeem, setInvalidTx } = props;

    const [ownerTokenURIs, setOwnerTokenURIs] = useState([]);

    const getTokenMetadata = async (ipfsLink) => {
        const ipfsHash = ipfsLink.substring(7);
        const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
        return response.data;
    }

    useEffect(() => {
        const getOwnedTokens = async () => {
            const address = await signer.getAddress();
            const balance = await masqueradeContract.balanceOf(address);

            if (balance) {
                const ownedArray = [];
                const tokenCount = await masqueradeContract.getLastTokenId();

                for (let i = 1; i <= tokenCount; i++) {
                    try {
                        const tokenOwner = await masqueradeContract.ownerOf(i);

                        if (tokenOwner === address) {
                            ownedArray.push(i);
                        }

                    } catch { }
                }

                await getOwnerTokenURIs(ownedArray);
            }
        }

        const getOwnerTokenURIs = async (tokenIds) => {
            const ownerTokenURIs = {};

            for (let id of tokenIds) {
                const tokenURI = await masqueradeContract.tokenURI(id);
                const tokenMetadata = await getTokenMetadata(tokenURI);

                ownerTokenURIs[id] = {
                    ...tokenMetadata,
                    id
                }
            }

            setOwnerTokenURIs(ownerTokenURIs);
        }

        if (provider && signer) {
            getOwnedTokens()
        }

    }, [provider, signer, masqueradeContract]);

    return (
        <Fragment>
            <RedeemForm signer={signer} masqueradeContract={masqueradeContract} ownerTokenURIs={ownerTokenURIs} setWaitingOnRedeem={setWaitingOnRedeem} setInvalidTx={setInvalidTx} />
        </Fragment>
    )
}