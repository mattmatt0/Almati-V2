const jwt = require("jsonwebtoken")
const secret = 'kmnq$kkmnq$k411€415@km§.t.iakmnq$keg€§dkmnq$kij/k§mne4+3.lkmnq§$k€dkyiokm§lmnq$kij.s13' 

exports.verifier = function(token){
	try{
		var valide = jwt.verify(token,secret)
		return true
	}
	catch(err){
		return false
	}
}
exports.creer = function(contenu,parametre)
{
	return jwt.sign(contenu,secret,parametre)
}
exports.isConnect = function(req,res)
{
	var token = req.cookies['user']
	if (token==undefined)
		return false
	else if (!this.verifier(token))
		return false
	else
		return true
}
exports.getTokenRr = function(req,res){
	var token = req.cookies['user']
	if (this.verifier(token))
	{
		return jwt.decode(token)
	}
	return{erreur:"valid"}
}
exports.getToken = function(token){
	if (this.verifier(token))
	{
		return jwt.decode(token)
	}
	return{erreur:"valid"}
}
/*exports.secret = secret;*/
exports.token = (req,res)=>{
	return req.cookies['user']
}
exports.miseAjour = (req,res,contenu)=>
{
	var tok = this.getTokenRr(req,res)
	req.cookies['user'] = this.creer(contenu+{'iat':tok.iat,'exp':tok.exp},{})
}