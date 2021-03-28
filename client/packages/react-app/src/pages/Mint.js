import React, { Fragment } from "react";
import { MintForm } from "../components/MintForm/MintForm";

export const Mint = (props) => {

    const { defaultProvider, masqueradeContract } = props;

    return (
        <Fragment>
            <h1> Mint </h1>
            <MintForm />
        </Fragment>
    )
}