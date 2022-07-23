export const connectWallet = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    return alert("Metamask não foi encontrada!");
  }

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });

  return accounts[0];
};
