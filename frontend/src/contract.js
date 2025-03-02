export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update if redeployed
export const CONTRACT_ABI = [
  "function submitTip(string _title, string _description, string _imageURL, string _location) public",
  "function getMyTips() public view returns (tuple(address sender, string title, string description, string imageURL, string location, uint256 timestamp, bool tookAction)[])",
  "function getAllTips() public view returns (tuple(address sender, string title, string description, string imageURL, string location, uint256 timestamp, bool tookAction)[])",
  "function markActionTaken(uint256 tipIndex) public",
  "function assignAdmin(address _admin) public",
  "function removeAdmin(address _admin) public",
  "function admins(address) public view returns (bool)",
  "function owner() public view returns (address)",
];
