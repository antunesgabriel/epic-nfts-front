import "./styles/App.css";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { connectWallet } from "./services/connect-wallet";
import ButtonConnectWallet from "./components/button-connect-walet";
import MintButton from "./components/mint-button";
import contract from "./assets/json/NFTFactory.json";

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const App = () => {
  const [currentWallet, setCurrentWallet] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [lastNft, setLastNft] = useState("");

  const recoveryCurrentWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return alert("Metamask não encontrada.");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts?.length) {
      setCurrentWallet(accounts[0]);
    }
  };

  const onClickConnectWallet = async () => {
    const wallet = await connectWallet();

    if (wallet) {
      setCurrentWallet(wallet);
    }
  };

  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      REACT_APP_CONTRACT_ADDRESS,
      contract.abi,
      signer
    );

    try {
      connectedContract.on("NewEpicNFTMinted", (_, tokenId) => {
        console.log(tokenId.toNumber());
        setLastNft(
          `https://testnets.opensea.io/assets/${REACT_APP_CONTRACT_ADDRESS}/${tokenId.toNumber()}`
        );
      });
    } catch (err) {
      console.log(err);
    }

    try {
      setIsMinting(true);
      const transaction = await connectedContract.mintANFT();

      await transaction.wait();

      console.log(transaction.hash);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    recoveryCurrentWallet();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção de NFT</p>
          <p className="sub-text">
            Exclusivos! Maravilhosos! Únicos! Descubra seu NFT hoje.
          </p>

          {currentWallet ? (
            <MintButton onClick={mint} isMinting={isMinting} />
          ) : (
            <ButtonConnectWallet onClick={onClickConnectWallet} />
          )}

          {lastNft && (
            <p className="last-nft">
              <a
                href={lastNft}
                target="_blank"
                rel="noreferrer"
                className="footer-text"
              >
                🌊 Exibir coleção no OpenSea
              </a>
            </p>
          )}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href="https://www.linkedin.com/in/gabriel-antunes/"
            target="_blank"
            rel="noreferrer"
          >
            feito com ❤️ por Gabriel Antunes
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
