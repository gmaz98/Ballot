import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballotFactory.deploy(
        PROPOSALS.map(ethers.encodeBytes32String)
    );
    await ballotContract.waitForDeployment();
    return ballotContract;
}
describe("Ballot", async () => {
    let ballotContract: Ballot;

    beforeEach(async () => {
        ballotContract = await loadFixture(deployContract);
    });

    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.decodeBytes32String(proposal.name)).to.eq(
                    PROPOSALS[index]
                );
            }
        });

        it("has zero votes for all proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(proposal.voteCount).to.eq(0);
            }
        });

        it("sets the deployer address as chairperson", async () => {
            const accounts = await ethers.getSigners();
            expect(await ballotContract.chairperson()).to.eq(accounts[0].address)

        });
        it("sets the voting weight for the chairperson as 1", async () => {
            const chairpersonAddress = await ballotContract.chairperson();
            const chairpersonWeight = (await ballotContract.voters(chairpersonAddress)).weight;
            expect(chairpersonWeight).to.eq(1);
        });
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
        it("gives right to vote for another address", async () => {
            const accounts = await ethers.getSigners();
            await ballotContract.giveRightToVote(accounts[1].address);
            const newVoterWeight = (await ballotContract.voters(accounts[1].address)).weight;
            expect(newVoterWeight).to.eq(1);
        });
        it("can not give right to vote for someone that has voted", async () => {
            const accounts = await ethers.getSigners();
            await ballotContract.giveRightToVote(accounts[1].address);
            await ballotContract.connect(accounts[1]).vote(0);
            await expect(ballotContract.giveRightToVote(accounts[1].address)).to.be.revertedWith(
                "The voter already voted.")
        });
        it("can not give right to vote for someone that has already voting rights", async () => {
            const accounts = await ethers.getSigners();
            await ballotContract.giveRightToVote(accounts[1].address);
            await expect(ballotContract.giveRightToVote(accounts[1].address)).to.be.reverted;  //why im not managing to put a revert in ballot contract and show here it reverts with that error?
        });
    });

    describe("when the voter interacts with the vote function in the contract", async () => {
        it("should register the vote", async () => {
            const accounts = await ethers.getSigners();
            const proposalIndex = PROPOSALS.indexOf("Proposal 1");
            await ballotContract.connect(accounts[0]).vote(proposalIndex);
            const updatedProposal = await ballotContract.proposals(proposalIndex);
            const afterVoteProposalVoteCount = updatedProposal.voteCount;
            expect(afterVoteProposalVoteCount).to.equal(1);
        });
    });

    describe("when the voter interacts with the delegate function in the contract", async () => {
        // TODO
        it("should transfer voting power", async () => {
            const accounts = await ethers.getSigners();
            await ballotContract.giveRightToVote(accounts[1].address);
            await ballotContract.connect(accounts[0]).delegate(accounts[1].address);
            const delegatedAccountVoter = await ballotContract.voters(accounts[1].address);
            expect(delegatedAccountVoter.weight).to.eq(2);


        });
    });

    describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            const accounts = await ethers.getSigners();
            await expect(ballotContract.connect(accounts[1]).giveRightToVote(accounts[2].address)).to.be.revertedWith("Only chairperson can give right to vote.");
        });
    });

    describe("when an account without right to vote interacts with the vote function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            const accounts = await ethers.getSigners();
            const proposalIndex = PROPOSALS.indexOf("Proposal 1");
            await expect(ballotContract.connect(accounts[1]).vote(proposalIndex)).to.be.revertedWith("Has no right to vote");

        });
    });

    describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
        // TODO
        it("should revert", async () => {
            const accounts = await ethers.getSigners();
            await expect(ballotContract.connect(accounts[1]).delegate(accounts[2].address)).to.be.reverted;
        });
    });

    describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
        // TODO
        it("should return 0", async () => {
            const accounts = await ethers.getSigners();
            expect(await ballotContract.winningProposal()).to.eq(0);

        });
    });

    describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
        // TODO
        it("should return 0", async () => {
            const accounts = await ethers.getSigners();
            const proposalIndex = PROPOSALS.indexOf("Proposal 1");
            await ballotContract.vote(proposalIndex);
            expect(await ballotContract.winningProposal()).to.eq(proposalIndex);
        });
    });

    describe("when someone interacts with the winnerName function before any votes are cast", async () => {
        //winningProposal_ variable remains 0, indicating the first proposal. the for loop never finishes?????
        it("should return name of proposal 0", async () => {
            const proposal = PROPOSALS[0];
            const name = await ballotContract.winnerName();
            expect(ethers.decodeBytes32String(name)).to.be.eq(proposal);



        });
    });

    describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
        // TODO
        it("should return name of proposal 0", async () => {
            const accounts = await ethers.getSigners();
            await ballotContract.vote(0);
            const proposal = PROPOSALS[0];
            const name = await ballotContract.winnerName();
            expect(ethers.decodeBytes32String(name)).to.be.eq(proposal);

        });
    });

    describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
        // Not really random but every proposal was voted so kinda explains the purpose of the test. 
        it("should return the name of the winner proposal", async () => {
            const accounts = await ethers.getSigners();

            await ballotContract.giveRightToVote(accounts[1].address);
            await ballotContract.giveRightToVote(accounts[2].address);
            await ballotContract.giveRightToVote(accounts[3].address);
            await ballotContract.giveRightToVote(accounts[4].address);
            await ballotContract.giveRightToVote(accounts[5].address);

            await ballotContract.connect(accounts[1]).vote(2);
            await ballotContract.connect(accounts[2]).vote(1);
            await ballotContract.connect(accounts[3]).vote(2);
            await ballotContract.connect(accounts[4]).vote(0);
            await ballotContract.connect(accounts[5]).vote(2);

            const winnerName = await ballotContract.winnerName();
            expect(ethers.decodeBytes32String(winnerName)).to.eq(PROPOSALS[2]);;
        });
    });
});