// format response
var common = function(res, err, message, data){
    return res.send({error: !!err, message: !!err ? err.message: message, data: data});
};

module.exports = common;