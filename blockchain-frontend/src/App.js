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

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  // ② Local state
  const [wallet, setWallet] = useState("");
  const [productId, setProductId] = useState("");
  const [inventory, setInventory] = useState("");
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();

  // ③ Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new BrowserProvider(window.ethereum);
    const [acct] = await provider.send("eth_requestAccounts", []);
    setWallet(acct);
    toast({ title: "Wallet connected", status: "success" });
  };

  // ④ Add product
  const addProduct = async () => {
    if (!productId || !inventory) {
      return toast({
        title: "Missing fields",
        description: "ID, Inventory & Status required",
        status: "warning",
      });
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        CONTRACT_ADDRESS,
        TrackShipment.abi,
        signer
      );
      const tx = await contract.addProduct(
        Number(productId),
        Number(inventory),
      );
      await tx.wait();
      toast({ title: "Product added", status: "success" });
      setInventory("");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  // ⑤ Fetch product & its transactions
  const fetchProductData = async () => {
    if (!productId) return alert("Enter product ID");
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(
        CONTRACT_ADDRESS,
        TrackShipment.abi,
        provider
      );
      // auto-generated getter for mapping
      const p = await contract.products(Number(productId));
      setInventory(p.Inventory_Level.toString());

      const txs = await contract.getTransactions(Number(productId));
      // txs is an array of tuples matching your Transaction struct
      setTransactions(
        txs.map((t) => ({
          amount: t.User_Transaction_Amount.toString(),
          delay: t.Logistics_Delay,
          reason: t.Logistics_Delay_Reason,
          time: new Date(t.Timestamp.toNumber() * 1000).toLocaleString(),
          from: t.sender,
          to: t.receiver,
          location: t.location,
          status: t.Shipment_Status,
          asset: t.Asset_ID,
        }))
      );
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to fetch", description: err.message, status: "error" });
    }
  };

  return (
 
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#0d0d0d" p={6}>
      <VStack spacing={6} maxW="lg" mx="auto" bg="#1f2230" p={8} rounded="xl" shadow="xl" w="full">
        <Heading fontFamily="heading" color="brand.500">
          🚚 Supply Chain Tracker
        </Heading>

          <Button
            onClick={connectWallet}
            colorScheme="brand"
            variant="outline"
            w="full"
          >
            {wallet
              ? `Connected: ${wallet.slice(0, 6)}…${wallet.slice(-4)}`
              : "Connect MetaMask"}
          </Button>

          {/* Add / update product */}
          <Input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            bg="white"
            color="black"
          />
          <Input
            placeholder="Inventory Level"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            bg="white"
            color="black"
          />
          <Button colorScheme="green" w="full" onClick={addProduct}>
            Add / Update Product
          </Button>
          <Button colorScheme="purple" w="full" onClick={fetchProductData}>
            Fetch Product & Transactions
          </Button>
          {transactions.length > 0 && (
            <Box w="full" bg="#2d3142" p={4} rounded="md" overflowY="auto" maxH="40vh">
              <Heading size="sm" color="brand.500" mb={2}>
                Transaction History
              </Heading>
              {transactions.map((t, i) => (
                <Box key={i} p={2} bg="#1f2230" mb={2} rounded="md">
                  <Text><strong>Time:</strong> {t.time}</Text>
                  <Text><strong>From:</strong> {t.from}</Text>
                  <Text><strong>To:</strong> {t.to}</Text>
                  <Text><strong>Amount:</strong> {t.amount}</Text>
                  <Text><strong>Delay:</strong> {t.delay ? "Yes" : "No"}</Text>
                  {t.delay && <Text><strong>Reason:</strong> {t.reason}</Text>}
                  <Text><strong>Location:</strong> {t.location}</Text>
                  <Text><strong>Asset ID:</strong> {t.asset}</Text>
                  <Text><strong>Status:</strong> {t.status}</Text>
                </Box>
              ))}
            </Box>
          )}
        </VStack>
      </Box>
  );
}

export default App;
