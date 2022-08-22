import React, { FC, useEffect, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";

interface MyAnimalProps {
  account?: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardsArray, setAnimalCardsArray] = useState<string[]>([]);
  const getAnimalTokens = async () => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(account)
        .call();
      const tokenIndexes = [];
      for (let i = 0; i < parseInt(balanceLength, 10); i++) {
        tokenIndexes.push(
          mintAnimalTokenContract.methods.tokenOfOwnerByIndex(account, i).call()
        );
      }
      const response = await Promise.all(tokenIndexes);
      const animalTypes = response.map((tokenId) => {
        return mintAnimalTokenContract.methods.animalTypes(tokenId).call();
      });

      const types = await Promise.all(animalTypes);
      setAnimalCardsArray(types);
    } catch (error) {
      console.error(error, "error");
    }
  };

  useEffect(() => {
    if (account) {
      getAnimalTokens();
    }
  }, [account]);

  useEffect(() => {
    console.log(animalCardsArray);
  }, [animalCardsArray]);
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap="8">
      {animalCardsArray.length > 0 ? (
        animalCardsArray.map((type, index) => (
          <AnimalCard key={`${type}_${index}`} animalType={type} />
        ))
      ) : (
        <div>My Animal</div>
      )}
    </Grid>
  );
};

export default MyAnimal;
