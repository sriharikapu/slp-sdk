"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// require deps
var BITBOXSDK = require("bitbox-sdk/lib/bitbox-sdk").default;
var BigNumber = require("bignumber.js");
var slpjs = require("slpjs");
// import classes
var Address_1 = require("./Address");
var addy = new Address_1.default();
var TokenType1 = /** @class */ (function () {
    function TokenType1(restURL) {
        this.restURL = restURL;
        this.BITBOX = new BITBOXSDK();
    }
    TokenType1.prototype.create = function (createConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, fundingAddress, fundingWif, tokenReceiverAddress, batonReceiverAddress, bchChangeReceiverAddress, balances, decimals, name, symbol, documentUri, documentHash, initialTokenQty, genesisTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmpBITBOX = this.returnBITBOXInstance(createConfig.fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(createConfig.fundingAddress);
                        fundingWif = createConfig.fundingWif;
                        tokenReceiverAddress = addy.toSLPAddress(createConfig.tokenReceiverAddress);
                        if (createConfig.batonReceiverAddress !== undefined &&
                            createConfig.batonReceiverAddress !== "" &&
                            createConfig.batonReceiverAddress !== null) {
                            batonReceiverAddress = addy.toSLPAddress(createConfig.batonReceiverAddress);
                        }
                        else {
                            batonReceiverAddress = null;
                        }
                        bchChangeReceiverAddress = addy.toSLPAddress(createConfig.bchChangeReceiverAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        decimals = createConfig.decimals;
                        name = createConfig.name;
                        symbol = createConfig.symbol;
                        documentUri = createConfig.documentUri;
                        documentHash = createConfig.documentHash;
                        initialTokenQty = createConfig.initialTokenQty;
                        initialTokenQty = new BigNumber(initialTokenQty).times(Math.pow(10, decimals));
                        balances.nonSlpUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.simpleTokenGenesis(name, symbol, initialTokenQty, documentUri, documentHash, decimals, tokenReceiverAddress, batonReceiverAddress, bchChangeReceiverAddress, balances.nonSlpUtxos)];
                    case 2:
                        genesisTxid = _a.sent();
                        return [2 /*return*/, genesisTxid];
                }
            });
        });
    };
    TokenType1.prototype.mint = function (mintConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, fundingAddress, fundingWif, tokenReceiverAddress, batonReceiverAddress, bchChangeReceiverAddress, tokenId, additionalTokenQty, balances, tokenInfo, tokenDecimals, mintQty, inputUtxos, mintTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmpBITBOX = this.returnBITBOXInstance(mintConfig.fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(mintConfig.fundingAddress);
                        fundingWif = mintConfig.fundingWif;
                        tokenReceiverAddress = addy.toSLPAddress(mintConfig.tokenReceiverAddress);
                        batonReceiverAddress = addy.toSLPAddress(mintConfig.batonReceiverAddress);
                        bchChangeReceiverAddress = addy.toSLPAddress(mintConfig.bchChangeReceiverAddress);
                        tokenId = mintConfig.tokenId;
                        additionalTokenQty = mintConfig.additionalTokenQty;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        if (!balances.slpBatonUtxos[tokenId])
                            throw Error("You don't have the minting baton for this token");
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(tokenId)];
                    case 2:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        mintQty = new BigNumber(additionalTokenQty).times(Math.pow(10, tokenDecimals));
                        inputUtxos = balances.slpBatonUtxos[tokenId];
                        // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        // 6) Set the proper private key for each Utxo
                        inputUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.simpleTokenMint(tokenId, mintQty, inputUtxos, tokenReceiverAddress, batonReceiverAddress, bchChangeReceiverAddress)];
                    case 3:
                        mintTxid = _a.sent();
                        return [2 /*return*/, mintTxid];
                }
            });
        });
    };
    TokenType1.prototype.send = function (sendConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, fundingAddress, fundingWif, tokenReceiverAddress, bchChangeReceiverAddress, tokenId, amount, tokenInfo, tokenDecimals, balances, inputUtxos, sendTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmpBITBOX = this.returnBITBOXInstance(sendConfig.fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(sendConfig.fundingAddress);
                        fundingWif = sendConfig.fundingWif;
                        tokenReceiverAddress = addy.toSLPAddress(sendConfig.tokenReceiverAddress);
                        bchChangeReceiverAddress = addy.toSLPAddress(sendConfig.bchChangeReceiverAddress);
                        tokenId = sendConfig.tokenId;
                        amount = sendConfig.amount;
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)
                            // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
                        ];
                    case 2:
                        balances = _a.sent();
                        // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
                        amount = new BigNumber(amount).times(Math.pow(10, tokenDecimals)); // Don't forget to account for token precision
                        inputUtxos = balances.slpTokenUtxos[tokenId];
                        // 5) Simply sweep our BCH utxos to fuel the transaction
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        // 6) Set the proper private key for each Utxo
                        inputUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.simpleTokenSend(tokenId, amount, inputUtxos, tokenReceiverAddress, bchChangeReceiverAddress)];
                    case 3:
                        sendTxid = _a.sent();
                        return [2 /*return*/, sendTxid];
                }
            });
        });
    };
    TokenType1.prototype.burnAll = function (burnAllConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpBITBOX_1, getRawTransactions, slpValidator, bitboxNetwork, tokenInfo, tokenDecimals, balances, inputUtxos, network, transactionBuilder_1, originalAmount_1, byteCount, sendAmount, keyPair_1, redeemScript_1, tx, hex, txid, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        tmpBITBOX_1 = this.returnBITBOXInstance(burnAllConfig.fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX_1.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX_1, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX_1, slpValidator);
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(burnAllConfig.tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(burnAllConfig.fundingAddress)];
                    case 2:
                        balances = _a.sent();
                        inputUtxos = balances.slpTokenUtxos[burnAllConfig.tokenId];
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        inputUtxos.forEach(function (txo) { return (txo.wif = burnAllConfig.fundingWif); });
                        network = this.returnNetwork(burnAllConfig.fundingAddress);
                        if (network === "mainnet") {
                            transactionBuilder_1 = new tmpBITBOX_1.TransactionBuilder("mainnet");
                        }
                        else {
                            transactionBuilder_1 = new tmpBITBOX_1.TransactionBuilder("testnet");
                        }
                        originalAmount_1 = 0;
                        inputUtxos.forEach(function (utxo) {
                            // index of vout
                            var vout = utxo.vout;
                            // txid of vout
                            var txid = utxo.txid;
                            // add input with txid and index of vout
                            transactionBuilder_1.addInput(txid, vout);
                            originalAmount_1 += utxo.satoshis;
                        });
                        byteCount = tmpBITBOX_1.BitcoinCash.getByteCount({ P2PKH: inputUtxos.length }, { P2PKH: 1 });
                        sendAmount = originalAmount_1 - byteCount;
                        transactionBuilder_1.addOutput(addy.toCashAddress(burnAllConfig.bchChangeReceiverAddress), sendAmount);
                        keyPair_1 = tmpBITBOX_1.ECPair.fromWIF(burnAllConfig.fundingWif);
                        inputUtxos.forEach(function (utxo, index) {
                            transactionBuilder_1.sign(index, keyPair_1, redeemScript_1, transactionBuilder_1.hashTypes.SIGHASH_ALL, utxo.satoshis);
                        });
                        tx = transactionBuilder_1.build();
                        hex = tx.toHex();
                        return [4 /*yield*/, tmpBITBOX_1.RawTransactions.sendRawTransaction(hex)];
                    case 3:
                        txid = _a.sent();
                        return [2 /*return*/, txid];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, error_1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenType1.prototype.burn = function (burnConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpBITBOX_2, getRawTransactions, slpValidator, bitboxNetwork, fundingAddress, bchChangeReceiverAddress, tokenInfo, tokenDecimals, balances, amount, inputUtxos, burnTxid, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        tmpBITBOX_2 = this.returnBITBOXInstance(burnConfig.fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX_2.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX_2, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX_2, slpValidator);
                        fundingAddress = addy.toSLPAddress(burnConfig.fundingAddress);
                        bchChangeReceiverAddress = addy.toSLPAddress(burnConfig.bchChangeReceiverAddress);
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(burnConfig.tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 2:
                        balances = _a.sent();
                        amount = new BigNumber(burnConfig.amount).times(Math.pow(10, tokenDecimals));
                        inputUtxos = balances.slpTokenUtxos[burnConfig.tokenId];
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        inputUtxos.forEach(function (txo) { return (txo.wif = burnConfig.fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.simpleTokenBurn(burnConfig.tokenId, amount, inputUtxos, bchChangeReceiverAddress)];
                    case 3:
                        burnTxid = _a.sent();
                        return [2 /*return*/, burnTxid];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, error_2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenType1.prototype.returnNetwork = function (address) {
        return addy.detectAddressNetwork(address);
    };
    TokenType1.prototype.returnBITBOXInstance = function (address) {
        var network = this.returnNetwork(address);
        var tmpBITBOX;
        if (network === "mainnet") {
            tmpBITBOX = new BITBOXSDK({ restURL: "https://rest.bitcoin.com/v2/" });
        }
        else {
            tmpBITBOX = new BITBOXSDK({ restURL: "https://trest.bitcoin.com/v2/" });
        }
        return tmpBITBOX;
    };
    TokenType1.prototype.createP2MS = function (createP2MSConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, decimals, name, symbol, documentUri, documentHash, initialTokenQty, genesisTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = createP2MSConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        decimals = createP2MSConfig.decimals;
                        name = createP2MSConfig.name;
                        symbol = createP2MSConfig.symbol;
                        documentUri = createP2MSConfig.documentUri;
                        documentHash = createP2MSConfig.documentHash;
                        initialTokenQty = createP2MSConfig.initialTokenQty;
                        initialTokenQty = new BigNumber(initialTokenQty).times(Math.pow(10, decimals));
                        balances.nonSlpUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2msTokenGenesis(name, symbol, initialTokenQty, documentUri, documentHash, decimals, createP2MSConfig.tokenReceiverWifs, createP2MSConfig.batonReceiverWifs, createP2MSConfig.bchChangeReceiverWifs, balances.nonSlpUtxos, createP2MSConfig.requiredSignatures)];
                    case 2:
                        genesisTxid = _a.sent();
                        return [2 /*return*/, genesisTxid];
                }
            });
        });
    };
    TokenType1.prototype.mintP2MS = function (mintP2MSConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, tokenId, additionalTokenQty, tokenInfo, tokenDecimals, mintQty, inputUtxos, mintTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = mintP2MSConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)
                            // return false
                        ];
                    case 1:
                        balances = _a.sent();
                        tokenId = mintP2MSConfig.tokenId;
                        additionalTokenQty = mintP2MSConfig.additionalTokenQty;
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(tokenId)];
                    case 2:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        mintQty = new BigNumber(additionalTokenQty).times(Math.pow(10, tokenDecimals));
                        inputUtxos = [
                            {
                                txid: "05f8b4da2fc91b10fbfd9731971ed8d5dfb17edae700aa413b6f8caefb88c653",
                                vout: 2,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        // 6) Set the proper private key for each Utxo
                        inputUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2msTokenMint(tokenId, mintQty, inputUtxos, fundingWif, mintP2MSConfig.tokenReceiverWifs, mintP2MSConfig.batonReceiverWifs, mintP2MSConfig.bchChangeReceiverWifs, mintP2MSConfig.requiredSignatures)];
                    case 3:
                        mintTxid = _a.sent();
                        return [2 /*return*/, mintTxid];
                }
            });
        });
    };
    TokenType1.prototype.sendP2MS = function (sendP2MSConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, tokenId, sendAmount, tokenInfo, tokenDecimals, inputUtxos, sendTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = sendP2MSConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        tokenId = sendP2MSConfig.tokenId;
                        sendAmount = sendP2MSConfig.sendAmount;
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(tokenId)];
                    case 2:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
                        sendAmount = new BigNumber(sendAmount).times(Math.pow(10, tokenDecimals)); // Don't forget to account for token precision
                        inputUtxos = [
                            {
                                txid: "8e6005dd46b44356668287dfaab32285c7f36f8d8214af6439e1df3d6d54f2a8",
                                vout: 1,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        // 5) Simply sweep our BCH utxos to fuel the transaction
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        // 6) Set the proper private key for each Utxo
                        inputUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2msTokenSend(sendP2MSConfig.fundingWif, tokenId, sendAmount, inputUtxos, sendP2MSConfig.tokenReceiverWifs, sendP2MSConfig.bchChangeReceiverWifs, sendP2MSConfig.requiredSignatures)];
                    case 3:
                        sendTxid = _a.sent();
                        return [2 /*return*/, sendTxid
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
                        ];
                }
            });
        });
    };
    TokenType1.prototype.burnAllP2MS = function (burnAllP2MSConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, ecpair, fundingAddress, tmpBITBOX_3, getRawTransactions, slpValidator, bitboxNetwork, tokenInfo, tokenDecimals, balances, bchChangeReceiverAddresses, inputUtxos, network, transactionBuilder_2, originalAmount, mintPubkeys_1, mintBuf, byteCount, sendAmount, keyPair_2, redeemScript_2, tx, hex, txid, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        fundingWif = burnAllP2MSConfig.fundingWif;
                        ecpair = this.BITBOX.ECPair.fromWIF(burnAllP2MSConfig.fundingWif);
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(ecpair);
                        tmpBITBOX_3 = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX_3.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX_3, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX_3, slpValidator);
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(burnAllP2MSConfig.tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 2:
                        balances = _a.sent();
                        bchChangeReceiverAddresses = burnAllP2MSConfig.bchChangeReceiverWifs.map(function (wif) {
                            var ecpair = _this.BITBOX.ECPair.fromWIF(wif);
                            var cashAddr = _this.BITBOX.ECPair.toCashAddress(ecpair);
                            return addy.toSLPAddress(cashAddr);
                        });
                        bchChangeReceiverAddresses.forEach(function (outputAddress) {
                            if (!addy.isSLPAddress(outputAddress))
                                throw new Error("Change receiver address not in SLP format.");
                        });
                        inputUtxos = [
                            {
                                txid: "af16b2d0f76b3e19c7d6636b822cade8d2801f40eb87fa09dd6c853298ef1f19",
                                vout: 1,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        inputUtxos.forEach(function (txo) { return (txo.wif = burnAllP2MSConfig.fundingWif); });
                        network = this.returnNetwork(fundingAddress);
                        if (network === "mainnet") {
                            transactionBuilder_2 = new tmpBITBOX_3.TransactionBuilder("mainnet");
                        }
                        else {
                            transactionBuilder_2 = new tmpBITBOX_3.TransactionBuilder("testnet");
                        }
                        originalAmount = 0;
                        mintPubkeys_1 = [];
                        burnAllP2MSConfig.bchChangeReceiverWifs.forEach(function (wif) {
                            var ecpair = _this.BITBOX.ECPair.fromWIF(wif);
                            mintPubkeys_1.push(_this.BITBOX.ECPair.toPublicKey(ecpair));
                        });
                        mintBuf = this.BITBOX.Script.multisig.output.encode(burnAllP2MSConfig.requiredSignatures, mintPubkeys_1);
                        transactionBuilder_2.addInput(inputUtxos[0].txid, inputUtxos[0].vout, transactionBuilder_2.DEFAULT_SEQUENCE, mintBuf);
                        originalAmount += inputUtxos[0].satoshis;
                        transactionBuilder_2.addInput(inputUtxos[1].txid, inputUtxos[1].vout);
                        originalAmount += inputUtxos[1].satoshis;
                        byteCount = tmpBITBOX_3.BitcoinCash.getByteCount({ P2PKH: inputUtxos.length }, { P2PKH: 3 });
                        sendAmount = originalAmount - byteCount;
                        transactionBuilder_2.addOutput(addy.toCashAddress(bchChangeReceiverAddresses[0]), sendAmount);
                        keyPair_2 = tmpBITBOX_3.ECPair.fromWIF(burnAllP2MSConfig.fundingWif);
                        inputUtxos.forEach(function (utxo, index) {
                            transactionBuilder_2.sign(index, keyPair_2, redeemScript_2, transactionBuilder_2.hashTypes.SIGHASH_ALL, utxo.satoshis);
                        });
                        tx = transactionBuilder_2.build();
                        hex = tx.toHex();
                        return [4 /*yield*/, tmpBITBOX_3.RawTransactions.sendRawTransaction(hex)];
                    case 3:
                        txid = _a.sent();
                        return [2 /*return*/, txid];
                    case 4:
                        error_3 = _a.sent();
                        return [2 /*return*/, error_3];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenType1.prototype.burnP2MS = function (burnP2MSConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, ecpair, fundingAddress, tmpBITBOX_4, getRawTransactions, slpValidator, bitboxNetwork, tokenInfo, tokenDecimals, balances, inputUtxos, burnTxid, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        fundingWif = burnP2MSConfig.fundingWif;
                        ecpair = this.BITBOX.ECPair.fromWIF(burnP2MSConfig.fundingWif);
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(ecpair);
                        tmpBITBOX_4 = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX_4.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX_4, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX_4, slpValidator);
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(burnP2MSConfig.tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 2:
                        balances = _a.sent();
                        inputUtxos = [
                            {
                                txid: "b9c4b39733040452d557ec94179272d0b468c2330d187b27c1480b8a36cc478f",
                                vout: 1,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        inputUtxos.forEach(function (txo) { return (txo.wif = burnP2MSConfig.fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2msTokenBurn(fundingWif, burnP2MSConfig.tokenId, burnP2MSConfig.burnAmount, inputUtxos, burnP2MSConfig.bchChangeReceiverWifs, burnP2MSConfig.requiredSignatures)];
                    case 3:
                        burnTxid = _a.sent();
                        return [2 /*return*/, burnTxid
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
                        ];
                    case 4:
                        error_4 = _a.sent();
                        return [2 /*return*/, error_4];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenType1.prototype.createP2PK = function (createP2PKConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, decimals, name, symbol, documentUri, documentHash, initialTokenQty, genesisTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = createP2PKConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        decimals = createP2PKConfig.decimals;
                        name = createP2PKConfig.name;
                        symbol = createP2PKConfig.symbol;
                        documentUri = createP2PKConfig.documentUri;
                        documentHash = createP2PKConfig.documentHash;
                        initialTokenQty = createP2PKConfig.initialTokenQty;
                        initialTokenQty = new BigNumber(initialTokenQty).times(Math.pow(10, decimals));
                        balances.nonSlpUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2pkTokenGenesis(name, symbol, initialTokenQty, documentUri, documentHash, decimals, createP2PKConfig.tokenReceiverWif, createP2PKConfig.batonReceiverWif, createP2PKConfig.bchChangeReceiverWif, balances.nonSlpUtxos)];
                    case 2:
                        genesisTxid = _a.sent();
                        return [2 /*return*/, genesisTxid];
                }
            });
        });
    };
    TokenType1.prototype.mintP2PK = function (mintP2PKConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, tokenId, additionalTokenQty, tokenInfo, tokenDecimals, mintQty, inputUtxos, mintTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = mintP2PKConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)
                            // return false
                        ];
                    case 1:
                        balances = _a.sent();
                        tokenId = mintP2PKConfig.tokenId;
                        additionalTokenQty = mintP2PKConfig.additionalTokenQty;
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(tokenId)];
                    case 2:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        mintQty = new BigNumber(additionalTokenQty).times(Math.pow(10, tokenDecimals));
                        inputUtxos = [
                            {
                                txid: "a184e3715b124c6641da4eb0f2940f578c1f6a3525646b8d9a0b919b9b83898e",
                                vout: 2,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        // 5) Simply sweep our BCH (non-SLP) utxos to fuel the transaction
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        // 6) Set the proper private key for each Utxo
                        inputUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2pkTokenMint(tokenId, mintQty, inputUtxos, fundingWif, mintP2PKConfig.tokenReceiverWif, mintP2PKConfig.batonReceiverWif, mintP2PKConfig.bchChangeReceiverWif)];
                    case 3:
                        mintTxid = _a.sent();
                        return [2 /*return*/, mintTxid];
                }
            });
        });
    };
    TokenType1.prototype.sendP2PK = function (sendP2PKConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, tokenId, sendAmount, tokenInfo, tokenDecimals, inputUtxos, sendTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = sendP2PKConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        tokenId = sendP2PKConfig.tokenId;
                        sendAmount = sendP2PKConfig.sendAmount;
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(tokenId)];
                    case 2:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        // 3) Calculate send amount in "Token Satoshis".  In this example we want to just send 1 token unit to someone...
                        sendAmount = new BigNumber(sendAmount).times(Math.pow(10, tokenDecimals)); // Don't forget to account for token precision
                        inputUtxos = [
                            {
                                txid: "daaeef80e0b10fef3ca84e418b19ae2bab2b3e5a00f3fde09e22a0ddef9087be",
                                vout: 1,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        // 5) Simply sweep our BCH utxos to fuel the transaction
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        // 6) Set the proper private key for each Utxo
                        inputUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2pkTokenSend(sendP2PKConfig.fundingWif, tokenId, sendAmount, inputUtxos, sendP2PKConfig.tokenReceiverWif, sendP2PKConfig.bchChangeReceiverWif)];
                    case 3:
                        sendTxid = _a.sent();
                        return [2 /*return*/, sendTxid
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
                        ];
                }
            });
        });
    };
    TokenType1.prototype.burnAllP2PK = function (burnAllP2PKConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, ecpair, fundingAddress, tmpBITBOX_5, getRawTransactions, slpValidator, bitboxNetwork, tokenInfo, tokenDecimals, balances, bchChangeReceiverECPair, bchChangeReceiverCashAddr, bchChangeReceiverAddress, inputUtxos, network, transactionBuilder_3, originalAmount, pubKey, buf, byteCount, sendAmount, keyPair_3, redeemScript_3, tx, hex, txid, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        fundingWif = burnAllP2PKConfig.fundingWif;
                        ecpair = this.BITBOX.ECPair.fromWIF(burnAllP2PKConfig.fundingWif);
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(ecpair);
                        tmpBITBOX_5 = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX_5.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX_5, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX_5, slpValidator);
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(burnAllP2PKConfig.tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 2:
                        balances = _a.sent();
                        bchChangeReceiverECPair = this.BITBOX.ECPair.fromWIF(burnAllP2PKConfig.bchChangeReceiverWif);
                        bchChangeReceiverCashAddr = this.BITBOX.ECPair.toCashAddress(bchChangeReceiverECPair);
                        bchChangeReceiverAddress = addy.toSLPAddress(bchChangeReceiverCashAddr);
                        if (!addy.isSLPAddress(bchChangeReceiverAddress))
                            throw new Error("Change receiver address not in SLP format.");
                        inputUtxos = [
                            {
                                txid: "b01a045f52309006a055e5fe5865f2aa333ddeefedca95198b2dfdcfda9925de",
                                vout: 1,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        inputUtxos.forEach(function (txo) { return (txo.wif = burnAllP2PKConfig.fundingWif); });
                        network = this.returnNetwork(fundingAddress);
                        if (network === "mainnet") {
                            transactionBuilder_3 = new tmpBITBOX_5.TransactionBuilder("mainnet");
                        }
                        else {
                            transactionBuilder_3 = new tmpBITBOX_5.TransactionBuilder("testnet");
                        }
                        originalAmount = 0;
                        pubKey = tmpBITBOX_5.ECPair.toPublicKey(bchChangeReceiverECPair);
                        buf = tmpBITBOX_5.Script.pubKey.output.encode(pubKey);
                        transactionBuilder_3.addInput(inputUtxos[0].txid, inputUtxos[0].vout, transactionBuilder_3.DEFAULT_SEQUENCE, buf);
                        originalAmount += inputUtxos[0].satoshis;
                        transactionBuilder_3.addInput(inputUtxos[1].txid, inputUtxos[1].vout);
                        originalAmount += inputUtxos[1].satoshis;
                        byteCount = tmpBITBOX_5.BitcoinCash.getByteCount({ P2PKH: inputUtxos.length }, { P2PKH: 3 });
                        sendAmount = originalAmount - byteCount;
                        transactionBuilder_3.addOutput(addy.toCashAddress(bchChangeReceiverAddress), sendAmount);
                        keyPair_3 = tmpBITBOX_5.ECPair.fromWIF(burnAllP2PKConfig.fundingWif);
                        inputUtxos.forEach(function (utxo, index) {
                            transactionBuilder_3.sign(index, keyPair_3, redeemScript_3, transactionBuilder_3.hashTypes.SIGHASH_ALL, utxo.satoshis);
                        });
                        tx = transactionBuilder_3.build();
                        hex = tx.toHex();
                        return [4 /*yield*/, tmpBITBOX_5.RawTransactions.sendRawTransaction(hex)];
                    case 3:
                        txid = _a.sent();
                        return [2 /*return*/, txid];
                    case 4:
                        error_5 = _a.sent();
                        return [2 /*return*/, error_5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenType1.prototype.burnP2PK = function (burnP2PKConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, ecpair, fundingAddress, tmpBITBOX_6, getRawTransactions, slpValidator, bitboxNetwork, tokenInfo, tokenDecimals, balances, inputUtxos, burnTxid, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        fundingWif = burnP2PKConfig.fundingWif;
                        ecpair = this.BITBOX.ECPair.fromWIF(burnP2PKConfig.fundingWif);
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(ecpair);
                        tmpBITBOX_6 = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX_6.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX_6, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX_6, slpValidator);
                        return [4 /*yield*/, bitboxNetwork.getTokenInformation(burnP2PKConfig.tokenId)];
                    case 1:
                        tokenInfo = _a.sent();
                        tokenDecimals = tokenInfo.decimals;
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 2:
                        balances = _a.sent();
                        inputUtxos = [
                            {
                                txid: "7c547c9c20d0e60292386b9effaceabaf824ccb0af3136c0acdf85817922f8a0",
                                vout: 1,
                                amount: 0.00000546,
                                satoshis: 546
                            }
                        ];
                        inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);
                        inputUtxos.forEach(function (txo) { return (txo.wif = burnP2PKConfig.fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2pkTokenBurn(fundingWif, burnP2PKConfig.tokenId, burnP2PKConfig.burnAmount, inputUtxos, burnP2PKConfig.bchChangeReceiverWif)];
                    case 3:
                        burnTxid = _a.sent();
                        return [2 /*return*/, burnTxid
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
                        ];
                    case 4:
                        error_6 = _a.sent();
                        return [2 /*return*/, error_6];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TokenType1.prototype.createP2SH = function (createP2SHConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var fundingWif, fundingAddress, tmpBITBOX, getRawTransactions, slpValidator, bitboxNetwork, balances, decimals, name, symbol, documentUri, documentHash, initialTokenQty, genesisTxid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fundingWif = createP2SHConfig.fundingWif;
                        fundingAddress = this.BITBOX.ECPair.toCashAddress(this.BITBOX.ECPair.fromWIF(fundingWif));
                        tmpBITBOX = this.returnBITBOXInstance(fundingAddress);
                        getRawTransactions = function (txids) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tmpBITBOX.RawTransactions.getRawTransaction(txids)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        slpValidator = new slpjs.LocalValidator(tmpBITBOX, getRawTransactions);
                        bitboxNetwork = new slpjs.BitboxNetwork(tmpBITBOX, slpValidator);
                        fundingAddress = addy.toSLPAddress(fundingAddress);
                        return [4 /*yield*/, bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress)];
                    case 1:
                        balances = _a.sent();
                        decimals = createP2SHConfig.decimals;
                        name = createP2SHConfig.name;
                        symbol = createP2SHConfig.symbol;
                        documentUri = createP2SHConfig.documentUri;
                        documentHash = createP2SHConfig.documentHash;
                        initialTokenQty = createP2SHConfig.initialTokenQty;
                        initialTokenQty = new BigNumber(initialTokenQty).times(Math.pow(10, decimals));
                        balances.nonSlpUtxos.forEach(function (txo) { return (txo.wif = fundingWif); });
                        return [4 /*yield*/, bitboxNetwork.p2shTokenGenesis(name, symbol, initialTokenQty, documentUri, documentHash, decimals, createP2SHConfig.tokenReceiverWif, createP2SHConfig.batonReceiverWif, createP2SHConfig.bchChangeReceiverWif, balances.nonSlpUtxos)];
                    case 2:
                        genesisTxid = _a.sent();
                        return [2 /*return*/, genesisTxid];
                }
            });
        });
    };
    return TokenType1;
}());
exports.default = TokenType1;
