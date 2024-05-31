const checkboxTemplate = document.createElement("template");
const labelTextElement = document.querySelector(
	"todo-checkbox[data-labelText]",
);
const labelText = labelTextElement.getAttribute("data-labelText");

checkboxTemplate.innerHTML = `
<label style="display: block;">${labelText}</label>
<input type="checkbox"/>
<slot>${this.innerText}</slot>
<slot name="helper-text"></slot>
`;

class TodoCheckbox extends HTMLElement {
	constructor() {
		super();
		const shadowDom = this.attachShadow({ mode: "open" });
		shadowDom.append(checkboxTemplate.content.cloneNode(true));
	}
}

customElements.define("todo-checkbox", TodoCheckbox);
