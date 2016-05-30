var stream = require('stream')
var util   = require('util');

function set(dict, key, value){
	dict[key] = value;
	return dict;
}

function stream_lines2csv(opts){
	opts = opts || {};
	var delimiter = opts.delimiter || ',';
	var header    = opts.header    || false;
	var headers   = opts.headers   || null;
	var trim      = opts.trim      || true;

	var objPattern = new RegExp
	(
		(
                // Delimiters.
                "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields. (\ -> \\) and (" -> \")
                //"(?:\"([^\"]*(?:\\[\\\"][^\"]*)*)\"|" +
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + delimiter + "\\r\\n]*))"
		)
	, "gi"
	);

	this._transform = function(chunk, encoding, done){
		var row = [];
		while	( (arrMatches = objPattern.exec( chunk ))
			&&(arrMatches[0].length !== 0)
			){

			if (arrMatches[ 2 ]){
				//var strMatchedValue = arrMatches[ 2 ].replace(/\\([\"\\])/,function(str,char){ return char; });
				var strMatchedValue = arrMatches[ 2 ].replace(new RegExp( '""', "g" ), '"');
			} else {
				var strMatchedValue = arrMatches[ 3 ];
			}
			row.push( strMatchedValue );
		}
		if (trim && (row.length===0)) return done();
		if (header) {
			header = false;
			headers=row;
			return done();
		}
		if (headers) {
			this.push(headers.reduce((dict,key,index) => set(dict, key, row[index]),{}));
		} else {
			this.push(row);
		}
		done();
	}
	stream.Transform.call(this, {objectMode: true});
}
util.inherits(stream_lines2csv, stream.Transform);

module.exports = stream_lines2csv;
