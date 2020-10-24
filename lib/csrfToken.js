var ignore = ["/robots.txt","/favicon.ico"]


module.exports = {
	csrfToken : (req,res,next) => { //generate token to avoid csrf
		if (req.method == "GET" && ignore.indexOf(req.path) == -1)
		{
			var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
			req.session._csrfToken = token;
			res.locals._csrfToken = token
			// console.log('new token',token)
		}
		next()
	},

	csrfParse : (req,res,next) => {
		// console.log("body:",req.body._csrfToken, "session:", req.session._csrfToken)
		if (req.body._csrfToken == req.session._csrfToken){
			req.validToken = true
		} else {
			req.validToken = false
		}
		next()
	}
}