import { getOrderHistory } from './bittrexAPI' 

const main = async () => {
	let amOrderHistory = await getOrderHistory()

	// take just what we are interested in
	let amRefinedOrderHistory = amOrderHistory.map((oOrder: any) => {
		return {
			OrderUuid: oOrder['OrderUuid'],
			Exchange: oOrder['Exchange'],
			OrderType: oOrder['OrderType'],
			Closed: oOrder['Closed'],
			Quantity: oOrder['Quantity'],
			Commission: oOrder['Commission'],
			Price: oOrder['Price'],
			PricePerUnit: oOrder['PricePerUnit']
		}
	})


	// calculate 'costs' per trade
	amRefinedOrderHistory = amRefinedOrderHistory.map((oRefinedOrder: any) => {
		// base cost
		let cost = (oRefinedOrder['PricePerUnit'] * oRefinedOrder['Quantity'])

		if (oRefinedOrder['OrderType'] === 'LIMIT_BUY') {
			cost = (cost + oRefinedOrder['Commission']) * -1
		}
		
		if (oRefinedOrder['OrderType'] === 'LIMIT_SELL') {
			cost = cost - oRefinedOrder['Commission']
		}

		return {
			...oRefinedOrder,
			cost
		}
	})

	// net per market
	let aMarketNets: { [key: string]: number } = {}
	// let aMarketNets: any[] = []

	amRefinedOrderHistory.forEach((oRefinedOrder: any) => {
		const sMarket: string = oRefinedOrder['Exchange']
		if (aMarketNets[sMarket] === undefined) {
			aMarketNets[sMarket] = 0
		}
		aMarketNets[sMarket] += Number(oRefinedOrder['cost'])
	});

	// net across all markets
	let cTotalNet: number = Object.keys(aMarketNets).reduce(function (previous, key) {
		return previous + aMarketNets[key];
	}, 0);

	console.log('Net summary from last 30 days:')
	console.log('Profit/loss per market:')
	Object.keys(aMarketNets).forEach((sMarket: string) => {
		console.log(`${sMarket}: ${aMarketNets[sMarket]}`)
	})
	console.log('cTotalNet: ', cTotalNet)
}

main()