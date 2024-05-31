class TodoItem extends HTMLElement {
	constructor() {
		super();
		// we need to set the mode as 'open' or 'closed'.
		// open allows for future modification using the 'this' keyword whilst 'closed' doesn't
		const shadowDom = this.attachShadow({ mode: "open" });
		shadowDom.innerHTML = `<style>li { color: red; }</style><li><slot>${this.innerText}</slot></li>`;
	}
}

customElements.define("todo-item", TodoItem);
