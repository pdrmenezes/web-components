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
<div style="display: flex; gap: 1rem; align-items: center; padding-inline: 1.3rem; padding-block: 1.2rem; border: 1px solid #eeeeee; border-radius: 1rem; background-color: #f5f5f5; font-family: monospace; box-shadow: 2px 3px 8px rgba(230,230,230,15%);">
    <div id="profile-image-container">
        <img style="border-radius: 0.8rem;" alt="user profile image" id="user-image" />
    </div>
    <div style="flex-grow: 1; color: #222">
        <h3 id="user-name"></h3>
        <p id="user-job-title" style="font-style: italic; font-size: 0.7rem;"></p>
    </div>
    <button title="Go to Github" style="border:none; background-color: transparent; font-size: 1rem; transition: all; transition-duration: 80ms; padding-inline: 0.6rem; padding-block: 0.4rem;"><a id="github-button" nooppener noreferrer target="_blank"><slot name="button-icon"></slot></a></button>
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
