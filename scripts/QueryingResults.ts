import * as dotenv from "dotenv";
import { Ballot, Ballot__factory } from "../typechain-types";
import { ethers } from "hardhat";
dotenv.config();

async function main() {
    const parameter = process.argv.slice(2)
    const contractAddress = "0x905c6371D0842C31a1315f4768058BF7a37C66Bb";
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const ballotFactory = new Ballot__factory(wallet);
    const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
    console.log("Calling winningProposal...");
    const tx = await ballotContract.winningProposal();
    console.log("winningProposal result:", tx);

    console.log("Calling winnerName...");
    const winnerName = await ballotContract.winnerName();
    console.log("Winner's name:", ethers.decodeBytes32String(winnerName));


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});