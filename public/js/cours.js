function toogleSection(element)
{
    var section = element.nextElementSibling;
    console.log(section.style.transform);
    if(section.style.transform == "scaleY(1)")
    {
        section.style.transform = "scaleY(0)";
        section.style.height = "0";
        element.className = "augm"
    }
    else
    {
        section.style.transform = "scaleY(1)";
        section.style.height = "auto";
        element.className = ""
    }
}