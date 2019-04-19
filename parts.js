var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require("cheerio");

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

var baseurl = 'https://partsurfer.hpe.com/Search.aspx?searchText='
var bodyHtml = '';
var headingArray = ['Matching Spare Parts', 'Assembly Part Number', 'Part Description', 'Qty'];
var count = 0;

router.get('/:id', function(req, res) {
    
    var productInfo = {};
    var bom = {};
    var bomArray = [];
    var resultsArray = [];

    request({
            uri: baseurl + req.params.id
        },
        function(error, response, body) {
            var $ = cheerio.load(body);
            $('span').each(function() {
                var id = $(this).attr('id');
                if (typeof(id) != 'undefined') {
                    if(id == 'ctl00_BodyContentPlaceHolder_lblSerialNumber'){
                        productInfo['Serial Number'] = $(this).text();
                    }
                    if(id == 'ctl00_BodyContentPlaceHolder_lblProductNumber'){
                        productInfo['Product Number'] = $(this).text();
                    }
                    if(id == 'ctl00_BodyContentPlaceHolder_lblDescription'){
                        productInfo['Product Description'] = $(this).text();
                        resultsArray.push({"Product Information":productInfo});
                    }
                    if (id.includes('ctl00_BodyContentPlaceHolder_gridCOMBOM') && !headingArray.includes($(this).text())) {
                        if (count == 0) {
                            bom['Part'] = $(this).text();
                        } else if (count == 1) {
                            bom['Description'] = $(this).text();
                        } else if (count == 2) {
                            bom['Count'] = $(this).text();
                            bomArray.push(bom);
                            bom = {};
                            count = -1;
                        }
                        count++;
                    }
                }
            });
            resultsArray.push({"Component Bom":bomArray});
            res.json(resultsArray);
        });
});

module.exports = router;