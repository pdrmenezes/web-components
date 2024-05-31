const template = document.createElement("template");
template.innerHTML = `
<style>
    li {
        color: green;
    }
</style>

<li>
    Brand new
    <slot>${this.innerText}</slot>
</li>
`;

class TodoItem2 extends HTMLElement {
	constructor() {
		super();
		const shadowDom = this.attachShadow({ mode: "open" });
		shadowDom.append(template.content);
	}
}

customElements.define("todo-item-2", TodoItem2);
