let owner
let oracle
let contract
let vesting
let token
let tokenAddr = "0x97807C3330B2B64232062aC05D772d088A4fd8e9"
let oracleAddr = "0x5d0a0f17f692d4ede36ca5d42e4de556660e9195"
const rd = "0xA736e0aCF152e5BE5d577586bFcA999c60C5f972";
const FEEWALLET = "0xbA4137D7FB8Cfe37efB3Cc3A3559DdBc0d562921";

const allowedTokens = ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                           "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
                           "0xb33eaad8d922b1083446dc23f610c2567fb5180f", "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
                           "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
                           "0xd6df932a45c0f255f85145f286ea0b292b21c90b"];

const options = {gasPrice : 100000000000, gasLimit : 40000000}

async function main() {
        //deploy Oracle
        [owner] = await ethers.getSigners()
/*      const ORACLE = await ethers.getContractFactory("UniswapV3PriceOracle", owner)
        oracle = await ORACLE.deploy()
        await oracle.deployed()  */
        //deploy ICO
        const ICO = await ethers.getContractFactory("MetaluxICO", owner)
        contract = await ICO.deploy(oracleAddr, rd, allowedTokens)
        await contract.deployed()
        console.log("oracle address is ", oracleAddr);
        console.log("ICO address is ", contract.address);
        //deploy vesting
        const VESTING = await ethers.getContractFactory("MetaluxVesting", owner)
        vesting = await VESTING.deploy()
        await vesting.deployed()
        console.log("Vesting address is ", vesting.address);
        //Deploy LUX
        const LUX = await ethers.getContractFactory("LUXCoin", owner)
        token = await LUX.deploy(FEEWALLET, vesting.address, contract.address)
        await token.deployed()
        console.log("Token address is ", token.address);
        await vesting.setToken(token.address, options); 
        await contract.setToken(token.address,options);
        //await contract.startICO(options);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
