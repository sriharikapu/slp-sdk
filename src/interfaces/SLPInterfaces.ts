export interface IConfig {
  restURL?: string
}

export interface ICreateConfig {
  fundingAddress: string
  fundingWif: string
  tokenReceiverAddress: string
  batonReceiverAddress: string
  bchChangeReceiverAddress: string
  decimals: number
  name: string
  symbol: string
  documentUri: string
  documentHash: any
  initialTokenQty: number
}

export interface IMintConfig {
  fundingAddress: string
  fundingWif: string
  tokenReceiverAddress: string
  batonReceiverAddress: string
  bchChangeReceiverAddress: string
  tokenId: string
  additionalTokenQty: number
}

export interface ISendConfig {
  fundingAddress: string
  fundingWif: string
  tokenReceiverAddress: string
  bchChangeReceiverAddress: string
  tokenId: string
  amount: number
}

export interface IBurnAllConfig {
  fundingAddress: string
  fundingWif: string
  tokenId: string
  bchChangeReceiverAddress: string
}

export interface IBurnConfig {
  fundingAddress: string
  fundingWif: string
  tokenId: string
  bchChangeReceiverAddress: string
  amount: number
}

export interface ICreateP2MSConfig {
  fundingWif: string
  tokenReceiverWifs: string[]
  batonReceiverWifs: string[]
  bchChangeReceiverWifs: string[]
  decimals: number
  name: string
  symbol: string
  documentUri: string
  documentHash: any
  initialTokenQty: number
  requiredSignatures: number
}

export interface IMintP2MSConfig {
  fundingWif: string
  tokenReceiverWifs: string[]
  batonReceiverWifs: string[]
  bchChangeReceiverWifs: string[]
  tokenId: string
  additionalTokenQty: number
  requiredSignatures: number
}

export interface ISendP2MSConfig {
  fundingWif: string
  tokenReceiverWifs: string[]
  bchChangeReceiverWifs: string[]
  tokenId: string
  sendAmount: number
  requiredSignatures: number
}

export interface IBurnAllP2MSConfig {
  fundingWif: string
  tokenId: string
  tokenReceiverWifs: string[]
  bchChangeReceiverWifs: string[]
  requiredSignatures: number
}

export interface IBurnP2MSConfig {
  fundingWif: string
  tokenId: string
  burnAmount: number
  tokenReceiverWifs: string[]
  bchChangeReceiverWifs: string[]
  requiredSignatures: number
}

export interface ICreateP2PKConfig {
  fundingWif: string
  tokenReceiverWif: string
  batonReceiverWif: string
  bchChangeReceiverWif: string
  decimals: number
  name: string
  symbol: string
  documentUri: string
  documentHash: any
  initialTokenQty: number
}

export interface IMintP2PKConfig {
  fundingWif: string
  tokenReceiverWif: string
  batonReceiverWif: string
  bchChangeReceiverWif: string
  tokenId: string
  additionalTokenQty: number
}

export interface ISendP2PKConfig {
  fundingWif: string
  tokenReceiverWif: string
  bchChangeReceiverWif: string
  tokenId: string
  sendAmount: number
}

export interface IBurnAllP2PKConfig {
  fundingWif: string
  tokenId: string
  tokenReceiverWif: string
  bchChangeReceiverWif: string
}

export interface IBurnP2PKConfig {
  fundingWif: string
  tokenId: string
  burnAmount: number
  tokenReceiverWif: string
  bchChangeReceiverWif: string
}

export interface ICreateP2SHConfig {
  fundingWif: string
  tokenReceiverWif: string
  batonReceiverWif: string
  bchChangeReceiverWif: string
  decimals: number
  name: string
  symbol: string
  documentUri: string
  documentHash: any
  initialTokenQty: number
}

export interface IMintP2SHConfig {
  fundingWif: string
  tokenReceiverWif: string
  batonReceiverWif: string
  bchChangeReceiverWif: string
  tokenId: string
  additionalTokenQty: number
}

export interface ISendP2SHConfig {
  fundingWif: string
  tokenReceiverWif: string
  bchChangeReceiverWif: string
  tokenId: string
  sendAmount: number
}

export interface IBurnAllP2SHConfig {
  fundingWif: string
  tokenId: string
  tokenReceiverWif: string
  bchChangeReceiverWif: string
}
