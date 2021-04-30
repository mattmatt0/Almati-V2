/********************************/
/******* UTILITY FUNCTIONS ******/
/********************************/
getCurrentElementType = (editorId=-1) => {
	var target = document.getElementById("editor-"+editorId).querySelector(".focused")
	if (!target)
		return

	var targetType = target.getAttribute("type")

	if (window[targetType]){
		return targetType
	} else {
		throw "Current element is not suported"
	}
}

formatCurrentElement = (editorId,command) => {
	var focusedElementType = getCurrentElementType(editorId)
	if (focusedElementType)
		window[focusedElementType].formatManager(command)
}

window.toolBar = []

window.getToolBarById = (editorId,barId) => {
	for (var i = 0; i<toolBar.length; i++)
		if (toolBar[i].editorId == editorId && toolBar[i].barId == barId) return toolBar[i]
}

window.getToolBarByButtonId = (buttonId) => {
	var parseid = ToolBar.buttonIdRegex.exec(buttonId)
	if (parseid){
		return getToolBarById(parseid[2],parseid[3])
	} else {
		throw "Bad button id"
	}
}

window.getToolBarsByEditorId = (editorId) => {
	if (!document.getElementById("editor-"+editorId))
		throw `Editor with id ${editorId} doesn't exist`
	var result = []
	toolBar.forEach((bar)=>{
		if (bar.editorId == editorId)
			result.push(bar)
	})
	return result
}


/********************************/
/******* TOOLS BAR CLASS ********/
/********************************/
class ToolBar {
	static buttonIdRegex = /button\.([a-z]+)\.([0-9]+)\.([0-9]+)/

	constructor(editorId,barId,forElement,hidden=false,buttonList=[]){
		var editor = document.getElementById("editor-"+editorId)
		if (!editor){
			throw "Editor don't exist"
		}

		if (editor.querySelector("#tooBar-"+barId)){
			throw "Duplicate tool bar"
		}
		

		this.editorId = editorId
		this.barId = barId
		this.forElement = forElement

		this.group = document.createElement("div")
		this.group.classList.add("wysiwyg__toolBar__group")
		this.group.setAttribute("id", "toolBar-"+barId)

		if (hidden)
			this.hide()

		editor.querySelector(".wysiwyg__toolBar").appendChild(this.group)

		buttonList.forEach((button)=>{
			this.addButton(button.name,button.image,button.action)
		})

		window.toolBar.push(this)
	}

	addButton(name,image,action){
		var button = document.createElement("button")
		button.setAttribute("id", `button.${name}.${this.editorId}.${this.barId}`)
		button.classList.add("wysiwyg__toolBar__group__button")

		var imageContent = document.createElement("img")
		imageContent.setAttribute("src", image)
		button.appendChild(imageContent)

		button.addEventListener("click", (event)=>{
			var target = event.target
			if (target.nodeName == "IMG")
				target = target.parentNode
			var buttonData = ToolBar.buttonIdRegex.exec(target.getAttribute("id"))
			if (!buttonData)
				throw "Bad button id"
			action({
				name:buttonData[1],
				editorId:buttonData[2],
				barId:buttonData[3]
			})
		})

		this.group.appendChild(button)
	}

	update(){
		// var currentElementType = getCurrentElementType()
		// if (~this.forElement.indexOf(currentElementType))
		// 	this.disable()
		// else
		// 	this.enable()
	}

	show(){
		this.group.classList.remove("hidden")
	}

	hide(){
		this.group.classList.add("hidden")
	}

	toggle(){
		this.group.classList.toggle("hidden")
	}

	disable(){
		this.group.classList.add("disabled")
	}

	ensable(){
		this.group.classList.remove("disabled")
	}
}

class FormatToolBar extends ToolBar {
	constructor(editorId,barId,forElement,imageBase,formatMethod,formats){
		var buttons = []
		formats.forEach((format)=>{
			buttons.push({
				name:format,
				image:imageBase+"/"+format+".png",
				action:(buttonData)=>{
					formatMethod(buttonData.editorId,format)
				}
			})
		})

		super(editorId,barId,forElement,false,buttons)
	}
}
/********************************/
/******* ELEMENT MANAGMENT ******/
/********************************/
// To create new elements, just add it to "this" or to "window"


