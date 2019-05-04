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

function switchMenu()
{
	var menu = document.getElementById("menu");
	switch(menu.style.display)
	{
		case "block":
		menu.style.display = "none";
		break;
		default:
		menu.style.display = "block";
		break;
	}
	

}