
var litmus = require('litmus');

exports.test = new litmus.Suite('amdtools tests', [
    require('./conversions').test
]);

