// using arrow function
// describe("Ballot", () => {
    import { expect } from "chai";
    import {ethers} from "hardhat";
    import { Ballot } from "../typechain-types";
    
    const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
    
    function convertStringArrayToBytes32(array: string[]) {
      const bytes32Array = [];
      for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
      }
      return bytes32Array;
    }
    // })
    // including anonymous function
    describe("Ballot", function () {
      let ballotContract:Ballot;
     beforeEach(async function(){
      const ballotContractFactory = await ethers.getContractFactory("Ballot")
      // deploy is the name of the function to deploy a smart contract
      // using the string directly wont worked better we convert the strings Alice etc to bytes#. docs here https://docs.ethers.org/v5/api/utils/strings/
    
      ballotContract = await ballotContractFactory.deploy(
      //   [
      //     rewriting this below as shown in line 6
      //   ethers.utils.formatBytes32String("Alice" ), 
      //   ethers.utils.formatBytes32String( "Bob" ), 
      //   ethers.utils.formatBytes32String( "pet" ) 
      // ]
    
       // rewritten as
       convertStringArrayToBytes32(PROPOSALS)
      );
      
      // await ballotContract.deployed()
      // line 36 can be rewritten as this below, they perform same 
      await ballotContract.deployTransaction.wait()
     })
    describe("when the contract is deployed", function () {
      // it("has the provided proposals", async function(){
      //   const proposal = await ballotContract.proposals(0)
      //   // ethers.utils.parseBytes32 below is to convert back to string
      //   expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(PROPOSALS[0]);
      // })
      // the it above just chcek for one, to dynamically check for much, use for loop below
      it("has the provided proposals", async function(){
        for (let index = 0; index < PROPOSALS.length; index++) {
          const proposal = await ballotContract.proposals(index);
          expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(PROPOSALS[index]);
        }
        const proposal = await ballotContract.proposals(0)
        // ethers.utils.parseBytes32 below is to convert back to string
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(PROPOSALS[0]);
      })
    
      it("sets the deployer address as chairperson ", async function(){
        const signers = await ethers.getSigners();
        const deployer = signers[0].address;
        // chairperson here is the METHOD_NAME
        const chairPerson = await ballotContract.chairperson();
          expect(chairPerson).to.eq(deployer)
      })
    
      it("has zero votefor all proposals ", async function(){
        for (let index = 0; index < PROPOSALS.length; index++) {
          const proposal = await ballotContract.proposals(index);
          expect(proposal.voteCount).to.eq(0);
        }
      })
      
      it("set the voting weight for the chairperson as 1 ", async function(){
        const chairPerson = await ballotContract.chairperson();
        const chairPersonVoter = await ballotContract.voters(chairPerson)
        const votingWeight = chairPersonVoter.weight;
        expect(votingWeight).to.eq(1)
      })
    })
    })