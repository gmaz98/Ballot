# Voting with Delegation - Ballot Contract

## Overview

This Solidity smart contract, named **Ballot**, implements a voting system with delegation. It allows voters to delegate their voting rights to others and cast votes on proposals. The contract is designed to be used for choosing one of the provided proposals.

## Key Components

### 1. Voter Struct:
   - Represents a single voter and includes fields such as weight, voted status, delegate, and the index of the voted proposal.

### 2. Proposal Struct:
   - Represents a single proposal with a short name and the number of accumulated votes.

### 3. Chairperson:
   - The address of the chairperson who deploys the contract and has the initial voting weight.

### 4. Functions:
   - `giveRightToVote`: Allows the chairperson to grant voting rights to a specific address.
   - `delegate`: Allows a voter to delegate their vote to another address.
   - `vote`: Allows a voter to cast their vote on a specific proposal.

### 5. Winner Determination:
   - The contract includes functions (`winningProposal` and `winnerName`) to determine the winning proposal based on the accumulated votes.

## Getting Started

### 1. Contract Deployment:
   - Deploy the contract by providing an array of proposal names.

### 2. Grant Voting Rights:
   - The chairperson can grant voting rights to specific addresses using the `giveRightToVote` function.

### 3. Voting Process:
   - Voters can either cast their votes directly using the `vote` function or delegate their votes to other addresses using the `delegate` function.

### 4. Winner Determination:
   - Use the `winnerName` function to retrieve the name of the winning proposal after the voting process is complete.

## Security Considerations

### 1. Voting Rights:
   - Only the chairperson can grant voting rights to prevent unauthorized voting.

### 2. Delegation Loop:
   - The contract checks for delegation loops to avoid infinite loops during the delegation process.

### 3. Validations:
   - Various require statements are used to ensure that voters have the right to vote and that they haven't voted before.

## Example Usage

```solidity
// Deploy the contract with proposal names
Ballot ballot = new Ballot(["Proposal A", "Proposal B", "Proposal C"]);

// Chairperson grants voting rights
ballot.giveRightToVote(address);

// Voters cast their votes or delegate
ballot.vote(0);
ballot.delegate(anotherAddress);

// Determine the winner
bytes32 winner = ballot.winnerName();
