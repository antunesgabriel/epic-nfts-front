const MintButton = ({ onClick, isMinting }) => (
  <button
    onClick={onClick}
    disabled={isMinting}
    className="cta-button connect-wallet-button"
  >
    {isMinting ? "Minting..." : "Cunhar NFT"}
  </button>
);

export default MintButton;
