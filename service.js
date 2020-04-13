var crypto = require('crypto');


module.exports.hashElement = function (element) {
    return crypto.createHash('sha256').update(element).digest('base64');
};


module.exports.findMostRecent = function(docs, start, end){
    var ans = [];
    var realStart;
    if(start!==0) {
        var date = new Date(start);
        realStart = date.setHours(0, 0, 0, 0);
    }
    else{
        var oldest= docs[0];
        docs.forEach(function(doc){
            if(doc.ValidTime<oldest.ValidTime)
                oldest=doc;
        });
        realStart = (new Date(oldest.ValidTime)).setHours(0,0,0,0);
    }
    var realEnd = (new Date(end)).setHours(24, 0, 0, 0);
    for(var temp = realStart; temp <= realEnd; temp += (24 * 3600 * 1000)){
        var docsPerDay = [];
        docs.forEach(function(doc){
            if(doc.ValidTime>= temp && doc.ValidTime< (temp + (24 * 3600 * 1000)))
                docsPerDay.push(doc);
        });
        if(docsPerDay.length>0) {
            var recent = docsPerDay[0];
            docsPerDay.forEach(function (doc2) {
                if (doc2.ValidTime > recent.ValidTime)
                    recent = doc2;
            });
            ans.push(recent);
        }
    }
    return ans;
};


