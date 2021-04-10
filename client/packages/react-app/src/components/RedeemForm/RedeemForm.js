import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";

import { ChatHelpModal } from "../ChatHelpModal/ChatHelpModal";
import { BurnModal } from "../BurnModal/BurnModal";

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

    const ORACLE_ADDRESS = process.env.REACT_APP_ORACLE_ADDRESS;
    const JOB_ID = process.env.REACT_APP_JOB_ID;

    const { masqueradeContract, signer, ownerTokenURIs, setWaitingOnRedeem, setInvalidTx } = props;

    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [selectedToken, setSelectedToken] = useState({
        id: "0",
        approved: false
    });
    const [userChatId, setUserChatId] = useState('');
    const [sendingTx, setSendingTx] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);

    const validateInput = e => {
        e.target.parentNode.classList.add("was-validated");
    };

    const validateForm = () => {
        if (
            selectedToken.id !== "0" &&
            parseInt(userChatId) &&
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

    const confirmTokenBurn = async () => {

        setSendingTx(true);

        const burnTx = await masqueradeContract.connect(signer).requestNFTDecode(ORACLE_ADDRESS, JOB_ID, userChatId, selectedToken.id);
        const burnReceipt = await burnTx.wait();

        if (burnReceipt.status === 1) {
            setSelectedToken({
                id: "0",
                approved: false
            });

            window.scrollTo(0, 0);
            setWaitingOnRedeem(true);
            history.push("/");
        } else {
            setInvalidTx(true);
        }

        setSendingTx(false);
    }

    const handleRedeemButton = async (e) => {
        e.preventDefault();

        setSendingTx(true);

        if (selectedToken.approved) {
            setIsBurnModalOpen(true);
        } else {
            const approveTx = await masqueradeContract.connect(signer).approve(masqueradeContract.address, selectedToken.id);
            const approveReceipt = await approveTx.wait();

            if (approveReceipt.status !== 1) {
                setInvalidTx(true);
            } else {
                setSelectedToken({
                    ...selectedToken,
                    approved: true
                });
            }
        }

        setSendingTx(false);
    }

    const TokenDropDown = () => {
        let items = [{ value: "0", label: 'Select Token...' }];

        for (let i in ownerTokenURIs) {
            items.push({ value: ownerTokenURIs[i].id, label: ownerTokenURIs[i].name });
        }

        if (items.length === 1) {
            items.push({ value: "0", label: "No Tokens Owned" });
        }

        return (
            <Field label="Select Token" validated={validated} width={1}>
                <Select
                    value={selectedToken.id}
                    onChange={handleDropdownChange}
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
            return <Loader color="Black" size="30px" />
        }

        return (
            <text style={{ fontFamily: 'Fjalla One', fontWeight: 500, fontSize: 24 }}> {selectedToken.approved ? "Burn" : "Approve"} </text>
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

                    <Flex style={{ paddingTop: '30px', textAlign: 'center' }}>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button mainColor="White" contrastColor="Black" onClick={handleRedeemButton} disabled={!validated} style={{ width: 150, marginLeft: '30px' }}>
                                {sendButtonText()}
                            </Button>
                        </Box>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button mainColor="White" contrastColor="Black" type="back" style={{ width: 150, marginRight: '30px' }} onClick={handleButtonBack}>
                                <text style={{ fontFamily: 'Fjalla One', fontWeight: 500, fontSize: 24 }}> Back </text>
                            </Button>
                        </Box>
                    </Flex>
                </Box>
            </Form>

            <ChatHelpModal isChatModalOpen={isChatModalOpen} setIsChatModalOpen={setIsChatModalOpen} />
            <BurnModal isBurnModalOpen={isBurnModalOpen} setIsBurnModalOpen={setIsBurnModalOpen} confirmTokenBurn={confirmTokenBurn} />

        </Fragment>
    )
}
