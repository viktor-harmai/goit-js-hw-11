import axios from 'axios';

const API_KEY = '29484479-34e6c0d98a298c71636b4aafe';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalPage = 1;
    this.totalHits = 0;
  }

  async fetchData() {
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    });
    const { hits, totalHits } = data;

    this.totalHits = totalHits;
    this.allPages(totalHits);
    this.incrementPage();
    // console.log(hits);
    return hits;
  }

  allPages(totalHits) {
    this.totalPage = Math.ceil(totalHits / this.per_page);
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
