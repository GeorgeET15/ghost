const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipOff Contract", function () {
  let TipOff, tipOff, owner, addr1, addr2, addr3;

  const sampleTip = {
    title: "Suspicious Activity",
    description: "Saw something odd near the park.",
    imageURL: "https://example.com/image.jpg",
    location: "Central Park",
  };

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    TipOff = await ethers.getContractFactory("TipOff");
    tipOff = await TipOff.deploy();
    await tipOff.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await tipOff.owner()).to.equal(owner.address);
    });

    it("should not set any admins by default", async function () {
      expect(await tipOff.admins(addr1.address)).to.be.false;
    });
  });

  describe("Tip Submission", function () {
    it("should allow a user to submit a tip", async function () {
      await tipOff
        .connect(addr1)
        .submitTip(
          sampleTip.title,
          sampleTip.description,
          sampleTip.imageURL,
          sampleTip.location
        );

      const myTips = await tipOff.connect(addr1).getMyTips();
      expect(myTips.length).to.equal(1);
      expect(myTips[0].title).to.equal(sampleTip.title);
      expect(myTips[0].description).to.equal(sampleTip.description);
      expect(myTips[0].imageURL).to.equal(sampleTip.imageURL);
      expect(myTips[0].location).to.equal(sampleTip.location);
      expect(myTips[0].sender).to.equal(addr1.address);
      expect(myTips[0].tookAction).to.be.false;
    });

    it("should emit TipSubmitted event", async function () {
      const tx = await tipOff
        .connect(addr1)
        .submitTip(
          sampleTip.title,
          sampleTip.description,
          sampleTip.imageURL,
          sampleTip.location
        );
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      const timestamp = block.timestamp;

      await expect(tx)
        .to.emit(tipOff, "TipSubmitted")
        .withArgs(
          addr1.address,
          sampleTip.title,
          sampleTip.description,
          sampleTip.imageURL,
          sampleTip.location,
          timestamp,
          false
        );
    });
  });

  describe("Get My Tips", function () {
    it("should return only the sender's tips", async function () {
      await tipOff
        .connect(addr1)
        .submitTip(
          sampleTip.title,
          sampleTip.description,
          sampleTip.imageURL,
          sampleTip.location
        );

      await tipOff
        .connect(addr2)
        .submitTip(
          "Another Tip",
          "Different description",
          "https://example.com/another.jpg",
          "Downtown"
        );

      const addr1Tips = await tipOff.connect(addr1).getMyTips();
      const addr2Tips = await tipOff.connect(addr2).getMyTips();

      expect(addr1Tips.length).to.equal(1);
      expect(addr2Tips.length).to.equal(1);
      expect(addr1Tips[0].title).to.equal(sampleTip.title);
      expect(addr2Tips[0].title).to.equal("Another Tip");
    });

    it("should return an empty array if no tips exist for sender", async function () {
      const myTips = await tipOff.connect(addr1).getMyTips();
      expect(myTips.length).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      await tipOff.connect(owner).assignAdmin(addr1.address);
      await tipOff
        .connect(addr2)
        .submitTip(
          sampleTip.title,
          sampleTip.description,
          sampleTip.imageURL,
          sampleTip.location
        );
    });

    it("should allow owner to assign and remove admins", async function () {
      expect(await tipOff.admins(addr1.address)).to.be.true;
      await tipOff.connect(owner).removeAdmin(addr1.address);
      expect(await tipOff.admins(addr1.address)).to.be.false;
    });

    it("should prevent non-owners from assigning admins", async function () {
      await expect(
        tipOff.connect(addr2).assignAdmin(addr3.address)
      ).to.be.revertedWith("Only owner can assign admins");
    });

    it("should allow admins to view all tips", async function () {
      const allTips = await tipOff.connect(addr1).getAllTips();
      expect(allTips.length).to.equal(1);
      expect(allTips[0].sender).to.equal(addr2.address);
      expect(allTips[0].title).to.equal(sampleTip.title);
    });

    it("should prevent non-admins from viewing all tips", async function () {
      await expect(tipOff.connect(addr2).getAllTips()).to.be.revertedWith(
        "Only authorized admins can access this."
      );
    });

    it("should allow admins to mark action taken", async function () {
      await tipOff.connect(addr1).markActionTaken(0);
      const allTips = await tipOff.connect(addr1).getAllTips();
      expect(allTips[0].tookAction).to.be.true;
    });

    it("should emit ActionTaken event", async function () {
      await expect(tipOff.connect(addr1).markActionTaken(0))
        .to.emit(tipOff, "ActionTaken")
        .withArgs(0, true);
    });

    it("should prevent non-admins from marking action taken", async function () {
      await expect(tipOff.connect(addr2).markActionTaken(0)).to.be.revertedWith(
        "Only authorized admins can access this."
      );
    });

    it("should revert if tip index is invalid", async function () {
      await expect(tipOff.connect(addr1).markActionTaken(1)).to.be.revertedWith(
        "Invalid tip index"
      );
    });
  });
});
