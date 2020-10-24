
module.exports = {
	csrfToken : (req,res,next) => { //generate token to avoid csrf
		if (req.method == "GET")
		{
			var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
			req.session.token = token;
			res.locals._csrfToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		}
		next()
	},

	csrfParse : (req,res,next) => {
		if (req.body._csrfToken == req.session.token){
			req.session.validToken = true
		} else {
			req.session.validToken = false
		}
		next()
	}
}