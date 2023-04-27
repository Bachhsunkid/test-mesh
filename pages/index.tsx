import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { ForgeScript, Transaction } from "@meshsdk/core";

import type { Mint, AssetMetadata } from "@meshsdk/core";
import type { Asset } from "@meshsdk/core";

const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }
  }

  async function sendAda() {
    const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        "addr_test1qz40t3pvn5x7xxah7zvkn0ay30twems9g8l09tg5dnj70vwdht80uqnhfvvm6sjjlg3kmalrh9g7evzs7pwz8kyqh2dstcr9lu",
        "1000000"
      )
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
  }

  async function sendAsset() {
    const tx = new Transaction({ initiator: wallet })
    .sendAssets(
      "addr_test1qz40t3pvn5x7xxah7zvkn0ay30twems9g8l09tg5dnj70vwdht80uqnhfvvm6sjjlg3kmalrh9g7evzs7pwz8kyqh2dstcr9lu",
      [
        {
          unit: "d3332d3250f2b5658d52ea798d59ed1b3e836a6fe6ce3ee8ab6224c762616368",
          quantity: "10",
        },
      ]
    )
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
  }

  async function mintNFT() {
    // prepare forgingScript
    const usedAddress = await wallet.getUsedAddresses();
    const address = usedAddress[0];
    const forgingScript = ForgeScript.withOneSignature(address);

    const tx = new Transaction({ initiator: wallet });

    // define asset#1 metadata
    const assetMetadata1: AssetMetadata = {
      "name": "T1",
      "image": "ipfs://QmREp3TLtFCeTFozpDUTnpkLvjDe2Mvdu1r6x8k4m6mdtk",
      "mediaType": "image/jpg",
      "description": "This NFT is minted by Bach using Mesh (https://meshjs.dev/)."
    };
    const asset1: Mint = {
      assetName: 'T1',
      assetQuantity: '1',
      metadata: assetMetadata1,
      label: '721',
      recipient: 'addr_test1qz40t3pvn5x7xxah7zvkn0ay30twems9g8l09tg5dnj70vwdht80uqnhfvvm6sjjlg3kmalrh9g7evzs7pwz8kyqh2dstcr9lu',
    };
    tx.mintAsset(
      forgingScript,
      asset1,
    );

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

}
async function BuntNFT() {
  const usedAddress = await wallet.getUsedAddresses();
  const address = usedAddress[0];
  const forgingScript = ForgeScript.withOneSignature(address);
  console.log (forgingScript)
  
  const tx = new Transaction({ initiator: wallet });

  const asset2: Asset = {
    unit: 'd3332d3250f2b5658d52ea798d59ed1b3e836a6fe6ce3ee8ab6224c75431',
    quantity: '1',
  };
  tx.burnAsset(forgingScript, asset2);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
}

  return (
    <div>
      <h1>Connect Wallet</h1>
      <CardanoWallet />
      {connected && (
        <>
          <h1>Get Wallet Assets</h1>
          {assets ? (
            <pre>
              <code className="language-js">
                {JSON.stringify(assets, null, 2)}
              </code>
            </pre>
          ) : (
            <button
              type="button"
              onClick={() => getAssets()}
              disabled={loading}
              style={{
                margin: "8px",
                backgroundColor: loading ? "orange" : "grey",
              }}
            >
              Get Wallet Assets
            </button>
          )}
        </>
      )}

      <br/>
      <button
        type="button"
        onClick={() => sendAda()}
        disabled={loading}
        style={{
          margin: "8px",
          backgroundColor: loading ? "orange" : "grey",
        }}
      >
        Send Ada
      </button>
      <br/>
      <button
        type="button"
        onClick={() => mintNFT()}
        disabled={loading}
        style={{
          margin: "8px",
          backgroundColor: loading ? "orange" : "grey",
        }}
      >
        Mint NFT
      </button>

      <br/>
      <button
        type="button"
        onClick={() => BuntNFT()}
        disabled={loading}
        style={{
          margin: "8px",
          backgroundColor: loading ? "orange" : "grey",
        }}
      >
        Burn NFT
      </button>


      <br/>
      <button
        type="button"
        onClick={() => sendAsset()}
        disabled={loading}
        style={{
          margin: "8px",
          backgroundColor: loading ? "orange" : "grey",
        }}
      >
        Send Asset
      </button>

    </div>
  );
};

export default Home;
