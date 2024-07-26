// in questa pagina io devo RECUPERARE con una fetch() i miei eventi a DB
// e li devo mostrare nella pagina
// per farlo, creerò per ogni evento esistente una colonna che appenderò
// allo "scheletro" imbastito nel file html
const URL = 'https://striveschool-api.herokuapp.com/api/product/';
const Auth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzNGUyZmYyNjBjYzAwMTVjYzBkYzkiLCJpYXQiOjE3MjE5Nzg0MTUsImV4cCI6MTcyMzE4ODAxNX0.1SOaS3sB4odDWGMlL8dDJwKMg-qCXYQEJhu4K_BsqYY";

const spanSpinner = document.getElementById('spanSpinner');
const eventsRow = document.getElementById('events-row');
const numeroProdottiCarrello = document.getElementById('numeroProdotti')
const modalBody = document.getElementById('modal-body');

let arrayProduct = []  //questo lo uso per andarmi a prendere i  prodotti dal db e metterli nel array per gestirli meglio
let arrayCarrello = []
let nProdottiCarrello = 0
let totaleCarrello = 0



const getEvents = function () {
  //localStorage.removeItem('carrello')
  //localStorage.removeItem('sommaCarrello')
  const savedCarrello = localStorage.getItem('carrello'); //andiamo ad ottenere  il carrello dal localstorage
  if (savedCarrello) {
    arrayCarrello = JSON.parse(savedCarrello);
  }
  const sommaCarrello = localStorage.getItem('sommaCarrello'); //andiamo ad ottenere  il carrello dal localstorage
  if (sommaCarrello) {
    totaleCarrello = parseInt(sommaCarrello);
  }
  const numeroProd = localStorage.getItem('numeroProdottiCarrello'); //andiamo ad ottenere  il carrello dal localstorage
  if (numeroProd) {
    totaleCarrello = parseInt(numeroProd);
    numeroProdottiCarrello.innerText = totaleCarrello
  }

    // Mostra lo spinner
    spanSpinner.innerHTML = `
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Caricamento...</span>
    </div>
  `;

  //mostra le card vuote prima del caricamento
  for (let i = 0; i < 12; i++) {
    // Crea il markup per una card di placeholder
    const placeholderCard = `
        <div class="col-lg-3 col-md-6 col-sm-12 mt-4">
            <div class="card containerCard" aria-hidden="true">
                <div class="placeholder-image"></div>
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8"></span>
                    </p>
                    <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                </div>
            </div>
        </div>
    `; 
    eventsRow.innerHTML += placeholderCard
  }

  createDOMCarrello()

  fetch(URL, {
    method: 'GET',
    headers: {
      'Authorization': Auth,
      'Content-Type': 'application/json' 
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        toast("Errore nella chiamata ok")
        throw new Error('Errore nella chiamata ok');
      }
    })
    .then((arrayOfEvents) => {
      eventsRow.innerHTML = ''  //qui va a cancellare le card vuote
      // Andiamo a creare le colonne con le card
      arrayOfEvents.forEach((product) => {
        arrayProduct.push(product)
        const newEventCol = `
          <div class="col-lg-3 col-md-6 col-sm-12 mt-4">
              <div class="card containerCard">
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
                      <a href="./details.html?productId=${product._id}" class="btn butcolor w-100">Vai ai dettagli</a>
                      <a href="./back-office.html?productId=${product._id}" class="btn butcolorSecondary w-100 mt-2">Modifica Prodotto</a>
                       <button onclick="addProductCarrello('${product._id}')" class="btn btn-success w-100 mt-2">Compra Prodotto</button>
                  </div>
              </div>
          </div>
        `;

        // Selezioniamo la row e appendiamo la nuova colonna
        eventsRow.innerHTML += newEventCol;
        spanSpinner.innerHTML = '';
      });
      console.log(arrayProduct)
    })
    .catch((error) => {
      // Gestione degli errori
      console.log('ERRORE!', error);
    });
}

getEvents();


// Questo è il toast che si attiva quando succede un evento
function toast(stringa) {
  const toastEl = document.getElementById('myToast');
  const toastBody = toastEl.querySelector('.toast-body'); // Seleziona il corpo del toast

  // Aggiorna il testo del toast
  toastBody.textContent = stringa;

  // Inizializza e mostra il toast
  const toast = new bootstrap.Toast(toastEl, {
    delay: 4000 // Durata del toasts
  });
  toast.show();
}



function addProductCarrello(id) {
  arrayProduct.forEach((product) => {
    if(product._id === id) {
      totaleCarrello += parseInt(product.price)  //per il totale del carrello
      arrayCarrello.push(product)  //vado ad inserire l'oggetto nel carrello
      let n = arrayCarrello.length    //per sapere quanti oggetti stanno nel carrello
      numeroProdottiCarrello.innerText = n
      localStorage.setItem('carrello', JSON.stringify(arrayCarrello));  //salva il carrello in modo locale al browser
      localStorage.setItem('sommaCarrello', totaleCarrello);  //salva il carrello in modo locale al browser
      localStorage.setItem('numeroProdottiCarrello', n);  //salva il carrello in modo locale al browser
      createDOMCarrello()
      toast("Prodotto aggiunto nel carello")
      return   //senza che prosegue una volta trovato
    }
  })
  console.log(arrayCarrello)
  console.log(totaleCarrello)
}

function createDOMCarrello () {
  modalBody.innerHTML = ''
  let carrelloHtml = '';
  arrayCarrello.forEach((product) => {
    carrelloHtml += `
      <div class="row">
        <hr class="text-black">
          <div class="col-4">
            <a href="./details.html?productId=${product._id}">
                  <img
                  src="${product.imageUrl || 'https://uninuoro.it/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg'}"
                  class="card-img-top img-fluid img-card"
                  alt="product pic"
              />
            </a>
          </div>
          <div class="col-8">
                  <div class="text-start text-black">
                  <h5 class="card-title fw-bold text-black">${product.name}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text"><b>Brand: ${product.brand}</b></p>
                  <p class="card-text">Prezzo: $${product.price}</p>
                  <a href="./details.html?productId=${product._id}" class="btn butcolor">Vai ai dettagli</a>
                  <button onclick="removeProductFromCarrello('${product._id}')"  class="btn btn-danger">Rimuovi dal Carrello</button>
              </div>
          </div>
      <hr class="text-black mb-5">
      </div>
    `;
  })
  modalBody.innerHTML = carrelloHtml;
}

//per il momento da problemi per mezzo dell'id quando vado ad eliminare se ci sono duplicati. Dovrei aggiungere la qt, ma non so se ho tempo
//funzione per rimuovere un oggetto dal carrello
function removeProductFromCarrello(id) {
  arrayCarrello = arrayCarrello.filter(product => product._id !== id);
  localStorage.setItem('carrello', JSON.stringify(arrayCarrello));
  createDOMCarrello();
  toast("Prodotto rimosso dal carello")
}