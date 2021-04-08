import React, { Fragment } from "react";
import { MintForm } from "../components/MintForm/MintForm";

export const Mint = (props) => {

    const { signer, setWaitingOnMint } = props;

    return (
        <Fragment>
            <MintForm signer={signer} setWaitingOnMint={setWaitingOnMint} />
        </Fragment>
    )
}