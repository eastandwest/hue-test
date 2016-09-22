"use strict";

// node-hue-api repo => https://github.com/peter-murray/node-hue-api
const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;
const log4js = require('log4js');

const logger = log4js.getLogger("index.js");

hue.nupnpSearch().then( res => {
  getConf(res);
}).catch(err => {
  logger.warn(err);
});

function getConf(res) {
  // Obtaining username, see http://www.developers.meethue.com/documentation/getting-started
  const username = "Qi4SWGI5aDOddYFfl9CGGwGz3Jw5HvszHKad2nZl";
  const hostname = res[0].ipaddress;
  const api = new HueApi(hostname, username);


  api.lights().then( res => {
    res.lights.forEach( (light) => {
      let id = light.id;
      let on = light.state.on;
      let state = lightState.create().on(!on);
      api.setLightState(id, state).then(res => {
        logger.info(JSON.stringify(res, null, 2));
      }).catch(err => {
        logger.warn(err);
      });
    });
  }).catch(err => {
    logger.warn(err);
  });
}
