import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/get-refs';
import API from './js/api-service';
import './css/common';
import 'notiflix/dist/notiflix-3.2.2.min';

const refs = getRefs();

refs.searchBox.addEventListener('input', onSearch);

function onSearch() {  
    const inputData = refs.searchBox.value.trim();

    if (!inputData) {
        refs.cardsContainer.innerHTML = '';
        return;
    } 
    API.fetchImages(inputData).then(renderImages).catch(onFetchError);
}


function renderImages(images) {
    refs.cardsContainer.innerHTML = '';
    refs.cardsContainer.innerHTML = '';
    console.log(images);

    const markup = images.map(({ previewURL }) =>
        `<img src="${previewURL}" width="100"></div>`
    ).join(''); 
    refs.cardsContainer.innerHTML = markup;
}


function onFetchError(error) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}