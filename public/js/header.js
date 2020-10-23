function hideNews()
{
	// For the button
	var newsPannel = document.getElementsByClassName("news")[0] // Where the news are displayed
	newsPannel.style.display = "none";
}

document.getElementById("hideNewsButton").addEventListener("click",hideNews)