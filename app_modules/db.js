//db.js -----------------------------------------------------------------------

var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var file = "datas.db";
var dbase = new sqlite3.Database(file);

db = module.exports = {
	
	getProgramName : function(callback) {		
		var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_NAME'";
		dbase.each(sql, function (err, row) {						
	        if(err) {
	        	callback(err);
	        } else {	   	    
  			  	callback(null, row.value);
	        } 
	               
		});		
	},

	getProgramVersion : function(callback) {		
		var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_VERSION'";
		dbase.each(sql, function (err, row) {						
	        if(err) {
	        	callback(err);
	        } else {	   	    
  			  	callback(null, row.value);
	        } 
	               
		});				
	},

	getDevelopmentYear : function(callback) {
		var sql = "select value from sys_param sp where	sp.key = 'DEV_YEAR'";
		dbase.each(sql, function (err, row) {						
	        if(err) {
	        	callback(err);
	        } else {	   	    
  			  	callback(null, row.value);
	        } 
	               
		});
	},

	getDeveloper : function(callback) {
		var sql = "select value from sys_param sp where	sp.key = 'DEVELOPER'";
		dbase.each(sql, function (err, row) {						
	        if(err) {
	        	callback(err);
	        } else {	   	    
  			  	callback(null, row.value);
	        } 
	               
		});					
	},

};