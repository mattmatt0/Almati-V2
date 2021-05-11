var ignore = ["/robots.txt","/favicon.ico"]


module.exports = {
	csrfToken : (req,res,next) => { //generate token to avoid csrf
		if (req.method == "GET" && ignore.indexOf(req.path) == -1)
		{
			var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
			req.session._csrf = token
			req.session.save()
			res.locals._csrf = token
		}
		next()
	},

	csrfParse : (req,res,next) => {
		if (req.body._csrf == req.session._csrf){
			req.validToken = true
		} else {
			req.validToken = false
		}
		next()
	}
}