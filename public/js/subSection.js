function hideInfo(element)
{
	element.src = "/images/dialog/info.png";
	element.parentElement.classList.remove("descriptionHeader");
	element.parentElement.nextElementSibling.style.transform = "scale(0)";
	element.classList.remove("activeDescription");
	element.parentElement.nextElementSibling.style.zIndex = "0";
	document.getElementById("descriptionMask").style.display = "none";
}
function toogleInfo(element,hide=false)
{
	if(element.src.search("info") > -1)
	{
		element.src = "/images/dialog/close_white.png";
		element.classList.add("activeDescription");
		element.parentElement.classList.add("descriptionHeader");
		element.parentElement.nextElementSibling.style.transform = "scale(1)";
		element.parentElement.nextElementSibling.style.zIndex = "99";
		document.getElementById("descriptionMask").style.display = "block";
	}
	else
	{
		hideInfo(element);
	}
}

document.addEventListener("keydown", (event) => 
{
    if(event.code === "Escape")
    {
	hideInfo(document.getElementsByClassName("activeDescription")[0]);
    }
});

