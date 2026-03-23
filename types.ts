
export enum AppType {
    CodeAttestor = 'code-attestor',
    NftMinter = 'nft-minter',
    QuantumLocker = 'quantum-locker',
    IpfsLinker = 'ipfs-linker',
    EnclavePulse = 'enclave-pulse',
    CodeAnalyzer = 'code-analyzer',
}

export interface SignatureData {
    signature: string;
    fileName: string;
}
