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
    throw new Error('ERRORE NELLA FETCH SINGOLA');
  }
})
.then((product) => {
  console.log(product);
  const detailRow = document.getElementById('detail-row');
  detailRow.innerHTML = `
      <div class="col-12 col-md-8 text-center">
          <div class="card pb-4">
          <img src="${product.imageUrl}" class="card-img-top" alt="concert">
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">${product.brand}</p>
              <a href="#" class="btn btn-primary">${product.price}€ COMPRA</a>
          </div>
              <div class="border border-danger border-2 fit-content mx-auto p-3">
                  <h3>TASTI ADMIN</h3>
                  <div>
                      <a href="./back-office.html?productId=${product._id}" class="btn btn-warning">MODIFICA</a>
                      <button class="btn btn-danger" onclick="deleteEvent('${product._id}')">ELIMINA</button>
                  </div>
              </div>
          </div>
      </div>
  `;
})
.catch((err) => {
  console.log(err);
});


//funzione per eliminare un prodotto
const deleteEvent = function(productId) { 
  // Verifica che l'productId sia definito
  if (!productId) {
    console.error('ID dell\'evento non fornito');
    return;
  }

  fetch(URL + productId, {
    method: 'DELETE',
    headers: {
      'Authorization': Auth,
      'Content-Type': 'application/json' // Non necessario
    }
  })
  .then((response) => {
    if (response.ok) {
      alert('CONCERTO ELIMINATO');
      location.assign('./index.html'); 
    } else {

      throw new Error("Problema nell'eliminazione");
    }
  })
  .catch((err) => {
    console.error('Error:', err);
  });
}

