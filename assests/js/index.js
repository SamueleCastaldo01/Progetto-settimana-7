// in questa pagina io devo RECUPERARE con una fetch() i miei eventi a DB
// e li devo mostrare nella pagina
// per farlo, creerò per ogni evento esistente una colonna che appenderò
// allo "scheletro" imbastito nel file html
const URL = 'https://striveschool-api.herokuapp.com/api/product/';
const Auth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzNGUyZmYyNjBjYzAwMTVjYzBkYzkiLCJpYXQiOjE3MjE5Nzg0MTUsImV4cCI6MTcyMzE4ODAxNX0.1SOaS3sB4odDWGMlL8dDJwKMg-qCXYQEJhu4K_BsqYY";

const getEvents = function () {
  // Fetch con headers per l'autenticazione
  fetch(URL, {
    method: 'GET',
    headers: {
      'Authorization': Auth,
      'Content-Type': 'application/json' 
    }
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Errore nella chiamata ok');
      }
    })
    .then((arrayOfEvents) => {
      // Andiamo a creare le colonne con le card
      arrayOfEvents.forEach((product) => {
        const newEventCol = `
          <div class="col">
              <div class="card">
                  <img
                      src="${product.imageUrl || 'https://uninuoro.it/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg'}"
                      class="card-img-top"
                      alt="event pic"
                  />
                  <div class="card-body text-center">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <p class="card-text">${product.brand}</p>
                      <p class="card-text">$${product.price}</p>
                      <a href="./details.html?productId=${product._id}" class="btn btn-primary w-100">Vai ai dettagli</a>
                  </div>
              </div>
          </div>
        `;

        // Selezioniamo la row e appendiamo la nuova colonna
        const eventsRow = document.getElementById('events-row');
        eventsRow.innerHTML += newEventCol;
      });
    })
    .catch((error) => {
      // Gestione degli errori
      console.log('ERRORE!', error);
    });
}

getEvents();
