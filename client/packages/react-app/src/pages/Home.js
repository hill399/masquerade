import React, { Fragment } from "react";
import LandingButtons from "../components/LandingButtons/LandingButtons";

export const Home = (props) => {

    const { correctNetwork } = props;

    return (
        <Fragment>
            <LandingButtons correctNetwork={correctNetwork}  />
        </Fragment>
    )
}