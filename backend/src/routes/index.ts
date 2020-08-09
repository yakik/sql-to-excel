import {transformSQL} from '../modules/index'


import cors from 'cors'
import express from 'express'
var router = express.Router();

var corsOptions:cors.CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

router.post ('AAA', cors(corsOptions), (req:express.Request, res:express.Response) => {
  let playerID
  
  return res.json({ success: status });
});

module.exports = router;
