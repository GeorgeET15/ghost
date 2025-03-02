import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import UserDashboard from "./components/UserDashboard";
import UserTips from "./components/UserTips";
import AdminPanel from "./components/AdminPanel";

// Hardhat account data (address -> private key mapping)
const HARDHAT_ACCOUNTS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey:
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey:
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    privateKey:
      "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  },
  {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    privateKey:
      "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
  },
  {
    address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    privateKey:
      "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  },
  {
    address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    privateKey:
      "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
  },
  {
    address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    privateKey:
      "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
  },
  {
    address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    privateKey:
      "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
  },
  {
    address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    privateKey:
      "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
  },
  {
    address: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
    privateKey:
      "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897",
  },
  {
    address: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    privateKey:
      "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
  },
  {
    address: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    privateKey:
      "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1",
  },
  {
    address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    privateKey:
      "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
  },
  {
    address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    privateKey:
      "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa",
  },
  {
    address: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
    privateKey:
      "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61",
  },
  {
    address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    privateKey:
      "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
  },
  {
    address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    privateKey:
      "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd",
  },
  {
    address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    privateKey:
      "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
  },
  {
    address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    privateKey:
      "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
  },
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CONTRACT_ABI = [
    "function owner() public view returns (address)",
    "function admins(address) public view returns (bool)",
    "function submitTip(string _title, string _description, string _imageURL, string _location) public",
    "function getMyTips() public view returns (tuple(address sender, string title, string description, string imageURL, string location, uint256 timestamp, bool tookAction)[])",
    "function getAllTips() public view returns (tuple(address sender, string title, string description, string imageURL, string location, uint256 timestamp, bool tookAction)[])",
    "function markActionTaken(uint256 tipIndex) public",
    "function assignAdmin(address _admin) public",
    "function removeAdmin(address _admin) public",
    "event TipSubmitted(address indexed sender, string title, string description, string imageURL, string location, uint256 timestamp, bool tookAction)",
    "event ActionTaken(uint256 indexed tipIndex, bool tookAction)",
  ];

  useEffect(() => {
    const initializeConnection = async () => {
      const storedAccount = localStorage.getItem("connectedAccount");
      if (storedAccount) {
        try {
          const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
          const accountData = HARDHAT_ACCOUNTS.find(
            (acc) => acc.address.toLowerCase() === storedAccount.toLowerCase()
          );
          const signer = accountData
            ? new ethers.Wallet(accountData.privateKey, provider)
            : new ethers.Wallet(HARDHAT_ACCOUNTS[0].privateKey, provider);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          const accountAddress = await signer.getAddress();

          if (accountAddress.toLowerCase() === storedAccount.toLowerCase()) {
            setProvider(provider);
            setSigner(signer);
            setContract(contract);
            setAccount(accountAddress);
            setConnectionError(null);
          }
        } catch (error) {
          console.error("Reconnection error:", error);
          setConnectionError("Failed to reconnect. Please try again.");
        }
      }
    };
    initializeConnection();
  }, []);

  useEffect(() => {
    if (signer && contract && account) checkRoles();
  }, [signer, contract, account]);

  const connectWallet = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

      let signer;
      if (walletAddress && ethers.isAddress(walletAddress)) {
        const accountData = HARDHAT_ACCOUNTS.find(
          (acc) => acc.address.toLowerCase() === walletAddress.toLowerCase()
        );
        if (!accountData) {
          throw new Error(
            "Provided wallet address not found among the 20 Hardhat accounts."
          );
        }
        signer = new ethers.Wallet(accountData.privateKey, provider);
      } else {
        signer = new ethers.Wallet(HARDHAT_ACCOUNTS[0].privateKey, provider); // Default to Account #0
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const accountAddress = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAccount(accountAddress);
      setConnectionError(null);
      setWalletAddress("");

      localStorage.setItem("connectedAccount", accountAddress);
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionError(
        error.message || "Failed to connect to Hardhat node. Is it running?"
      );
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setIsAdmin(false);
    setIsOwner(false);
    setConnectionError(null);
    setWalletAddress("");
    localStorage.removeItem("connectedAccount");
  };

  const checkRoles = async () => {
    try {
      if (!contract || !signer) return;
      const contractWithSigner = contract.connect(signer);
      const adminStatus = await contractWithSigner.admins(account);
      const owner = await contractWithSigner.owner();
      setIsAdmin(adminStatus);
      setIsOwner(account.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error("Role check error:", error);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-950">
        <Navbar
          account={account}
          isAdmin={isAdmin}
          isOwner={isOwner}
          disconnectWallet={disconnectWallet}
        />
        <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6">
          {!account ? (
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-4">
                Welcome to G.H.O.S.T
              </h2>
              <p className="text-base sm:text-lg text-gray-300 mb-6">
                Share tips securely with blockchain technology.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter a Hardhat account address (e.g., 0xf39F...2266)"
                  className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition duration-300"
                />
                <button
                  onClick={connectWallet}
                  className="bg-green-950 text-gray-200 font-medium py-2 px-6 rounded-lg border border-green-900 hover:bg-green-900 transition duration-300 w-full sm:w-auto"
                >
                  Connect Wallet
                </button>
              </div>
              {connectionError && (
                <p className="text-red-400 mt-4 animate-pulse text-sm sm:text-base">
                  {connectionError}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full max-w-lg mx-auto text-center">
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <UserDashboard contract={contract} signer={signer} />
                  }
                />
                <Route
                  path="/tips"
                  element={<UserTips contract={contract} signer={signer} />}
                />
                <Route
                  path="/admin"
                  element={
                    isAdmin || isOwner ? (
                      <AdminPanel
                        contract={contract}
                        signer={signer}
                        isOwner={isOwner}
                        account={account}
                      />
                    ) : (
                      <Navigate to="/dashboard" />
                    )
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          )}
        </main>
        <footer className="bg-gray-950 text-gray-400 py-4 border-t border-gray-800">
          <div className="container mx-auto text-center text-sm sm:text-base">
            <p>© 2025 G.H.O.S.T. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
