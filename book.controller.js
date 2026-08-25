'use strict'

function onInit() {

    const layout = getLayout()

    if (layout === 'grid') {
        document.body.classList.add('grid')
    }

    render()
}

function render(books = getBooks()) {

    const elTbody = document.querySelector('tbody')

    let strHTML = ''

    books.forEach(function (book) {

        strHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td>
                    <button class="read" onclick="onShowDetails('${book.id}')">Read</button>
                    <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button>
                </td>
            </tr>
        `
    })

    elTbody.innerHTML = strHTML

    if (!books.length) {
        elTbody.innerHTML = `
            <tr>
                <td colspan="3">No matching books were found</td>
            </tr>
        `
        return
    }

    const stats = getBookStats()

    document.querySelector('.expensive-count').innerText = stats.expensive
    document.querySelector('.average-count').innerText = stats.average
    document.querySelector('.cheap-count').innerText = stats.cheap

    renderGrid(books)
}

onInit()

function onRemoveBook(bookId) {

    removeBook(bookId)
    render()

    showSuccessMsg('Book deleted successfully!')

}

function onUpdateBook(bookId) {

    const newPrice = +prompt('Enter new price:')

    updatePrice(bookId, newPrice)

    render()

    showSuccessMsg('Book updated successfully!')
}

function onAddBook() {

    const newBookId = getNewId()
    const newBookTitle = prompt(`Enter the book's title`)
    const newBookPrice = +prompt(`Enter the book's price`)

    if (!newBookTitle || !newBookPrice) {
        alert(`Can't keep blank!`)
        return
    }

    addBook(newBookId, newBookTitle, newBookPrice)
    render()

    showSuccessMsg('Book added successfully!')
}

function onShowDetails(bookId) {

    const book = getBookById(bookId)

    const elModal = document.querySelector('.book-details-modal')
    const elDetails = document.querySelector('.book-details')

    elDetails.innerHTML = `
        <img src="${book.imgUrl}" alt="${book.title}">
        <h2>${book.title}</h2>
        <p>Price: ${book.price}</p>
    `

    elModal.style.display = 'block'
}

function onCloseModal() {
    document.querySelector('.book-details-modal').style.display = 'none'
}

function onFilterByTitle(txt) {
    const books = getBooks(txt)
    render(books)
}

function onClearFilter() {

    document.querySelector('input').value = ''

    render()
}

function showSuccessMsg(msg) {

    const elMsg = document.querySelector('.success-msg')

    elMsg.innerText = msg

    setTimeout(function () {
        elMsg.innerText = ''
    }, 2000)
}

function onSetLayout(layout) {

    setLayout(layout)

    if (layout === 'grid') {
        document.body.classList.add('grid')
    } else {
        document.body.classList.remove('grid')
    }

    render()
}

function renderGrid(books) {

    const elGrid = document.querySelector('.books-grid')

    let strHTML = ''

    books.forEach(function (book) {

        strHTML += `
            <div class="book-card">

                <img src="${book.imgUrl}" alt="${book.title}">

                <h2>${book.title}</h2>

                <p>Price: ${book.price}</p>

                <button class="read" onclick="onShowDetails('${book.id}')">Read</button>
                <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                <button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button>

            </div>
        `
    })

    elGrid.innerHTML = strHTML
}