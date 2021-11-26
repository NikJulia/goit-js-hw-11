import getRefs from './js/get-refs';
import ImagesApiService from './js/api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

// import CSS
import './css/common';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'notiflix/dist/notiflix-3.2.2.min';

const refs = getRefs();
const imagesApiService = new ImagesApiService();
let galleryCarousel = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
hideLoadMoreBtn();

async function onSearch(event) {  
    event.preventDefault();

    imagesApiService.query = event.currentTarget.elements.searchQuery.value.trim();
    console.log(imagesApiService.query);

    if (!imagesApiService.query) {
        clearCardsContainer();
        onFetchError();
        return;
    } 

    imagesApiService.resetPage();
    clearCardsContainer();

    try {
        const images = await imagesApiService.fetchImages();
        renderImages(images);
        scrollToBottom();
        showLoadMoreBtn();
        refreshGallery();
        onFetchSuccess(images.totalHits);
    } catch (error) {
        onFetchError();
    }
}

async function onLoadMore() {
        const images = await imagesApiService.fetchImages();
        renderImages(images);
        scrollToBottom();
        showLoadMoreBtn();
        refreshGallery();
        
        const currentPage = imagesApiService.page - 1;
        const itemsPerPage = imagesApiService.per_page;
        const totalPages = Math.ceil(images.totalHits / itemsPerPage);

        if (currentPage >= totalPages) {
            hideLoadMoreBtn();
            onReachLastPage();
        } 
}

function renderImages(images) {

    const obj = [...images.hits];
    console.log(obj);

    const markup = obj.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
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
}

function clearCardsContainer() {
    refs.cardsContainer.innerHTML = '';
}

function refreshGallery() {
    galleryCarousel.refresh();
}

function hideLoadMoreBtn() {
    refs.loadMoreBtn.classList.add('is-hidden');
}

function showLoadMoreBtn() {
    refs.loadMoreBtn.classList.remove('is-hidden');
}

function scrollToBottom() {
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 10,
    behavior: 'smooth',
    });
}

// Notifications
function onFetchSuccess(total) {
    Notify.success(`Hooray! We found ${total} images.`);
}

function onFetchError(error) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function onReachLastPage() {
    Notify.info("We're sorry, but you've reached the end of search results.");
}