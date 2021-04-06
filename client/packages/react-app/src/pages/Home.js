import React, { Fragment } from "react";
import LandingButtons from "../components/LandingButtons/LandingButtons";

export const Home = (props) => {

    //const { provider, signer, masqueradeContract } = props;

    return (
        <Fragment>
            <h3> Encode secret data into NFTs </h3>
            <LandingButtons />
        </Fragment>
    )
}