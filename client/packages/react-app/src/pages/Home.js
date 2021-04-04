import React, { Fragment } from "react";
import LandingButtons from "../components/LandingButtons/LandingButtons";

export const Home = (props) => {

    const { provider, signer, masqueradeContract } = props;

    return (
        <Fragment>
            <h1> Home </h1>
            <LandingButtons />
        </Fragment>
    )
}