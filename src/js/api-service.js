export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImages() {
      const API_KEY = '18718105-08a50232bddfbe92cd3f58c89';
      const BASE_URL = 'https://pixabay.com/api/';

      return await fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`).then(response => {
      if (!response.ok) {
          return Promise.reject(error);
      }
      return response.json();
      }).then(data => {
          if (data.total === 0 && data.totalHits === 0) {
            return;
          }
          this.incrementPage();
          return data.hits;
      });
  }

  incrementPage() {
      this.page += 1;
  }

  resetPage() {
      this.page = 1;
  }

  get query() {
      return this.searchQuery;
  }

  set query(newQuery) {
      this.searchQuery = newQuery;
  }
}