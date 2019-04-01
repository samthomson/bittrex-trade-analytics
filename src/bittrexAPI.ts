// @ts-ignore
import * as crypto from 'crypto'
// @ts-ignore
import * as requestPromise from 'request-promise'
// @ts-ignore
const { BITTREX_API_KEY, BITTREX_API_SECRET } = process.env

const hmac = (key: string, data: any) => {
    const hash = crypto.createHmac('sha512', key)
    hash.update(data)
    return hash.digest('hex')
}

const bittrexRequest = async (
    apiRoute: string,
    oVariables: any
): Promise<any> => {
    const version = 'v1.1'
    const nonce = Math.floor(new Date().getTime() / 1000)

    let sRelativeURI: string = `/api/${version}${apiRoute}?apikey=${
        BITTREX_API_KEY
    }&nonce=${nonce}`

    // add vars
    for (const sKey in oVariables) {
        if (oVariables.hasOwnProperty(sKey)) {
            sRelativeURI += `&${sKey}=${oVariables[sKey]}`
        }
    }

    const sBittrexHost: string = 'https://bittrex.com'

    const signUri: string = sBittrexHost + sRelativeURI

    const options = {
        headers: {
            Accept: 'text/json',
            apisign: hmac(BITTREX_API_SECRET || 'key-missing', signUri),
        },
        method: 'GET',
        url: signUri,
        withCredentials: false,
	}

    const response = JSON.parse(await requestPromise(options))

    return response
}

export const getOrderHistory = async (): Promise<any> => {
	const resp: { result: { Balance: number } } = await bittrexRequest(
		'/account/getorderhistory',
		{}
	)
	if (
		resp &&
		resp.result
	) {
		// return resp.result.Balance
		// @ts-ignore
		// console.log(resp)
		return resp.result
	}else {
		return 0
	}
}
