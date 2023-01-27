// SeedRound contract args


const allowedTokens = ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                           "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
                           "0xb33eaad8d922b1083446dc23f610c2567fb5180f", "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
                           "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
                           "0xd6df932a45c0f255f85145f286ea0b292b21c90b"];

const oracle = "0x5d0a0f17f692d4ede36ca5d42e4de556660e9195"
const rd = "0xA736e0aCF152e5BE5d577586bFcA999c60C5f972"
const FEEWALLET = "0xbA4137D7FB8Cfe37efB3Cc3A3559DdBc0d562921";
module.exports = [
    oracle,
    rd,
    allowedTokens,
];