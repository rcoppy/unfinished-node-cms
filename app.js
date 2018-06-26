'use strict';

// imports
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

// Constants
const PORT = 3000;
const HOST = '127.0.0.1';

// App
const app = express();

// configure template engine
app.set('views', './views');
app.set('view engine', 'pug');

// configure parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// make resources in public folder available
app.use(express.static('public'));

// database connect
var client, db;

const TARGET_DB = 'json-item-editor';
const TARGET_COLLECTION = 'portfolio-items'; 
const MONGO_HOST = 'localhost';
const MONGO_PORT = 27017; 

// mongo 3.0+ returns client, not database object--db is inside client
MongoClient.connect('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + TARGET_DB, (err, cli) => {
  if (err) return console.log(err);
  client = cli; 
  db = client.db(TARGET_DB); 
  console.log("connected to mongo"); 
  main(); 
});

var main = function() {
	// start server 
	app.listen(PORT, HOST);
	console.log(`Running on http://${HOST}:${PORT}`);

	// set up routing
	app.get('/', (req, res) => {
	  // res.sendFile(__dirname + "/index.html");
	  

	  var cursor = db.collection(TARGET_COLLECTION).find().toArray((err, results) => {
	  	if (err) return console.log("something went wrong fetching the data");

	  	res.render('index', { items: results });
	  	console.log(results);
	  });


	});

	app.get('/pug', (req, res) => {
	  res.render('index', { title: 'Hey', message: 'Hello there!' });
	});

	// save function
	app.post("/additem", (req, res) => {
		db.collection(TARGET_COLLECTION).save(req.body, (err, result) => {
			if (err) {
				res.send('woops save failed');
				return console.log(err); 
			}

			console.log("item saved"); 
			res.redirect('/');
		})
	});

	app.put('/updateitem', (req, res) => {
		// handle put request

		db.collection(TARGET_COLLECTION)
		.findOneAndUpdate({title: 'hello there'}, {
			$set: {
				title: req.body.title
			}
		}, (err, result) => {
			if (err) return res.send(err); 

			res.send(result);
		});
	});

	app.delete('/deleteitem', (req, res) => {
		db.collection(TARGET_COLLECTION)
		.findOneAndDelete({title: req.body.title}), (err, result) => {
			if (err) return res.send(err); 
			res.send(result);
		}
	});
}


// uses mongodb package: https://zellwk.com/blog/crud-express-mongodb/
// uses mongoose package: https://codeburst.io/hitchhikers-guide-to-back-end-development-with-examples-3f97c70e0073