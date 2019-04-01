import { getOrderHistory } from './bittrexAPI' 

const main = async () => {
	let amOrderHistory = await getOrderHistory()
	// @ts-ignore
	console.log(`mOrderHistory`)
	// @ts-ignore
	// console.log(amOrderHistory)

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

		// @ts-ignore
		console.log('cost ', cost)

		return {
			...oRefinedOrder,
			cost
		}
	})
	// @ts-ignore
	console.log(amRefinedOrderHistory)

	// net per market
	let aMarketNets: { [key: string]: number } = {}
	// let aMarketNets: any[] = []

	amRefinedOrderHistory.forEach((oRefinedOrder: any) => {
		const sMarket: string = oRefinedOrder['Exchange']
		if (aMarketNets[sMarket] === undefined) {
			aMarketNets[sMarket] = 0
			console.log('setting to zero')
		}
		console.log('adding the value')
		aMarketNets[sMarket] += Number(oRefinedOrder['cost'])
	});
	// @ts-ignore
	console.log(aMarketNets)

	// net across all markets
	// @ts-ignore
	// let cTotalNet: number = aMarketNets.reduce(
	// 	(a: any,b: any) => a['cost'] + b['cost']
	// )
	// @ts-ignore
	let cTotalNet: number = Object.keys(aMarketNets).reduce(function (previous, key) {
		// @ts-ignore
		return previous + aMarketNets[key];
	}, 0);
	console.log('cTotalNet: ', cTotalNet)

}

main()