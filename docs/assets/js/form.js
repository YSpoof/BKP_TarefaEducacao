const scriptURL = 'https://script.google.com/macros/s/AKfycbxB7c4nrFgb_PCmX9rHykY3rTIY2nYpxaCumU-TDgyO4nqY6wyFwn7TlSzsqnUq5qlt/exec'

const form = document.forms['suggest']
const smBtn = form.elements["submitBtn"]
form.elements["name"].value = configs.name ? configs.name : ''
form.elements["email"].value = configs.email ? configs.email : ''


function fmSError() {
    let shouldWe = window.confirm("OOps, não foi possível enviar a sua mensagem, vou tentar novamente, OK ?");
    if (shouldWe == true) {
        form.requestSubmit(smBtn)
        shouldWe = false
        return
    }
    smBtn.innerHTML = "Enviar"
    smBtn.disabled = false
}

form.addEventListener('submit', e => {
    smBtn.innerHTML = "<img loading='lazy' width='25px' src='/assets/images/icons/spinner.svg' class='will-spin'>"
    smBtn.disabled = true
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', mode: 'no-cors' ,body: new FormData(form)})
    .then(response => window.location.replace('/contact-success/'))
    .catch(error => fmSError())
})