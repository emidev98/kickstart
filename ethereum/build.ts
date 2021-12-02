import path from "path";
import fs from "fs";
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");

try {
	console.log("Start contract compilation");

	fs.rmdirSync(buildPath, { recursive: true });
	fs.mkdirSync(buildPath);

	const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
	const source = fs.readFileSync(campaignPath, "utf-8");
	const output = solc.compile(source, 1).contracts;

	for (const contract in output) {
		const contractName = contract.replace(":", "");
		const fileName = path.resolve(buildPath, contractName + ".json");
		const contractObject = output[contract];

		console.log(`'${contractName}' compiled successfully`);

		fs.writeFileSync(fileName, JSON.stringify(contractObject));
	}

	console.log("Contract compiled successfully");
} catch (e) {
	console.error("Contract failed to compile " + e);
}
