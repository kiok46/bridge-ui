const BRIDGE_ABI = {
  "contractName": "Bridge",
  "constructorInputs": [
    {
      "name": "bridgeTokenCategory",
      "type": "bytes"
    },
    {
      "name": "claimTokenCategory",
      "type": "bytes"
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
      "name": "claim",
      "inputs": []
    },
    {
      "name": "exit",
      "inputs": []
    }
  ],
  "bytecode": "OP_2 OP_PICK OP_0 OP_NUMEQUAL OP_IF OP_4 OP_ROLL OP_4 OP_ROLL OP_CHECKSIG OP_NIP OP_NIP OP_NIP OP_ELSE OP_2 OP_PICK OP_1 OP_NUMEQUAL OP_IF OP_TXOUTPUTCOUNT OP_3 OP_NUMEQUALVERIFY OP_INPUTINDEX OP_0 OP_NUMEQUALVERIFY OP_INPUTINDEX OP_UTXOBYTECODE OP_INPUTINDEX OP_OUTPUTBYTECODE OP_EQUALVERIFY OP_INPUTINDEX OP_UTXOTOKENCATEGORY OP_INPUTINDEX OP_OUTPUTTOKENCATEGORY OP_EQUALVERIFY OP_INPUTINDEX OP_UTXOTOKENCATEGORY 20 OP_SPLIT OP_DROP OP_OVER OP_EQUALVERIFY OP_INPUTINDEX OP_1ADD OP_UTXOTOKENCATEGORY 20 OP_SPLIT OP_SWAP OP_3 OP_ROLL OP_EQUALVERIFY OP_0 OP_EQUALVERIFY OP_INPUTINDEX OP_1ADD OP_UTXOTOKENCOMMITMENT OP_8 OP_SPLIT OP_BIN2NUM OP_CHECKSEQUENCEVERIFY OP_DROP OP_BIN2NUM OP_INPUTINDEX OP_UTXOTOKENAMOUNT OP_INPUTINDEX OP_OUTPUTTOKENAMOUNT OP_SWAP OP_2 OP_PICK OP_SUB OP_NUMEQUALVERIFY OP_INPUTINDEX OP_1ADD OP_OUTPUTTOKENAMOUNT OP_NUMEQUALVERIFY OP_INPUTINDEX OP_1ADD OP_OUTPUTTOKENCATEGORY 20 OP_SPLIT OP_DROP OP_EQUALVERIFY OP_INPUTINDEX OP_1ADD OP_UTXOBYTECODE OP_INPUTINDEX OP_1ADD OP_OUTPUTBYTECODE OP_EQUALVERIFY OP_INPUTINDEX OP_2 OP_ADD OP_OUTPUTTOKENCATEGORY OP_0 OP_EQUAL OP_NIP OP_ELSE OP_ROT OP_2 OP_NUMEQUALVERIFY OP_TXOUTPUTCOUNT OP_3 OP_NUMEQUALVERIFY OP_INPUTINDEX OP_0 OP_NUMEQUALVERIFY OP_INPUTINDEX OP_UTXOBYTECODE OP_INPUTINDEX OP_OUTPUTBYTECODE OP_EQUALVERIFY OP_INPUTINDEX OP_UTXOTOKENCATEGORY 20 OP_SPLIT OP_DROP OP_EQUALVERIFY OP_INPUTINDEX OP_UTXOTOKENAMOUNT OP_INPUTINDEX OP_1ADD OP_UTXOTOKENAMOUNT OP_INPUTINDEX OP_OUTPUTTOKENAMOUNT OP_ROT OP_ROT OP_ADD OP_NUMEQUALVERIFY OP_INPUTINDEX OP_1ADD OP_OUTPUTBYTECODE OP_1 OP_SPLIT OP_DROP 6a OP_EQUALVERIFY OP_INPUTINDEX OP_2 OP_ADD OP_OUTPUTTOKENCATEGORY OP_0 OP_EQUAL OP_NIP OP_ENDIF OP_ENDIF",
  "source": "pragma cashscript ^0.10.2;\n\n/**\n * @title Bridge Contract\n */\ncontract Bridge(\n  bytes bridgeTokenCategory,\n  bytes claimTokenCategory\n) {\n\n  function transfer(pubkey pk, sig s) {\n    require(checkSig(s, pk));\n  }\n\n  /**\n   * Allows anyone to provide a matured claim NFT and withdraw funds from the contract.\n   *\n   * Inputs:\n   * 0. Contract input (with reserve supply)\n   * 1. Claim NFT input\n   *\n   * Outputs:\n   * 0. Contract output (with updated reserve supply)\n   * 1. Token output to the NFT owner\n   * 2. BCH change output (implicitly burns the NFT and change)\n   */\n  function claim() {\n    // Ensure there are exactly 3 outputs\n    require(tx.outputs.length == 3);\n    // Maintains the authhead and accounts for reserve supply for various explorers.\n    require(this.activeInputIndex == 0);\n\n    // Check that the funds are sent back to the contract\n    bytes contractLock = tx.inputs[this.activeInputIndex].lockingBytecode;\n    require(tx.outputs[this.activeInputIndex].lockingBytecode == contractLock);\n\n    // Verify that the contract input and output match\n    require(tx.inputs[this.activeInputIndex].tokenCategory == tx.outputs[this.activeInputIndex].tokenCategory);\n\n    // Ensure the contract input/output is of the bridge token category\n    bytes bridgeReserveSupplyCategory = tx.inputs[this.activeInputIndex].tokenCategory.split(32)[0];\n    require(bridgeReserveSupplyCategory == bridgeTokenCategory);\n\n    bytes inputCategory, bytes inputCapability = tx.inputs[this.activeInputIndex+1].tokenCategory.split(32);\n    require(inputCategory == claimTokenCategory);\n    require(inputCapability == 0x); // Ensure immutable capability\n\n    // Extract amount and min age from NFT commitment\n    bytes amountFromNFT, bytes minAgeFromNFT = tx.inputs[this.activeInputIndex+1].nftCommitment.split(8);\n\n    int minAge = int(minAgeFromNFT);\n    // Ensure the min age has expired\n    require(tx.age >= minAge);\n    int amount = int(amountFromNFT);\n    \n    // Token Amount checks\n    int reserveAmount = tx.inputs[this.activeInputIndex].tokenAmount;\n    require(tx.outputs[this.activeInputIndex].tokenAmount == reserveAmount - amount);\n\n    // Ensure the token amount being claimed is correct.\n    require(tx.outputs[this.activeInputIndex+1].tokenAmount == amount);\n    // Ensure the withdrawn tokens are of the bridge token category\n    require(tx.outputs[this.activeInputIndex+1].tokenCategory.split(32)[0] == bridgeTokenCategory);\n    // Verify that the withdrawn tokens go to the NFT owner\n    require(tx.inputs[this.activeInputIndex+1].lockingBytecode == tx.outputs[this.activeInputIndex+1].lockingBytecode);\n\n    // Ensure the third output is BCH change, implicitly burning the NFT\n    require(tx.outputs[this.activeInputIndex+2].tokenCategory == 0x);\n  }\n\n\n  /**\n   * Allows anyone to deposit tokens to the contract and start the process of bridging out of the Blockchain.\n   *\n   * Inputs:\n   * 0. Contract input (with reserve supply)\n   * 1. Token Input from the user.\n   * 2. BCH funder utxo.\n   *\n   * Outputs:\n   * 0. Contract output (with updated reserve supply)  [previous reserve + new amount from the user]\n   * 1. OP_RETURN with information about the address that must receive the funds. It is the responsibility of the caller to ensure that the address is valid.\n   * 2. BCH change output\n   */\n  function exit(){\n     // Ensure there are exactly 3 outputs\n    require(tx.outputs.length == 3);\n    // Maintains the authhead and accounts for reserve supply for various explorers.\n    require(this.activeInputIndex == 0);\n\n    // Check that the funds are sent back to the contract\n    bytes contractLock = tx.inputs[this.activeInputIndex].lockingBytecode;\n    require(tx.outputs[this.activeInputIndex].lockingBytecode == contractLock);\n\n    // Ensure the contract input/output is of the bridge token category\n    bytes bridgeReserveSupplyCategory = tx.inputs[this.activeInputIndex].tokenCategory.split(32)[0];\n    require(bridgeReserveSupplyCategory == bridgeTokenCategory);\n\n    int reserveAmount = tx.inputs[this.activeInputIndex].tokenAmount;\n    // Amount of tokens being deposited\n    int amount = tx.inputs[this.activeInputIndex+1].tokenAmount;\n    // // Ensure that the amount is being sent back to the contract.\n    require(tx.outputs[this.activeInputIndex].tokenAmount == reserveAmount + amount);\n    // Require that the 2nd outputs is an OP_RETURN that contains all the metadata about the address that must receive fund.\n    require(tx.outputs[this.activeInputIndex+1].lockingBytecode.split(1)[0] == 0x6a);\n    // Ensure the third output is BCH change\n    require(tx.outputs[this.activeInputIndex+2].tokenCategory == 0x);\n  }\n}",
  "debug": {
    "bytecode": "5279009c63547a547aac777777675279519c63c4539c69c0009c69c0c7c0cd517a8769c0cec0d18769c0ce01207f75007a51798769c05193ce01207f517a537a8769007a008769c05193cf587f007a81007ab275007a81c0d0c0d3517a5279949c69c05193d3517a9c69c05193d101207f75517a8769c05193c7c05193cd8769c05293d100877767527a529c69c4539c69c0009c69c0c7c0cd517a8769c0ce01207f75007a517a8769c0d0c05193d0c0d3527a527a939c69c05193cd517f75016a8769c05293d10087776868",
    "sourceMap": "11:2:13:3;;;;;12:21:12:22;;:24::26;;:12::27:1;11:2:13:3;;;;27::69::0;;;;;29:12:29:29;:33::34;:12:::1;:4::36;31:12:31:33:0;:37::38;:12:::1;:4::40;34:35:34:56:0;:25::73:1;35:23:35:44:0;:12::61:1;:65::77:0;;:12:::1;:4::79;38:22:38:43:0;:12::58:1;:73::94:0;:62::109:1;:12;:4::111;41:50:41:71:0;:40::86:1;:93::95:0;:40::96:1;:::99;42:12:42:39:0;;:43::62;;:12:::1;:4::64;44:59:44:80:0;:81::82;:59:::1;:49::97;:104::106:0;:49::107:1;45:12:45:25:0;;:29::47;;:12:::1;:4::49;46:12:46:27:0;;:31::33;:12:::1;:4::35;49:57:49:78:0;:79::80;:57:::1;:47::95;:102::103:0;:47::104:1;51:21:51:34:0;;:17::35:1;53:22:53:28:0;;:4::30:1;;54:21:54:34:0;;:17::35:1;57:34:57:55:0;:24::68:1;58:23:58:44:0;:12::57:1;:61::74:0;;:77::83;;:61:::1;:12;:4::85;61:23:61:44:0;:45::46;:23:::1;:12::59;:63::69:0;;:12:::1;:4::71;63:23:63:44:0;:45::46;:23:::1;:12::61;:68::70:0;:12::71:1;:::74;:78::97:0;;:12:::1;:4::99;65:22:65:43:0;:44::45;:22:::1;:12::62;:77::98:0;:99::100;:77:::1;:66::117;:12;:4::119;68:23:68:44:0;:45::46;:23:::1;:12::61;:65::67:0;:12:::1;27:2:69:3;;85::108::0;;;;;87:12:87:29;:33::34;:12:::1;:4::36;89:12:89:33:0;:37::38;:12:::1;:4::40;92:35:92:56:0;:25::73:1;93:23:93:44:0;:12::61:1;:65::77:0;;:12:::1;:4::79;96:50:96:71:0;:40::86:1;:93::95:0;:40::96:1;:::99;97:12:97:39:0;;:43::62;;:12:::1;:4::64;99:34:99:55:0;:24::68:1;101:27:101:48:0;:49::50;:27:::1;:17::63;103:23:103:44:0;:12::57:1;:61::74:0;;:77::83;;:61:::1;:12;:4::85;105:23:105:44:0;:45::46;:23:::1;:12::63;:70::71:0;:12::72:1;:::75;:79::83:0;:12:::1;:4::85;107:23:107:44:0;:45::46;:23:::1;:12::61;:65::67:0;:12:::1;85:2:108:3;6:0:109:1;",
    "logs": [],
    "requires": [
      {
        "ip": 12,
        "line": 12
      },
      {
        "ip": 24,
        "line": 29
      },
      {
        "ip": 28,
        "line": 31
      },
      {
        "ip": 36,
        "line": 35
      },
      {
        "ip": 42,
        "line": 38
      },
      {
        "ip": 53,
        "line": 42
      },
      {
        "ip": 65,
        "line": 45
      },
      {
        "ip": 70,
        "line": 46
      },
      {
        "ip": 82,
        "line": 53
      },
      {
        "ip": 97,
        "line": 58
      },
      {
        "ip": 105,
        "line": 61
      },
      {
        "ip": 116,
        "line": 63
      },
      {
        "ip": 126,
        "line": 65
      },
      {
        "ip": 133,
        "line": 68
      },
      {
        "ip": 143,
        "line": 87
      },
      {
        "ip": 147,
        "line": 89
      },
      {
        "ip": 155,
        "line": 93
      },
      {
        "ip": 166,
        "line": 97
      },
      {
        "ip": 181,
        "line": 103
      },
      {
        "ip": 191,
        "line": 105
      },
      {
        "ip": 198,
        "line": 107
      }
    ]
  },
  "compiler": {
    "name": "cashc",
    "version": "0.10.2"
  },
  "updatedAt": "2024-11-18T03:57:59.551Z"
}

export default BRIDGE_ABI;