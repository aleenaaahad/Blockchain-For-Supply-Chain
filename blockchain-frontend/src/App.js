import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import TrackShipment from "C:/Users/16692/Projects/Blockchain-For-Supply-Chain/Blockchain-For-Supply-Chain-1/blockchain-frontend/src/Contracts/TrackShipment.json";

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace this!

function App() {
  const [wallet, setWallet] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const toast = useToast();

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWallet(accounts[0]);
    toast({
      title: "Wallet Connected",
      description: `${accounts[0]}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const addShipment = async () => {
    if (!shipmentId || !description) {
      return toast({
        title: "Missing Fields",
        description: "Enter both shipment ID and description",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, TrackShipment.abi, signer);

      const tx = await contract.addShipment(shipmentId, description);
      await tx.wait();

      toast({
        title: "Shipment Added",
        description: `ID ${shipmentId}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setShipmentId("");
      setDescription("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Transaction failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkStatus = async () => {
    if (!shipmentId) return alert("Enter a shipment ID first");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, TrackShipment.abi, provider);
      const result = await contract.getShipmentStatus(shipmentId);
      setStatus(result);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg="background" px={4} py={10} color="white" fontFamily="body">
      <Box
        maxW="lg"
        mx="auto"
        p={8}
        bg="#1f2230"
        rounded="xl"
        shadow="xl"
        border="1px solid #3e4c59"
      >
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center" fontFamily="heading" color="brand.500">
            🚚 Supply Chain Tracker
          </Heading>

          <Button
            onClick={connectWallet}
            colorScheme="brand"
            variant="outline"
            fontWeight="bold"
            fontFamily="body"
          >
            {wallet
              ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`
              : "Connect MetaMask"}
          </Button>

          <Input
            placeholder="Shipment ID"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            bg="white"
            color="black"
            _placeholder={{ color: "gray.500" }}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            bg="white"
            color="black"
            _placeholder={{ color: "gray.500" }}
          />

          <Button colorScheme="green" onClick={addShipment}>
            Add Shipment
          </Button>
          <Button colorScheme="purple" onClick={checkStatus}>
            Check Status
          </Button>

          {status && (
            <Box p={4} bg="gray.700" rounded="md" mt={2} textAlign="center">
              <Text>Status: <strong>{status}</strong></Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default App;
