'use strict';

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection.js');

const router = express.Router();

const models = new Map();
const bearerAuth=require('../middleware/bearer');
const basicAuth=require('../middleware/basic');
const acl=require('../middleware/acl');
const User = require('../models/users');

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next("Invalid Model");
    }
  }
});
// example :http://localhost:3001/user/food/1234665
// example :http://localhost:3001/user/clothes/1234665 

router.post('/signup', handlesignup) ;
router.get('/user/:model',bearerAuth, handleGetAll);
router.get('/user/:model/:id',bearerAuth, handleGetOne);
router.post('/signin',basicAuth, handlesignin);
router.post('/create', bearerAuth, acl('create'), handleCreate);
router.put('/update/:model/:id',bearerAuth, acl('update'), handleUpdate);
router.delete('/delete/:model/:id', bearerAuth, acl('delete'), handleDelete);

async function handlesignup(req, res,next) {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
}
async function handlesignin(req, res,next) {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);

}
async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
 try {

   let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
} 
   
catch (error) {
res.status(201).json('You can create but no correct data');
 }
}

async function handleUpdate(req, res) {
try {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
  
} catch (error) {
  res.status(201).json('You can update but no correct data');
}


}

async function handleDelete(req, res) {
  try {
    
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    res.status(201).json('You can delete but no correct data');
  }
  
}


module.exports = router;