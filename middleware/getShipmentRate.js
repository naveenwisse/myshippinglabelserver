var request = require('request');


var getShipmentRate = (req, res) => {
    var data = req.body;
    // console.log("data", data);
    var carrier_ids = req.body.carrier_ids;
    var url = 'https://api.shipengine.com/v1/rates';
    // console.log(data);
    var chosen_rate = data.chosen_rate;
    var service = data.service_code;
    var p_type = data.package_type;
    request(
            {
            method:'post',
            url:url,
            json: data,
            headers:{
              'Content-Type': 'application/json',
              'api-key': '0csdkPfPU/sybpRTTuugb4yqckof7Yb0UZFsJpRXXOo',
            }
        }, (error, response, body) => {
            if(body.errors) {
              console.log(body.errors);
              res.send({
                error:true,
                message:body.errors
              });

            } else {
              // console.log(body.rate_response)
            if(body.rate_response.rates)   var results = body.rate_response.rates.map(o => o.shipping_amount.amount)

            else res.json({'errors':'shippment data incorrect'})
            // console.log(results)

            function closest(array,num){
              var i=0;
              var minDiff=1000;
              var ans;
              for(i in array){
                var m=Math.abs(num-array[i]);
                if(m<minDiff){
                  minDiff=m;
                  ans=array[i];
                }
              }
              return ans;
            }
          var closest_res = body.rate_response.rates.filter(o => o.service_code = service)
          var chosen_price = closest_res.find(o => o.package_type = p_type)
          console.log(closest_res);
          if(service) res.json(chosen_price)
          else res.json({'errors':"service code cannot be empty"})
          }
    });
};


module.exports = getShipmentRate;
