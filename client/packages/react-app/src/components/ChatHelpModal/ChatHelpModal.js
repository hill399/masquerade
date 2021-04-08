import React from "react";

import { Box, Flex, Modal, Button, Card } from "rimble-ui";

import telegram from "../../icons/telegram.svg";

export const ChatHelpModal = (props) => {

    const { isChatModalOpen, setIsChatModalOpen } = props;

    const handleCloseChatModal = () => {
        setIsChatModalOpen(false);
    }

    return (
        <Box p={4}>
        <Box>
          <Modal isOpen={isChatModalOpen}>
            <Card width={"420px"} p={0}>
              <Button.Text
                icononly
                icon={"Close"}
                color={"moon-gray"}
                position={"absolute"}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={handleCloseChatModal}
              />
  
              <Box p={4} mb={3}>
                <h3> Telegram Message Delivery </h3>
                <p style={{fontFamily: 'Fjalla One'}}> Masquerade uses the Telegram platform to safely deliver secrets to you.</p> 
                <p style={{fontFamily: 'Fjalla One'}}> Start a chat with the Masquerade Bot to receive your unique chat ID. </p>
                <p style={{fontFamily: 'Courier New', paddingTop: '10px'}}> t.me/MasqueradeDeliveryBot </p>
                <img src={telegram} id="telegramIcon" alt="telegram" style={{ cursor: "pointer"}} onClick={() => window.open('http://t.me/MasqueradeDeliveryBot')} />
              </Box>
  
              <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
              >
                <Button mainColor="Black" contrastColor="White" onClick={handleCloseChatModal}>Okay</Button>
              </Flex>
            </Card>
          </Modal>
        </Box>
      </Box>
    )
}