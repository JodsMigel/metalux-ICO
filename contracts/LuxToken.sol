pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract LUXCoin is ERC20, ERC20Burnable, Pausable, Ownable {

    mapping(address => uint) public points;
    mapping(address => bool) public blacklist;

    address public feeWallet;
    address public vestingContract;
    address public ICOContract;
    address public minter;

    uint public fee;
    uint public division = 10000;

    constructor(address _feeWallet, address _vestingContract, address _icoContract) ERC20("LUXCoin", "LUX") {
        feeWallet = _feeWallet;
        vestingContract = _vestingContract;
        ICOContract = _icoContract;
    }


    function burn(uint256 amount) public override {
        super._burn(msg.sender, amount);
        points[msg.sender] += amount;
    }

    function usePoints(uint amount, address user) external returns(bool){
        require(msg.sender == minter, "Incorrect msg.sender");
        require(points[user] >= amount, "Not enough points");
        points[user] -= amount;
        return true;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        require(!blacklist[from], "User in blacklist");
        uint toTransfer;
        if(fee>0){
            toTransfer = _takeFee(amount);
            super._transfer(from, feeWallet, amount-toTransfer);
            super._transfer(from, to, toTransfer);
        } else {
            super._transfer(from, to, amount);
        }
    }

    function _takeFee(uint amount) internal view returns(uint){
        return amount - amount * fee / division;
    }

    //============================================Admin's functions============================================

    function changeFee(uint _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee must keep under 10%");
        fee = _newFee;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function withdrawTokens(address _to) external onlyOwner {
        IERC20(address(this)).transfer(_to, IERC20(address(this)).balanceOf(address(this)));
    }

    function changeFeeWallet(address _newWallet) external onlyOwner {
        feeWallet = _newWallet;
    }

    function addToBlacklist(address user) external onlyOwner {
        blacklist[user] = true;
    }

    function removeBlacklist(address user) external onlyOwner {
        blacklist[user] = false;
    }
    
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner() || msg.sender == vestingContract || msg.sender == ICOContract, "Incorrect msg.sender");
        _mint(to, amount);
    }

}