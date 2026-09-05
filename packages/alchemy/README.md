# @corsair-dev/alchemy

Alchemy plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/alchemy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `nft.computeRarityV3` | `alchemy.api.nft.computeRarityV3` | `read` | Compute rarity for each attribute of an NFT. |
| `nft.getCollectionMetadata` | `alchemy.api.nft.getCollectionMetadata` | `read` | Get collection metadata by marketplace slug. |
| `nft.getCollectionsForOwner` | `alchemy.api.nft.getCollectionsForOwner` | `read` | Get NFT collections held by an owner. |
| `nft.getContractMetadataBatchV3` | `alchemy.api.nft.getContractMetadataBatchV3` | `read` | Batch-fetch NFT contract metadata. |
| `nft.getContractMetadataV3` | `alchemy.api.nft.getContractMetadataV3` | `read` | Get metadata for an NFT contract. |
| `nft.getContractsForOwnerV3` | `alchemy.api.nft.getContractsForOwnerV3` | `read` | Get NFT contracts owned by an address. |
| `nft.getFloorPriceV3` | `alchemy.api.nft.getFloorPriceV3` | `read` | Get floor price across marketplaces. |
| `nft.getNftMetadata` | `alchemy.api.nft.getNftMetadata` | `read` | Get metadata for a specific NFT. |
| `nft.getNftMetadataBatch` | `alchemy.api.nft.getNftMetadataBatch` | `read` | Batch-fetch NFT metadata (up to 100). |
| `nft.getNftSalesV3` | `alchemy.api.nft.getNftSalesV3` | `read` | Get NFT sales across marketplaces. |
| `nft.getNftsForCollectionV3` | `alchemy.api.nft.getNftsForCollectionV3` | `read` | Get NFTs for a collection slug or contract. |
| `nft.getNftsForContract` | `alchemy.api.nft.getNftsForContract` | `read` | Get NFTs for a contract address. |
| `nft.getNftsForOwner` | `alchemy.api.nft.getNftsForOwner` | `read` | Get NFTs owned by an address. |
| `nft.getOwnersForCollection` | `alchemy.api.nft.getOwnersForCollection` | `read` | Get owners for an NFT collection/contract. |
| `nft.getOwnersForContract` | `alchemy.api.nft.getOwnersForContract` | `read` | Get owners for an NFT contract. |
| `nft.getOwnersForNftV3` | `alchemy.api.nft.getOwnersForNftV3` | `read` | Get owners for a specific NFT. |
| `nft.invalidateContractV3` | `alchemy.api.nft.invalidateContractV3` | `write` | Invalidate cached metadata for an NFT contract. |
| `nft.isAirdrop` | `alchemy.api.nft.isAirdrop` | `read` | Check if an NFT token is marked as an airdrop. |
| `nft.isAirdropNft` | `alchemy.api.nft.isAirdropNft` | `read` | Check whether an NFT was airdropped to its owner. |
| `nft.isHolderOfCollection` | `alchemy.api.nft.isHolderOfCollection` | `read` | Check if a wallet owns any NFT from a collection/contract. |
| `nft.isHolderOfContract` | `alchemy.api.nft.isHolderOfContract` | `read` | Check if a wallet holds any NFT from a contract. |
| `nft.isSpamContract` | `alchemy.api.nft.isSpamContract` | `read` | Check if an NFT contract is marked as spam. |
| `nft.isSpamContractV3` | `alchemy.api.nft.isSpamContractV3` | `read` | Check if an NFT contract is marked as spam (v3). |
| `nft.searchContractMetadataV3` | `alchemy.api.nft.searchContractMetadataV3` | `read` | Search NFT contract metadata by keywords. |
| `nft.summarizeNftAttributes` | `alchemy.api.nft.summarizeNftAttributes` | `read` | Summarize attribute distribution for a collection. |
| `portfolio.getNftContractsByAddress` | `alchemy.api.portfolio.getNftContractsByAddress` | `read` | Get NFT contracts for wallets across networks. |
| `portfolio.getPortfolioNftsByAddress` | `alchemy.api.portfolio.getPortfolioNftsByAddress` | `read` | Get portfolio NFTs for wallets across networks. |
| `portfolio.getTokenBalancesByAddress` | `alchemy.api.portfolio.getTokenBalancesByAddress` | `read` | Get lightweight token balances across networks. |
| `portfolio.getTokensByAddress` | `alchemy.api.portfolio.getTokensByAddress` | `read` | Get fungible tokens with metadata and prices. |
| `portfolio.getTransactionsHistoryByAddress` | `alchemy.api.portfolio.getTransactionsHistoryByAddress` | `read` | Get transaction history across networks. |
| `prices.getHistoricalPrices` | `alchemy.api.prices.getHistoricalPrices` | `read` | Get historical token prices over a time range. |
| `prices.getPricesBySymbol` | `alchemy.api.prices.getPricesBySymbol` | `read` | Get current token prices by symbol. |
| `prices.getTokenPricesByAddress` | `alchemy.api.prices.getTokenPricesByAddress` | `read` | Get current token prices by address/network. |
| `rpc.getTransactionCount` | `alchemy.api.rpc.getTransactionCount` | `read` | Get transaction count (nonce) for an address. |
| `token.getTokenBalances` | `alchemy.api.token.getTokenBalances` | `read` | Get ERC-20 token balances for an address (JSON-RPC). |
| `token.getTokenMetadata` | `alchemy.api.token.getTokenMetadata` | `read` | Get ERC-20 token metadata (JSON-RPC). |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/alchemy

## License

Apache-2.0
