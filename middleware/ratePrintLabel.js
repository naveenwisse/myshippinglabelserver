var request = require('request');


var ratePrintLabel = (req, res) => {
    var data = req.body;
    console.log(data);
    var carrier_ids = req.body.carrier_ids;
    var url = 'https://api.shipengine.com/v1/labels/rates/'+req.params.rate_id;
    request(
            {
            method:'post',
            url:url,
            json: data,
            headers:{
              'Content-Type': 'application/json',
              'api-key': '0csdkPfPU/sybpRTTuugb4yqckof7Yb0UZFsJpRXXOo',
            }
        }, function (error, response, body) {
            if(body.errors) {
              console.log(body.errors);
              res.send({
                error:true,
                message:body.errors[0].message
              });

            } else {
            res.send(body);
          }
    });
};


module.exports = ratePrintLabel;
