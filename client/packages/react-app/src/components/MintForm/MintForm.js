import React, { useState } from "react";

const axios = require('axios');

export const MintForm = (props) => {

    const { signer } = props;

    const [inputState, setInputState] = useState({
        title: '',
        description: '',
        image: null,
        message: ''
    })

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
    }

    const handleFileChange = (e) => {
        setInputState({
            ...inputState,
            [e.target.name]: e.target.files[0]
        });
    }

    return (
        <form onSubmit={handleMintFormSubmit}>
            <label>
                Title:
    <input type="text" value={inputState.title} onChange={handleTextChange} name="title" />
            </label>
            <label>
                Description:
    <input type="text" value={inputState.description} onChange={handleTextChange} name="description" />
            </label>
            <label>
                Image:
    <input type="file" onChange={handleFileChange} name="image" />
            </label>
            <label>
                Message:
    <input type="text" value={inputState.message} onChange={handleTextChange} name="message" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}
