// writing scripts with hardhat, find docs below, you need to run commnand (yarn hardhat run .\scripts\Deployment.ts)
// https://hardhat.org/hardhat-runner/docs/advanced/scripts
// import { providers } from "ethers";
// i am changing line 5 to 6 because we are now connected to the testnet & not the Hre, the hre has prefunded account while the goerli is connceting to my individyual account. now the provider which is hre turns getDefaultProvider i.e am connecting with testnet account
// import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();
import { ethers } from "ethers";
import { Ballot__factory } from '../typechain-types';
// const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
  // the flow below is going to pick the Argument
  const args = process.argv;
  // this is to remove the default 2 that comes when you run the args
  const proposals = args.slice(2);
  if (proposals.length <= 0) throw new Error ("Missing parameters: proposals");

  // provider connects you to the blockchain
// docs here, https://docs.ethers.org/v5/api/providers/
    // const provider = ethers.provider;
    // change the aove provider  to one of the dafult provider just by passing the network name


    // this flow below sets up a provider
    const provider = ethers.getDefaultProvider("goerli");
    // console.log({provider})

    // getting signers from the getDefaultProvider flow and not provider
    // https://docs.ethers.org/v5/api/signer/#Wallet
    // creating a random wallet below
    // const wallet = ethers.Wallet.createRandom();
    // console.log("connected to the wallet address ${wallet.address}");
    // const signer =wallet.connect(provider);
    // const balance = await signer.getBalance();
    // console.log(`wallet balance : ${balance} wei`);

        // now creating from Mneumonic/ privatekey
        // to validate privatKey
        const privateKey = process.env.GOERLI_PRIVATE_KEY
        if (!privateKey || privateKey.length <=0 ) throw new Error ("Missing privateKey: privateKey");
        // to connect using privateKey
        const wallet = new ethers.Wallet(privateKey)
      
        // console.log(wallet)
        console.log(`Tutu wallet address ${wallet.address}`);

        // this is going to setup my wallet, create a signer by connecting the wallet to the provider 
        const signer =wallet.connect(provider);

        // checking the balance of the signer
          const balance = await signer.getBalance();
         console.log(`wallet balance : ${balance} wei`);
    // const lastBlock = await provider.getBlock("latest");
    // console.log({lastBlock})
// the above flow is creating a random wallet, to bring your own environment here, use the .ENV package
    // return;


  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // TODO
//   copied from ballot.ts
  // const ballotContractFactory = await ethers.getContractFactory("Ballot")
  // above rewritten as below becasue we not getting ethers from ethers again so getContractFactory dosent work again

  // pick the ballot factory function
  const ballotContractFactory = new Ballot__factory(signer);

  // deploy the contrat
  console.log("Deploying contract .....")
   const ballotContract = await ballotContractFactory.deploy(
       convertStringArrayToBytes32(proposals)
      );

 const deployTxReceipt = await ballotContract.deployTransaction.wait();
 
   console.log(`The Ballot contract was deployed successfully at the address ${ballotContract.address}`);
   console.log({deployTxReceipt})

 const chairPerson = await ballotContract.chairperson();
 console.log(chairPerson)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

