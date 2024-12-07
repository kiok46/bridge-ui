import { ElectrumClient } from '@electrum-cash/network';
import { fetchUnspentTransactionOutputs } from '@electrum-cash/protocol';
import {Contract} from "cashscript"
import BRIDGE_ABI from '../contracts/abis/bch/bridge';
import ISSUER_ABI from '../contracts/abis/bch/issuer';

interface UTXO {
  txid: string;
  vout: number;
  value: number;
  height: number;
  confirmations: number;
  scriptPubKey: string; 
}

export const useElectrum = () => {
  const fetchUTXOs = async (address: string): Promise<UTXO[] | any> => {
    const client = new ElectrumClient(
      'Token Bridge',
      '1.5.3',
      'fulcrum.greyh.at'
    );

    const handleAddressStatusUpdates = (address: string, status: string) => {
      console.log('address:', address, 'status:', status);
    };

    // client.on('blockchain.address.subscribe', handleAddressStatusUpdates);


    try {
      if(!address) return [];

      await client.connect();

      console.log('client connected', address);

            // Declare an example transaction ID.
      const transactionID = '4db095f34d632a4daf942142c291f1f2abb5ba2e1ccac919d85bdc2f671fb251';

      // Request the full transaction hex for the transaction ID.
      const transactionHex = await client.request('blockchain.transaction.get', transactionID);

      // Print out the transaction hex.
      console.log(transactionHex);

      const utxos = await fetchUnspentTransactionOutputs(client, address, true, true);
      console.log('unspent outputs', utxos);
      

      
      // const utxos = await client.request(
      //   'blockchain.address.listunspent',
      //   [undefined, undefined, [address]]
      // ) as any[];

      console.log('utxos:', utxos);
      
      // return utxos.map(utxo => ({
      //   txid: utxo.tx_hash,
      //   vout: utxo.tx_pos,
      //   value: utxo.value,
      //   height: utxo.height,
      //   confirmations: utxo.confirmations || 0,
      //   scriptPubKey: utxo.scriptPubKey
      // }));
    } catch (error) {
      console.error('Error fetching UTXOs:', error);
      throw error;
    } finally {
      if (!client.disconnected) {
        await client.disconnect();
      }
    }
  };

  return {
    fetchUTXOs
  };
};