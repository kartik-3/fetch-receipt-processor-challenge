/**
 * This is our main router. It has two routes -
 * /receipts/{id}/points (GET) - Get endpoint that looks up the receipt by the ID and returns an object specifying the points awarded.
 * /receipts/process (POST) - Post endpoint. First, request body is validated. Then points are calculated and a UUID is generated and both are stored in the in-memory database. The UUID is returned to the user.
 */
const { Router } = require("express");
const receiptsRouter = Router();
const { generateUuid } = require("../services/uuidService");

/* For our in-memory database use-case, using a simple JS object for O(1) insert and get */
let receiptPoints = {};

async function main() {
  try {
    receiptsRouter.get("/:id/points", async (req, res) => {
      const id = req.params.id;
      /* Check if ID is not present in the database */
      if (!receiptPoints[id]) {
        return res.status(404).send({ msg: "No receipt found for this ID" });
      }
      /* Return points */
      return res.status(200).send({ points: receiptPoints[id] });
    });

    receiptsRouter.post("/process", async (req, res) => {
      /* Check if the request body is valid */
      const validBody = validateRequestBody(req);
      if (validBody.status == 400) {
        return res.status(400).send({ msg: validBody.msg });
      }
      /* Calculate points for the receipt */
      const points = calculatePoints(req);
      /* Generate id. I have used UUID module */
      const id = generateUuid();
      /* Add the key-value pair of id-points to the data structure */
      receiptPoints[id] = points;

      return res.status(200).send({ id: id });
    });
  } catch (e) {
    console.error(e);
  }
}

/* Function to validate the request body has all required fields.
Please read the corresponding message to understand what is being validated.
*/
function validateRequestBody(req) {
  let status = 200,
    msg = "";
  if (!req.body.retailer) {
    status = 400;
    msg = "Retailer not present in request";
  } else if (!req.body.purchaseDate) {
    status = 400;
    msg = "Purchase date not present in request";
  } else if (!req.body.purchaseTime) {
    status = 400;
    msg = "Purchase time not present in request";
  } else if (!req.body.total) {
    status = 400;
    msg = "Total not present in request";
  } else if (!req.body.items || req.body.items.length == 0) {
    status = 400;
    msg = "Items not present in request";
  } else {
    for (let item of req.body.items) {
      if (!item.shortDescription) {
        status = 400;
        msg = "Item description not present for an item";
        break;
      }
      if (!item.price) {
        status = 400;
        msg = "Item price not present for an item";
        break;
      }
    }
  }
  return { status, msg };
}

/* Function to calculate points for the receipt */
function calculatePoints(req) {
  const retailer = req.body.retailer;
  const purchaseDate = req.body.purchaseDate;
  const purchaseTime = req.body.purchaseTime;
  const total = +req.body.total;
  const items = req.body.items;
  let points = 0;

  /* Calculate points for retailer name length */
  points += retailer.replace(/[^A-Z0-9]/gi, "").length; //Number of alphanumeric characters in the string
  /* Calculate points for total having no cents */
  points += total % 1 === 0.0 ? 50 : 0; //50 points if total is round dollar amount with no cents
  /* Calculate points for total being a multiple of 0.25 */
  points += total % 0.25 === 0 ? 25 : 0; //25 points if total is a multiple of 0.25
  /* Calculate points for item array length */
  points += Math.floor(items.length / 2) * 5; //5 points for every two items

  /* Calculate points for item description */
  for (let item of items) {
    const desc = item.shortDescription;
    if (desc.trim().length % 3 == 0) {
      const price = +item.price;
      points += Math.ceil(price * 0.2); //points if trimmed length of item description is a multiple of 3
    }
  }

  /* Calculate points for purchase date */
  let date = purchaseDate.slice(-2);
  date = date.charAt(0) == "0" ? +date.charAt(1) : +date;
  points += date % 2 === 0 ? 0 : 6; //6 points if the purchase date is odd

  /* Calculate points for purchase time */
  let time = purchaseTime.split(":");
  let hours = +time[0],
    mins = time[1];
  mins = mins.charAt(0) == "0" ? +mins.charAt(1) : +mins;
  if ((hours == 14 && mins != 0) || hours == 15) {
    /* P.S. Not considering 2:00PM and 4:00PM based on the wordings of the question */
    points += 10; //10 points if the time is between 14:00 and 16:00
  }

  return points;
}
main().catch(console.error);

module.exports = receiptsRouter;
