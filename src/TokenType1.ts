// require deps
const BITBOXSDK: any = require("bitbox-sdk/lib/bitbox-sdk").default
const BigNumber: any = require("bignumber.js")
const slpjs: any = require("slpjs")

// import interfaces
import {
  ICreateConfig,
  IMintConfig,
  ISendConfig,
  IBurnAllConfig,
  IBurnConfig,
  ICreateP2MSConfig,
  IMintP2MSConfig,
  ISendP2MSConfig,
  IBurnAllP2MsConfig,
  IBurnP2MsConfig,
  ICreateP2PKConfig,
  IMintP2PKConfig
} from "./interfaces/SLPInterfaces"

// import classes
import Address from "./Address"
let addy: any = new Address()

class TokenType1 {
  restURL: string
  BITBOX: any
  constructor(restURL?: string) {
    this.restURL = restURL
    this.BITBOX = new BITBOXSDK()
  }

  async create(createConfig: ICreateConfig) {
    let tmpBITBOX: any = this.returnBITBOXInstance(createConfig.fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )
    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    const fundingAddress: string = addy.toSLPAddress(
      createConfig.fundingAddress
    )
    const fundingWif: string = createConfig.fundingWif
    const tokenReceiverAddress: string = addy.toSLPAddress(
      createConfig.tokenReceiverAddress
    )
    let batonReceiverAddress: string
    if (
      createConfig.batonReceiverAddress !== undefined &&
      createConfig.batonReceiverAddress !== "" &&
      createConfig.batonReceiverAddress !== null
    ) {
      batonReceiverAddress = addy.toSLPAddress(
        createConfig.batonReceiverAddress
      )
    } else {
      batonReceiverAddress = null
    }

    const bchChangeReceiverAddress: string = addy.toSLPAddress(
      createConfig.bchChangeReceiverAddress
    )
    const balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )

    const decimals: number = createConfig.decimals
    const name: string = createConfig.name
    const symbol: string = createConfig.symbol
    const documentUri: string = createConfig.documentUri
    const documentHash: any = createConfig.documentHash

    let initialTokenQty: number = createConfig.initialTokenQty

