import StoryPresenter from "../../presenters/storyPresenter.js";

export default class StoryPage {
  constructor() {
    this.presenter = new StoryPresenter(this);
  }

  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Daftar Story</h1>
          <form id="story-form">
              <input type="text" id="story-input" placeholder="Write your story..." required />
              <button type="submit">Save</button>
          </form>
          <section id="story-list" aria-live="polite"></section>
      </main>
    `;
  }

  async afterRender() {
    this.setupEventListeners();
    this.presenter.loadStories();
  }

  setupEventListeners() {
    document.getElementById("story-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const storyInput = document.getElementById("story-input");
      const storyContent = storyInput.value.trim();
      if (storyContent) {
        this.presenter.addStory(storyContent);
        storyInput.value = "";
      }
    });
  }

  displayStories(stories) {
    const listContainer = document.getElementById("story-list");
    listContainer.innerHTML = "";
    stories.forEach((story) => {
      const item = document.createElement("div");
      item.className = "story-item";
      item.innerHTML = `
        <p style="margin-bottom: 10px;">${story.content}</p>
        <button class="delete-btn" data-id="${story.id}">Delete</button>
      `;
      listContainer.appendChild(item);
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", (event) => {
        const id = parseInt(event.target.dataset.id, 10);
        this.presenter.deleteStory(id);
      });
    });
  }
}