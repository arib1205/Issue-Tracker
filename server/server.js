// 'use strict'

// const express = require('express');
// const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const Issue = require('./issue.js');

import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import Issue from './issue.js';
import path from 'path'

import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();

const app = express();
// app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'))
app.use(bodyParser.json())

let db;
MongoClient.connect('mongodb://localhost').then(client =>{
  db = client.db('issuetracker');
  app.listen(3000,function(){
    console.log('App started on port 3000');
  });
}).catch(error => {
  console.log('ERROR', error);
});

app.get('/hello', (req,res) => {
  console.log("sfgsg");
  res.send('Hello Worldssss');
});

app.get('/customers/:customerId', (req,res) => {
  res.send('Hi ' + req.params.customerId);
});

// API

app.get('/api/issues/:id', (req,res) => {
  let issueId;
  try{
    issueId = new ObjectId(req.params.id);
    // console.log(issueId);
  }catch(error){
    res.status(422).json({message: `Invalid issue Id format: ${error}`});
  }

  db.collection('issues').find({_id: issueId}).limit(1)
  .next().then(issue => {
    if(!issue)
      res.status(404).json({message: `No such issue: ${issueId}`});
    else
      res.json(issue);
  }).catch(error => {
        console.log(error);
        res.status(500).json({message: `Internal server error ${error}`});
  });
});


app.put('/api/issues/:id', (req, res) => {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  }catch(error){
    res.status(422).json({message: `Invalid issue ID format: ${error}`});
    return;
  }

  const issue = req.body;
  delete issue._id;

  const err = Issue.validateIssue(issue);
  if(err){
    res.status(422).json({message: `Invalid request: ${err}`})
    return;
  }

  db.collection('issues').update({_id: issueId}, Issue.convertIssue(issue))
    .then(() => db.collection('issues').find({_id: issueId}).limit(1).next())
    .then(savedIssue => {
      res.json(savedIssue);
    }).catch(error => {
      console.log(error);
      res.status(500).json({message: `Internal server error: ${error}`});
    });
});

app.delete('/api/issues/:id', (req, res) => {
    let issueId;
    try{
      issueId = new ObjectId(req.params.id);
    }catch(error){
      res.status(422).json({message : `Invalid issue id format: ${error}`})
      return;
    }

    db.collection('issues').deleteOne({_id: issueId})
      .then(deleteResult => {
        if (deleteResult.result.n === 1) res.json({status: 'OK'});
        else res.json({status: 'Warning: object not found'});
      }).catch(error =>  {
        console.log(error);
        res.status(500).json({message: `Internal server error: ${error}`});
      });
});


app.get('/api/issues', (req,res) => {
  const filter = {};
  if(req.query.status) filter.status = req.query.status;
  if(req.query.effort_lte||req.query.effort_gte) filter.effort = {};
  if(req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte);
  if(req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte);

  // console.info(filter)

  db.collection('issues').find(filter).toArray().then(issues => {
    const metadata = {total_count : issues.length };
    res.json({metadata: metadata , records: issues})
  }).catch(error => {
    console.log(error);
    res.status(500).json({message: `Internal Server Error ${error}`});
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.post('/api/issues', (req, res) => {
  // console.log(req)
  console.log(req.body)
  const new_issue = req.body;
  // new_issue.id = issues.length + 1
  new_issue.created = new Date();
  new_issue.effort = Math.floor((Math.random() * 100) + 1);
  if(!new_issue.status){
    new_issue.status = 'New'
  }

  const err = Issue.validateIssue(new_issue);
  if(err){
    res.status(422).json({message: `Invalid request ${err}`});
    return;
  }

  db.collection('issues').insertOne(Issue.cleanupIssue(new_issue)).then(result =>
    db.collection('issues').find({_id: result.insertedId}).limit(1).next()).then(newIssue => {
      // const metadata = db.collection('issues').count();
      // console.log(metadata)
      db.collection('issues').count().then(count => {
        const metadata = {total_count : count};
        res.json({metadata: metadata, new_issue: newIssue})
      })
    }).catch(error => {
    res.status(500).json({message: `Internal server Error: ${error}`})
  });

  // issues.push(new_issue);
  // // res.json(new_issue)
  // const metadata = {total_count : issues.length };
  // res.json({metadata: metadata, new_issue: new_issue})
});
