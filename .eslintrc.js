module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "max-len" : [2 , {"code" : 200}],
        "new-cap" : [2 ,{ "newIsCapExceptions": ["stream"] } ],
        //"new-cap" : 0,
        "no-unused-vars" : [2, { "args": "none" }]
    }
};