/********************************/
/****** BASE ELEMENT CLASS ******/
/********************************/
window.Element = class Element {

	static createElement = () => {
		var element = document.createElement("div")
		element.classList.add("wysiwyg__editor__element")
		element.setAttribute("type", this.name)
		var content = document.createElement("p")
		content.setAttribute("contenteditable", "true")

		element.appendChild(content)
		return element
	}

	/********************************/
	/***** ELEMENT MANIPULATION *****/
	/********************************/

	// manpuation to get different node from one editor element or status of element
	static getEditableFromElement = (element) => {
		if (element.classList.contains("wysiwyg__editor__element"))
			return element.querySelector("*[contentEditable='true']")
		else 
			return element
	}

	static getTextNodeFromElement = (element) => {
		element = this.getEditableFromElement(element)
		return element.childNodes[0]
	}

	static getElementFromEditable = (element) => {
		var max = 5, i = 0
		while (!element.classList.contains("wysiwyg__editor__element") && i<max)
			element = element.parentNode
			i += 1
		if (element.classList.contains("wysiwyg__editor__element"))
			return element
		
		throw "Element isn't content of editor element"	
	}

	static getEditorFromElement = (element) => this.getElementFromEditable(element).parentElement

	static isEmpty = (element) => {
		if (element == null)
			return true
		element = this.getEditableFromElement(element)
		return (element.childNodes.length > 0) ? element.childNodes[0].nodeType != Node.TEXT_NODE : true
	}

	static previousElement = (element) => {
		element = this.getElementFromEditable(element)
		return element.previousElementSibling
	}

	static nextElement = (element) => this.getElementFromEditable(element).nextElementSibling

	//manipulate element content
	static setElementContent = (element,text) => this.getEditableFromElement(element).textContent = text
	static addElementContent = (element,text) => this.getEditableFromElement(element).textContent += text
	static getElementContent = (element) => this.getEditableFromElement(element).textContent


	//manipulate element
	static deleteElement = (element) => this.getEditorFromElement(element).removeChild(this.getElementFromEditable(element))
	static insertElement = (element,content) => {
		var newElement = this.createElement()
		newElement.addEventListener("click",this.clickManager)
		newElement.addEventListener("keydown",this.keyManager)

		this.setElementContent(newElement,content)

		this.getElementFromEditable(element).insertAdjacentElement("afterend", newElement)

		return newElement
	}

	static focusElement = (element) => {
		var editor = this.getEditorFromElement(element)

		editor.querySelectorAll(".selected,.focused").forEach((element)=>{
			element.classList.remove("selected")
			element.classList.remove("focused")
		})

		this.getElementFromEditable(element).classList.add("focused")
	}

	//cursor manipulation
	static createRangeWithMultipleChild = (element,ofset) => {
		var result = null
		for (var i = 0; i<element.childNodes.length; i++){
			var lookElement = element.childNodes[i]
			if (lookElement.nodeType == Node.TEXT_NODE){
				if (lookElement.length < ofset)
					ofset -= lookElement.length
				else {
					return [ofset, lookElement]
					break
				}
			} else if (lookElement.childNodes.length > 0){
				[ofset, result] = exploreChildNodes(lookElement,ofset)
				if (result != null)
					return [ofset, result]
			}
		}
		return [ofset, null]
	}

	static mouseInElement = (element,end=false) => { //insert mouse at start of any element
		element = this.getElementFromEditable(element)

		this.focusElement(element)

		element = this.getEditableFromElement(element)
		var range = document.createRange()
		var selection = window.getSelection()
		var pos = 0


		if (end == true && !this.isEmpty(element)) //check if not empty because if element is empty pos = 1 cause error
			pos = element.childNodes.length

		if (typeof end == "number"){ //number pos are only valid if element contain only text
			[pos,element] = this.createRangeWithMultipleChild(element,end)
		}


		range.setStart(element, pos)

		//prevent from bugs in certains browser
		range.collapse(true)

		selection.removeAllRanges()
		selection.addRange(range)
	}

	static mouseInPreviousElement = (element) => {
		if (this.previousElement(element) != null){
			event.preventDefault()
			this.mouseInElement(this.previousElement(element),true)
		}
	}

	static mouseInNextElement = (element) => {
		if (this.nextElement(element) != null){
			event.preventDefault()
			this.mouseInElement(this.nextElement(element))
		}
	}

	//cursor position gesture
	static getCursorPosition = (selection = window.getSelection()) => selection.anchorOffset

	static getCursorAtEnd = () => { //get if cursor is at end of element
		var selection = window.getSelection()
		
		// sometimes, the cursor moove to the element insted of textNode so fix that
		if (selection.focusNode.nodeType == Node.TEXT_NODE)
			return this.getCursorPosition(selection) >= selection.focusNode.textContent.length
		else if (this.isEmpty(selection.focusNode))
			return true
		else
			return selection.focusOffset == 1
	}

	//get if cursor is at start of element
	static getCursorAtStart = () => this.getCursorPosition() == 0

	/********************************/
	/***** ELEMENT EVENT GESTURE ****/
	/********************************/

	static clickManager = (event) => { 
		var target = event.target
		this.focusElement(target)
	}

	static keyManager = (event) => {
		var target = event.target
		switch (event.keyCode) {
			case 13: //take enter and create a new element after the current element
				var content = ""

				if (!this.getCursorAtEnd()){
					content = this.getElementContent(target).substring(this.getCursorPosition())
					this.setElementContent(target,this.getElementContent(target).substring(0, this.getCursorPosition()))
				}

				this.mouseInElement(this.insertElement(target,content))
				event.stopPropagation()
				event.preventDefault()
				break;
			case 8: //backspace
				if (window.getSelection().isCollapsed)
					if (this.isEmpty(target)){ //if is empty
						if (this.previousElement(target) != null){
							this.mouseInElement(this.previousElement(target),true)
							this.deleteElement(target)
							event.preventDefault()
						}
					} else if (this.getCursorAtStart()){
						if (this.isEmpty(this.previousElement(target))){
							this.deleteElement(this.previousElement(target))
						} else {
							var ofset = this.getElementContent(this.previousElement(target)).length
							this.addElementContent(this.previousElement(target),this.getElementContent(target))
							this.mouseInElement(this.previousElement(target),ofset)
							this.deleteElement(target)
						}
						event.preventDefault()
					}
				break;
			case 46: //supr key
				if (window.getSelection().isCollapsed)
					if (this.getCursorAtEnd() && this.nextElement(target)){
						var ofset = this.getElementContent(target).length
						this.addElementContent(target,this.getElementContent(this.nextElement(target)))
						this.mouseInElement(target,ofset)
						this.deleteElement(this.nextElement(target))
						event.preventDefault()
					}
			break;
			case 38: //arrow up
			case 37: //arrow left
				if (this.getCursorAtStart())
					this.mouseInPreviousElement(target)
				
				break;
			case 40: //arrow down
			case 39: //arrow right
				if (this.getCursorAtEnd())
					this.mouseInNextElement(target)
				break;

			default:
				console.log(event.keyCode)
				break;
		}
	}



	static allowedCommands = ["bold","italic","underline"]
	static formatManager(command) {
		if (~this.allowedCommands.indexOf(command)){
			document.execCommand(command)
		}
	}
}

