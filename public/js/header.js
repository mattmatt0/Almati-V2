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