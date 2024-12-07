import ISSUER_ABI from '../contracts/abis/bch/issuer';
import BRIDGE_ABI from '../contracts/abis/bch/bridge';
import { Contract, ElectrumNetworkProvider, AddressType } from 'cashscript';


const ownerPkh = 'b50bbbabc937c8cb7a54375f0f5d73f8a6a0628f';
const bridgeTokenCategoryNonReversed = '71d29d5239b908fe6996d97680fd2fb9a69596806b25f22ddd223ca58f4767f5'
const claimTokenCategoryNonReversed = '8b5e273114a5002d914d68cd8ff90b0f38afc3827ca2a7ffa91fce26432f4c3d'

let bridgeTokenCategory = '';
let claimTokenCategory = '';

const setCategories = (bridgeTokenCategoryNonReversed, claimTokenCategoryNonReversed) => {
  bridgeTokenCategory = bridgeTokenCategoryNonReversed
    .match(/.{2}/g) // Split into byte pairs
    .reverse()      // Reverse the byte pairs
    .join('');

  claimTokenCategory = claimTokenCategoryNonReversed
    .match(/.{2}/g) // Split into byte pairs
    .reverse()      // Reverse the byte pairs
    .join('');
}

setCategories(bridgeTokenCategoryNonReversed, claimTokenCategoryNonReversed);

const provider = new ElectrumNetworkProvider();
const addressType: AddressType = 'p2sh32';
const options = { provider, addressType }

const IssuerContract = new Contract(ISSUER_ABI, [ownerPkh, claimTokenCategory, BigInt(0)], options);
const BridgeContract = new Contract(BRIDGE_ABI, [bridgeTokenCategory, claimTokenCategory], options);



const claimTokensOnBCH = () => {

}