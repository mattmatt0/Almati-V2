const baseElement = document.createElement("div")
baseElement.classList.add("wysiwyg__editor__element")

const content = document.createElement("p")
content.setAttribute("contentEditable", "true")
content.appendChild(document.createElement("br"))
baseElement.appendChild(content)


// manpuation to get different node from one editor element or status of element
getEditableFromElement = (element) => {
	if (element.classList.contains("wysiwyg__editor__element"))
		return element.querySelector("*[contentEditable='true']")
	else 
		return element
}

getTextNodeFromElement = (element) => {
	element = getEditableFromElement(element)
	return element.childNodes[0]
}

getElementFromEditable = (element) => {
	if (element.classList.contains("wysiwyg__editor__element"))
		return element
	else 
		return element.parentElement
}

getEditorFromElement = (element) => getElementFromEditable(element).parentElement

isEmpty = (element) => {
	if (element == null)
		return true
	element = getEditableFromElement(element)
	return (element.childNodes.length > 0) ? element.childNodes[0].nodeType != Node.TEXT_NODE : true
}

previousElement = (element) => {
	element = getElementFromEditable(element)
	return element.previousElementSibling
}

nextElement = (element) => getElementFromEditable(element).nextElementSibling

//manipulate element content
setElementContent = (element,text) => getEditableFromElement(element).textContent = text
addElementContent = (element,text) => getEditableFromElement(element).textContent += text
getElementContent = (element) => getEditableFromElement(element).textContent


//manipulate element
deleteElement = (element) => getEditorFromElement(element).removeChild(getElementFromEditable(element))
insertElement = (element,content) => {
	var newElement = baseElement.cloneNode(true)
	newElement.addEventListener("click",clickManager)
	newElement.addEventListener("keydown",keyManager)

	setElementContent(newElement,content)

	getElementFromEditable(element).insertAdjacentElement("afterend", newElement)

	return newElement
}

//cursor manipulation
mouseInElement = (element,end=false) => { //insert mouse at start of any element
	var range = document.createRange()
	var selection = document.getSelection()
	var pos = 0


	if (end == true && !isEmpty(element)) //check if not empty because if element is empty pos = 1 cause error
		pos = 1

	if (typeof end == "number"){ //number pos are only valid if element contain only text
		range.setStart(getTextNodeFromElement(element),end)
	} else {
		range.setStart(getEditableFromElement(element), pos)
	}

	//prevent from bugs in certains browser
	range.collapse(true)

	selection.removeAllRanges()
	selection.addRange(range)

	//prevent from bugs in certains browser
	element.focus()
}

mouseInPreviousElement = (element) => {
	if (previousElement(element) != null){
		event.preventDefault()
		mouseInElement(previousElement(element),true)
	}
}

mouseInNextElement = (element) => {
	if (nextElement(element) != null){
		event.preventDefault()
		mouseInElement(nextElement(element))
	}
}

//cursor position gesture
getCursorPosition = (selection = window.getSelection()) => selection.anchorOffset

getCursorAtEnd = () => { //get if cursor is at end of element
	var selection = window.getSelection()
	
	// sometimes, the cursor moove to the element insted of textNode so fix that
	if (selection.focusNode.nodeType == Node.TEXT_NODE)
		return getCursorPosition(selection) >= selection.focusNode.textContent.length
	else if (isEmpty(selection.focusNode))
		return true
	else
		return selection.focusOffset == 1
}

//get if cursor is at start of element
getCursorAtStart = () => getCursorPosition() == 0


clickManager = (event) => { //click gesture

}

keyManager = (event) => { //keyboard gesture
	var target = event.target
	switch (event.keyCode) {
		case 13: //take enter and create a new element after the current element
			var content = ""

			if (!getCursorAtEnd()){
				content = getElementContent(target).substring(getCursorPosition())
				setElementContent(target,getElementContent(target).substring(0, getCursorPosition()))
			}

			mouseInElement(insertElement(target,content))
			event.stopPropagation()
			event.preventDefault()
			break;
		case 8: //backspace
			if (isEmpty(target)){ //if is empty
				if (previousElement(target) != null){
					mouseInElement(previousElement(target),true)
					deleteElement(target)
					event.preventDefault()
				}
			} else if (getCursorAtStart()){
				if (isEmpty(previousElement(target))){
					deleteElement(previousElement(target))
				} else {
					var ofset = getElementContent(previousElement(target)).length
					addElementContent(previousElement(target),getElementContent(target))
					mouseInElement(previousElement(target),ofset)
					deleteElement(target)
				}
				event.preventDefault()
			}
			break;
		case 46: //supr key
			if (getCursorAtEnd() && nextElement(target)){
				var ofset = getElementContent(target).length
				addElementContent(target,getElementContent(nextElement(target)))
				mouseInElement(target,ofset)
				deleteElement(nextElement(target))
				event.preventDefault()
			}
		break;
		case 38: //arrow up
		case 37: //arrow left
			if (getCursorAtStart())
				mouseInPreviousElement(target)
			
			break;
		case 40: //arrow down
		case 39: //arrow right
			if (getCursorAtEnd())
				mouseInNextElement(target)
			break;

		default:
			console.log(event.keyCode)
			break;
	}
}

document.querySelectorAll(".wysiwyg").forEach((editor) => {
	//add event listener to all elements in editor
	editor.querySelectorAll(".wysiwyg__editor__element").forEach((element)=>{
		element.addEventListener("click",clickManager)
		element.addEventListener("keydown",keyManager)
	})
})