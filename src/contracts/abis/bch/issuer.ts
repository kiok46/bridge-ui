const ISSUER_ABI = {
  "contractName": "Issuer",
  "constructorInputs": [
    {
      "name": "ownerPKH",
      "type": "bytes20"
    },
    {
      "name": "claimTokenCategory",
      "type": "bytes"
    },
    {
      "name": "minAge",
      "type": "int"
    }
  ],
  "abi": [
    {
      "name": "transfer",
      "inputs": [
        {
          "name": "pk",
          "type": "pubkey"
        },
        {
          "name": "s",
          "type": "sig"
        }
      ]
    },
    {
      "name": "issue",
      "inputs": [
        {
          "name": "pk",
          "type": "pubkey"
        },
        {
          "name": "s",
          "type": "sig"
        },
        {
          "name": "amount",
          "type": "int"
        }
      ]
    }
  ],
  "bytecode": "OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF OP_4 OP_PICK OP_HASH160 OP_EQUALVERIFY OP_4 OP_ROLL OP_4 OP_ROLL OP_CHECKSIG OP_NIP OP_NIP OP_NIP OP_ELSE OP_3 OP_ROLL OP_1 OP_NUMEQUALVERIFY OP_INPUTINDEX OP_UTXOTOKENCATEGORY OP_INPUTINDEX OP_OUTPUTTOKENCATEGORY OP_EQUALVERIFY OP_INPUTINDEX OP_OUTPUTTOKENCATEGORY 20 OP_SPLIT OP_SWAP OP_3 OP_PICK OP_EQUALVERIFY OP_2 OP_EQUALVERIFY OP_INPUTINDEX OP_UTXOBYTECODE OP_INPUTINDEX OP_OUTPUTBYTECODE OP_EQUALVERIFY OP_INPUTINDEX OP_1ADD OP_OUTPUTTOKENCATEGORY 20 OP_SPLIT OP_SWAP OP_3 OP_ROLL OP_EQUALVERIFY OP_0 OP_EQUALVERIFY OP_4 OP_ROLL OP_8 OP_NUM2BIN OP_ROT OP_8 OP_NUM2BIN OP_CAT OP_INPUTINDEX OP_1ADD OP_OUTPUTTOKENCOMMITMENT OP_EQUALVERIFY OP_OVER OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG OP_ENDIF",
  "source": "pragma cashscript ^0.10.2;\n\n/**\n * @title Issuer\n * @notice This contract is responsible for minting and withdrawing tokens from the contract.\n */\ncontract Issuer(\n  bytes20 ownerPKH,\n  bytes claimTokenCategory,\n  int minAge\n) {\n\n  function transfer(pubkey pk, sig s) {\n    require(hash160(pk) == ownerPKH);\n    require(checkSig(s, pk));\n  }\n\n  /**\n   * @notice Issues new tokens.\n   * @param pk The public key of the owner\n   * @param s The signature of the owner\n   * @param amount The amount of tokens to issue\n   */\n  function issue(pubkey pk, sig s, int amount) {\n    // Ensure that the NFT is of minting capability and the tokencategory is of the claimCategory.\n    require(tx.inputs[this.activeInputIndex].tokenCategory == tx.outputs[this.activeInputIndex].tokenCategory);\n    bytes mintClaimCategory, bytes mintClaimCapability = tx.outputs[this.activeInputIndex].tokenCategory.split(32);\n    require(mintClaimCategory == claimTokenCategory);\n    require(mintClaimCapability == 0x02);\n\n    // Check that the funds are sent back to the contract\n    bytes contractLock = tx.inputs[this.activeInputIndex].lockingBytecode;\n    require(tx.outputs[this.activeInputIndex].lockingBytecode == contractLock);\n\n    // Check that the NFT send to the entity is of claimCategory and has the immutable capability.\n    bytes entityClaimCategory, bytes entityClaimCapability = tx.outputs[this.activeInputIndex+1].tokenCategory.split(32);\n    require(entityClaimCategory == claimTokenCategory);\n    require(entityClaimCapability == 0x);\n\n    // This NFT is given to the user to keep track of the amount that can be withdrawn from the contract.\n    // Once the timelock is over, the user can call the withdraw function to burn the NFT and get the funds from the contract.\n\n    bytes expectedCommitment = bytes8(amount) + bytes8(minAge);\n    require(tx.outputs[this.activeInputIndex+1].nftCommitment == expectedCommitment);\n\n    require(hash160(pk) == ownerPKH);\n    require(checkSig(s, pk));\n  }\n\n}",
  "debug": {
    "bytecode": "5379009c635479a9517a8769547a547aac77777767537a519c69c0cec0d18769c0d101207f517a53798769007a528769c0c7c0cd517a8769c05193d101207f517a537a8769007a008769547a5880527a58807ec05193d2517a87695179a9517a8769517a517aac68",
    "sourceMap": "13:2:16:3;;;;;14:20:14:22;;:12::23:1;:27::35:0;;:12:::1;:4::37;15:21:15:22:0;;:24::26;;:12::27:1;13:2:16:3;;;;24::48::0;;;;;26:22:26:43;:12::58:1;:73::94:0;:62::109:1;:12;:4::111;27:68:27:89:0;:57::104:1;:111::113:0;:57::114:1;28:12:28:29:0;;:33::51;;:12:::1;:4::53;29:12:29:31:0;;:35::39;:12:::1;:4::41;32:35:32:56:0;:25::73:1;33:23:33:44:0;:12::61:1;:65::77:0;;:12:::1;:4::79;36:72:36:93:0;:94::95;:72:::1;:61::110;:117::119:0;:61::120:1;37:12:37:31:0;;:35::53;;:12:::1;:4::55;38:12:38:33:0;;:37::39;:12:::1;:4::41;43:38:43:44:0;;:31::45:1;;:55::61:0;;:48::62:1;;:31;44:23:44:44:0;:45::46;:23:::1;:12::61;:65::83:0;;:12:::1;:4::85;46:20:46:22:0;;:12::23:1;:27::35:0;;:12:::1;:4::37;47:21:47:22:0;;:24::26;;:12::27:1;7:0:50:1",
    "logs": [],
    "requires": [
      {
        "ip": 14,
        "line": 14
      },
      {
        "ip": 20,
        "line": 15
      },
      {
        "ip": 34,
        "line": 26
      },
      {
        "ip": 44,
        "line": 28
      },
      {
        "ip": 49,
        "line": 29
      },
      {
        "ip": 57,
        "line": 33
      },
      {
        "ip": 69,
        "line": 37
      },
      {
        "ip": 74,
        "line": 38
      },
      {
        "ip": 91,
        "line": 44
      },
      {
        "ip": 98,
        "line": 46
      },
      {
        "ip": 104,
        "line": 47
      }
    ]
  },
  "compiler": {
    "name": "cashc",
    "version": "0.10.2"
  },
  "updatedAt": "2024-11-18T03:57:59.202Z"
}

export default ISSUER_ABI;