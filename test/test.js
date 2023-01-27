const { expect } = require("chai");
const { ethers, waffle, network } = require("hardhat");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");

describe("ICO TEST", function () {

    let owner
    let user1
    let user2
    let user3
    let oracle
    let contract
    let token
  
    //slot 
    let wmaticContract //3
    let usdtContract //0
    let usdcContract //0
    let busdContract //51
    let uniContract //0
    let sandContract //5
    let daiContract //0
    let linkContract //0
    let aaveContract //0

    let maticPrice
    let uniPrice
    let sandPrice
    let linkPrice
    let aavePrice


    const ONE_ETH = ethers.utils.parseEther("1");
    const max = ethers.constants.MaxUint256;
    const zero = ethers.constants.AddressZero;
    const rd = "0xA736e0aCF152e5BE5d577586bFcA999c60C5f972";

    let bn10000 = ethers.BigNumber.from(10000)
    let bn6700 = ethers.BigNumber.from(6700)
    let bn8700 = ethers.BigNumber.from(8700)
    let bn1300 = ethers.BigNumber.from(1300)

    //const provider = waffle.provider;
    
    
    // WMATIC, USDT, USDC, BUSD, UNI, SAND, DAI, Link, AAVE
    const allowedTokens = ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                           "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
                           "0xb33eaad8d922b1083446dc23f610c2567fb5180f", "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
                           "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
                           "0xd6df932a45c0f255f85145f286ea0b292b21c90b"];

    beforeEach(async function(){
        [owner, user1, user2, user3] = await ethers.getSigners()
        //deploy Oracle
        const ORACLE = await ethers.getContractFactory("UniswapV3PriceOracle", owner)
        oracle = await ORACLE.deploy()
        await oracle.deployed()
        //deploy ICO
        const ICO = await ethers.getContractFactory("MetaluxICO", owner)
        contract = await ICO.deploy(oracle.address, rd, allowedTokens)
        await contract.deployed()
        //Deploy LUX
        const LUX = await ethers.getContractFactory("LUXCoin", owner)
        token = await LUX.deploy(oracle.address, contract.address, owner.address)
        await token.deployed()

        const test = await ethers.provider.getStorageAt(oracle.address, 100)
        console.log(test)
      

        await contract.setToken(token.address);

        await initTokens() 

        await initBalances(0) // 1 - console.log on

        await approveAll()
    })

    async function initBalances (show) {
      await setBalanceToken(allowedTokens[0], owner.address, 100000n * 10n ** 18n, 3);
      await setBalanceToken(allowedTokens[1], owner.address, 100000n * 10n ** 6n, 0);
      await setBalanceToken(allowedTokens[2], owner.address, 100000n * 10n ** 6n, 0);
      await setBalanceToken(allowedTokens[3], owner.address, 100000n * 10n ** 18n, 51);
      await setBalanceToken(allowedTokens[4], owner.address, 100000n * 10n ** 18n, 0);
      await setBalanceToken(allowedTokens[5], owner.address, 100000n * 10n ** 18n, 5);
      await setBalanceToken(allowedTokens[6], owner.address, 100000n * 10n ** 18n, 0);
      await setBalanceToken(allowedTokens[7], owner.address, 100000n * 10n ** 18n, 0);
      await setBalanceToken(allowedTokens[8], owner.address, 100000n * 10n ** 18n, 0);
      if (show == 1){
        console.log("WMATIC balance is", await wmaticContract.balanceOf(owner.address))
        console.log("USDT balance is", await usdtContract.balanceOf(owner.address))
        console.log("USDC balance is", await usdcContract.balanceOf(owner.address))
        console.log("BUSD balance is", await busdContract.balanceOf(owner.address))
        console.log("UNI balance is", await uniContract.balanceOf(owner.address))
        console.log("SAND balance is", await sandContract.balanceOf(owner.address))
        console.log("DAI balance is", await daiContract.balanceOf(owner.address))
        console.log("LINK balance is", await linkContract.balanceOf(owner.address))
        console.log("AAVE balance is", await aaveContract.balanceOf(owner.address))
      }
    }

    async function increaseBalances (address, show) {
      await setBalanceToken(allowedTokens[0], address, 1000000000n * 10n ** 18n, 3);
      await setBalanceToken(allowedTokens[1], address, 1000000000n * 10n ** 6n, 0);
      await setBalanceToken(allowedTokens[2], address, 1000000000n * 10n ** 6n, 0);
      await setBalanceToken(allowedTokens[3], address, 1000000000n * 10n ** 18n, 51);
      await setBalanceToken(allowedTokens[4], address, 1000000000n * 10n ** 18n, 0);
      await setBalanceToken(allowedTokens[5], address, 1000000000n * 10n ** 18n, 5);
      await setBalanceToken(allowedTokens[6], address, 1000000000n * 10n ** 18n, 0);
      await setBalanceToken(allowedTokens[7], address, 1000000000n * 10n ** 18n, 0);
      await setBalanceToken(allowedTokens[8], address, 1000000000n * 10n ** 18n, 0);
      if (show == 1){
        console.log("WMATIC balance is", await wmaticContract.balanceOf(address))
        console.log("USDT balance is", await usdtContract.balanceOf(address))
        console.log("USDC balance is", await usdcContract.balanceOf(address))
        console.log("BUSD balance is", await busdContract.balanceOf(address))
        console.log("UNI balance is", await uniContract.balanceOf(address))
        console.log("SAND balance is", await sandContract.balanceOf(address))
        console.log("DAI balance is", await daiContract.balanceOf(address))
        console.log("LINK balance is", await linkContract.balanceOf(address))
        console.log("AAVE balance is", await aaveContract.balanceOf(address))
      }
    }

    async function initTokens (show) {
      wmaticContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[0]);
      usdtContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[1]);
      usdcContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[2]);
      busdContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[3]);
      uniContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[4]);
      sandContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[5]);
      daiContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[6]);
      linkContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[7]);
      aaveContract = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", allowedTokens[8]);
    }

    async function approveAll () {
      await wmaticContract.approve(contract.address, max);
      await usdtContract.approve(contract.address, max); 
      await usdcContract.approve(contract.address, max); 
      await busdContract.approve(contract.address, max); 
      await uniContract.approve(contract.address, max); 
      await sandContract.approve(contract.address, max); 
      await daiContract.approve(contract.address, max); 
      await linkContract.approve(contract.address, max); 
      await aaveContract.approve(contract.address, max);
      await usdtContract.connect(user1).approve(contract.address, max); 
      await usdtContract.connect(user2).approve(contract.address, max);
    }


    async function setBalanceToken (tokenAddress, userAddress, balance, slot) {

      const toBytes32 = (bn) => {
        return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
      };

      const index = ethers.utils.solidityKeccak256(
        ["uint256", "uint256"],
        [userAddress, slot] // key, slot
      )
    
      await network.provider.send("hardhat_setStorageAt", [
        tokenAddress,
        index,
        toBytes32(ethers.BigNumber.from(balance)).toString(),
      ]);

    }

    async function getPrice (token0, token1, amount, fee) {
      const secondsAgo = 10;
      const price = await oracle.getAmountOut(token0, token1, amount, fee, secondsAgo);
      return price;
    }

    async function wait_time (amount) {
        const time = 86400 * amount; //1 day
        await ethers.provider.send("evm_increaseTime", [time])
        await ethers.provider.send("evm_mine")
    }

    async function setCOINBalance (address, amount) {
      await setBalance(address, amount * 10n ** 18n);
    }

    it("Price Oracle has to show correct price", async function(){
      maticPrice = await getPrice(allowedTokens[0], allowedTokens[2], 1n * 10n ** 18n, 500)
      uniPrice = await getPrice(allowedTokens[4], allowedTokens[2], 1n * 10n ** 18n, 3000)
      sandPrice = await getPrice(allowedTokens[5], allowedTokens[2], 1n * 10n ** 18n, 3000)
      linkPrice = await getPrice(allowedTokens[7], allowedTokens[0], 1n * 10n ** 18n, 500)
      linkPrice = await getPrice(allowedTokens[0], allowedTokens[2], linkPrice, 500)
      aavePrice = await getPrice(allowedTokens[8], allowedTokens[0], 1n * 10n ** 18n, 3000)
      aavePrice = await getPrice(allowedTokens[0], allowedTokens[2], aavePrice, 500)
      console.log("MATIC Price is", maticPrice/(10 ** 6));
      console.log("UNI Price is", uniPrice/(10 ** 6));
      console.log("SAND Price is", sandPrice/(10 ** 6));
      console.log("LINK Price is", linkPrice/(10 ** 6));
      console.log("AAVE Price is", aavePrice/(10 ** 6));
    }) 

    //=================================TEST STABLE=========================================

    it("Can not buy before start ICO", async function(){
      await expect(contract.invest(100, allowedTokens[1], zero)).to.be.revertedWith("ICO has not started");
    }) 

    it("Can not pay by wrong token", async function(){
      await expect(contract.invest(100, "0x0d500b1d8e8ef31e21c99d1db9a6444ddadf1270", zero)).to.be.revertedWith("Incorrect payment token");
    }) 

    it("Can not buy less 10$", async function(){
      //usdt, usdc, dai, busd
      //USDT
      await contract.startICO();
      await expect(contract.invest(1, allowedTokens[1], zero)).to.be.revertedWith("Minimum purchase is must be equal 10$");
      await expect(contract.invest(1, allowedTokens[0], zero)).to.be.revertedWith("Minimum purchase is must be equal 10$");
      await expect(contract.invest(1, allowedTokens[0], zero, { value : 100})).to.be.revertedWith("Minimum purchase is must be equal 10$");
    })

    it("Buy 100 tokens for USDT 1st stage", async function(){
      //usdt, usdc, dai, busd
      //USDT
      await contract.startICO();
      await contract.invest(100, allowedTokens[1], zero)
      expect(await usdtContract.balanceOf(owner.address)).to.eq(99990n * 10n ** 6n);
      expect(await usdtContract.balanceOf(contract.address)).to.eq(87n * 10n ** 5n);
      expect(await token.balanceOf(owner.address)).to.eq(100n * 10n ** 18n);
    })
    

    it("Buy 100 tokens for BUSD 1st stage", async function(){
      //usdt, usdc, dai, busd
      //BUSD
      await contract.startICO();
      await contract.invest(100, allowedTokens[3], zero)
      expect(await busdContract.balanceOf(owner.address)).to.eq(99990n * 10n ** 18n);
      expect(await token.balanceOf(owner.address)).to.eq(100n * 10n ** 18n);
    }) 

    it("Buy 10000 tokens for BUSD and USDT 1st stage", async function(){
      //usdt, usdc, dai, busd
      //BUSD
      await contract.startICO();
      await contract.invest(10000, allowedTokens[3], zero) //busd
      
      expect(await busdContract.balanceOf(owner.address)).to.eq(99200n * 10n ** 18n);
      expect(await busdContract.balanceOf(contract.address)).to.eq(696n * 10n ** 18n);
      expect(await token.balanceOf(owner.address)).to.eq(10000n * 10n ** 18n);

      await contract.invest(10000, allowedTokens[1], zero) //usdt

      expect(await usdtContract.balanceOf(owner.address)).to.eq(99200n * 10n ** 6n);
      expect(await usdtContract.balanceOf(contract.address)).to.eq(696n * 10n ** 6n);
      expect(await token.balanceOf(owner.address)).to.eq(20000n * 10n ** 18n);
    }) 

    it("Buy 50000 tokens for BUSD and USDT 1st stage", async function(){
      //usdt, usdc, dai, busd
      //BUSD
      await contract.startICO();
      await contract.invest(50000, allowedTokens[3], zero) //busd
      
      expect(await busdContract.balanceOf(owner.address)).to.eq(97000n * 10n ** 18n);
      expect(await busdContract.balanceOf(contract.address)).to.eq(2610n * 10n ** 18n);
      expect(await token.balanceOf(owner.address)).to.eq(50000n * 10n ** 18n);

      await contract.invest(50000, allowedTokens[1], zero) //usdt

      expect(await usdtContract.balanceOf(owner.address)).to.eq(97000n * 10n ** 6n);
      expect(await usdtContract.balanceOf(contract.address)).to.eq(2610n * 10n ** 6n);
      expect(await token.balanceOf(owner.address)).to.eq(100000n * 10n ** 18n);
    }) 

    it("Buy 100000 tokens for BUSD and USDT 1st stage", async function(){
      //usdt, usdc, dai, busd
      //BUSD
      await contract.startICO();
      await contract.invest(100000, allowedTokens[3], zero) //busd
      
      expect(await busdContract.balanceOf(owner.address)).to.eq(95000n * 10n ** 18n);
      expect(await busdContract.balanceOf(contract.address)).to.eq(4350n * 10n ** 18n);
      expect(await token.balanceOf(owner.address)).to.eq(100000n * 10n ** 18n);

      await contract.invest(100000, allowedTokens[1], zero) //usdt

      expect(await usdtContract.balanceOf(owner.address)).to.eq(95000n * 10n ** 6n);
      expect(await usdtContract.balanceOf(contract.address)).to.eq(4350n * 10n ** 6n);
      expect(await token.balanceOf(owner.address)).to.eq(200000n * 10n ** 18n);
    }) 

    it("Correct count for 1+2 stages for stables", async function(){
      await increaseBalances(owner.address);
      await contract.startICO();
      await contract.invest(10000000, allowedTokens[1], zero)
      expect(await token.balanceOf(owner.address)).to.eq(10000000n * 10n ** 18n);
      await contract.invest(20000000, allowedTokens[1], zero)
      expect(await token.balanceOf(owner.address)).to.eq(30000000n * 10n ** 18n);
      await contract.invest(24500000, allowedTokens[1], zero)
      expect(await token.balanceOf(owner.address)).to.eq(54500000n * 10n ** 18n);
    })

    it("Correct count for 1+2 stages for non stables", async function(){
      await increaseBalances(owner.address);
      await contract.startICO();
      await contract.invest(10000000, allowedTokens[0], zero)
      expect(await token.balanceOf(owner.address)).to.eq(10000000n * 10n ** 18n);
      await contract.invest(20000000, allowedTokens[0], zero)
      expect(await token.balanceOf(owner.address)).to.eq(30000000n * 10n ** 18n);
      await contract.invest(24500000, allowedTokens[0], zero)
      expect(await token.balanceOf(owner.address)).to.eq(54500000n * 10n ** 18n);
    })

    //=================================TEST NOT STABLE=========================================

    it("Buy 100 tokens for non stable 1st stage", async function(){
      //WMATIC, USDT, USDC, BUSD, UNI, SAND, DAI, Link, AAVE
      await contract.startICO();
      await contract.invest(100, allowedTokens[0], zero)
      
      let balance = await contract.checkPrice(100, allowedTokens[0])
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await wmaticContract.balanceOf(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })

    it("Buy 10000 tokens for non stable 1st stage", async function(){
      //WMATIC, USDT, USDC, BUSD, UNI, SAND, DAI, Link, AAVE
      await contract.startICO();
      await contract.invest(10000, allowedTokens[0], zero)

      let balance = await contract.checkPrice(10000, allowedTokens[0])
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await wmaticContract.balanceOf(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })

    it("Buy 50000 tokens for non stable 1st stage", async function(){
      //WMATIC, USDT, USDC, BUSD, UNI, SAND, DAI, Link, AAVE
      await contract.startICO();
      await contract.invest(50000, allowedTokens[0], zero)

      let balance = await contract.checkPrice(50000, allowedTokens[0])
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await wmaticContract.balanceOf(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })
    

    it("Buy 100000 tokens for non stable 1st stage", async function(){
      //WMATIC, USDT, USDC, BUSD, UNI, SAND, DAI, Link, AAVE
      await contract.startICO();
      await contract.invest(100000, allowedTokens[0], zero)

      let balance = await contract.checkPrice(100000, allowedTokens[0])
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await wmaticContract.balanceOf(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })

    //=================================TEST NATIVE COIN=========================================

    it("Can't pay less by NATIVE COIN 1st stage", async function(){
      await contract.startICO();
      let balance = await contract.checkPrice(100, allowedTokens[0])
      await expect(contract.invest(100, allowedTokens[0], zero, { value : 100})).
      to.be.revertedWith("Incorrect amount of MATIC");
    })

    it("Buy 100 tokens for NATIVE COIN 1st stage", async function(){
      await contract.startICO();
      let balance = await contract.checkPrice(100, allowedTokens[0])
      await contract.invest(100, allowedTokens[0], zero, { value : balance[0]})
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await ethers.provider.getBalance(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })

    it("Buy 10000 tokens for NATIVE COIN 1st stage", async function(){
      await contract.startICO();
      let balance = await contract.checkPrice(10000, allowedTokens[0])
      await contract.invest(10000, allowedTokens[0], zero, { value : balance[0]})
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await ethers.provider.getBalance(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })

    it("Buy 50000 tokens for NATIVE COIN 1st stage", async function(){
      await contract.startICO();
      let balance = await contract.checkPrice(50000, allowedTokens[0])
      await contract.invest(50000, allowedTokens[0], zero, { value : balance[0]})
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await ethers.provider.getBalance(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })
    

    it("Buy 100000 tokens for NATIVE COIN 1st stage", async function(){
      await setCOINBalance(owner.address, 1000000000n);
      await contract.startICO();
      let balance = await contract.checkPrice(100000, allowedTokens[0])
      await contract.invest(100000, allowedTokens[0], zero, { value : balance[0]})
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await ethers.provider.getBalance(contract.address)).to.be.closeTo(balance, ONE_ETH);
    })

    it("Correct price for tokens for NATIVE COIN and stables 1st+2nd+3rd stages", async function(){
      await setCOINBalance(owner.address, 1000000000n);
      await contract.startICO();
      //1 stage
      let balance = await contract.checkPrice(1000, allowedTokens[0])
      let balanceStable = await contract.checkPriceStable(1000, allowedTokens[1])
      let balanceStableBUSD = await contract.checkPriceStable(1000, allowedTokens[3])

      expect(balance[1]).to.eq(100n * 10n ** 6n);
      expect(balanceStable).to.eq(100n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(100n * 10n ** 18n);

      balance = await contract.checkPrice(10000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(10000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(10000, allowedTokens[3])

      expect(balance[1]).to.eq(800n * 10n ** 6n);
      expect(balanceStable).to.eq(800n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(800n * 10n ** 18n);

      balance = await contract.checkPrice(50000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(50000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(50000, allowedTokens[3])

      expect(balance[1]).to.eq(3000n * 10n ** 6n);
      expect(balanceStable).to.eq(3000n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(3000n * 10n ** 18n);

      balance = await contract.checkPrice(100000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(100000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(100000, allowedTokens[3])

      expect(balance[1]).to.eq(5000n * 10n ** 6n);
      expect(balanceStable).to.eq(5000n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(5000n * 10n ** 18n);

      //2 stage

      await wait_time(31);

      balance = await contract.checkPrice(1000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(1000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(1000, allowedTokens[3])

      expect(balance[1]).to.eq(150n * 10n ** 6n);
      expect(balanceStable).to.eq(150n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(150n * 10n ** 18n);

      balance = await contract.checkPrice(10000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(10000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(10000, allowedTokens[3])

      expect(balance[1]).to.eq(1100n * 10n ** 6n);
      expect(balanceStable).to.eq(1100n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(1100n * 10n ** 18n);

      balance = await contract.checkPrice(50000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(50000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(50000, allowedTokens[3])

      expect(balance[1]).to.eq(4500n * 10n ** 6n);
      expect(balanceStable).to.eq(4500n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(4500n * 10n ** 18n);

      balance = await contract.checkPrice(100000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(100000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(100000, allowedTokens[3])

      expect(balance[1]).to.eq(8000n * 10n ** 6n);
      expect(balanceStable).to.eq(8000n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(8000n * 10n ** 18n);
      
      //3 stage

      await wait_time(45);

      
      balance = await contract.checkPrice(1000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(1000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(1000, allowedTokens[3])

      expect(balance[1]).to.eq(200n * 10n ** 6n);
      expect(balanceStable).to.eq(200n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(200n * 10n ** 18n);

      balance = await contract.checkPrice(10000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(10000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(10000, allowedTokens[3])

      expect(balance[1]).to.eq(1500n * 10n ** 6n);
      expect(balanceStable).to.eq(1500n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(1500n * 10n ** 18n);

      balance = await contract.checkPrice(50000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(50000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(50000, allowedTokens[3])

      expect(balance[1]).to.eq(6000n * 10n ** 6n);
      expect(balanceStable).to.eq(6000n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(6000n * 10n ** 18n);

      balance = await contract.checkPrice(100000, allowedTokens[0])
      balanceStable = await contract.checkPriceStable(100000, allowedTokens[1])
      balanceStableBUSD = await contract.checkPriceStable(100000, allowedTokens[3])

      expect(balance[1]).to.eq(10000n * 10n ** 6n);
      expect(balanceStable).to.eq(10000n * 10n ** 6n);
      expect(balanceStableBUSD).to.eq(10000n * 10n ** 18n);
    }) 

    it("Correct count for 1+2 stages for NATIVE COIN", async function(){
      await setCOINBalance(owner.address, 1000000000n);
      await contract.startICO();
      let balance = await contract.checkPrice(10000000, allowedTokens[0])
      await contract.invest(10000000, allowedTokens[0], zero, { value : balance[0]})
      expect(await contract.currentStage()).to.eq(2);
      expect(await contract.stageOneAmountToSell()).to.eq(ethers.utils.parseEther("0"));
      expect(await contract.stageTwoAmountToSell()).to.eq(ethers.utils.parseEther("16705000"));
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));
      expect(await ethers.provider.getBalance(contract.address)).to.be.closeTo(balance, ONE_ETH);
      expect(await token.balanceOf(owner.address)).to.eq(ethers.utils.parseEther("10000000"));
    })

    //=================================TEST REFFEAL=========================================

    it("Correct set ref", async function(){
      
      await setCOINBalance(owner.address, 1000000000n);
      await setCOINBalance(rd, 0n);
      await setCOINBalance(user1.address, 1000000000n);
      await setCOINBalance(user2.address, 1000000000n);
      await setCOINBalance(user3.address, 1000000000n);
      await increaseBalances(user1.address);
      await increaseBalances(user2.address);
      await contract.startICO();

      let balance = await contract.checkPrice(1000, allowedTokens[0])
      await contract.invest(1000, allowedTokens[0], zero, { value : balance[0]})   
      balance = ethers.BigNumber.from(BigInt(balance[0] * bn1300 / bn10000));
      expect(await ethers.provider.getBalance(rd)).to.be.closeTo(balance, ONE_ETH);

      await contract.connect(user2).invest(1000, allowedTokens[1], user3.address);
      expect(await usdtContract.balanceOf(user3.address)).to.eq(10n * 10n ** 6n);

      await contract.connect(user1).invest(1000, allowedTokens[1], user2.address);
      expect(await usdtContract.balanceOf(user3.address)).to.eq(13n * 10n ** 6n);
      expect(await usdtContract.balanceOf(user2.address)).to.eq(999999910n * 10n ** 6n);
    })

    //=================================TEST STAGES=========================================
    
    it("Change stages if sold all amount on this stage", async function(){
      await increaseBalances(owner.address);
      await contract.startICO();
      await contract.invest(10000000, allowedTokens[3], zero) //busd
      expect(await contract.currentStage()).to.eq(2);
      await contract.invest(20000000, allowedTokens[3], zero)
      expect(await contract.currentStage()).to.eq(3);
      await contract.invest(24500000, allowedTokens[3], zero)
      await expect(contract.invest(1, allowedTokens[3], zero)).to.be.revertedWith("ICO has ended");
    })

    it("Change stages if stage time is over", async function(){
      await contract.startICO();
      await wait_time(31);
      await contract.invest(1000, allowedTokens[3], zero)
      expect(await contract.currentStage()).to.eq(2);
      await wait_time(45);
      await contract.invest(1000, allowedTokens[3], zero)
      expect(await contract.currentStage()).to.eq(3);
      await wait_time(105);
      await expect(contract.invest(1000, allowedTokens[3], zero)).to.be.revertedWith("ICO has ended");
    })

    it("Correct move rest of token if change stage cuz time is over", async function(){
      await contract.startICO();
      await contract.invest(1000, allowedTokens[3], zero)
      expect(await contract.stageOneAmountToSell()).to.eq(ethers.utils.parseEther("9264000"));
      await wait_time(31);
      await contract.invest(1000, allowedTokens[3], zero)
      expect(await contract.stageOneAmountToSell()).to.eq(0);
      expect(await contract.currentStage()).to.eq(2);
      expect(await contract.stageTwoAmountToSell()).to.eq(ethers.utils.parseEther("26703000"));
      await contract.invest(1000, allowedTokens[3], zero)
      await wait_time(45);
      await contract.invest(1000, allowedTokens[3], zero)
      expect(await contract.stageTwoAmountToSell()).to.eq(0);
      expect(await contract.currentStage()).to.eq(3);
      expect(await contract.stageThreeAmountToSell()).to.eq(ethers.utils.parseEther("54496000"));
    })

    //=================================TEST OTHER=========================================

    it("Correctly reduce amount tokens to sale after sale", async function(){
      await increaseBalances(owner.address)
      await contract.startICO();
      await contract.invest(100, allowedTokens[3], zero) //busd
      expect(await contract.stageOneAmountToSell()).to.eq(ethers.utils.parseEther("9264900"));
      await contract.invest(500, allowedTokens[3], zero) //busd
      expect(await contract.stageOneAmountToSell()).to.eq(ethers.utils.parseEther("9264400"));
      await contract.invest(9265000, allowedTokens[3], zero) //busd
      expect(await contract.stageOneAmountToSell()).to.eq(ethers.utils.parseEther("0"));
      expect(await contract.stageTwoAmountToSell()).to.eq(ethers.utils.parseEther("17439400"));
      expect(await contract.stageThreeAmountToSell()).to.eq(ethers.utils.parseEther("27795000"));
      await expect(contract.invest(45234500, allowedTokens[3], zero)).to.be.revertedWith("Incorrect amount");
      await contract.invest(45234300, allowedTokens[3], zero) //busd
      expect(await contract.stageOneAmountToSell()).to.eq(ethers.utils.parseEther("0"));
      expect(await contract.stageTwoAmountToSell()).to.eq(ethers.utils.parseEther("0"));
      expect(await contract.stageThreeAmountToSell()).to.eq(ethers.utils.parseEther("100"));
      await expect(contract.invest(200, allowedTokens[3], zero)).to.be.revertedWith("Incorrect amount")
      await contract.invest(100, allowedTokens[3], zero);
      expect(await contract.stageThreeAmountToSell()).to.eq(ethers.utils.parseEther("0"));
    })

    //=================================TEST ADMIN' FUNCTIONS=========================================
    
    it("Admin can withdraw tokens and matic", async function(){
      await increaseBalances(owner.address)
      await contract.startICO();
      const mainOwner = "0xE6E7A02bb8457D4F2C07560092f255f19986E38A";
      const secondOwner = "0x9cAa904e2eF96945f522c907d2dB288e41cba68F";

      let balance = await contract.checkPrice(100000, allowedTokens[0])
      await contract.invest(100000, allowedTokens[3], zero) //busd
      await contract.invest(100000, allowedTokens[1], zero) //usdt
      await contract.invest(100000, allowedTokens[0], zero, { value : balance[0] })

      let balanceBusd = await contract.checkPriceStable(100000, allowedTokens[3])

      balanceBusd = ethers.BigNumber.from(BigInt(balanceBusd * bn8700 / bn10000));

      let balanceMainBusd = ethers.BigNumber.from(BigInt(balanceBusd * bn6700 / bn10000));
      
      let balanceSecondBusd = ethers.BigNumber.from(BigInt(balanceBusd - balanceMainBusd));

      await contract.withdrawToken(allowedTokens[3])
      expect(await busdContract.balanceOf(mainOwner)).to.be.closeTo(balanceMainBusd, ONE_ETH)
      expect(await busdContract.balanceOf(secondOwner)).to.be.closeTo(balanceSecondBusd, ONE_ETH)
      expect(await busdContract.balanceOf(contract.address)).to.eq(0)

      //============USDT

      let balanceUSDT = await contract.checkPriceStable(100000, allowedTokens[1])

      balanceUSDT = ethers.BigNumber.from(BigInt(balanceUSDT * bn8700 / bn10000));

      let balanceMainUSDT = ethers.BigNumber.from(BigInt(balanceUSDT * bn6700 / bn10000));
      
      let balanceSecondUSDT = ethers.BigNumber.from(BigInt(balanceUSDT - balanceMainUSDT));

      await contract.withdrawToken(allowedTokens[1])

      expect(await usdtContract.balanceOf(mainOwner)).to.be.closeTo(balanceMainUSDT, ONE_ETH)
      expect(await usdtContract.balanceOf(secondOwner)).to.be.closeTo(balanceSecondUSDT, ONE_ETH)
      expect(await usdtContract.balanceOf(contract.address)).to.eq(0)

      //============MATIC

      let genBalance = ethers.BigNumber.from(BigInt(balance[0] * bn8700 / bn10000));

      let balanceMain = ethers.BigNumber.from(BigInt(genBalance * bn6700 / bn10000));
      
      let balanceSecond = ethers.BigNumber.from(BigInt(genBalance - balanceMain));

      
      
      let balanceBeforeMain = await ethers.provider.getBalance(mainOwner)
      let balanceBeforeSecond = await ethers.provider.getBalance(secondOwner)

      await contract.withdrawMatic()

      balanceMain = BigInt(balanceMain) + BigInt(balanceBeforeMain);
      balanceSecond = BigInt(balanceSecond) + BigInt(balanceBeforeSecond);

      expect(await ethers.provider.getBalance(mainOwner)).to.be.closeTo(balanceMain, ethers.utils.parseEther("10"))
      expect(await ethers.provider.getBalance(secondOwner)).to.be.closeTo(balanceSecond, ethers.utils.parseEther("10"))
      expect(await ethers.provider.getBalance(contract.address)).to.eq(0) 
    })

});

