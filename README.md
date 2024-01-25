# Receipt Processor Challenge

This repository is for Fetch's Receipt Processor Challenge (https://github.com/fetch-rewards/receipt-processor-challenge).

## Language, Framework and Tools used

I have used JavaScript for this task.
I used ExpressJs, a Node.js web application framework, to build the webservice.
Apart from Express, I have used an external module called `uuid` to create unique IDs.
I have also used Docker to containerize the application.

## Instructions to run the application

### Requirements

* Docker
* Git

### Steps

1. Clone the repository `git clone git@github.com:kartik-3/fetch-receipt-processor-challenge.git`.
2. Move to the cloned directory `cd fetch-receipt-processor-challenge`.
3. Make sure docker service (or docker application) is up and running on your system.
4. Run the command `docker compose up --build`. Wait for about a minute and the application should be running on `localhost:3000`
5. Now you can access the APIs by navigating to `localhost:3000`

## Provided APIs

1. `/receipts/{id}/points` (GET) - Get endpoint that looks up the receipt by the ID and returns an object specifying the points awarded.
2. `/receipts/process` (POST) - Post endpoint. First, request body is validated. Then points are calculated and a UUID is generated and both are stored in the in-memory database. The UUID is returned to the user.
3. `/receipts/points` (GET) - Additional. Get endpoint that returns all receipts with corresponding points in the database.

## Assumptions Made/Some Comments

* While calculating points on the basis of purchase time, based on the wording of the instructions, I have not included 2:00PM and 4:00PM in the calculations.
* For validations, I have only validated the presence of all the required fields. Also, for `items` field, I have validated if both required fields are present for each item and there should be at least one item present in the items array. I have also returned custom validation messages for each validation error.
* Some other potential assumptions that could be done are matching the patterns of each value in the request. This task is simple and can be added to make the services more robust. However, this was not mentioned in the task so, in the interest of time, I have skipped it for now.
