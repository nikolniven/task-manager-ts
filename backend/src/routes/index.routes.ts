const express = require('express');
const router = express.Router();
import { Request, Response, NextFunction } from 'express';


router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'all good in here' });
});

module.exports = router;
