function colorHeader()
{
	// To make the header colorful
	var divOptions = document.getElementsByClassName("options")[0];
	var optionsTitles = divOptions.getElementsByTagName("h2");
	var options = divOptions.getElementsByTagName("a");
	var len = options.length;

	for(var iterator = 0; iterator < len; ++iterator)
	{
		options[iterator].style.filter = "hue-rotate(" + -60 * iterator +"deg)";
		
	}
}
function hideNews()
{
	// For the button
	var newsPannel = document.getElementsByClassName("news")[0] // Where the news are displayed
	newsPannel.style.display = "none";
}
function connect()
{
	var mask = document.getElementById("loginMask");
	var blurred = document.getElementById("blurred");
	mask.style.display = "block";
	blurred.style.filter = "blur(5px)";

}
function hideConnectMenu()
{
	var mask = document.getElementById("loginMask");
	var blurred = document.getElementById("blurred");
	mask.style.display = "none";
	blurred.style.filter = "none";
}
function showMenu()
{
	var menu = document.getElementById("menu");
	menu.style.display = "block";

}
