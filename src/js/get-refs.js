export default function getRefs() {
    return {
      searchBox: document.querySelector('form#search-form input'),
      submitBtn: document.querySelector('button[type="submit"]'),
      cardsContainer: document.querySelector('.js-cards-container'),
    };
  }