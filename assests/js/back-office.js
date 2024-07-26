// - PARTE FINALE DELLA LEZIONE -
// nel caso la pagina backoffice si caricasse con un parametro "eventId" nella barra
// degli indirizzi, significa che non sono arrivato qui cliccando il bottone "backoffice"
// nella navbar ma cliccando il tasto MODIFICA da uno degli eventi.
// questo comporta che la mia pagina backoffice deve entrare in "modalità modifica":
// - deve fare una fetch singola per i dettagli dell'evento con quell_id
// - deve ri-popolare i campi del form con i dati risultanti dalla fetch
// - il tasto SALVA non deve fare una POST, ma una PUT (per modificare l'evento con quell'id)

const eventId = new URLSearchParams(location.search).get('eventId')

const URL = 'https://striveschool-api.herokuapp.com/api/product/'
const Auth = "Bearer" + " " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzNGUyZmYyNjBjYzAwMTVjYzBkYzkiLCJpYXQiOjE3MjE5Nzg0MTUsImV4cCI6MTcyMzE4ODAxNX0.1SOaS3sB4odDWGMlL8dDJwKMg-qCXYQEJhu4K_BsqYY"

console.log('EVENTID', eventId)  //vado a prendere l'id per fare la modifica del prodotto


if (eventId) {  // qui fa una get per andare a prendere i dettagli del prodotto per popolare i campi di input
  // se entro qui, vuol dire che sono in "modalità modifica"
  // 1) fetch individuale per recuperare i dettagli, COME nella pagina DETAILS!
  fetch(URL + eventId, {
    method: 'GET', // Imposta il metodo come GET
    headers: {
      "Authorization": Auth, // Aggiungi l'intestazione di autorizzazione
    }
  })
  .then((response) => {
    if (response.ok) {
      // la chiamata è andata a buon fine
      return response.json()
    } else {
      throw new Error('errore nel recupero del singolo concerto')
    }
  })
  .then((singleEvent) => {
    console.log('SINGLEEVENT', singleEvent)
    // 2) ri-popolo i campi del form con i dati dell'evento
    document.getElementById('name').value = singleEvent.name
    document.getElementById('description').value = singleEvent.description
    document.getElementById('time').value = singleEvent.time.split('.000Z')[0]
    document.getElementById('price').value = singleEvent.price
  })
  .catch((err) => {
    console.log(err)
  })
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



// Evento del form per andare a prendere i parametri
const eventForm = document.getElementById('event-form')
eventForm.addEventListener('submit', function (e) {
  e.preventDefault() // bloccare il riavvio della pagina
  // recupero i riferimenti degli input
  const nameInput = document.getElementById('name')
  const descriptionInput = document.getElementById('description')
  const brandInput = document.getElementById('brand')
  const imageUrlInput = document.getElementById('imageUrl')
  const priceInput = document.getElementById('price')


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

  function clearInput() {  //funzione per cancellare i campi di input
    nameInput.value = ""
    descriptionInput.value = ""
    brandInput.value = ""
    imageUrlInput.value = ""
    priceInput.value = ""
  }

  // Creo un istanza dell'oggetto
  const newProduct = new Product(
    nameValue,
    descriptionValue,
    brandValue,
    imageUrlValue,
    priceValue,
  )


  let methodToUse  // qui vado a scegliere il tipo di metodo, per farlo dianamico
  if (eventId) {    // se è presente id
    // modalità modifica
    methodToUse = 'PUT'
  } else {
    // modalità creazione
    methodToUse = 'POST'
  }

  

  let URLToUse
  if (eventId) {
    // modalità modifica
    URLToUse = URL + eventId
  } else {
    // modalità creazione
    URLToUse = URL
  }

 
  {/**** */}
  // chiamata fetch() per fare una POST del concerto appena compilato
  // per fare una chiamata POST, l'URL è lo stesso della chiamata GET
  // ...se l'API è stata costruita secondo i principi REST
 
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
        alert('Prodotto Salvato')
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

