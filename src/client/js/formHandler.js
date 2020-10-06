function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    const formText = document.getElementById('name').value
    if (formText.trim().length === 0) {
        alert("type a phrase or a word")
        return
    }
    Client.checkForName(formText)
    const newObject = {text: formText}

    console.log("::: Form Submitted :::")
    fetch('http://localhost:8080/sentiment', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newObject),
      })
    .then(res => res.json())
    .then(function(res) {
        document.getElementById('results').innerHTML = res.irony
    })
}

export { handleSubmit }
