import getRefs from './get-refs';
import ApiService from './components/api-service';
import imgCardTpl from './templates/img-card.hbs';
import LoadMoreBtn from './components/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const newApiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });
const refs = getRefs();

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchData);

function onSearch(e) {
  e.preventDefault();

  newApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newApiService.query === '') {
    return Notify.failure('Field cannot be empty');
  }

  loadMoreBtn.show();
  newApiService.resetPage();
  clearGalleryContainer();
  fetchData();
}

async function fetchData() {
  loadMoreBtn.hide();
  try {
    const data = await newApiService.fetchData();
    // console.log(data);
    renderGallery(data);
  } catch (error) {
    console.log(error);
  }
}

// function fetchData() {
//   loadMoreBtn.hide();
//   newApiService
//     .fetchData()
//     .then(renderGallery)
//     .catch(error => {
//       console.log(error);
//     });
// }

function renderGallery(hits) {
  const page = newApiService.page;
  const totalPage = newApiService.totalPage;
  const totalHits = newApiService.totalHits;

  if (totalHits === 0) {
    loadMoreBtn.hide();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (page === 2) {
    appendGalleryMarkup(hits);
    lightbox.refresh();
    loadMoreBtn.show();
    Notify.info(`Hooray! We found ${totalHits} images.`);
  } else if (page - 1 === totalPage) {
    loadMoreBtn.hide();
    appendGalleryMarkup(hits);
    lightbox.refresh();
    scrolPage();
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    appendGalleryMarkup(hits);
    lightbox.refresh();
    scrolPage();
    loadMoreBtn.show();
  }
}

function appendGalleryMarkup(imgCard) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imgCardTpl(imgCard));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function scrolPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
