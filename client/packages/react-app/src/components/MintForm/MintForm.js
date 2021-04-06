import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import {
    Box,
    Flex,
    Form,
    Input,
    Field,
    Button,
} from "rimble-ui";

const axios = require('axios');

export const MintForm = (props) => {

    const { signer } = props;

    const history = useHistory();
    const fileInput = useRef(null);

    const [inputState, setInputState] = useState({
        title: '',
        description: '',
        image: null,
        message: ''
    })

    const [validated, setValidated] = useState(false);

    const validateInput = e => {
        e.target.parentNode.classList.add("was-validated");
    };

    const validateForm = () => {
        // Perform advanced validation here
        console.log(inputState)
        if (
            inputState.title.length > 0 &&
            inputState.description.length > 0 &&
            inputState.image !== null &&
            inputState.message.length > 0
        ) {
            setValidated(true);
        } else {
            setValidated(false);
        }
    };

    useEffect(() => {
        validateForm();
    });

    const handleMintFormSubmit = async (e) => {
        e.preventDefault();

        // NEED TO CHECK FOR JPEG FORMAT

        const formData = new FormData();

        const address = await signer.getAddress();

        formData.append("title", inputState.title);
        formData.append("desc", inputState.description);
        formData.append("image", inputState.image);
        formData.append("message", inputState.message);
        formData.append("owner", address);

        const response = await axios.post('http://34.105.216.144:3002/submit', formData);
        console.log(response);
    }

    const handleTextChange = (e) => {
        setInputState({
            ...inputState,
            [e.target.name]: e.target.value
        });
        validateInput(e);
    }

    const handleFileChange = (e) => {
        setInputState({
            ...inputState,
            [e.target.name]: e.target.files[0]
        });
        validateInput(e);
    }

    const handleButtonBack = () => {
        history.push("/");
    }

    return (
        <Form onSubmit={handleMintFormSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box width="60%">
                <Field label="Title" validated={validated} width={1}>
                    <Input
                        type="text"
                        required // set required attribute to use brower's HTML5 input validation
                        onChange={handleTextChange}
                        value={inputState.title}
                        width={1}
                        name="title"
                    />
                </Field>

                <Field label="Description" validated={validated} width={1}>
                    <Input
                        type="text"
                        required // set required attribute to use brower's HTML5 input validation
                        onChange={handleTextChange}
                        value={inputState.description}
                        width={1}
                        name="description"
                    />
                </Field>

                <Field label="Message" validated={validated} width={1}>
                    <Input
                        type="text"
                        required // set required attribute to use brower's HTML5 input validation
                        onChange={handleTextChange}
                        value={inputState.message}
                        width={1}
                        name="message"
                    />
                </Field>

                <Field label="Image File (.jpg)" validated={validated} width={1}>
                    <input
                        ref={fileInput}
                        onChange={handleFileChange}
                        name="image"
                        type="file"
                        style={{ display: "none" }}
                    />
                    <Button mainColor="White" contrastColor="Black" type="file" style={{ width: 250 }} onClick={(e) => fileInput.current && fileInput.current.click()} required>
                        <text style={{fontFamily: 'Courier New', fontWeight: 500, fontSize: 22 }}> Select File... </text>
                    </Button>
                </Field>


                <Flex flexWrap={"wrap"} style={{ paddingTop: '30px', textAlign: 'center' }}>
                    <Box width={[1, 1, 1 / 2]} px={3}>
                        <Button mainColor="White" contrastColor="Black" type="submit" disabled={!validated} style={{ width: 150, marginLeft: '30px' }}>
                            <text style={{fontFamily: 'Courier New', fontWeight: 500, fontSize: 24 }}> Mint </text>
                        </Button>
                    </Box>
                    <Box width={[1, 1, 1 / 2]} px={3}>
                        <Button mainColor="White" contrastColor="Black" type="back" style={{ width: 150, marginRight: '30px' }} onClick={handleButtonBack}>
                            <text style={{fontFamily: 'Courier New', fontWeight: 500, fontSize: 24 }}> Back </text>
                        </Button>
                    </Box>
                </Flex>


            </Box>
        </Form>
    )
}
