import corsEnabledURLs from '../constants/corsUrls';

const corsOptionsDelegate = (req, callback) => {
	// eslint-disable-next-line max-len
	if (req.header('Origin') && corsEnabledURLs.indexOf(req.header('Origin').toLowerCase()) !== -1) {
		callback(null, true);
	} else {
		callback(new Error('CORS_DISABLED')); // disable CORS for this request
	}
};

module.exports = corsOptionsDelegate;
