// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipOff {
    struct Tip {
        address sender;
        string title;
        string description;
        string imageURL;  
        string location;
        uint256 timestamp;
        bool tookAction;
    }

    address public owner; // Contract owner (can assign admins)
    mapping(address => bool) public admins; // Admin users (replacing police)

    Tip[] private tips; // Keep tips private

    event TipSubmitted(
        address indexed sender,
        string title,
        string description,
        string imageURL,
        string location,
        uint256 timestamp,
        bool tookAction
    );

    event ActionTaken(uint256 indexed tipIndex, bool tookAction);

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only authorized admins can access this.");
        _;
    }

    constructor() {
        owner = msg.sender; // The deployer is the contract owner
    }

    // Submit a tip
    function submitTip(
        string memory _title,
        string memory _description,
        string memory _imageURL,
        string memory _location
    ) public {
        tips.push(Tip(msg.sender, _title, _description, _imageURL, _location, block.timestamp, false));
        emit TipSubmitted(msg.sender, _title, _description, _imageURL, _location, block.timestamp, false);
    }

    // Get tips submitted by the sender (only their own tips)
    function getMyTips() public view returns (Tip[] memory) {
        uint count = 0;
        
        // Count how many tips belong to the sender
        for (uint i = 0; i < tips.length; i++) {
            if (tips[i].sender == msg.sender) {
                count++;
            }
        }

        // Create an array with the sender's tips
        Tip[] memory myTips = new Tip[](count);
        uint index = 0;

        for (uint i = 0; i < tips.length; i++) {
            if (tips[i].sender == msg.sender) {
                myTips[index] = tips[i];
                index++;
            }
        }

        return myTips;
    }

    // Get all tips (only admins can access)
    function getAllTips() public view onlyAdmin returns (Tip[] memory) {
        return tips;
    }

    // Mark a tip as action taken (only admins can update)
    function markActionTaken(uint256 tipIndex) public onlyAdmin {
        require(tipIndex < tips.length, "Invalid tip index");
        tips[tipIndex].tookAction = true;
        emit ActionTaken(tipIndex, true);
    }

    // Assign admin roles (only owner can do this)
    function assignAdmin(address _admin) public {
        require(msg.sender == owner, "Only owner can assign admins");
        admins[_admin] = true;
    }

    // Remove admin roles
    function removeAdmin(address _admin) public {
        require(msg.sender == owner, "Only owner can remove admins");
        admins[_admin] = false;
    }
}