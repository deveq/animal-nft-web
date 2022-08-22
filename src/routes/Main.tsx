import React, { FC, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();
  const onClickMint = async () => {
    try {
      if (!account) {
        return;
      }

      const response = await mintAnimalTokenContract.methods
        .mintAnimalToken()
        .send({ from: account });

      if (response.status) {
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(account)
          .call();
        const tokenId = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(account, balanceLength - 1)
          .call();
        const type = await onClickGetAnimalCard(tokenId);
        setNewAnimalType(type);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onClickGetAnimalCard = async (animalTokenId: number) => {
    const animalType = await mintAnimalTokenContract.methods
      .animalTypes(animalTokenId)
      .call();
    return animalType;
  };
  return (
    <Flex
      width="full"
      height="100vh"
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Box>
        {newAnimalType ? (
          <AnimalCard animalType={newAnimalType} />
        ) : (
          <Text>Let's mint animal card</Text>
        )}
      </Box>
      <Button mt={4} colorScheme="blue" size="sm" onClick={onClickMint}>
        Mint
      </Button>
    </Flex>
  );
};

export default Main;
