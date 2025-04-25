import fs from 'fs'
import path from 'path'
import Client from '@amazonpay/amazon-pay-api-sdk-nodejs'

const secretKeyFilePath = path.resolve(process.cwd(), 'private.pem')

const config = {
    publicKeyId: process.env.NEXT_PUBLIC_AMZ_PUBLIC_KEY_ID,
    privateKey: fs.readFileSync(secretKeyFilePath, 'utf8'),
    region: 'us',
    sandbox: process.env.NEXT_PUBLIC_AMZ_SANDBOX === 'true',
    algorithm: 'AMZN-PAY-RSASSA-PSS-V2'
}

const amazonPayClient = new Client.AmazonPayClient(config)
const webStoreClient = new Client.WebStoreClient(config)
const inStoreClient = new Client.InStoreClient(config)

export { amazonPayClient, webStoreClient, inStoreClient }