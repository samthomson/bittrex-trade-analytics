# Bittrex Trade Analytics

Given a [read access] Bittrex API key, this project reads and aggregates historic trades to infer overall profitablilty.

`docker-compose up` to start

`docker-compose run app sh` to enter container


### total cost to me

sell = ([price per unit] * quantity) - commision
buy = (([price per unit] * quantity) + commision) *= -1