import React from "react";

import { Box, Flex, Modal, Button, Card } from "rimble-ui";

export const BurnModal = (props) => {

    const { isBurnModalOpen, setIsBurnModalOpen, confirmTokenBurn } = props;

    const handleCloseBurnModal = () => {
        setIsBurnModalOpen(false);
    }

    const handleConfirmBurn = () => {
        setIsBurnModalOpen(false);
        confirmTokenBurn();
    }

    return (
        <Box p={4}>
        <Box>
          <Modal isOpen={isBurnModalOpen}>
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
                onClick={handleCloseBurnModal}
              />
  
              <Box p={4} mb={3}>
                <h3> Confirm Burn </h3>
                <p style={{fontFamily: 'Fjalla One'}}> You are about to burn this token and unlock the secret message.</p> 
                <p style={{fontFamily: 'Fjalla One'}}> This will destroy your NFT. </p>
                <p style={{fontFamily: 'Fjalla One', paddingTop: '10px'}}> Are you sure? </p>
              </Box>
  
              <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
              >
                <Button mainColor="Black" contrastColor="White" onClick={handleConfirmBurn}>Confirm Burn</Button>
              </Flex>
            </Card>
          </Modal>
        </Box>
      </Box>
    )
}