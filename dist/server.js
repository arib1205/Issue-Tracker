'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install(); // 'use strict'

// const express = require('express');
// const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const Issue = require('./issue.js');

const app = (0, _express2.default)();
// app.use(express.static(path.join(__dirname,'public')));
app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.json());

let db;
_mongodb.MongoClient.connect('mongodb://localhost').then(client => {
  db = client.db('issuetracker');
  app.listen(3000, function () {
    console.log('App started on port 3000');
  });
}).catch(error => {
  console.log('ERROR', error);
});

app.get('/hello', (req, res) => {
  console.log("sfgsg");
  res.send('Hello Worldssss');
});

app.get('/customers/:customerId', (req, res) => {
  res.send('Hi ' + req.params.customerId);
});

// API

app.get('/api/issues/:id', (req, res) => {
  let issueId;
  try {
    issueId = new _mongodb.ObjectId(req.params.id);
    // console.log(issueId);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue Id format: ${error}` });
  }

  db.collection('issues').find({ _id: issueId }).limit(1).next().then(issue => {
    if (!issue) res.status(404).json({ message: `No such issue: ${issueId}` });else res.json(issue);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal server error ${error}` });
  });
});

app.get('/api/issues', (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte);
  if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte);

  // console.info(filter)

  db.collection('issues').find(filter).toArray().then(issues => {
    const metadata = { total_count: issues.length };
    res.json({ metadata: metadata, records: issues });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error ${error}` });
  });
});

app.get("*", (req, res) => {
  res.sendFile(_path2.default.resolve('public/index.html'));
});

app.post('/api/issues', (req, res) => {
  // console.log(req)
  console.log(req.body);
  const new_issue = req.body;
  // new_issue.id = issues.length + 1
  new_issue.created = new Date();
  new_issue.effort = Math.floor(Math.random() * 100 + 1);
  if (!new_issue.status) {
    new_issue.status = 'New';
  }

  const err = _issue2.default.validateIssue(new_issue);
  if (err) {
    res.status(422).json({ message: `Invalid request ${err}` });
    return;
  }

  db.collection('issues').insertOne(_issue2.default.cleanupIssue(new_issue)).then(result => db.collection('issues').find({ _id: result.insertedId }).limit(1).next()).then(newIssue => {
    // const metadata = db.collection('issues').count();
    // console.log(metadata)
    db.collection('issues').count().then(count => {
      const metadata = { total_count: count };
      res.json({ metadata: metadata, new_issue: newIssue });
    });
  }).catch(error => {
    res.status(500).json({ message: `Internal server Error: ${error}` });
  });

  // issues.push(new_issue);
  // // res.json(new_issue)
  // const metadata = {total_count : issues.length };
  // res.json({metadata: metadata, new_issue: new_issue})
});
//# sourceMappingURL=server.js.map