const axios = require('axios').default;

const API_KEY = '18718105-08a50232bddfbe92cd3f58c89';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchImages() {
      return await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`)
      .then(response => {
      if (response.status !== 200) {
          return Promise.reject(error);
      }
      return response;
      }).then(response => {
          if (response.data.total === 0 && response.data.totalHits === 0) {
            return;
          }
          this.incrementPage();
          return response.data;
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