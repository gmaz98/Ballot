import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
    const PROPOSALS = ["P1", "P2", "P3"];

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log("Deploying with address: ", wallet.address);

    const ballotFactory = new Ballot__factory(wallet);
    const contractBallot = await ballotFactory.deploy(PROPOSALS.map(ethers.encodeBytes32String));
    await contractBallot.waitForDeployment();
    const address = await contractBallot.getAddress();

    console.log(`contract deployed at address:`, address);

}




main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });