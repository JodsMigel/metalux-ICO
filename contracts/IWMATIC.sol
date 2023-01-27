
pragma solidity ^0.4.18;

interface IWMATIC {

    function balanceOf(address owner) external view returns(uint);

    function deposit() external payable;

    function approve(address guy, uint wad) external returns (bool);

    function transfer(address dst, uint wad) external returns (bool);

    function transferFrom(address src, address dst, uint wad)
        external
        returns (bool);
}

