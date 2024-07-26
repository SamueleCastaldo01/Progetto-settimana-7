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
          <div class="col-lg-3 col-md-6 col-sm-12 mt-4">
              <div class="card">
                <a href="./details.html?productId=${product._id}">
                      <img
                      src="${product.imageUrl || 'https://uninuoro.it/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg'}"
                      class="card-img-top img-fluid img-card"
                      alt="event pic"
                  />
                </a>
                  <div class="card-body text-start">
                      <h5 class="card-title fw-bold">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <p class="card-text"><b>Brand: ${product.brand}</b></p>
                      <p class="card-text">Prezzo: $${product.price}</p>
                      <a href="./details.html?productId=${product._id}" class="btn btn-primary w-100">Vai ai dettagli</a>
                      <a href="./back-office.html?productId=${product._id}" class="btn btn-warning w-100 mt-2">Modifica Prodotto</a>
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