    initialTokenQty = new BigNumber(initialTokenQty).times(10 ** decimals)
    balances.nonSlpUtxos.forEach((txo: any) => (txo.wif = fundingWif))
    const genesisTxid = await bitboxNetwork.simpleTokenGenesis(
      name,
      symbol,
      initialTokenQty,
      documentUri,
      documentHash,
      decimals,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress,
      balances.nonSlpUtxos
    )
    return genesisTxid
  }

  async mint(mintConfig: IMintConfig) {
    let tmpBITBOX: any = this.returnBITBOXInstance(mintConfig.fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )
    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    const fundingAddress: string = addy.toSLPAddress(mintConfig.fundingAddress)
    const fundingWif: string = mintConfig.fundingWif
    const tokenReceiverAddress: string = addy.toSLPAddress(
      mintConfig.tokenReceiverAddress
    )
    const batonReceiverAddress: string = addy.toSLPAddress(
      mintConfig.batonReceiverAddress
    )
    const bchChangeReceiverAddress: string = addy.toSLPAddress(
      mintConfig.bchChangeReceiverAddress
    )
    const tokenId: string = mintConfig.tokenId
    let additionalTokenQty: number = mintConfig.additionalTokenQty
    let balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )
    if (!balances.slpBatonUtxos[tokenId])
      throw Error("You don't have the minting baton for this token")

    const tokenInfo: any = await bitboxNetwork.getTokenInformation(tokenId)
    let tokenDecimals: number = tokenInfo.decimals

    // 3) Multiply the specified token quantity by 10^(token decimal precision)
    let mintQty = new BigNumber(additionalTokenQty).times(10 ** tokenDecimals)

    // 4) Filter the list to choose ONLY the baton of interest
    // NOTE: (spending other batons for other tokens will result in losing ability to mint those tokens)
    let inputUtxos = balances.slpBatonUtxos[tokenId]

    // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    // 6) Set the proper private key for each Utxo
    inputUtxos.forEach((txo: any) => (txo.wif = fundingWif))

    let mintTxid = await bitboxNetwork.simpleTokenMint(
      tokenId,
      mintQty,
      inputUtxos,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress
    )
    return mintTxid
  }

  async send(sendConfig: ISendConfig) {
    let tmpBITBOX: any = this.returnBITBOXInstance(sendConfig.fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )
    const bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)

    const fundingAddress: string = addy.toSLPAddress(sendConfig.fundingAddress)
    const fundingWif: string = sendConfig.fundingWif
    const tokenReceiverAddress: string = addy.toSLPAddress(
      sendConfig.tokenReceiverAddress
    )
    const bchChangeReceiverAddress: string = addy.toSLPAddress(
      sendConfig.bchChangeReceiverAddress
    )
    let tokenId: string = sendConfig.tokenId
    let amount: number = sendConfig.amount

    const tokenInfo: any = await bitboxNetwork.getTokenInformation(tokenId)
    let tokenDecimals: number = tokenInfo.decimals

    let balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )

    // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
    amount = new BigNumber(amount).times(10 ** tokenDecimals) // Don't forget to account for token precision

    // 4) Get all of our token's UTXOs
    let inputUtxos = balances.slpTokenUtxos[tokenId]

    // 5) Simply sweep our BCH utxos to fuel the transaction
    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    // 6) Set the proper private key for each Utxo
    inputUtxos.forEach((txo: any) => (txo.wif = fundingWif))

    let sendTxid = await bitboxNetwork.simpleTokenSend(
      tokenId,
      amount,
      inputUtxos,
      tokenReceiverAddress,
      bchChangeReceiverAddress
    )
    return sendTxid
  }

  async burnAll(burnAllConfig: IBurnAllConfig) {
    try {
      let tmpBITBOX: any = this.returnBITBOXInstance(
        burnAllConfig.fundingAddress
      )

      const getRawTransactions = async (txids: any) => {
        return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
      }

      const slpValidator: any = new slpjs.LocalValidator(
        tmpBITBOX,
        getRawTransactions
      )
      const bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
      const tokenInfo = await bitboxNetwork.getTokenInformation(
        burnAllConfig.tokenId
      )
      let tokenDecimals = tokenInfo.decimals

      let balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
        burnAllConfig.fundingAddress
      )
      let inputUtxos = balances.slpTokenUtxos[burnAllConfig.tokenId]
      inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

      inputUtxos.forEach((txo: any) => (txo.wif = burnAllConfig.fundingWif))
      let network: string = this.returnNetwork(burnAllConfig.fundingAddress)
      let transactionBuilder: any
      if (network === "mainnet") {
        transactionBuilder = new tmpBITBOX.TransactionBuilder("mainnet")
      } else {
        transactionBuilder = new tmpBITBOX.TransactionBuilder("testnet")
      }

      let originalAmount: number = 0
      inputUtxos.forEach((utxo: any) => {
        // index of vout
        let vout: string = utxo.vout

        // txid of vout
        let txid: string = utxo.txid

        // add input with txid and index of vout
        transactionBuilder.addInput(txid, vout)

        originalAmount += utxo.satoshis
      })

      let byteCount = tmpBITBOX.BitcoinCash.getByteCount(
        { P2PKH: inputUtxos.length },
        { P2PKH: 1 }
      )
      let sendAmount = originalAmount - byteCount

      transactionBuilder.addOutput(
        addy.toCashAddress(burnAllConfig.bchChangeReceiverAddress),
        sendAmount
      )

      let keyPair = tmpBITBOX.ECPair.fromWIF(burnAllConfig.fundingWif)

      let redeemScript: void
      inputUtxos.forEach((utxo: any, index: number) => {
        transactionBuilder.sign(
          index,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.satoshis
        )
      })

      let tx = transactionBuilder.build()
      let hex = tx.toHex()
      let txid = await tmpBITBOX.RawTransactions.sendRawTransaction(hex)
      return txid
    } catch (error) {
      return error
    }
  }

  async burn(burnConfig: IBurnConfig) {
    try {
      let tmpBITBOX: any = this.returnBITBOXInstance(burnConfig.fundingAddress)

      const getRawTransactions = async (txids: any) => {
        return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
      }

      const slpValidator: any = new slpjs.LocalValidator(
        tmpBITBOX,
        getRawTransactions
      )
      const bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
      const fundingAddress: string = addy.toSLPAddress(
        burnConfig.fundingAddress
      )
      const bchChangeReceiverAddress: string = addy.toSLPAddress(
        burnConfig.bchChangeReceiverAddress
      )
      const tokenInfo = await bitboxNetwork.getTokenInformation(
        burnConfig.tokenId
      )
      const tokenDecimals = tokenInfo.decimals
      const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
        fundingAddress
      )
      let amount = new BigNumber(burnConfig.amount).times(10 ** tokenDecimals)
      let inputUtxos = balances.slpTokenUtxos[burnConfig.tokenId]

      inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

      inputUtxos.forEach((txo: any) => (txo.wif = burnConfig.fundingWif))
      const burnTxid = await bitboxNetwork.simpleTokenBurn(
        burnConfig.tokenId,
        amount,
        inputUtxos,
        bchChangeReceiverAddress
      )
      return burnTxid
    } catch (error) {
      return error
    }
  }

  returnNetwork(address: string): string {
    return addy.detectAddressNetwork(address)
  }

  returnBITBOXInstance(address: string): any {
    let network: string = this.returnNetwork(address)
    let tmpBITBOX: any

    if (network === "mainnet") {
      tmpBITBOX = new BITBOXSDK({ restURL: "https://rest.bitcoin.com/v2/" })
    } else {
      tmpBITBOX = new BITBOXSDK({ restURL: "https://trest.bitcoin.com/v2/" })
    }

    return tmpBITBOX
  }

  async createP2MS(createP2MSConfig: ICreateP2MSConfig) {
    const fundingWif: string = createP2MSConfig.fundingWif
    let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(
      this.BITBOX.ECPair.fromWIF(fundingWif)
    )
    let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )

    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    fundingAddress = addy.toSLPAddress(fundingAddress)

    const balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )

    const decimals: number = createP2MSConfig.decimals
    const name: string = createP2MSConfig.name
    const symbol: string = createP2MSConfig.symbol
    const documentUri: string = createP2MSConfig.documentUri
    const documentHash: any = createP2MSConfig.documentHash

    let initialTokenQty: number = createP2MSConfig.initialTokenQty

    initialTokenQty = new BigNumber(initialTokenQty).times(10 ** decimals)
    balances.nonSlpUtxos.forEach((txo: any) => (txo.wif = fundingWif))
    const genesisTxid = await bitboxNetwork.p2msTokenGenesis(
      name,
      symbol,
      initialTokenQty,
      documentUri,
      documentHash,
      decimals,
      createP2MSConfig.tokenReceiverWifs,
      createP2MSConfig.batonReceiverWifs,
      createP2MSConfig.bchChangeReceiverWifs,
      balances.nonSlpUtxos,
      createP2MSConfig.requiredSignatures
    )
    return genesisTxid
  }

  async mintP2MS(mintP2MSConfig: IMintP2MSConfig) {
    const fundingWif: string = mintP2MSConfig.fundingWif
    let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(
      this.BITBOX.ECPair.fromWIF(fundingWif)
    )
    let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )

    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    fundingAddress = addy.toSLPAddress(fundingAddress)

    const balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )
    // return false
    const tokenId: string = mintP2MSConfig.tokenId
    let additionalTokenQty: number = mintP2MSConfig.additionalTokenQty

    const tokenInfo: any = await bitboxNetwork.getTokenInformation(tokenId)
    let tokenDecimals: number = tokenInfo.decimals

    // 3) Multiply the specified token quantity by 10^(token decimal precision)
    let mintQty = new BigNumber(additionalTokenQty).times(10 ** tokenDecimals)

    // 4) Filter the list to choose ONLY the baton of interest
    // NOTE: (spending other batons for other tokens will result in losing ability to mint those tokens)
    let inputUtxos = [
      {
        txid:
          "05f8b4da2fc91b10fbfd9731971ed8d5dfb17edae700aa413b6f8caefb88c653",
        vout: 2,
        amount: 0.00000546,
        satoshis: 546
      }
    ]

    // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    // 6) Set the proper private key for each Utxo
    inputUtxos.forEach((txo: any) => (txo.wif = fundingWif))

    let mintTxid = await bitboxNetwork.p2msTokenMint(
      tokenId,
      mintQty,
      inputUtxos,
      fundingWif,
      mintP2MSConfig.tokenReceiverWifs,
      mintP2MSConfig.batonReceiverWifs,
      mintP2MSConfig.bchChangeReceiverWifs,
      mintP2MSConfig.requiredSignatures
    )
    return mintTxid
  }

  async sendP2MS(sendP2MSConfig: ISendP2MSConfig) {
    const fundingWif: string = sendP2MSConfig.fundingWif
    let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(
      this.BITBOX.ECPair.fromWIF(fundingWif)
    )
    let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )

    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    fundingAddress = addy.toSLPAddress(fundingAddress)

    const balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )
    const tokenId: string = sendP2MSConfig.tokenId
    let sendAmount: number = sendP2MSConfig.sendAmount

    const tokenInfo: any = await bitboxNetwork.getTokenInformation(tokenId)
    let tokenDecimals: number = tokenInfo.decimals

    // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
    sendAmount = new BigNumber(sendAmount).times(10 ** tokenDecimals) // Don't forget to account for token precision

    // 4) Get all of our token's UTXOs
    let inputUtxos = [
      {
        txid:
          "8e6005dd46b44356668287dfaab32285c7f36f8d8214af6439e1df3d6d54f2a8",
        vout: 1,
        amount: 0.00000546,
        satoshis: 546
      }
    ]

    // 5) Simply sweep our BCH utxos to fuel the transaction
    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    // 6) Set the proper private key for each Utxo
    inputUtxos.forEach((txo: any) => (txo.wif = fundingWif))

    let sendTxid = await bitboxNetwork.p2msTokenSend(
      sendP2MSConfig.fundingWif,
      tokenId,
      sendAmount,
      inputUtxos,
      sendP2MSConfig.tokenReceiverWifs,
      sendP2MSConfig.bchChangeReceiverWifs,
      sendP2MSConfig.requiredSignatures
    )
    return sendTxid

    // 3) Multiply the specified token quantity by 10^(token decimal precision)
    // let mintQty = new BigNumber(sendAmount).times(10 ** tokenDecimals)
    //
    // // 4) Filter the list to choose ONLY the baton of interest
    // // NOTE: (spending other batons for other tokens will result in losing ability to mint those tokens)
    // let inputUtxos = [
    //   {
    //     txid:
    //       "f0dcdcf8642a7bfedac0d93f19d1fb0b4933b35da9bf315d1cfd46fb9cc45679",
    //     vout: 2,
    //     amount: 0.00000546,
    //     satoshis: 546
    //   }
    // ]
    //
    // // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
    // inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)
    //
    // // 6) Set the proper private key for each Utxo
    // inputUtxos.forEach((txo: any) => (txo.wif = fundingWif))
    //
    // let mintTxid = await bitboxNetwork.p2msTokenSend(
    //   tokenId,
    //   sendAmount,
    //   inputUtxos,
    //   fundingWif,
    //   mintP2MSConfig.tokenReceiverWifs,
    //   mintP2MSConfig.bchChangeReceiverWifs,
    //   mintP2MSConfig.requiredSignatures
    // )
    // return mintTxid
  }

  async burnAllP2MS(burnAllP2MSConfig: IBurnAllP2MsConfig) {
    try {
      const fundingWif: string = burnAllP2MSConfig.fundingWif
      let ecpair: any = this.BITBOX.ECPair.fromWIF(burnAllP2MSConfig.fundingWif)
      let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(ecpair)
      let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

      const getRawTransactions = async (txids: any) => {
        return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
      }

      const slpValidator: any = new slpjs.LocalValidator(
        tmpBITBOX,
        getRawTransactions
      )
      const bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
      const tokenInfo = await bitboxNetwork.getTokenInformation(
        burnAllP2MSConfig.tokenId
      )
      let tokenDecimals = tokenInfo.decimals

      let balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
        fundingAddress
      )

      let bchChangeReceiverAddresses: string[] = burnAllP2MSConfig.bchChangeReceiverWifs.map(
        wif => {
          let ecpair = this.BITBOX.ECPair.fromWIF(wif)
          let cashAddr = this.BITBOX.ECPair.toCashAddress(ecpair)
          return addy.toSLPAddress(cashAddr)
        }
      )

      bchChangeReceiverAddresses.forEach(outputAddress => {
        if (!addy.isSLPAddress(outputAddress))
          throw new Error("Change receiver address not in SLP format.")
      })

      let inputUtxos = [
        {
          txid:
            "af16b2d0f76b3e19c7d6636b822cade8d2801f40eb87fa09dd6c853298ef1f19",
          vout: 1,
          amount: 0.00000546,
          satoshis: 546
        }
      ]
      inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

      inputUtxos.forEach((txo: any) => (txo.wif = burnAllP2MSConfig.fundingWif))
      let network: string = this.returnNetwork(fundingAddress)
      let transactionBuilder: any
      if (network === "mainnet") {
        transactionBuilder = new tmpBITBOX.TransactionBuilder("mainnet")
      } else {
        transactionBuilder = new tmpBITBOX.TransactionBuilder("testnet")
      }

      let originalAmount: number = 0

      let mintPubkeys: any[] = []
      burnAllP2MSConfig.bchChangeReceiverWifs.forEach((wif: string) => {
        const ecpair = this.BITBOX.ECPair.fromWIF(wif)
        mintPubkeys.push(this.BITBOX.ECPair.toPublicKey(ecpair))
      })

      const mintBuf = this.BITBOX.Script.multisig.output.encode(
        burnAllP2MSConfig.requiredSignatures,
        mintPubkeys
      )

      transactionBuilder.addInput(
        inputUtxos[0].txid,
        inputUtxos[0].vout,
        transactionBuilder.DEFAULT_SEQUENCE,
        mintBuf
      )
      originalAmount += inputUtxos[0].satoshis

      transactionBuilder.addInput(inputUtxos[1].txid, inputUtxos[1].vout)
      originalAmount += inputUtxos[1].satoshis

      let byteCount = tmpBITBOX.BitcoinCash.getByteCount(
        { P2PKH: inputUtxos.length },
        { P2PKH: 3 }
      )
      let sendAmount = originalAmount - byteCount

      transactionBuilder.addOutput(
        addy.toCashAddress(bchChangeReceiverAddresses[0]),
        sendAmount
      )

      let keyPair = tmpBITBOX.ECPair.fromWIF(burnAllP2MSConfig.fundingWif)

      let redeemScript: void
      inputUtxos.forEach((utxo: any, index: number) => {
        transactionBuilder.sign(
          index,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.satoshis
        )
      })

      let tx = transactionBuilder.build()
      let hex = tx.toHex()
      let txid = await tmpBITBOX.RawTransactions.sendRawTransaction(hex)
      return txid
    } catch (error) {
      return error
    }
  }

  async burnP2MS(burnP2MSConfig: IBurnP2MsConfig) {
    try {
      const fundingWif: string = burnP2MSConfig.fundingWif
      let ecpair: any = this.BITBOX.ECPair.fromWIF(burnP2MSConfig.fundingWif)
      let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(ecpair)
      let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

      const getRawTransactions = async (txids: any) => {
        return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
      }

      const slpValidator: any = new slpjs.LocalValidator(
        tmpBITBOX,
        getRawTransactions
      )
      const bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
      const tokenInfo = await bitboxNetwork.getTokenInformation(
        burnP2MSConfig.tokenId
      )
      let tokenDecimals = tokenInfo.decimals

      let balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
        fundingAddress
      )

      let inputUtxos = [
        {
          txid:
            "b9c4b39733040452d557ec94179272d0b468c2330d187b27c1480b8a36cc478f",
          vout: 1,
          amount: 0.00000546,
          satoshis: 546
        }
      ]
      inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

      inputUtxos.forEach((txo: any) => (txo.wif = burnP2MSConfig.fundingWif))

      const burnTxid = await bitboxNetwork.p2msTokenBurn(
        fundingWif,
        burnP2MSConfig.tokenId,
        burnP2MSConfig.burnAmount,
        inputUtxos,
        burnP2MSConfig.bchChangeReceiverWifs,
        burnP2MSConfig.requiredSignatures
      )

      return burnTxid
      // let network: string = this.returnNetwork(fundingAddress)
      // let transactionBuilder: any
      // if (network === "mainnet") {
      //   transactionBuilder = new tmpBITBOX.TransactionBuilder("mainnet")
      // } else {
      //   transactionBuilder = new tmpBITBOX.TransactionBuilder("testnet")
      // }
      //
      // let originalAmount: number = 0
      //
      // let mintPubkeys: any[] = []
      // burnP2MSConfig.bchChangeReceiverWifs.forEach((wif: string) => {
      //   const ecpair = this.BITBOX.ECPair.fromWIF(wif)
      //   mintPubkeys.push(this.BITBOX.ECPair.toPublicKey(ecpair))
      // })
      //
      // const mintBuf = this.BITBOX.Script.multisig.output.encode(
      //   burnP2MSConfig.requiredSignatures,
      //   mintPubkeys
      // )
      //
      // transactionBuilder.addInput(
      //   inputUtxos[0].txid,
      //   inputUtxos[0].vout,
      //   transactionBuilder.DEFAULT_SEQUENCE,
      //   mintBuf
      // )
      // originalAmount += inputUtxos[0].satoshis
      //
      // transactionBuilder.addInput(inputUtxos[1].txid, inputUtxos[1].vout)
      // originalAmount += inputUtxos[1].satoshis
      //
      // let byteCount = tmpBITBOX.BitcoinCash.getByteCount(
      //   { P2PKH: inputUtxos.length },
      //   { P2PKH: 3 }
      // )
      // let sendAmount = originalAmount - byteCount
      //
      // transactionBuilder.addOutput(
      //   addy.toCashAddress(bchChangeReceiverAddresses[0]),
      //   sendAmount
      // )
      //
      // let keyPair = tmpBITBOX.ECPair.fromWIF(burnP2MSConfig.fundingWif)
      //
      // let redeemScript: void
      // inputUtxos.forEach((utxo: any, index: number) => {
      //   transactionBuilder.sign(
      //     index,
      //     keyPair,
      //     redeemScript,
      //     transactionBuilder.hashTypes.SIGHASH_ALL,
      //     utxo.satoshis
      //   )
      // })
      //
      // let tx = transactionBuilder.build()
      // let hex = tx.toHex()
      // let txid = await tmpBITBOX.RawTransactions.sendRawTransaction(hex)
      // return txid
    } catch (error) {
      return error
    }
  }

  async createP2PK(createP2PKConfig: ICreateP2PKConfig) {
    const fundingWif: string = createP2PKConfig.fundingWif
    let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(
      this.BITBOX.ECPair.fromWIF(fundingWif)
    )
    let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )

    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    fundingAddress = addy.toSLPAddress(fundingAddress)

    const balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )

    const decimals: number = createP2PKConfig.decimals
    const name: string = createP2PKConfig.name
    const symbol: string = createP2PKConfig.symbol
    const documentUri: string = createP2PKConfig.documentUri
    const documentHash: any = createP2PKConfig.documentHash

    let initialTokenQty: number = createP2PKConfig.initialTokenQty

    initialTokenQty = new BigNumber(initialTokenQty).times(10 ** decimals)
    balances.nonSlpUtxos.forEach((txo: any) => (txo.wif = fundingWif))
    const genesisTxid = await bitboxNetwork.p2pkTokenGenesis(
      name,
      symbol,
      initialTokenQty,
      documentUri,
      documentHash,
      decimals,
      createP2PKConfig.tokenReceiverWif,
      createP2PKConfig.batonReceiverWif,
      createP2PKConfig.bchChangeReceiverWif,
      balances.nonSlpUtxos
    )
    return genesisTxid
  }

  async mintP2PK(mintP2PKConfig: IMintP2PKConfig) {
    const fundingWif: string = mintP2PKConfig.fundingWif
    let fundingAddress: string = this.BITBOX.ECPair.toCashAddress(
      this.BITBOX.ECPair.fromWIF(fundingWif)
    )
    let tmpBITBOX: any = this.returnBITBOXInstance(fundingAddress)

    const getRawTransactions = async (txids: any) => {
      return await tmpBITBOX.RawTransactions.getRawTransaction(txids)
    }

    const slpValidator: any = new slpjs.LocalValidator(
      tmpBITBOX,
      getRawTransactions
    )

    const bitboxNetwork: any = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator)
    fundingAddress = addy.toSLPAddress(fundingAddress)

    const balances: any = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    )
    // return false
    const tokenId: string = mintP2PKConfig.tokenId
    let additionalTokenQty: number = mintP2PKConfig.additionalTokenQty

    const tokenInfo: any = await bitboxNetwork.getTokenInformation(tokenId)
    let tokenDecimals: number = tokenInfo.decimals

    // 3) Multiply the specified token quantity by 10^(token decimal precision)
    let mintQty = new BigNumber(additionalTokenQty).times(10 ** tokenDecimals)

    // 4) Filter the list to choose ONLY the baton of interest
    // NOTE: (spending other batons for other tokens will result in losing ability to mint those tokens)
    let inputUtxos = [
      {
        txid:
          "fe3b9b75755cc616072e89660b72e5e158032ac7b627bbef3500be3dd2ea11f5",
        vout: 2,
        amount: 0.00000546,
        satoshis: 546
      }
    ]

    // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    // 6) Set the proper private key for each Utxo
    inputUtxos.forEach((txo: any) => (txo.wif = fundingWif))

    let mintTxid = await bitboxNetwork.p2pkTokenMint(
      tokenId,
      mintQty,
      inputUtxos,
      fundingWif,
      mintP2PKConfig.tokenReceiverWif,
      mintP2PKConfig.batonReceiverWif,
      mintP2PKConfig.bchChangeReceiverWif
    )
    return mintTxid
  }
}

export default TokenType1
