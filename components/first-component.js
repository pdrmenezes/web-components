class FirstComponent extends HTMLElement {
	constructor() {
		super();
		this.innerText = "Custom Web Component";
	}
}

customElements.define("first-component", FirstComponent);
