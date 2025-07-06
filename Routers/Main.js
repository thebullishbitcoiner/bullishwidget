const express = require("express");
const { SW, Button, Image, SWComponentsSet } = require("smart-widget-builder");
const router = express.Router();
const axios = require("axios");
const { getMainURL } = require("../Helpers/Helper");
const WebSocket = require("ws");
const ImagePainter = require("../Painter/ImagePainter");
global.WebSocket = WebSocket;

/*
Root endpoint, should be the start of the smart widget.
Add more endpoints to use them in a POST type buttons for more widget heirarchy.
*/
router.post("/", async (req, res) => {
  try {
    /*
      Initialize a Smart Widget instance, a relays URL list is optional.
      Make sure to add your secret key in the .env file under the key of SECRET_KEY to ensure all widgets are signed under the same key.
    */
    let SMART_WIDGET = new SW();

    /*
     Smart widget components (Image, Input, Button).
     */
    let SWImage = new Image(
      "https://image.nostr.build/1690fdce710a9f0ddd6466ffe1edbfe76710615e1d0fd8d0b8118f1641953e28.jpg"
    );
    let SWButton = new Button(
      1,
      "Bitcoin Fees ₿",
      "post",
      getMainURL() + "/fees"
    );

    /*
    Smart widget component set, it accepts one image, one optional input, and a max of 6 buttons ordered respectively from 1 to 6.
    */
    let SWComp = new SWComponentsSet([SWImage, SWButton]);

    /*
    An optional static Smart widget event identifier, but highly recommended on the root Smart widget.
    Make sure to use a unique string.
    */
    let identifier = "a99a8857ce9ca5a4237";

    /*
    To sign a Smart widget event, skip this step if wanting to publish the event.
    */
    let signedEvent = await SMART_WIDGET.signEvent(
      SWComp,
      "Bitcoin Fees",
      identifier
    );

    /*
    To publish a Smart widget event, skip this step if not wanting to publish the event.
    For a best practice, make sure to publish only the root widget.
    the init() method is required before publishing the Smart widget.
    */
    let publishedEvent;
    if (process.env.NODE_ENV === "production")
      publishedEvent = await SMART_WIDGET.publish(SWComp, "Bitcoin Fees", identifier);

    /*
   Always return a valid Smart widget event.
   */
    res.send(publishedEvent ? publishedEvent.event : signedEvent.event);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});



router.post("/fees", async (req, res) => {
  try {
    /*
      Initialize a Smart Widget instance, a relays URL list is optional.
      Make sure to add your secret key in the .env file under the key of SECRET_KEY to ensure all widgets are signed under the same key.
    */
    let SMART_WIDGET = new SW();

    /*
    Fetch current Bitcoin fees from mempool.space
    */
    const feesResponse = await axios.get("https://mempool.space/api/v1/fees/recommended");
    const fees = feesResponse.data;

    /*
Create a text representation of the fees for the image
*/
    const feesText = `Low: ${fees.minimumFee} sat/vB

Medium: ${fees.hourFee} sat/vB

High: ${fees.fastestFee} sat/vB`;

    /*
    Generate image with the fees data using Canvas
    */
    let feesImage = await ImagePainter(feesText);

    /*
    Use the generated image if available, otherwise fallback to placeholder
    */
    let SWImage = new Image(
      feesImage ? `data:image/png;base64,${feesImage.toString("base64")}` : 
      "https://image.nostr.build/1690fdce710a9f0ddd6466ffe1edbfe76710615e1d0fd8d0b8118f1641953e28.jpg"
    );

    /*
     Smart widget components (Image, Input, Button).
     */
    let SWButton = new Button(
      1,
      "Refresh Fees 🔄",
      "post",
      getMainURL() + "/fees"
    );

    /*
    Smart widget component set, it accepts one image, one optional input, and a max of 6 buttons ordered respectively from 1 to 6.
    */
    let SWComp = new SWComponentsSet([SWImage, SWButton]);

    /*
    To sign a Smart widget event, the use of a static event identifier is not required if the event is not published.
    For best practice, make sure to publish only the root Smart widget.
    */
    let signed = await SMART_WIDGET.signEvent(SWComp, "Bitcoin Fees");

    /*
    Always return a valid Smart widget event.
    */
    res.send(signed.event);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
