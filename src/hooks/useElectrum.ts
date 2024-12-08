import { ElectrumClient } from '@electrum-cash/network';
import { initializeElectrumClient, fetchUnspentTransactionOutputs } from '@electrum-cash/protocol';
import {Contract} from "cashscript"
import BRIDGE_ABI from '../contracts/abis/bch/bridge';
import ISSUER_ABI from '../contracts/abis/bch/issuer';
import { Transaction } from '../types';

interface UTXO {
  txid: string;
  vout: number;
  value: number;
  height: number;
  confirmations: number;
  scriptPubKey: string; 
}

export const useElectrum = () => {

  const getClient = async () => {
    return new ElectrumClient(
      'Token Bridge',
      '1.5.3',
      'fulcrum.greyh.at'
    );

    // return await initializeElectrumClient('Electrum Protocol Test', 'fulcrum.greyh.at');
  }

  const claimToken = async (transaction: Transaction) => {
    if(!transaction.data) return [];
    const client = await getClient();

    const utxos = await fetchUnspentTransactionOutputs(client, transaction.data, true, true);
    const targetUtxo = utxos.find(utxo => 
      // @ts-ignore
      utxo.token_data?.category === '8b5e273114a5002d914d68cd8ff90b0f38afc3827ca2a7ffa91fce26432f4c3d'
    );

    console.log('found target utxo:', targetUtxo);
    

    await client.disconnect();
    return targetUtxo;

  }


  const fetchUTXOs = async (address: string): Promise<UTXO[] | any> => {
    if(!address) return [];
    // const client = getClient();

    // const handleAddressStatusUpdates = (address: string, status: string) => {
    //   console.log('address:', address, 'status:', status);
    // };

    // // client.on('blockchain.address.subscribe', handleAddressStatusUpdates);


    try {
      return
    //   if(!address) return [];

    //   await client.connect();

    //   console.log('client connected', address);

    //         // Declare an example transaction ID.
    //   const transactionID = '4db095f34d632a4daf942142c291f1f2abb5ba2e1ccac919d85bdc2f671fb251';

    //   // Request the full transaction hex for the transaction ID.
    //   const transactionHex = await client.request('blockchain.transaction.get', transactionID);

    //   // Print out the transaction hex.
    //   console.log(transactionHex);

    //   const utxos = await fetchUnspentTransactionOutputs(client, address, true, true);
    //   console.log('unspent outputs', utxos);
      

      
    //   // const utxos = await client.request(
    //   //   'blockchain.address.listunspent',
    //   //   [undefined, undefined, [address]]
    //   // ) as any[];

    //   console.log('utxos:', utxos);
      
    //   // return utxos.map(utxo => ({
    //   //   txid: utxo.tx_hash,
    //   //   vout: utxo.tx_pos,
    //   //   value: utxo.value,
    //   //   height: utxo.height,
    //   //   confirmations: utxo.confirmations || 0,
    //   //   scriptPubKey: utxo.scriptPubKey
    //   // }));
    } catch (error) {
      console.error('Error fetching UTXOs:', error);
      throw error;
    } finally {
      // if (!client.disconnected) {
      //   await client.disconnect();
      // }
    }
  };

  return {
    claimToken,
    fetchUTXOs
  };
};