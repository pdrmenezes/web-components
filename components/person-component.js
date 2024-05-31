class Person extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		const name = this.getAttribute("name") || "";
		const message = `Hi, I'm ${name}`;

		const content = document.createElement("p");
		content.textContent = message;
		this.shadowRoot.appendChild(content);
	}
}

customElements.define("person-component", Person);
