# Bittrex Trade Analytics

Given a [read access] Bittrex API key, this project reads and aggregates historic trades to infer overall profitablilty.

On Bittrex only trades from the last 30 days are exposed.

Created to quickly get an idea of profitability from a Bittrex with many trades (e.g. those placed by a bot).

## using

Populate an `.env` file as per the `.env.sample` file.

`docker-compose run app yarn run start` to run the program in a container.

## working on

`docker-compose up` to star the service in a watch mode, which will re-run the script as it is saved.

`docker-compose run app sh` to enter container


### total cost to me

sell = ([price per unit] * quantity) - commision
buy = (([price per unit] * quantity) + commision) *= -1