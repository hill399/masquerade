import React, { Fragment } from "react";
import { Button } from "../../components";
import { useHistory } from "react-router-dom";

const LandingButtons = () => {

    const history = useHistory();

    const handleMintButton = () => {
        history.push("/mint");
    }

    const handleRedeemButton = () => {
        history.push("/redeem");
    }

    return (
        <Fragment>
            <Button onClick={() => handleMintButton()}>
                Mint
        </Button>

            <Button onClick={() => handleRedeemButton()}>
                Redeem
        </Button>
        </Fragment>
    )
}

export default LandingButtons;