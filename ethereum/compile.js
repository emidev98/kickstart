const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)
fs.ensureDirSync(buildPath)

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf-8')
const output = solc.compile(source, 1).contracts
 
for (let contract in output) {
    const fileName = path.resolve(buildPath, contract.replace(':','') + '.json')
    const jsonData = output[contract]
    
    fs.outputJsonSync(fileName, jsonData)
}