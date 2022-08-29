import { Grid } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { IMyAnimalCard } from "../components/MyAnimalCard";
import SaleAnimalCard from "../components/SaleAnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenContract } from "../contracts";

interface SaleAnimalProps {
  account: string;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
  const [saleAnimalCardArray, setSaleAnimalCardArray] = useState<
    IMyAnimalCard[]
  >([]);

  const getOnSaleAnimalCards = async () => {
    try {
      const onSaleAnimalTokens = await saleAnimalTokenContract.methods
        .getOnSaleAnimalTokens()
        .call();

      const tempOnSaleAnimalTokens: IMyAnimalCard[] = [];

      onSaleAnimalTokens.forEach((data: IMyAnimalCard) => {
        tempOnSaleAnimalTokens.push({
          animalPrice: data.animalPrice,
          animalTokenId: data.animalTokenId,
          animalType: data.animalType,
        });
      });

      setSaleAnimalCardArray(tempOnSaleAnimalTokens);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleAnimalCards();
  }, []);

  useEffect(() => {
    console.log(saleAnimalCardArray);
  }, [saleAnimalCardArray]);

  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={4}>
      {saleAnimalCardArray &&
        saleAnimalCardArray.map((v, i) => {
          return (
            <SaleAnimalCard
              key={`${i}`}
              animalType={v.animalType}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              account={account}
              getOnSaleAnimalCards={getOnSaleAnimalCards}
            />
          );
        })}
    </Grid>
  );
};

export default SaleAnimal;
