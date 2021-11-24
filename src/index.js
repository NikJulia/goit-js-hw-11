import './css/common';
import ImagesApiService from './js/api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/get-refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'notiflix/dist/notiflix-3.2.2.min';

const refs = getRefs();
const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {  
    event.preventDefault();

    imagesApiService.query = event.currentTarget.elements.searchQuery.value.trim();

    if (!imagesApiService.query) {
        refs.cardsContainer.innerHTML = '';
        // refs.loadMoreBtn.classList.remove('is-visible');
        onFetchError();
        return;
    } 

    imagesApiService.resetPage();
    refs.cardsContainer.innerHTML = '';

    try {
        const images = await imagesApiService.fetchImages();
        renderImages(images);
        refs.loadMoreBtn.classList.add("is-visible");

        // if (page >= totalPages) {
        //     refs.loadMoreBtn.classList.remove("is-visible");
        // }

        onFetchSuccess(images.totalHits);
        
    } catch (error) {
        onFetchError();
    }

    // await imagesApiService.fetchImages().then(renderImages).catch(onFetchError);
}

async function onLoadMore() {
    await imagesApiService.fetchImages().then(renderImages).catch(onFetchError);
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
    renderSimpleLightbox();
}

function renderSimpleLightbox() {
    let galleryCarousel = new SimpleLightbox('.gallery a');
    galleryCarousel.on('show.simplelightbox');
}

function onFetchSuccess(total) {
    Notify.success(`Hooray! We found ${total} images.`);
}

function onFetchError(error) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}