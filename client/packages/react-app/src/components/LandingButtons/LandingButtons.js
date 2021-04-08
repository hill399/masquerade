import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";

import {
    Box,
    Flex,
    Button,
} from "rimble-ui";

const LandingButtons = () => {

    const history = useHistory();

    const [textValue, setTextValue] = useState(null);

    const handleMintButton = () => {
        history.push("/mint");
    }

    const handleRedeemButton = () => {
        history.push("/redeem");
    }

    const setButtonHover = (e) => {
        setTextValue(e.target.name);
    }

    const clearButtonHover = () => {
        setTextValue(null);
    }

    const LandingText = () => {
        let landingText;

        switch (textValue) {
            case "mint":
                landingText = "Mint a new NFT with a secret message inside"
                break
            case "redeem":
                landingText = "Redeem an NFT and unlock its secret"
                break
            default:
                landingText = "Create NFTs with secrets"
        }

        return (
            <text style={{ textAlign: "center" }}> {landingText} </text>
        )
    }

    return (
        <Fragment>
            <Box>
                <Flex mx={-3} flexWrap={"wrap"} style={{ paddingBottom: '70px' }}>
                    <Box width={[1, 1, 1 / 2]} px={3}>
                        <Button mainColor="White" contrastColor="Black" name="mint" style={{ width: 150 }} onClick={() => handleMintButton()} onMouseEnter={setButtonHover} onMouseLeave={clearButtonHover}>
                            <text style={{ fontFamily: 'Fjalla One', fontWeight: 500, fontSize: 24 }}> Mint </text>
                        </Button>
                    </Box>
                    <Box width={[1, 1, 1 / 2]} px={3}>
                        <Button mainColor="White" contrastColor="Black" name="redeem" style={{ width: 150 }} onClick={() => handleRedeemButton()} onMouseEnter={setButtonHover} onMouseLeave={clearButtonHover}>
                            <text style={{ fontFamily: 'Fjalla One', fontWeight: 500, fontSize: 24 }}> Redeem </text>
                        </Button>
                    </Box>
                </Flex>
            </Box>

            <Box width='800px' style={{ textAlign: 'center' }}>

                <LandingText />

            </Box>

        </Fragment>


    )
}

export default LandingButtons;