window.Tips = class Tips extends Element{
	static allowedCommands = []

	static createElement = () => {
		var element = document.createElement("div")
		element.classList.add("wysiwyg__editor__element")
		element.setAttribute("type", this.name)
		var content = document.createElement("p")
		content.setAttribute("contenteditable", "true")
		content.classList.add("tips-info")

		element.appendChild(content)
		return element
	}

	static availablesTypes = ["info","error","good","warning"]

	static changeType(type){
		if (~this.availablesTypes.indexOf(type)){
			var currentFocus = document.querySelector(".focused")

			var currentFocus = this.getEditableFromElement(currentFocus)
			currentFocus.className = ""
			currentFocus.classList.add("tips-"+type)
		}
	}
}

window.Title = class Title extends Element{
	static allowedCommands = []


	static createElement = () => {
		var element = document.createElement("div")
		element.classList.add("wysiwyg__editor__element")
		element.setAttribute("type", this.name)
		var content = document.createElement("h2")
		content.setAttribute("contenteditable", "true")
		content.classList.add("tips-info")

		element.appendChild(content)
		return element
	}
}


/********************************/
/********* EDITORS INIT *********/
/********************************/
var editorId = 0


document.querySelectorAll(".wysiwyg").forEach((editor) => {
	//set id for undo/redo stack
	editor.setAttribute("id", "editor-"+editorId)

	var formatToolBar = new FormatToolBar(editorId,0,["Element"],"/images/icons",formatCurrentElement, ["bold","italic","underline"])
	var editorIdcp = Number(editorId)

	editor.querySelector(".wysiwyg__editor").addEventListener("click", (event)=>{

		getToolBarsByEditorId(editorIdcp).forEach((bar)=>{
			bar.update()
		})
	})

	//add event listener to all elements in editor
	editor.querySelectorAll(".wysiwyg__editor__element").forEach((element)=>{
		element.addEventListener("click",Element.clickManager)
		element.addEventListener("keydown",Element.keyManager)
	})

	editorId += 1
})