const API_KEY = '18718105-08a50232bddfbe92cd3f58c89';
const BASE_URL = 'https://pixabay.com/api/';
const TYPE = 'image_type=photo';
const ORIENTATION = 'orientation=horizontal';
const SAFE_SEARCH = 'safesearch=true';

function fetchImages(imageName) {

    return fetch(`${BASE_URL}?key=${API_KEY}&q=${imageName}&${TYPE}&${ORIENTATION}&${SAFE_SEARCH}`).then(response => {
      if (!response.ok) {
          return Promise.reject(error);
      }
      return response.json();
      })
  };
  
export default { fetchImages };