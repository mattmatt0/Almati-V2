/********************************/
/******* UTILITY FUNCTIONS ******/
/********************************/

window.focusEditor = (element) => {
	var type = element.getAttribute("type")

	if (window[type]){
		document.querySelectorAll(".currentEditor").forEach((editor)=>{
			editor.classList.remove("currentEditor")
		})

		target = window[type].getEditorFromElement(element)

		target.classList.add("currentEditor")
	} else {
		throw "Element is not suported"
	}
}

window.getCurrentEditor = () => document.querySelector(".currentEditor")

window.getCurrentEditorId = () => {
	var editor = getCurrentEditor()
	if (editor)
		return editor.parentElement.getAttribute("id").split("-")[1]

	return null
}


window.getCurrentElement = (editorId=-1) => {
	if (editorId == -1)
		var editor = getCurrentEditor()
	else
		var editor = document.getElementById(`editor-${editorId}`)

	if (!editor)
		return null

	var target = editor.querySelector(".focused")

	if (!target)
		return null

	return target
}

window.getCurrentElementType = (editorId=-1) => {
	if (editorId == -1)
		editorId = getCurrentEditorId()


	var element = getCurrentElement(editorId)

	if (!element)
		return null

	var elementType = element.getAttribute("type")

	if (window[elementType]){
		return elementType
	} else {
		throw "Current element is not suported"
	}
}

window.formatCurrentElement = (editorId,command) => {
	var focusedElementType = getCurrentElementType(editorId)
	console.log(focusedElementType)
	if (focusedElementType)
		window[focusedElementType].formatManager(command)
}

window.toolBar = {}
window.toolBarContener = document.createElement("nav")
toolBarContener.classList.add("wysiwyg__toolBar")


window.getToolBarById = (barId) => {
	for (var i in toolBar)
		if (toolBar[i].barId == barId) return toolBar[i]
}

window.getToolBarByButtonId = (buttonId) => {
	var parseid = ToolBar.buttonIdRegex.exec(buttonId)
	if (parseid){
		return getToolBarById(parseid[2])
	} else {
		throw "Bad button id"
	}
}


/********************************/
/******* TOOLS BAR CLASS ********/
/********************************/
class ToolBar {
	static buttonIdRegex = /button-([a-zA-Z_0-9\-]+)-([0-9]+)/

	/**
	 * Constructor for toolBar
	 *
	 * @author robotechnic
	 *
	 * @param  {int}       barId      id of the bar
	 * @param  {Array}     forElement list of all element allowed for the bar ["all"] to include all elements
	 * @param  {Boolean}   hide       if is true, on element not suported, this tool bar disapear else, toolbar only disabled
	 * @param  {Array}     buttonList list of json buttons to create new buttons
	 *
	 */
	constructor(barId,forElement,hide=false,buttonList=[]){

		if (toolBarContener.querySelector("#tooBar-"+barId)){
			throw "Duplicate tool bar"
		}
		

		this.editorId = editorId
		this.barId = barId
		this.forElement = forElement

		this.group = document.createElement("div")
		this.group.classList.add("wysiwyg__toolBar__group")
		this.group.setAttribute("id", "toolBar-"+barId)

		this.hide = hide

		toolBarContener.appendChild(this.group)

		buttonList.forEach((button)=>{
			this.addButton(button.name,button.image,button.action)
		})
	}

	/**
	 * add buttons to tool bar based on a json list
	 *
	 * @author robotechnic
	 *
	 * @param  {Array} buttonList list of json buttons
	 */
	addButtons(buttonList){
		buttonList.forEach((button)=>{
			this.addButton(button.name,button.image,button.action)
		})
	}

	/**
	 * Add buttons with parameters
	 *
	 * @author robotechnic
	 *
	 * @param  {string}   name   name of the button
	 * @param  {string}   image  url of button image
	 * @param  {function} action callback on click
	 */
	addButton(name,image,action){
		var button = document.createElement("button")
		button.setAttribute("id", `button-${name}-${this.barId}`)
		button.setAttribute("name", name)
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
				barId:buttonData[2]
			})
		})

		this.group.appendChild(button)
	}

	/**
	 * update tool bar based on supported elements
	 *
	 * @author robotechnic
	 */
	update(){
		if (this.forElement[0] != "all"){
			var currentElementType = getCurrentElementType()
			if (this.forElement.indexOf(currentElementType)>-1){
				if (this.hidde)
					this.show()
				else
					this.enable()
			} else {
				if (this.hidde)
					this.hide()
				else
					this.disable()
			}
		}
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
		this.group.querySelectorAll(".wysiwyg__toolBar__group__button").forEach((button)=>{
			button.disabled = true
		})
	}

	enable(){
		this.group.classList.remove("disabled")
		this.group.querySelectorAll(".wysiwyg__toolBar__group__button").forEach((button)=>{
			button.disabled = false
		})
	}
}

