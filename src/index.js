import ImagesApiService from './js/api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/get-refs';
import SimpleLightbox from 'simplelightbox';
import './css/common';
import 'simplelightbox/dist/simple-lightbox.min';
import 'notiflix/dist/notiflix-3.2.2.min';

const refs = getRefs();
const imagesApiService = new ImagesApiService();
refs.loadMoreBtn.disabled = true;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {  
    event.preventDefault();

    imagesApiService.query = event.currentTarget.elements.searchQuery.value.trim();

    if (!imagesApiService.query) {
        refs.cardsContainer.innerHTML = '';
        return;
    } 

    imagesApiService.resetPage();
    refs.cardsContainer.innerHTML = '';
    await imagesApiService.fetchImages().then(renderImages).catch(onFetchError);
    refs.loadMoreBtn.disabled = false;
}

async function onLoadMore() {
    await imagesApiService.fetchImages().then(renderImages).catch(onFetchError);
    refs.loadMoreBtn.disabled = false;
}

function renderImages(images) {

    const markup = images.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
    `<a href="${largeImageURL}">
        <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                        <span>${likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                        <span>${views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                        <span>${comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                        <span>${downloads}</span>
                </p>
            </div>
        </div>
    </a>`
    ).join(''); 
    refs.cardsContainer.insertAdjacentHTML('beforeend', markup);
    renderSimpleLightbox();
}

function renderSimpleLightbox() {
    let galleryCarousel = new SimpleLightbox('.gallery a');
    galleryCarousel.on('show.simplelightbox');
}

function onFetchError(error) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}