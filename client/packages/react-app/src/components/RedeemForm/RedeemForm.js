import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";

import { ChatHelpModal } from "../ChatHelpModal/ChatHelpModal";

import {
    Box,
    Flex,
    Form,
    Input,
    Field,
    Button,
    Loader,
    Select
} from "rimble-ui";

export const RedeemForm = (props) => {

    const ORACLE_ADDRESS = '0xAcC3247110cab6e2886e38a7167Cc36983b20233';
    const JOB_ID = '27e9e6e5dfa94d6bb17b4a43ae890e2d';

    const { masqueradeContract, signer, ownerTokenURIs } = props;

    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [selectedToken, setSelectedToken] = useState({
        id: 0,
        approved: false
    });
    const [userChatId, setUserChatId] = useState('');
    const [sendingTx, setSendingTx] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const validateInput = e => {
        e.target.parentNode.classList.add("was-validated");
    };

    const validateForm = () => {
        // Perform advanced validation here
        if (
            selectedToken.id !== 0 &&
            userChatId.length > 0
        ) {
            setValidated(true);
        } else {
            setValidated(false);
        }
    };

    useEffect(() => {
        validateForm();
    });

    useEffect(() => {

        const getApprovedAddress = async () => {
            const approvedAddress = await masqueradeContract.getApproved(selectedToken.id);

            if (approvedAddress === masqueradeContract.address) {
                setSelectedToken({
                    ...selectedToken,
                    approved: true
                })
            }
        }

        if (signer && selectedToken.id !== "0" && !selectedToken.approved) {
            getApprovedAddress();
        }

    }, [selectedToken, masqueradeContract, signer]);


    const handleDropdownChange = (e) => {
        setSelectedToken({
            id: e.target.value,
            approved: false
        });
        validateInput(e)
    }

    const handleChangeChatId = (e) => {
        setUserChatId(e.target.value);
        validateInput(e);
    }

    const handleButtonBack = () => {
        history.push("/");
    }

    const handleRedeemButton = async (e) => {
        e.preventDefault();

        setSendingTx(true);

        try {
            if (selectedToken.approved) {
                await masqueradeContract.connect(signer).requestNFTDecode(ORACLE_ADDRESS, JOB_ID, userChatId, selectedToken.id);
            } else {
                await masqueradeContract.connect(signer).approve(masqueradeContract.address, selectedToken.id);
            }

        } catch {

        }

        setSendingTx(false);
    }

    const TokenDropDown = () => {
        let items = [];

        for (let i in ownerTokenURIs) {
            items.push({ value: ownerTokenURIs[i].id, label: ownerTokenURIs[i].name });
        }

        if (items.length === 0) {
            items.push({ value: "0", label: "No Tokens Owned" });
        }

        return (
            <Field label="Select Token" validated={validated} width={1}>
                <Select
                    value={selectedToken.id}
                    onClick={handleDropdownChange}
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                    options={items} />
            </Field>
        )
    }

    const handleChatTooltip = () => {
        setIsChatModalOpen(!isChatModalOpen);
    }

    const sendButtonText = () => {
        if (sendingTx) {
            return <Loader color="white" />
        }

        return (
            <text style={{ fontFamily: 'Courier New', fontWeight: 500, fontSize: 24 }}> {selectedToken.approved ? "Redeem" : "Approve"} </text>
        )
    }

    return (
        <Fragment>
            <Form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>

                    <TokenDropDown />

                    <Field label="Telegram Chat ID" validated={validated} width={1}>
                        <Input
                            type="text"
                            required // set required attriute to use brower's HTML5 input validation
                            onChange={handleChangeChatId}
                            value={userChatId}
                            width={1}
                            name="chatId"
                        />
                        <text onClick={handleChatTooltip} style={{ fontSize: 12, padding: '8px', cursor: 'pointer' }}>Why do I need this?</text>
                    </Field>

                    <Flex flexWrap={"wrap"} style={{ paddingTop: '30px', textAlign: 'center' }}>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button mainColor="White" contrastColor="Black" onClick={handleRedeemButton} style={{ width: 150, marginLeft: '30px' }}>
                                {sendButtonText()}
                            </Button>
                        </Box>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button mainColor="White" contrastColor="Black" type="back" style={{ width: 150, marginRight: '30px' }} onClick={handleButtonBack}>
                                <text style={{ fontFamily: 'Courier New', fontWeight: 500, fontSize: 24 }}> Back </text>
                            </Button>
                        </Box>
                    </Flex>
                </Box>
            </Form>

            <ChatHelpModal isChatModalOpen={isChatModalOpen} setIsChatModalOpen={setIsChatModalOpen} />

        </Fragment>
    )
}
