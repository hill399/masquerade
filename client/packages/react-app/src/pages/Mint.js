import React, { Fragment } from "react";
import { MintForm } from "../components/MintForm/MintForm";

export const Mint = (props) => {

    const { signer } = props;

    return (
        <Fragment>
            <MintForm signer={signer}/>
        </Fragment>
    )
}