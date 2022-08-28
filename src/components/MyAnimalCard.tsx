import React, { ChangeEvent, FC, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import AnimalCard from "./AnimalCard";
import { saleAnimalTokenContract, web3 } from "../contracts";

export interface IMyAnimalCard {
  animalTokenId: string;
  animalType: string;
  animalPrice: string;
}

interface MyAnimalCardProp extends IMyAnimalCard {
  saleStatus: boolean;
  account?: string;
}

const MyAnimalCard: FC<MyAnimalCardProp> = ({
  animalType,
  animalPrice,
  animalTokenId,
  saleStatus,
  account,
}) => {
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myAnimalPrice, setMyAnimalPrice] = useState(animalPrice);
  const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(e.target.value);
  };

  const onClickSell = async () => {
    try {
      if (!account || !saleStatus) return;
      const maticToWeiPrice = web3.utils.toWei(sellPrice, "ether");
      const response = await saleAnimalTokenContract.methods
        .setForSaleAnimalToken(animalTokenId, maticToWeiPrice)
        .send({ from: account });
      if (response.status) {
        setMyAnimalPrice(maticToWeiPrice);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box textAlign={"center"} w={150}>
      <AnimalCard animalType={animalType} />
      <Box mt={2}>
        {/* {animalPrice === "0" ? ( */}
        {myAnimalPrice === "0" ? (
          <>
            <InputGroup>
              <Input
                type="number"
                value={sellPrice}
                onChange={onChangeSellPrice}
              />
              <InputRightAddon children="Matic" />
            </InputGroup>
            <Button size="sm" colorScheme="green" mt={2} onClick={onClickSell}>
              Sell
            </Button>
          </>
        ) : (
          //   <div>판매중인 가격 : {animalPrice}</div>
          <Text display="inline-block">
            {/* {web3.utils.fromWei(animalPrice, "ether")}Matic */}
            {web3.utils.fromWei(myAnimalPrice, "ether")}Matic
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyAnimalCard;
