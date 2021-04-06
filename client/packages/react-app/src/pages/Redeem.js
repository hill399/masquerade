import React, { useEffect, useState } from "react";
import { Fragment } from "react";

import { RedeemForm } from "../components/RedeemForm/RedeemForm";

export const Redeem = (props) => {

    const { provider, signer, masqueradeContract } = props;

    const [ownerTokenURIs, setOwnerTokenURIs] = useState([]);

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

}, [provider, signer, masqueradeContract]);

return (
    <Fragment>
        <RedeemForm signer={signer} masqueradeContract={masqueradeContract} ownerTokenURIs={ownerTokenURIs} />
    </Fragment>
)
}