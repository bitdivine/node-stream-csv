#!/usr/bin/env node
var csv   = require('.');
var split = require('split');
var fs    = require('fs');

Promise.all([])
.then(() => new Promise((yay, nay) => {
	console.log("=== To array ===");
	fs.createReadStream('test.csv')
		.pipe(split())
		.pipe(new csv())
		.on('data', console.log)
		.on('end', yay);
}))
.then(() => new Promise((yay, nay) => {
	console.log("=== To dict ===");
	fs.createReadStream('test.csv')
		.pipe(split())
		.pipe(new csv({header:true}))
		.on('data', console.log)
		.on('end', yay);
}));
