# Web Components

For times you don't need a full fledged framework but want a little more flexibility.

## Walkthrough

1. Create a javascript class extending the HTMLElement and calling super() to inherit the HTMLElement properties and methods

2. Inside its constructor create the element itself

3. Use the `customElements` registry do define a new web component passing it the name of the web component as the first paramenter and the web component itself as the second parameter

> The name of the web component should have at least one hifen (-) to denote clearly that it is a custom component, not a native HTML tag and cannot start with an x (x-button).

```javascript
class FirstComponent extends HTMLElement {
    constructor() {
        super()
        this.innerText = "Custom Web Component"
    }
}

customElements.define("first-component", FirstComponent)
```

4. Its important to know that what is defined in web components spread to the entire HTML. For instance, if we use a style tag to style the `<li>` element on a custom web component, all the `<li>` elements in our html will receive the same style.

e.g.:
```javascript
class TodoItem extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = `<style>li { color: red; }</style><li style="color: red;">${this.innerText}</li>`
    }
}

customElements.define("todo-item", TodoItem)
```

In this case, both `<li>` elements, the custom and the native one will be red

```html
<ul>
    <todo-item>Custom todo item component</todo-item>
    <li>Great li item</li>
</ul>
```

> If we only style the custom element itself than it naturally doesn't spread to the rest of the HTML

```javascript
class TodoItem extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = `<li style="color: red;">${this.innerText}</li>`
    }
}

customElements.define("todo-item", TodoItem)
```

5. To encapsulate our component's logic and avoid conflicts, we can use the Shadow DOM and create our component inside it.

> Now, with the Shadow DOM we need to create a `<slot>` to pass what we want, which a content placeholder. <i>Similar to passing the children props</i>

```javascript
class TodoItem extends HTMLElement {
    constructor() {
        super()
        // we need to set the mode as 'open' or 'closed'.
        // open allows for future modification using the 'this' keyword whilst 'closed' doesn't
        const shadowDom = this.attachShadow({ mode: 'open' })
        shadowDom.innerHTML = `<style>li { color: red; }</style><li><slot>${this.innerText}</slot></li>`
    }
}

customElements.define("todo-item", TodoItem)
```

Not saying you <b>should</b> use a `<style>` tag inside a custom component but you can, and now it shouldn't interfere the rest of the HTML. The component is a closed off environment and "self-contained"

6. We can also write them by templating the component

```javascript
const template = document.createElement('template')
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
`

class TodoItem2 extends HTMLElement {
    constructor() {
        super()
        const shadowDom = this.attachShadow({ mode: 'open' })
        // we'll use the clone method passing true to copy all its descendants to make sure if we reuse the component it will in fact create a new one, not just redeclre it (Attention on step #8 for another possible pitfall while reusing web components)
        shadowDom.append(template.content.clone(true))
    }
}

customElements.define("todo-item-2", TodoItem2)
```

An example getting the equivalent to props using data attributes

```javascript
const checkboxTemplate = document.createElement('template')
const labelTextElement = document.querySelector('todo-checkbox[data-labelText]')
const labelText = labelTextElement.getAttribute('data-labelText')

checkboxTemplate.innerHTML = `
<label style="display: block;">${labelText}</label>
<input type="checkbox"/>
<slot>${this.innerText}</slot>
`

class CheckboxWithLabel extends HTMLElement {
    constructor() {
        super()
        const shadowDom = this.attachShadow({ mode: 'open' })
        shadowDom.append(checkboxTemplate.content)
    }
}

customElements.define("todo-checkbox", CheckboxWithLabel)
```

7. There's another cool way to pass different information to web components, since they allow for more than one `<slot>`. We can also use named slots (and style them).

```javascript
const checkboxTemplate = document.createElement('template')
const labelTextElement = document.querySelector('todo-checkbox[data-labelText]')
const labelText = labelTextElement.getAttribute('data-labelText')

checkboxTemplate.innerHTML = `
<label style="display: block;">${labelText}</label>
<input type="checkbox"/>
<slot>${this.innerText}</slot>
<slot name="helper-text"></slot>
`

class CheckboxWithLabel extends HTMLElement {
    constructor() {
        super()
        const shadowDom = this.attachShadow({ mode: 'open' })
        shadowDom.append(checkboxTemplate.content)
    }
}

customElements.define("todo-checkbox", CheckboxWithLabel)
```

The HTML would look something like:
```html
 <todo-checkbox data-labelText="Personal task">Water the plants
    <slot name="helper-text" style="color:brown; font-size: 0.8rem;" >tomorrow</slot>
</todo-checkbox>
```

We can also create an element-based slot passing to the `slot` attribute the name defined in the web component

```html
<todo-checkbox data-labelText="Personal task">Water the plants
    <small slot="helper-text" style="color:brown; font-size: 0.8rem;">tomorrow</small>
</todo-checkbox>
```

8. But if we want to use multiple of these components we have to keep track of each one and their attributes to not mix them up. <i>Now React unique key attributes start to make sense.</i> In order to reuse it we'll just bake in the attributes self reference logic

```javascript
class Person extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const name = this.getAttribute('name') || ''
        const message = `Hi, I'm ${name}`
        
        const content = document.createElement('p')
        content.textContent = message
        this.shadowRoot.appendChild(content)
    }
}

