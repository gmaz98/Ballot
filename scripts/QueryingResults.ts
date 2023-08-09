import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Ballot, Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {

    const contractAddress = process.argv[2];

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

    const ballotFactory = new Ballot__factory(wallet);
    const contractBallot = ballotFactory.attach(contractAddress) as Ballot;
    const tx = await contractBallot.winningProposal();
    console.log("the winner is ", (ethers.decodeBytes32String(await contractBallot.winnerName())));

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
