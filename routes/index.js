var router = require('express').Router();

router.all('/', (req, res) => {
	res.render('index.html');
});

module.exports = router;