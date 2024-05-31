class TodoCheckbox2 extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });

		const label = this.getAttribute("label") || "";
		const content = `
        <label style="display: block;">${label}</label>
        <input type="checkbox"/>
        <slot>${this.innerText}</slot>`;

		const element = document.createElement("span");
		element.innerHTML = content;
		this.shadowRoot.appendChild(element);

		this.checkbox = this.shadowRoot.querySelector("input");
	}

	static get observedAttributes() {
		return ["checked"];
	}

	attributeChangedCallback(attributeName, oldValue, newValue) {
		// console.log({ attributeName, oldValue, newValue });
		if (attributeName === "checked") this.updateChecked(newValue);
	}

	updateChecked(value) {
		this.checkbox.checked = (value != null) !== "false";
	}
}

customElements.define("todo-checkbox-2", TodoCheckbox2);
