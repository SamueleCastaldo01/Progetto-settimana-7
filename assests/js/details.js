const addressBarParameters = new URLSearchParams(location.search)
const productId = addressBarParameters.get('productId') // questo torna l'_id nella barra degli indirizzi

const URL = 'https://striveschool-api.herokuapp.com/api/product/'
const Auth = "Bearer" + " " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzNGUyZmYyNjBjYzAwMTVjYzBkYzkiLCJpYXQiOjE3MjE5Nzg0MTUsImV4cCI6MTcyMzE4ODAxNX0.1SOaS3sB4odDWGMlL8dDJwKMg-qCXYQEJhu4K_BsqYY"


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