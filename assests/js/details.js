//per i dettagli per questioni tempistiche non sono riuscito ad aggiungere, aggiungi la carello e la rimozione del prodotto al carello
//qui il carrello può essere solo visualizzato
//nell'homepage il carrello funziona senza nessun problema

const addressBarParameters = new URLSearchParams(location.search)
const productId = addressBarParameters.get('productId') // questo torna l'_id nella barra degli indirizzi

const URL = 'https://striveschool-api.herokuapp.com/api/product/'
const Auth = "Bearer" + " " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzNGUyZmYyNjBjYzAwMTVjYzBkYzkiLCJpYXQiOjE3MjE5Nzg0MTUsImV4cCI6MTcyMzE4ODAxNX0.1SOaS3sB4odDWGMlL8dDJwKMg-qCXYQEJhu4K_BsqYY"

const numeroProdottiCarrello = document.getElementById('numeroProdotti')
const modalBody = document.getElementById('modal-body');
const totaleCarrelloDom = document.getElementById('totaleCarrelloDom')
let arrayProduct = []  //questo lo uso per andarmi a prendere i  prodotti dal db e metterli nel array per gestirli meglio
let arrayCarrello = []
let nProdottiCarrello = 0
let totaleCarrello = 0

const savedCarrello = localStorage.getItem('carrello'); //andiamo ad ottenere  il carrello dal localstorage
if (savedCarrello) {
  arrayCarrello = JSON.parse(savedCarrello);
}
const sommaCarrello = localStorage.getItem('sommaCarrello'); //andiamo ad ottenere  il carrello dal localstorage
if (sommaCarrello) {
  totaleCarrello = parseInt(sommaCarrello);
  totaleCarrelloDom.innerText = totaleCarrello
  console.log(totaleCarrello)
}
const numeroProd = localStorage.getItem('numeroProdottiCarrello'); //andiamo ad ottenere  il carrello dal localstorage
if (numeroProd) {
  totaleCarrello = parseInt(numeroProd);
  numeroProdottiCarrello.innerText = totaleCarrello
}

createDOMCarrello()

//mi vado a prendere il singolo oggetto per vedere i dettagli
fetch(URL + productId, {
  headers: {
    'Authorization': Auth,
    'Content-Type': 'application/json' // Non necessario
  }
})
.then((response) => {
  if (response.ok) {
    return response.json();  //conversione
  } else {
    toast("Errore nella Fetch singola")
    throw new Error('ERRORE NELLA FETCH SINGOLA');
    
  }
})
.then((product) => {
  console.log(product);
  const detailRow = document.getElementById('detail-row');
  detailRow.innerHTML = `

          <div class="col-5 p-0">
            <img src="${product.imageUrl}" class="img-fluid detailImg" alt="immagineProdotto">
          </div>
          <div class="col-7">
              <h2 class="card-title mb-3">${product.name}</h2>
              <p class="card-text"><b>Brand:</b> ${product.brand}</p>
              <p class="card-text"><b>Descrizione:</b> ${product.description}</p>
              <a href="#" class="btn butcolor">$${product.price} Compra</a>
          </div>
  `;
})
.catch((err) => {
  console.log(err);
});


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
              </div>
          </div>
      <hr class="text-black mb-5">
      </div>
    `;
  })
  modalBody.innerHTML = carrelloHtml;
}

/*

//funzione per rimuovere un oggetto dal carrello
function removeProductFromCarrello(id) {
  arrayCarrello.forEach((product, index) => {
    if(product._id === id) {
      totaleCarrello = totaleCarrello - parseInt(product.price)
      arrayCarrello.splice(index,1)  //rimuove
      numeroProdottiCarrello.innerText = arrayCarrello.length  //aggiorna il DOM
      totaleCarrelloDom.innerText = totaleCarrello //Aggiorna il DOM
      localStorage.setItem('carrello', JSON.stringify(arrayCarrello));
      localStorage.setItem('numeroProdottiCarrello', arrayCarrello.length);
      localStorage.setItem('sommaCarrello', totaleCarrello); 
      createDOMCarrello();
      return
    }
  })
}
  */