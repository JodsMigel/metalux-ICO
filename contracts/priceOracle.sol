//SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";

contract UniswapV3PriceOracle {

    address factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;

    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint24 fee,
        uint32 secondsAgo
    ) external view returns (uint amountOut) {

        address pool = IUniswapV3Factory(factory).getPool(
            tokenIn,
            tokenOut,
            fee
        );

        if(pool == address(0)) {
            pool = IUniswapV3Factory(factory).getPool(
            tokenIn,
            tokenOut,
            500
            );
        }

        require(pool != address(0), "pool doesn't exist");
        
        // (int24 tick, ) = OracleLibrary.consult(pool, secondsAgo);

        uint32[] memory secondsAgos = new uint32[](2);
        secondsAgos[0] = secondsAgo;
        secondsAgos[1] = 0;

        (int56[] memory tickCumulatives, ) = IUniswapV3Pool(pool).observe(
            secondsAgos
        );

        int56 tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];

        int24 tick = int24(tickCumulativesDelta / secondsAgo);

        if (
            tickCumulativesDelta < 0 && (tickCumulativesDelta % secondsAgo != 0)
        ) {
            tick--;
        }

        amountOut = OracleLibrary.getQuoteAtTick(
            tick,
            amountIn,
            tokenIn,
            tokenOut
        );
    }
}