export const codeFiles = {
  bchIssuerContract: `pragma cashscript ^0.10.2;

/**
 * @title Issuer
 * @notice This contract is responsible for minting and withdrawing tokens from the contract.
 */
contract Issuer(
  bytes20 coSigner1,
  bytes claimTokenCategory
) {

  /**
   * @notice Issues new tokens.
   * @param pk The public key of the owner
   * @param s The signature of the owner
   * @param amount The amount of tokens to issue
   */
  function issue(sig s, int amount) {
    // Ensure that the NFT is of minting capability and the tokencategory is of the claimCategory.
    require(tx.inputs[this.activeInputIndex].tokenCategory == tx.outputs[this.activeInputIndex].tokenCategory);
    bytes mintClaimCategory, bytes mintClaimCapability = tx.outputs[this.activeInputIndex].tokenCategory.split(32);
    require(mintClaimCategory == claimTokenCategory);
    require(mintClaimCapability == 0x02);

    // Check that the funds are sent back to the contract
    bytes contractLock = tx.inputs[this.activeInputIndex].lockingBytecode;
    require(tx.outputs[this.activeInputIndex].lockingBytecode == contractLock);

    // Check that the NFT send to the entity is of claimCategory and has the immutable capability.
    bytes entityClaimCategory, bytes entityClaimCapability = tx.outputs[this.activeInputIndex+1].tokenCategory.split(32);
    require(entityClaimCategory == claimTokenCategory);
    require(entityClaimCapability == 0x);

    // This NFT is given to the user to keep track of the amount that can be withdrawn from the contract.
    // Once the timelock is over, the user can call the withdraw function to burn the NFT and get the funds from the contract.

    bytes expectedCommitment = bytes8(amount) + bytes8(minAge);
    require(tx.outputs[this.activeInputIndex+1].nftCommitment == expectedCommitment);

    require(hash160(pk) == coSigner1);
    require(checkSig(s, pk));

    // TODO: Replace with checkMultiSigVerify
    // require(checkMultiSigVerify([s], LockingBytecodeP2PKH(ownerPKH)));
  }

}`,

  bchBridgeContract: `pragma cashscript ^0.10.2;

/**
 * @title Bridge Contract
 */
contract Bridge(
  bytes bridgeTokenCategory,
  bytes claimTokenCategory
) {

  function transfer(pubkey pk, sig s) {
    require(checkSig(s, pk));
  }

  /**
   * Allows anyone to provide a matured claim NFT and withdraw funds from the contract.
   *
   * Inputs:
   * 0. Contract input (with reserve supply)
   * 1. Claim NFT input
   *
   * Outputs:
   * 0. Contract output (with updated reserve supply)
   * 1. Token output to the NFT owner
   * 2. BCH change output (implicitly burns the NFT and change)
   */
  function claim() {
    // Ensure there are exactly 3 outputs
    require(tx.outputs.length == 3);
    // Maintains the authhead and accounts for reserve supply for various explorers.
    require(this.activeInputIndex == 0);

    // Check that the funds are sent back to the contract
    bytes contractLock = tx.inputs[this.activeInputIndex].lockingBytecode;
    require(tx.outputs[this.activeInputIndex].lockingBytecode == contractLock);

    // Verify that the contract input and output match
    require(tx.inputs[this.activeInputIndex].tokenCategory == tx.outputs[this.activeInputIndex].tokenCategory);

    // Ensure the contract input/output is of the bridge token category
    bytes bridgeReserveSupplyCategory = tx.inputs[this.activeInputIndex].tokenCategory.split(32)[0];
    require(bridgeReserveSupplyCategory == bridgeTokenCategory);

    bytes inputCategory, bytes inputCapability = tx.inputs[this.activeInputIndex+1].tokenCategory.split(32);
    require(inputCategory == claimTokenCategory);
    require(inputCapability == 0x); // Ensure immutable capability

    // Extract amount and min age from NFT commitment
    bytes amountFromNFT, bytes minAgeFromNFT = tx.inputs[this.activeInputIndex+1].nftCommitment.split(8);

    int minAge = int(minAgeFromNFT);
    // Ensure the min age has expired
    require(tx.age >= minAge);
    int amount = int(amountFromNFT);
    
    // Token Amount checks
    int reserveAmount = tx.inputs[this.activeInputIndex].tokenAmount;
    require(tx.outputs[this.activeInputIndex].tokenAmount == reserveAmount - amount);

    // Ensure the token amount being claimed is correct.
    require(tx.outputs[this.activeInputIndex+1].tokenAmount == amount);
    // Ensure the withdrawn tokens are of the bridge token category
    require(tx.outputs[this.activeInputIndex+1].tokenCategory.split(32)[0] == bridgeTokenCategory);
    // Verify that the withdrawn tokens go to the NFT owner
    require(tx.inputs[this.activeInputIndex+1].lockingBytecode == tx.outputs[this.activeInputIndex+1].lockingBytecode);

    // Ensure the third output is BCH change, implicitly burning the NFT
    require(tx.outputs[this.activeInputIndex+2].tokenCategory == 0x);
  }


  /**
   * Allows anyone to deposit tokens to the contract and start the process of bridging out of the Blockchain.
   *
   * Inputs:
   * 0. Contract input (with reserve supply)
   * 1. Token Input from the user.
   * 2. BCH funder utxo.
   *
   * Outputs:
   * 0. Contract output (with updated reserve supply)  [previous reserve + new amount from the user]
   * 1. OP_RETURN with information about the address that must receive the funds. It is the responsibility of the caller to ensure that the address is valid.
   * 2. BCH change output
   */
  function exit(){
     // Ensure there are exactly 3 outputs
    require(tx.outputs.length == 3);
    // Maintains the authhead and accounts for reserve supply for various explorers.
    require(this.activeInputIndex == 0);

    // Check that the funds are sent back to the contract
    bytes contractLock = tx.inputs[this.activeInputIndex].lockingBytecode;
    require(tx.outputs[this.activeInputIndex].lockingBytecode == contractLock);

    // Ensure the contract input/output is of the bridge token category
    bytes bridgeReserveSupplyCategory = tx.inputs[this.activeInputIndex].tokenCategory.split(32)[0];
    require(bridgeReserveSupplyCategory == bridgeTokenCategory);

    int reserveAmount = tx.inputs[this.activeInputIndex].tokenAmount;
    // Amount of tokens being deposited
    int amount = tx.inputs[this.activeInputIndex+1].tokenAmount;
    // // Ensure that the amount is being sent back to the contract.
    require(tx.outputs[this.activeInputIndex].tokenAmount == reserveAmount + amount);
    // Require that the 2nd outputs is an OP_RETURN that contains all the metadata about the address that must receive fund.
    require(tx.outputs[this.activeInputIndex+1].lockingBytecode.split(1)[0] == 0x6a);
    // Ensure the third output is BCH change
    require(tx.outputs[this.activeInputIndex+2].tokenCategory == 0x);
  }
}`,

  evmBridgeContract: `pragma solidity 0.8.24;

  /**
   * @title BridgeUSDT
   * @dev A contract for swapping USDT tokens with built-in fee mechanism and admin controls.
   * @notice This contract allows users to request minting of tokens and admins to process withdrawals.
   */
  contract BridgeUSDT is Modifiers {
    using SafeERC20 for IERC20;
  
    /// @notice Getting a message-hash
    /// @param _message Message that was signed
    /// @param recipient Recipient address
    /// @return bytes32 Message hash
    function getMessageHash(
      bytes32 _message,
      uint256 amount,
      address recipient
    ) public pure returns (bytes32) {
      return keccak256(abi.encodePacked(_message, recipient, amount));
    }
  
    /// @notice Creating the signed message hash of a message-hash
    /// @param _messageHash Message hash
    function getEthSignedMessageHash(
      bytes32 _messageHash
    ) public pure returns (bytes32) {
      /*
              Signature is produced by signing a keccak256 hash with the following format:
              "\x19Ethereum Signed Message\n" + len(msg) + msg
              */
      return
        keccak256(
          abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );
    }
  
    /// @notice Recover the address of the signer of a message.
    /// @param _ethSignedMessageHash The hash of the signed message
    /// @return address
    function recoverSigner(
      bytes32 _ethSignedMessageHash,
      bytes memory _signature
    ) public pure returns (address) {
      (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
  
      return ecrecover(_ethSignedMessageHash, v, r, s);
    }
  
    function splitSignature(
      bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
      if (sig.length != 65) {
        revert InvalidSignatureLength();
      }
  
      assembly {
        /*
                      First 32 bytes stores the length of the signature
  
                      add(sig, 32) = pointer of sig + 32
                      effectively, skips first 32 bytes of signature
  
                      mload(p) loads next 32 bytes starting at the memory address p into memory
                      */
  
        // first 32 bytes, after the length prefix
        r := mload(add(sig, 32))
        // second 32 bytes
        s := mload(add(sig, 64))
        // final byte (first byte of the next 32 bytes)
        v := byte(0, mload(add(sig, 96)))
      }
  
      // implicitly return (r, s, v)
    }
  
    /**
     * @notice Initiates a request to mint tokens on the Bitcoin Cash Blockchain.
     * @dev This function handles the transfer of USDT from the user, calculates and deducts a fee,
     *      and emits a Bridge event to signal the mint request.
     * @param amount The total amount of tokens the user wishes to mint.
     * @param data A string containing additional information related to the mint request,
     *             specifically the receiver's BCH cash address.
     *
     * Requirements:
     * - The 'amount' must be greater than zero.
     * - The caller must not be a contract.
     * - The contract must not be paused.
     *
     * Emits a {Bridge} event indicating the successful initiation of a mint request.
     */
    function bridgeToBCH(
      uint256 amount,
      string calldata data
    ) external nonReentrant whenNotPaused nonContract {
      AppStorage storage ds = LibAppStorage.diamondStorage();
  
      require(amount > 0, "Amount must be greater than 0");
  
      uint256 fee = (amount * ds.feeBP) / 10000;
      uint256 amountAfterFee = amount - fee;
  
      IERC20 usdtToken = IERC20(ds.usdtToken);
  
      usdtToken.safeTransferFrom(msg.sender, address(this), amount);
      usdtToken.safeTransfer(ds.feeAddress, fee);
  
      emit LibEvents.Bridge(msg.sender, amountAfterFee, data);
    }
  
    /**
     * @notice Initiates an exit request for a specified amount of tokens.
     * @dev This function records an exit request, ensuring the transaction ID is unique and unused.
     * @param amount The amount of tokens the user wishes to exit with.
     * @param data The unique transaction ID associated with the exit on the BCH Blockchain.
     *
     * Requirements:
     * - The amount must be greater than zero.
     * - The data (transaction ID) must not have been used in a previous exit request.
     *
     * Emits a {StartExit} event indicating the initiation of an exit request.
     */
    function startExit(
      uint256 amount,
      string calldata data
    ) external nonReentrant whenNotPaused nonContract {
      AppStorage storage ds = LibAppStorage.diamondStorage();
  
      require(amount > 0, "Amount must be greater than 0");
  
      // Ensure the transaction ID (data) is unique and not previously used.
      bytes32 exitId = keccak256(abi.encodePacked(data));
      require(
        ds.exits[exitId].amount == 0 && ds.exits[exitId].processed == false,
        "Exit already exists"
      );
  
      // Record the exit request details in storage.
      ds.exits[exitId] = Exit({
        processed: false,
        user: payable(msg.sender),
        amount: amount,
        signature: "",
        data: data,
        blockNumber: block.number
      });
  
      // Emit an event to signal the start of an exit process.
      emit LibEvents.StartExit(msg.sender, exitId, amount, data);
    }
  
    /**
     * @dev Processes an exit request by verifying the signature and transferring the specified amount of USDT to the user.
     * @param exitId The unique identifier for the exit request.
     * @param sig The signature provided by the owner to authorize the exit.
     *
     * Requirements:
     * - The function can only be called by the contract owner.
     * - The exit must not have been processed already.
     * - The current block number must be greater than or equal to the block number when the exit was requested plus the minimum timelock.
     * - The signature must be valid and signed by the owner.
     *
     * Emits a {ProcessExit} event.
     */
    function processExit(
      bytes32 exitId,
      bytes memory sig
    ) external nonReentrant whenNotPaused nonContract {
      AppStorage storage ds = LibAppStorage.diamondStorage();
  
      // Retrieve the exit request from storage
      Exit storage exit = ds.exits[exitId];
      if (exit.processed) {
        revert ExitAlreadyProcessed();
      }
  
      // Ensure the exit request is ready for processing based on the timelock
      require(
        exit.blockNumber + ds.minTimelock <= block.number,
        "Under processing"
      );
  
      // Generate a message hash from the exit ID, amount, and sender address
      bytes32 messageHash = getMessageHash(exitId, exit.amount, msg.sender);
      bytes32 signedMessageHash = getEthSignedMessageHash(messageHash);
      address signatory = recoverSigner(signedMessageHash, sig);
  
      // Verify the signature is from the owner
      if (signatory != ds.owner) {
        revert InvalidOwnerSignature();
      }
  
      // Mark the exit as processed and store the signature
      exit.processed = true;
      exit.signature = sig;
  
      // Transfer the USDT amount to the user
      IERC20 usdtToken = IERC20(ds.usdtToken);
      usdtToken.safeTransfer(exit.user, exit.amount);
  
      // Emit an event indicating the exit has been processed
      emit LibEvents.ProcessExit(exitId, exit.user, sig);
    }
  }
  `,
  depositCallCode: `
      function deposit(
      uint256 amount,
      address token,
      string calldata data
    ) external nonReentrant whenNotPaused nonContract {
  `,
  coSignerSignatureCode: `
bytes32 messageHash = getMessageHash(exitId, exit.amount, msg.sender, block.chainid);
bytes32 signedMessageHash = getEthSignedMessageHash(messageHash);
address signatory = recoverSigner(signedMessageHash, sig);
  `,
  depositDescription: `
vin0: Token Reserve supply UTXO controlled by the contract
vin1: Funding UTXO

vout0: Token Reserve supply back to the contract - User token UTXO Amount
vout1: Token amount to the address specified in the calldata of the deposit transaction
vout2: OP_RETURN 'transactionHash + chainId' of the EVM chain.
vout3: BCH change output
  `,
  withdrawDescription: `
vin0: Token Reserve supply UTXO controlled by the contract
vin1: User's token UTXO
vin2: Funding UTXO

vout0: Token Reserve supply back to the contract + User token UTXO Amount
vout1: OP_RETURN 'evmaddress + chainId' the address that the user wants to receive the funds on the EVM chain.
vout2: BCH change output
  ` 

}