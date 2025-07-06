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
    console.log('Root endpoint called');
    
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
    console.log('Root endpoint completed successfully');
    res.send(publishedEvent ? publishedEvent.event : signedEvent.event);
  } catch (err) {
    console.error('Root endpoint error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});



router.post("/fees", async (req, res) => {
  try {
    console.log('Fees endpoint called');
    
    /*
      Initialize a Smart Widget instance, a relays URL list is optional.
      Make sure to add your secret key in the .env file under the key of SECRET_KEY to ensure all widgets are signed under the same key.
    */
    let SMART_WIDGET = new SW();

    /*
    Fetch current Bitcoin fees from mempool.space
    */
    console.log('Fetching Bitcoin fees...');
    const feesResponse = await axios.get("https://mempool.space/api/v1/fees/recommended");
    const fees = feesResponse.data;
    console.log('Fees fetched:', fees);

    /*
    Create a simple text representation of the fees
    */
    const feesText = `Low: ${fees.minimumFee} sat/vB\nMedium: ${fees.hourFee} sat/vB\nHigh: ${fees.fastestFee} sat/vB`;
    console.log('Fees text:', feesText);

    /*
    Generate image with the fees data using Canvas
    */
    console.log('Generating image...');
    let feesImage = await ImagePainter(feesText);
    console.log('Image generated:', feesImage ? 'success' : 'failed');

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
    console.log('Fees endpoint completed successfully');
    res.send(signed.event);
  } catch (err) {
    console.error('Fees endpoint error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

module.exports = router;
