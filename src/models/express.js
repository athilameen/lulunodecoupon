var catalyst = require('zcatalyst-sdk-node');
module.exports = (req, res) => {	
    var app = catalyst.initialize(req);

    var zia = app.zia();

	return zia
}