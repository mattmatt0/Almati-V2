document.addEventListener("keydown", (event) => {
    if(event.code === "Escape" && (document.location.toString().includes("#login") || document.location.toString().includes("#signUp")))
    {
        document.location = "#";
    }
});
