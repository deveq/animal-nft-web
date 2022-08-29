import { Box, Button, Text } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
  web3,
} from "../contracts";
import AnimalCard from "./AnimalCard";
import { IMyAnimalCard } from "./MyAnimalCard";

interface SaleAnimalCardProps extends IMyAnimalCard {
  account?: string;
  getOnSaleAnimalCards: () => Promise<void>;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  animalPrice,
  animalTokenId,
  animalType,
  account,
  getOnSaleAnimalCards,
}) => {
  const [isBuyable, setIsBuyable] = useState(false);

  const getAnimalTokenOwner = async () => {
    try {
      const owner = await mintAnimalTokenContract.methods
        .ownerOf(animalTokenId)
        .call();

      setIsBuyable(owner.toLowerCase() !== account?.toLowerCase());
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!account) return;
      const response = await saleAnimalTokenContract.methods
        .purchase(animalTokenId)
        .send({ from: account, value: animalPrice });
      if (response.status) {
        // setIsBuyable(false);
        getOnSaleAnimalCards();
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAnimalTokenOwner();
  }, []);

  return (
    // <Box textAlign={"center"} w={150}>
    <Box alignItems={"center"} w={150}>
      <AnimalCard animalType={animalType} />
      <Box justifyContent={"center"} alignItems="center">
        <Text display="inline-block" justifyContent="center">
          {web3.utils.fromWei(animalPrice, "ether")} Matic
        </Text>
        <Button
          size="sm"
          colorScheme="green"
          mt={2}
          disabled={!isBuyable}
          onClick={onClickBuy}
        >
          Buy
        </Button>
      </Box>
    </Box>
  );
};
export default SaleAnimalCard;
