import React, { PropsWithChildren, FC } from "react";
import { Stack, Flex, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack h="100vh">
      <Flex
        bg={"royalblue"}
        p={4}
        justifyContent="space-around"
        alignItems="center"
      >
        <Box>
          <Text fontWeight={"bold"}>h662 Animal</Text>
        </Box>
        <Link to="/">
          <Button size="sm" colorScheme="blue">
            Main
          </Button>
        </Link>
        <Link to="my-animal">
          <Button size="sm" colorScheme="red">
            My Animal
          </Button>
        </Link>
        <Link to="sale-animal">
          <Button size="sm" colorScheme="green">
            Sale Animal
          </Button>
        </Link>
      </Flex>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {children}
      </Flex>
    </Stack>
  );
};

export default Layout;
