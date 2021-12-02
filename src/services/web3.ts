import Web3 from "web3";

let web3: Web3;
const isMetamaskAvailable = (<any>window).ethereum !== undefined;

// If ethereum object exists on window object
// is because Metamask injected it.
if (isMetamaskAvailable) {
	(<any>window).ethereum.request({ method: "eth_requestAccounts" });
	web3 = new Web3((<any>window).ethereum);
}
// Otherwise we create our own provider for the
// user to at least be able to view the data
else {
	const provider = new Web3.providers.HttpProvider(process.env["PROVIDER_URL"] as string);
	web3 = new Web3(provider);
}

export default web3;
export { isMetamaskAvailable, web3 };
