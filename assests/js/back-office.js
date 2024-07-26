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
      toast('Errore nel recupero del singolo prodotto')
      throw new Error('Errore nel recupero del singolo prodotto');
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

    method: methodToUse,

    body: JSON.stringify(newProduct), 
    headers: {
      "Authorization": Auth,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        clearInput()
    
        if(productId){
          toast("Prodotto Modificato")
          setTimeout(() => {  //ci metto un ritardo, giusto il tempo per far visualizzare la notifica
            location.assign('./index.html');
          }, 3000);
         } else {
          toast("Prodotto Salvato")
         }
      } else {
        toast("Errore nel Salvataggio")
        throw new Error('Errore nel salvataggio del prodotto')
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
      toast("Prodotto Eliminato")
      setTimeout(() => {  //ci metto un ritardo, giusto il tempo per far visualizzare la notifica
        location.assign('./index.html');
      }, 3000);
    } else {
      toast("Problema nell'eliminazione")
      throw new Error("Problema nell'eliminazione");
    }
  })
  .catch((err) => {
    console.error('Error:', err);
  });
}


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
 


//funzione per resettare i campi di input
function clearInput() {  //funzione per cancellare i campi di input
  nameInput.value = ""
  descriptionInput.value = ""
  brandInput.value = ""
  imageUrlInput.value = ""
  priceInput.value = ""
}
