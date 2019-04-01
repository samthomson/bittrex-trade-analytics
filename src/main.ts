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

	// calculate 'costs'
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

	// @ts-ignore
	console.log(amRefinedOrderHistory)
}

main()