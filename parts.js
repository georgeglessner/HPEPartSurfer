var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var baseurl = 'https://partsurfer.hpe.com/Search.aspx?searchText='
var bodyHtml = '';
var headingArray = ['Matching Spare Parts','Assembly Part Number','Part Description','Qty'];
var count = 0;
var results = {};
var resultsArray = [];

router.get('/:id', function (req, res) {
    request({uri: baseurl+req.params.id}, 
        function(error, response, body) {
           var $ = cheerio.load(body);
            $('span').each(function() {
                var id = $(this).attr('id');
                if (typeof(id)!='undefined'){
                   if(id.includes('ctl00_BodyContentPlaceHolder_gridCOMBOM') && !headingArray.includes($(this).text())){
                        if (count == 0){
                            results['Part'] = $(this).text();
                        }else if (count == 1) {
                            results['Description'] = $(this).text();
                        }else if (count == 2){
                            resultsArray.push(results);
                            results = {};
                            count = -1;
                        }
                        count ++;
                    } 
                }
            });

            // res.setHeader('Content-Type', 'application/json');
            res.json(resultsArray);
        });
});

module.exports = router;