customElements.define("person-component", Person)
```

Or by using the `connectedCallback` method, which is called when the element is added to the DOM

> There's also the `disconnectedCallback` which, intuitively is called when an element is removed from the DOM


```javascript
class Person extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
        const name = this.getAttribute('name') || ''
        const message = `Hi, I'm ${name}`

        const content = document.createElement('p')
        content.textContent = message
        this.shadowRoot.appendChild(content)
    }
}

customElements.define("person-component", Person)
```


Now the HTML should show two different results for the `name` attribute
```html
<person-component name="Lara"></person-component> 
 <!-- Outputs: Hi, I'm Lara -->
<person-component name="Luiza"></person-component>
<!-- Outputs: Hi, I'm Luiza -->
```

9. We can handle attribute changes with the `attributeChangedCallback` HTMLElement callback, that is called when an attribute is added, removed, updated or replaced.

```javascript
class TodoCheckbox2 extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const label = this.getAttribute('label') || ''
        const content = `
        <label style="display: block;">${label}</label>
        <input type="checkbox"/>
        <slot>${this.innerText}</slot>`

        const element = document.createElement('span')
        element.innerHTML = content
        this.shadowRoot.appendChild(element)
    }

    static get observedAttributes() {
        return ["checked"]
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        console.log({ attributeName, oldValue, newValue });
    }
}

customElements.define("todo-checkbox-2", TodoCheckbox2)
```


10. And we can also extend other HTMLElements

```javascript
class AccordionList extends HTMLUListElement {
	constructor() {
		super();
		this.style.position = "relative";
		this.toggleButton = document.createElement("button");
		this.toggleButton.style.position = "absolute";
		this.toggleButton.style.border = "none";
		this.toggleButton.style.background = "none";
		this.toggleButton.style.padding = 0;
		this.toggleButton.style.top = 0;
		this.toggleButton.style.left = "5px";
		this.toggleButton.style.cursor = "pointer";
		this.toggleButton.textContent = "▶️";
		this.toggleButton.addEventListener("click", () => {
			this.dataset.expanded = !this.isExpanded;
		});
		this.appendChild(this.toggleButton);
	}

	get isExpanded() {
		return this.dataset.expanded !== "false" && this.dataset.expanded != null;
	}

	static get observedAttributes() {
		return ["data-expanded"];
	}

	attributeChangedCallback(attributeName, oldValue, newValue) {
		this.updateStyles();
	}

	connectedCallback() {
		this.updateStyles();
	}

	updateStyles() {
		this.toggleButton.textContent = this.isExpanded ? "🔽" : "▶️";
		for (const element of this.children) {
			if (element !== this.toggleButton) {
				element.style.display = this.isExpanded ? "" : "none";
			}
		}
	}
}

customElements.define("accordion-component", AccordionList, { extends: "ul" });
```

And use them passing their desired, defined behavior

```html
<ul is="accordion-component">
    <li>#1</li>
    <li>#2</li>
    <li>#3</li>
    <li>#4</li>
</ul>
```

11. A different example of a bigger component

```js
const userCardTemplate = document.createElement("template");
userCardTemplate.innerHTML = `
<style>
button:hover {
    transform: scale(1.2);
}
a {
    text-decoration: none;
}
</style>
<div style="display: flex; gap: 1rem; align-items: center; margin-block: 1rem; padding-inline: 1.5rem; padding-block: 1.2rem; border: 1px solid #eeeeee; border-radius: 1rem; background-color: #f5f5f5; font-family: monospace; box-shadow: 5px 4px 10px rgba(0,0,0,20%); max-width: 400px;">
    <div id="profile-image-container">
        <img style="border-radius: 0.8rem;" alt="user profile image" id="user-image" />
    </div>
    <div style="flex-grow: 1">
        <h3 id="user-name"></h3>
        <p id="user-job-title" style="font-style: italic; font-size: 0.7rem;"></p>
    </div>
    <button title="Go to Github" style="border:none; background-color: transparent; font-size: 1rem; transition: all; transition-duration: 80ms; padding-inline: 0.6rem; padding-block: 0.4rem;"><a id="github-button" nooppener noreferrer target="_blank">↗️</a></button>
</div>
`;

class UserCard extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(userCardTemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const name = this.getAttribute('name');
        const jobTitle = this.getAttribute('jobTitle');
        const githubUser = this.getAttribute('githubUser');

        const nameField = this.shadowRoot.getElementById('user-name');
        nameField.textContent = name;
        nameField.title = name
        const jobTitleField = this.shadowRoot.getElementById('user-job-title');
        jobTitleField.textContent = jobTitle
        jobTitleField.title = `Job title: ${jobTitle}`
        const githubProfileImage = this.shadowRoot.getElementById('user-image');
        githubProfileImage.src = `https://github.com/${githubUser}.png?size=100`;
        githubProfileImage.title = `${name}'s profile picture`

        const goToGithubButton = this.shadowRoot.getElementById("github-button")
        goToGithubButton.href = `https://github.com/${githubUser}`
    }
}

customElements.define("user-card", UserCard);
```

And on the HTML

```html
<user-card name="Pedro Menezes" jobTitle="Sr. Water drinker" githubUser="pdrmenezes" style="display:block; max-width: 500px;"></user-card>
<user-card name="Theo" jobTitle="Sr. Shirt wearer" githubUser="t3dotgg" style="display:block; max-width: 500px;"></user-card>
<user-card name="The Primeagen" jobTitle="Sr. Teej friend" githubUser="theprimeagen" style="display:block; max-width: 500px;"></user-card>
```