//index.js --------------------------------------------------------------------

var express = require('express');
var router = express.Router();
var async = require('async');

var db = require('../app_modules/db.js');

router.get('/', function(req, res, next) {			

	var page_name = 'Game page';

	async.parallel({
		
		func_prog_name: function asyncParallalDbGetProgName(callback) {
			db.getProgramName(function getProgramProgNameCallback(err, result) {
		      	callback(err, result);
		    });
	  	},

		func_prog_ver: function asyncParallalDbGetProgVer(callback) {
			db.getProgramVersion(function getProgramProgVerCallback(err, result) {
		      	callback(err, result);
		    });
	  	},	

		func_dev_year: function asyncParallalDbGetDevYear(callback) {
			db.getDevelopmentYear(function getProgramDevYearCallback(err, result) {
		      	callback(err, result);
		    });
	  	},	  	

	  	func_prog_dev: function asyncParallalDbGetProgDev(callback) {
			db.getDeveloper(function getProgramProgDevCallback(err, result) {
		      	callback(err, result);
		    });
	  	},

	}, 	function asyncParallalResulthandler(err, results) {
  			if (err) {
	    		res.send(err);
	  		} else {	    		
	    		res.render('index', { pageName : page_name,
	    							  progName: results.func_prog_name,
	    							  progVersion : results.func_prog_ver, 
	    							  devYear: results.func_dev_year, 	    							  
	    							  progDevloper : results.func_prog_dev
    							   	}); 	    		
	 		}
		}
	);		

});

module.exports = router;