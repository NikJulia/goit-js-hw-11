export default function getRefs() {
    return {
      searchForm: document.querySelector('form#search-form'),
      submitBtn: document.querySelector('button[type="submit"]'),
      cardsContainer: document.querySelector('.gallery'),
      loadMoreBtn: document.querySelector('.load-more'),
    };
  }