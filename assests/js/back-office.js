const productId = new URLSearchParams(location.search).get('productId')

const URL = 'https://striveschool-api.herokuapp.com/api/product/'
const Auth = "Bearer" + " " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzNGUyZmYyNjBjYzAwMTVjYzBkYzkiLCJpYXQiOjE3MjE5Nzg0MTUsImV4cCI6MTcyMzE4ODAxNX0.1SOaS3sB4odDWGMlL8dDJwKMg-qCXYQEJhu4K_BsqYY"
  // recupero i riferimenti degli input
  const nameInput = document.getElementById('name')
  const descriptionInput = document.getElementById('description')
  const brandInput = document.getElementById('brand')
  const imageUrlInput = document.getElementById('imageUrl')
  const priceInput = document.getElementById('price')

  const btnSub = document.getElementById('btnSub')
  const divButtonDelete = document.getElementById('divButtonDelete')

  if(productId) {  //come se adasse nella pagina modifica. Cambia il nome del bottone. E si aggiunge il bottone delete
    btnSub.innerText = "Modifica prodotto"
    divButtonDelete.innerHTML = `
    <button id="btnSub" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelete">
      Delete
    </button>
    `;
  }else {
    btnSub.innerText = "Crea prodotto"
  }

console.log('productId', productId)  //vado a prendere l'id per fare la modifica del prodotto

//modalità modifica, e l'id si ottiene solo attraverso la pagina details
if (productId) {  // Qui si fa una GET per andare a prendere i dettagli del prodotto per popolare i campi di input
  fetch(URL + productId, {
    method: 'GET', // Imposta il metodo come GET
    headers: {
      'Authorization': Auth, // Aggiungi l'intestazione di autorizzazione
      'Content-Type': 'application/json' // non necessario
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Errore nel recupero del singolo concerto');
    }
  })
  .then(product => {
    console.log('product', product);    //vado a popolare i campi con i dettagli dei prodotti ottenuti dalla get
    nameInput.value = product.name;
    descriptionInput.value = product.description;
    brandInput.value = product.brand;
    imageUrlInput.value = product.imageUrl;
    priceInput.value = product.price;
  })
  .catch(err => {
    console.error('Errore:', err);
  });
}



class Product {
  constructor(_name, _description, _brand, _imageUrl, _price) {
    this.name = _name
    this.description = _description
    this.brand = _brand
    this.imageUrl = _imageUrl
    this.price = _price
  }
}



// Evento del form per andare a prendere i parametri, sia nel caso che sia una post o un put
const eventForm = document.getElementById('event-form')
eventForm.addEventListener('submit', function (e) {
  e.preventDefault() // bloccare il riavvio della pagina


  const nameValue = nameInput.value
  const descriptionValue = descriptionInput.value
  const brandValue = brandInput.value
  const imageUrlValue = imageUrlInput.value
  const priceValue = priceInput.value

  console.log('nameInput', nameValue)
  console.log('nameInput', descriptionValue)
  console.log('nameInput', brandValue)
  console.log('nameInput', imageUrlValue)
  console.log('nameInput', priceValue)

  // Creo un istanza dell'oggetto
  const newProduct = new Product(
    nameValue,
    descriptionValue,
    brandValue,
    imageUrlValue,
    priceValue,
  )


  let methodToUse  // qui vado a scegliere il tipo di metodo, per farlo dianamico
  if (productId) {    // se è presente id
    // modalità modifica
    methodToUse = 'PUT'
  } else {
    // modalità creazione
    methodToUse = 'POST'
  }

  

  let URLToUse
  if (productId) {
    // modalità modifica
    URLToUse = URL + productId
  } else {
    // modalità creazione
    URLToUse = URL
  }

 
//questa fetch è dinamica l'andiamo ad usare sia per il post, che la put
//sia per la modifica che per la creazione, e questo dipende tutto se gli viene passato il paramentro id dell' prodotto 
  fetch(URLToUse, {
    // definiamo il metodo da utilizzare (altrimenti sarebbe GET di default)
    method: methodToUse,
    // alleghiamo alla chiamata l'oggetto che abbiamo costruito precedentemente
    body: JSON.stringify(newProduct), // le API si aspettano un oggetto stringhifizzato
    headers: {
      "Authorization": Auth,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        // se il concerto è stato salvato correttamente
        // non è indispensabile estrapolare il JSON da una chiamata POST,
        // perchè non otterremmo altro che il concerto che volevamo salvare!
        // ci fermiamo qua!
        clearInput()
    
        if(productId){
          location.assign('./index.html'); //una volta modificato ritorna alla pagina index
          alert('Prodotto Modificato')
         } else {
          alert('Prodotto Salvato')
         }
      } else {
        // se il concerto NON è stato salvato a causa di un problema
        alert('ERRORE NEL SALVATAGGIO!')
        throw new Error('Errore nel salvataggio del concerto')
      }
    })
    .catch((err) => {
      console.log('ERRORE', err)
    })

})


//funzione per eliminare un prodotto
const deleteEvent = function() { 
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
      alert('Prodotto ELIMINATO');
      location.assign('./index.html'); 
    } else {

      throw new Error("Problema nell'eliminazione");
    }
  })
  .catch((err) => {
    console.error('Error:', err);
  });
}


//funzione per resettare i campi di input
function clearInput() {  //funzione per cancellare i campi di input
  nameInput.value = ""
  descriptionInput.value = ""
  brandInput.value = ""
  imageUrlInput.value = ""
  priceInput.value = ""
}