class FormatToolBar extends ToolBar {
	constructor(barId,forElement,imageBase,formatMethod,formats){
		var buttons = []
		formats.forEach((format)=>{
			buttons.push({
				name:format,
				image:imageBase+"/"+format+".png",
				action:(buttonData)=>{
					formatMethod(getCurrentEditorId(),format)
				}
			})
		})

		super(barId,forElement,false,buttons)
		this.formats = formats
	}

	update(){
		super.update()
		this.formats.forEach((format)=>{
			var button = document.getElementById(`button-${format}-${this.barId}`)
			if (document.queryCommandState(format)){
				button.classList.add("active")
			} else {
				button.classList.remove("active")
			}
		})
	}
}
/********************************/
/******* TOOL BAR CREATION ******/
/********************************/


toolBar["changeFormat"] = new FormatToolBar(0,["Element"],"/images/icons",formatCurrentElement, ["bold","italic","underline"])
toolBar["reset"] = new ToolBar(1,["Element"],false,[
	{
		name:"reset",
		image:"/images/icons/reset.png",
		action:()=>{
			var element = getCurrentElement()
			console.log("Reset element",element)
			
			if (element){

				Element.resetElement(element)
			}
		}
	}
])
toolBar["changeType"] = new ToolBar(2,["Element"],false)


/********************************/
/******* ELEMENT MANAGMENT ******/
/********************************/
// To create new elements, just add it to "this" or to "window"


