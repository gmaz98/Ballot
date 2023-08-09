import * as dotenv from "dotenv";
import { Ballot, Ballot__factory } from "../typechain-types";
import { ethers } from "hardhat";
dotenv.config();

async function main() {
    const parameter = process.argv.slice(2)
    const contractAddress = "0x905c6371D0842C31a1315f4768058BF7a37C66Bb";
    const voterAddress = "0x1ee59350E29Ab2B858cbe0bb8F30E33acEe27e69";
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const ballotFactory = new Ballot__factory(wallet);
    const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
    console.log(`Attached to the contract at address ${contractAddress}`);
    console.log(`Giving voting rights to ${voterAddress}`);

    const tx = await ballotContract.giveRightToVote(voterAddress);
    console.log(`transaction hash is ${tx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});