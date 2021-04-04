import React, { Fragment } from "react";
import { MintForm } from "../components/MintForm/MintForm";

export const Mint = (props) => {

    const { signer } = props;

    return (
        <Fragment>
            <h1> Mint </h1>
            <MintForm signer={signer} />
        </Fragment>
    )
}