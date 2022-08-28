import React, { FC, useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenAddress,
  saleAnimalTokenContract,
} from "../contracts";
import AnimalCard from "../components/AnimalCard";
import MyAnimalCard, { IMyAnimalCard } from "../components/MyAnimalCard";

interface MyAnimalProps {
  account?: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardsArray, setAnimalCardsArray] = useState<IMyAnimalCard[]>([]);
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getAnimalTokens = async () => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(account)
        .call();

      if (balanceLength === "0") return;

      const response = await mintAnimalTokenContract.methods
        .getAnimalTokens(account)
        .call();

      const tempAnimalCardArray: IMyAnimalCard[] = [];

      response.forEach((data: IMyAnimalCard) => {
        tempAnimalCardArray.push({
          animalTokenId: data.animalTokenId,
          animalPrice: data.animalPrice,
          animalType: data.animalType,
        });
      });

      setAnimalCardsArray(tempAnimalCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getIsApprovedForAll = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        .isApprovedForAll(account, saleAnimalTokenAddress)
        .call();
      console.log(response);
      if (response) {
        setSaleStatus(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;

      const response = await mintAnimalTokenContract.methods
        // .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        .send({ from: account });

      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (account) {
      // getAnimalTokens();
      getAnimalTokens();
      getIsApprovedForAll();
      getAnimalTokens();
    }
  }, [account]);

  useEffect(() => {
    console.log(animalCardsArray);
  }, [animalCardsArray]);
  return (
    <>
      <Flex alignItems="center">
        <Text>Sale Status : {saleStatus ? "true" : "false"} </Text>
        <Button
          size="xs"
          ml={2}
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickApproveToggle}
        >
          {saleStatus ? "cancel" : "approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap="8">
        {animalCardsArray.length > 0 &&
          animalCardsArray.map((v, i) => (
            <MyAnimalCard
              key={`${i}`}
              animalType={v.animalType}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              saleStatus={saleStatus}
              account={account}
            />
          ))}
      </Grid>
    </>
  );
};

export default MyAnimal;
