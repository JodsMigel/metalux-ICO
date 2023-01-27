// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function mint(address _to, uint _amount) external;
}

contract MetaluxVesting is Ownable {


  // -------------------------------------------------------------------------------------------------------
  // ------------------------------- VESTING PARAMETERS
  // -------------------------------------------------------------------------------------------------------

    uint constant ONE_MONTH = 30 days;

    bool public vestingIsCreated;

    mapping(uint => Vesting) public vesting;

    IERC20 public token;

    // @notice                              provide full information of exact vesting 
    struct Vesting {
        address owner;                      //The only owner can call vesting claim function
        uint claimCounter;                  //Currect claim number
        uint totalClaimNum;                 //Maximum amount of claims for this vesting
        uint nextUnlockDate;                //Next date of tokens unlock 
        uint tokensRemaining;               //Remain amount of token
        uint tokenToUnclockPerMonth;        //Amount of token can be uncloked each month
    }           

    // @notice                             only contract deployer can call this method and only once
    function createVesting(
        address _teamWallet,
        address _liquidityWallet,
        address _partnersWallet,
        address _marketingWallet
        ) public onlyOwner 
        {
        require(!vestingIsCreated, "vesting is already created");
        vestingIsCreated = true;
        vesting[0] = Vesting(_teamWallet,       0, 12, block.timestamp + 360 days,   5_000_000 ether,    416_666 ether); 
        vesting[1] = Vesting(_liquidityWallet,  0, 5,  block.timestamp,              25_000_000 ether,   5_000_000 ether);
        vesting[2] = Vesting(_partnersWallet,   0, 12, block.timestamp + 90 days,    5_000_000 ether,    416_666 ether);
        vesting[3] = Vesting(_marketingWallet,  0, 5,  block.timestamp,              5_000_000 ether,  1_000_000 ether);
        token.mint(_liquidityWallet, 5_000_000 ether);
        token.mint(_marketingWallet, 500_000 ether);
    }

    modifier checkLock(uint _index) {
        require(vesting[_index].owner == msg.sender, "Not an owner of this vesting");
        require(block.timestamp > vesting[_index].nextUnlockDate, "Tokens are still locked");
        require(vesting[_index].tokensRemaining > 0, "Nothing to claim");
        _;
    }
    
    // @notice                             please use _index from table below
    //
    // 0 - Team
    // 1 - Liquidity
    // 2 - Partners
    // 3 - Marketing
    //
    function claim(uint256 _index) public checkLock(_index) {
        if(vesting[_index].claimCounter + 1 < vesting[_index].totalClaimNum) {
            uint toMint = vesting[_index].tokenToUnclockPerMonth;
            token.mint(msg.sender, toMint);
            vesting[_index].tokensRemaining -= toMint;
            vesting[_index].nextUnlockDate += ONE_MONTH;
            vesting[_index].claimCounter++;
        } else {
            token.mint(msg.sender, vesting[_index].tokensRemaining);
            vesting[_index].tokensRemaining = 0;
        }
    }

    function setToken(address _token) external onlyOwner {
        token = IERC20(_token);
    }
}