/********************************/
/****** BASE ELEMENT CLASS ******/
/********************************/
window.Element = class Element {

	static contentNodeName = "p"

	static createElement = () => {
		var element = document.createElement("div")
		element.classList.add("wysiwyg__editor__element")
		element.setAttribute("type", this.name)
		var content = document.createElement(this.contentNodeName)
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

	static getEditableFromTextNode = (textNode) => {
		if (textNode.nodeType == Node.TEXT_NODE){
			var element = textNode.parentElement
			while (element.getAttribute("contentEditable") != "true")
				element = element.parentElement

			return element
		} else {
			return this.getEditableFromElement(textNode)
		}
	}

	static getElementFromEditable = (element) => {

		var max = 5, i = 0
		if (element.nodeType == Node.TEXT_NODE)
			element = element.parentNode

		while (!element.classList.contains("wysiwyg__editor__element") && i<max){
			element = element.parentNode
			i += 1
		}

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
	static setElementContent = (element,text) => this.getEditableFromElement(element).innerHTML = this.checkFormat(text,element.getAttribute("type"))
	static addElementContent = (element,text) => this.getEditableFromElement(element).innerHTML += this.checkFormat(text,element.getAttribute("type"))
	static getElementContent = (element) => this.getEditableFromElement(element).innerHTML


	//manipulate element
	static deleteElement = (element) => this.getEditorFromElement(element).removeChild(this.getElementFromEditable(element))
	static insertElement = (element,type,content,afterElement = true) => {
		if (window[type]){
			var newElement = window[type].createElement()
			newElement.addEventListener("click",window[type].clickManager)
			newElement.addEventListener("keydown",window[type].keyManager)

			window[type].setElementContent(newElement,content)

			if (afterElement)
				window[type].getElementFromEditable(element).insertAdjacentElement("afterend", newElement)
			else
				element.appendChild(newElement)

			return newElement
		} else {
			throw "Element not suported"
		}
	}

	static focusElement = (element) => {
		var editor = this.getEditorFromElement(element)
		element = this.getElementFromEditable(element)

		editor.querySelectorAll(".selected,.focused").forEach((focusedElement)=>{
			if (focusedElement != element){
				var type = focusedElement.getAttribute("type")
				if (window[type])
					window[type].unfocusElement(focusedElement)
				else
					throw "Element not suported"
			}
		})

		element.classList.add("focused")
		focusEditor(element)
	}

	static unfocusElement = (element) => {
		this.getElementFromEditable(element).classList.remove("selected")
		this.getElementFromEditable(element).classList.remove("focused")
	}
	
	static splitElement = (element,splitNode,ofset) => {
		var result = document.createTextNode("")
		result.textContent = splitNode.textContent.substring(ofset)
		splitNode.textContent = splitNode.textContent.substring(0,ofset)

		while (splitNode != element){
			var temp = splitNode.parentElement.cloneNode(false)
			temp.appendChild(result)
			result = temp
			while (splitNode.nextSibling)
				result.appendChild(splitNode.nextSibling)
			splitNode = splitNode.parentNode
		}

		return result
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
				[ofset, result] = this.createRangeWithMultipleChild(lookElement,ofset)
				if (result != null)
					return [ofset, result]
			}
		}
		return [ofset, null]
	}

	static mouseInElement = (element,end=false) => { //insert mouse at start of any element
		var type = element.getAttribute("type")

		if (window[type]){
			element = window[type].getElementFromEditable(element)

			window[type].focusElement(element)

			element = window[type].getEditableFromElement(element)
			var range = document.createRange()
			
			var pos = 0


			if (end == true && !window[type].isEmpty(element)) //check if not empty because if element is empty pos = 1 cause error
				pos = element.childNodes.length

			if (typeof end == "number"){ //number pos are only valid if element contain only text
				[pos,element] = window[type].createRangeWithMultipleChild(element,end)
			}


			range.setStart(element, pos)

			//prevent from bugs in certains browser
			range.collapse(true)

			window[type].mousePositionFromRange(range)
		} else {
			throw "Element is not suported"
		}
	}

	static mousePositionFromRange = (range) => {
		var selection = window.getSelection()
		selection.removeAllRanges()
		selection.addRange(range)
	}

	static getRange = () => {
		var selection = window.getSelection()
		if (selection.rangeCount > 0)
			return selection.getRangeAt(0)
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

	static getCursorAtEnd = () => { //get if cursor is at end of element
		var selection = window.getSelection()
		
		if (selection.anchorNode.nodeName == this.contentNodeName.toUpperCase()){
			return selection.anchorOffset == 1
		}

		var childs = this.getEditableFromTextNode(selection.anchorNode).childNodes
		var last = childs[childs.length - 1]



		if (last.nodeName == "BR")
			return true

		while (last.nodeType != Node.TEXT_NODE)
			last = last.childNodes[0]

		return (
			last == selection.anchorNode && 
			selection.anchorOffset == selection.anchorNode.length
		)
	}

	//get if cursor is at start of element
	static getCursorAtStart = () => {
		var selection = window.getSelection()

		if (selection.anchorNode.nodeName == this.contentNodeName.toUpperCase()){
			return selection.anchorOffset == 0
		}

		var first = this.getEditableFromTextNode(selection.anchorNode).childNodes[0]

		if (first.nodeName == "BR")
			return true

		while (first.nodeType != Node.TEXT_NODE)
			first = first.childNodes[0]

		return (
			first == selection.anchorNode && 
			selection.anchorOffset == 0
		)
	}

	/********************************/
	/***** ELEMENT EVENT GESTURE ****/
	/********************************/

	static clickManager = (event) => { 
		var target = event.target
		var type = this.getElementFromEditable(target).getAttribute("type")
		if (window[type]){
			window[type].focusElement(target)
		} else {
			throw "Element is not suported"
		}

	}

	static keyManager = (event) => {
		var target = event.target
		switch (event.keyCode) {
			case 13: //take enter and create a new element after the current element
				event.stopPropagation()
				event.preventDefault()
				var currentRange = this.getRange()
				var content = ""

				if (!this.getCursorAtEnd() && !this.isEmpty(target)){
					content = this.splitElement(this.getEditableFromTextNode(currentRange.commonAncestorContainer),
												currentRange.commonAncestorContainer,
												currentRange.startOffset).innerHTML
				}


				var newElement = this.insertElement(this.getElementFromEditable(target),"Element",content)

				this.mouseInElement(newElement)
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
		}
	}


	static resetElement = (element) => {
		var mousePos = this.getRange()
		element = this.getElementFromEditable(element)

		var newElement = this.createElement("")
		newElement.addEventListener("click", this.clickManager)
		newElement.addEventListener("keydown", this.keyManager)

		var type = element.getAttribute("type")

		if (window[type]){
			this.setElementContent(newElement,window[element.getAttribute("type")].getElementContent(element))
			element.parentNode.replaceChild(newElement, element)

			return newElement
		} else {
			throw "Element is not suported"
		}
	}


	static allowedCommands = ["bold","italic","underline"]
	static formatManager(command) {
		if (~this.allowedCommands.indexOf(command)){
			document.execCommand(command)
		}
	}


	static checkFormat = (element,type="Element") => {
		if (!window[type])
			throw "Element is not suported"

		if (element.nodeType){
			var type = element.getAttribute("type")
			if (window[type])
				var text = window[type].getElementContent(element)
		} else {
			var text = element
		}

		if (window[type].allowedCommands.indexOf("bold") == -1){
			text = text.replace(/<\/?(b|strong)>/g,"")
		}

		if (window[type].allowedCommands.indexOf("italic") == -1){
			text = text.replace(/<\/?(i|em)>/g,"")
		}

		if (window[type].allowedCommands.indexOf("underline") == -1){
			text = text.replace(/\/?<(u)>/g,"")
		}

		if (element.nodeType){
			element.innerHTML = text
		}

		return text
	}
}

window.Tips = class Tips extends Element{
	static allowedCommands = []

	static types = Object.freeze({
		INFO:"info",
		ERROR:"error",
		GOOD:"good",
		WARNING:"warning"
	})

	static createElement = () => {
		var element = document.createElement("div")
		element.classList.add("wysiwyg__editor__element")
		element.setAttribute("type", this.name)
		var content = document.createElement(this.contentNodeName)
		content.setAttribute("contenteditable", "true")
		content.classList.add("tips-info")

		element.appendChild(content)
		return element
	}

	static availablesTypes = ["info","error","good","warning"]

	static changeType(element,type){
		if (~this.availablesTypes.indexOf(type)){
			var mousePos = this.getRange()

			var element = super.resetElement(element)
			element = this.getElementFromEditable(element)
			this.getEditableFromElement(element).classList.add(`tips-${type}`)
			element.setAttribute("type", this.name)

			return element
		}
	}
}

toolBar["changeType"].addButtons([
	{
		name:"goodTips",
		image:"/images/icons/good.png",
		action:()=>{
			var element = getCurrentElement()
			
			if (element){
				Tips.changeType(element,"good")
			}
		}
	},
	{
		name:"errorTips",
		image:"/images/icons/error.png",
		action:()=>{
			var element = getCurrentElement()
			
			if (element){
				Tips.changeType(element,"error")
			}
		}
	},
	{
		name:"warningTips",
		image:"/images/icons/warning.png",
		action:()=>{
			var element = getCurrentElement()
			
			if (element){
				Tips.changeType(element,"warning")
			}
		}
	},
	{
		name:"infoTips",
		image:"/images/icons/info.png",
		action:()=>{
			var element = getCurrentElement()
			
			if (element){
				Tips.changeType(element,"info")
			}
		}
	}
])

toolBar["changeType"].forElement.push("Tips")
toolBar["reset"].forElement.push("Tips")

window.Title = class Title extends Element{
	static allowedCommands = []
	static contentNodeName = "h2"

	static changeType(element){
		var mousePos = this.getRange()

		element = this.getElementFromEditable(element)

		var h2 = document.createElement("h2")
		h2.setAttribute("contenteditable", "true")
		h2.innerHTML = window[element.getAttribute("type")].getElementContent(element)
		element.setAttribute("type", this.name)
		element.replaceChild(h2, this.getEditableFromElement(element))
	}
}

toolBar["changeType"].addButtons([
	{
		name:"title",
		image:"/images/icons/title.png",
		action:()=>{
			var element = getCurrentElement()
			
			if (element){
				Title.changeType(element)
			}
		}
	}
])

toolBar["changeType"].forElement.push("Title")
toolBar["reset"].forElement.push("Title")

var codeSelect = document.createElement("select")
codeSelect.classList.add("wysiwyg__editor__codeSelect")
for (var l in Prism.languages) {
	var option = document.createElement("option")
	option.textContent = l
	option.setAttribute("value", l)
	codeSelect.appendChild(option)
}


toolBar["insertElement"] = new ToolBar(3,["all"])
window.Code = class Code extends Element {
	static contentNodeName = "pre"

	static getEditableFromElement(element){
		if (element.nodeName == "TEXTAREA" || element.nodeName == "CODE")
			return element
		else if (element.nodeName == "SELECT")
			return element.nextElementSibling
		else if (element.nodeName == "OPTION")
			return element.parentElement.nextElementSibling
		else
			return element.querySelector("code,textarea")
	}

	static setElementContent = (element,text) => {
		this.getEditableFromElement(element).textContent = this.checkFormat(text,element.getAttribute("type"))
		Prism.highlightElement(this.getEditableFromElement(element))
	}
	static addElementContent = (element,text) => {
		super.addElementContent(element,text)
		Prism.highlightElement(this.getEditableFromElement(element))
	}
	static getElementContent = (element) => {
		element = this.getEditableFromElement(element)

		if (element.nodeName == "TEXTAREA")
			return element.value
		else
			return element.textContent
	}

	static createElement(){
		var element = document.createElement("div")
		element.classList.add("wysiwyg__editor__element")
		element.setAttribute("type", this.name)
		var content = document.createElement(this.contentNodeName)
		var code = document.createElement("code")
		code.classList.add("language-plaintext")
		content.appendChild(code)
		element.appendChild(content)

		return element
	}


	static getCodeAreaFromElement(element){
		element = this.getElementFromEditable(element)
		return element.querySelector(".code-toolbar")
	}

	static getElementLanguage = (element) => this.getElementFromEditable(element).querySelector("pre[class*='language-']").className.split("-")[1]

	static focusElement(element){
		super.focusElement(element)
		element = this.getEditableFromElement(element)
		if (element.nodeName != "TEXTAREA"){
			var textarea = document.createElement("textarea")
			textarea.classList.add("wysiwyg__editor__code")
			textarea.textContent = this.getElementContent(element)
			textarea.addEventListener("keypress",this.setTextAreaHeight)
			textarea.addEventListener("click",this.setTextAreaHeight)

			element = this.getElementFromEditable(element)


			codeSelect.value = this.getElementLanguage(element)
			element.insertAdjacentElement("afterbegin",codeSelect)

			this.getElementFromEditable(element).replaceChild(textarea, this.getCodeAreaFromElement(element))
			

			textarea.style.height = `${textarea.scrollHeight}px`

			textarea.focus()
		} else {
			element.style.height = `${element.scrollHeight}px`
		}
	}

	static setTextAreaHeight(event){
		event.target.style.height = `${event.target.scrollHeight}px`
	}

	static unfocusElement(element){
		super.unfocusElement(element)
		this.getElementFromEditable(element).removeChild(codeSelect)
		var content = document.createElement(this.contentNodeName)
		var code = document.createElement("code")
		code.classList.add(`language-${codeSelect.value}`)

		code.textContent = this.getElementContent(element)

		content.appendChild(code)	
		element.replaceChild(content, this.getEditableFromElement(element))

		Prism.highlightElement(code)
	}

	static insertElement(element,content=" ",after=true){
		element = super.insertElement(element,"Code",content)
		if (after && !element.nextElementSibling){
			super.insertElement(element,"Element"," ")
		}
	}

	static getCursorAtStart(){
		var selection = window.getSelection()
		return selection.anchorNode.selectionStart == 0
	}

	static getCursorAtEnd(){
		var selection = window.getSelection()
		return selection.anchorNode.selectionStart == selection.anchorNode.textContent.length
	}	

	static mouseInElement(element,end=false){
		element = getEditableFromElement(element)
		pos = 0

		if (typeof end == "number")
			pos = end
		else if (end)
			pos = element.textContent.length

		element.selectionEnd = end
	}


	static keyManager = (event) => {
		var target = event.target
		switch (event.keyCode) {
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
		}
	}
}

toolBar["changeType"].forElement.push("Code")
toolBar["reset"].forElement.push("Code")

toolBar["insertElement"].addButton("insertCode","/images/icons/code.png",(button)=>{
	var currentElement = getCurrentElement()
	if (currentElement){
		Code.insertElement(currentElement,"")
	}
})


/********************************/
/********* EDITORS INIT *********/
/********************************/
var editorId = 0


document.querySelectorAll(".wysiwyg").forEach((editor) => {
	//set id for undo/redo stack and for mutiple editors
	editor.setAttribute("id", "editor-"+editorId)

	if (editorId == 0){
		editor.insertAdjacentElement("afterBegin",toolBarContener)
	}

	var contener = document.createElement("div")
	contener.classList.add("wysiwyg__editor")
	editor.appendChild(contener)

	Element.insertElement(contener,"Element","",false)

	editor.addEventListener("click",()=>{
		for (var bar in toolBar){
			toolBar[bar].update()
		}
	})

	editor.addEventListener("keydown",()=>{
		for (var bar in toolBar){
			toolBar[bar].update()
		}
	})


	var editorIdcp = Number(editorId)

	//add event listener to all elements in editor
	editor.querySelectorAll(".wysiwyg__editor__element").forEach((element)=>{
		var type = element.getAttribute("type")
		if (window[type]){
			element.addEventListener("click",window[type].clickManager)
			element.addEventListener("keydown",window[type].keyManager)
		}
	})

	editorId += 1
})