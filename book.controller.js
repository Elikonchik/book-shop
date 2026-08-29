'use strict'

function onInit() {

    const layout = getLayout()

    if (layout === 'grid') {
        document.body.classList.add('grid')
    }

    const filterBy = getFilterFromQueryParams()

    document.querySelector('.title-filter').value = filterBy.title
    document.querySelector('.rating-filter').value = filterBy.minRating

    const books = getBooks(filterBy)

    render(books)
}

function render(books = getBooks()) {

    const elTbody = document.querySelector('tbody')

    let strHTML = ''

    books.forEach(function (book) {

        strHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td>${getRatingStars(book.rating)}</td>
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
                <td colspan="4">No matching books were found</td>
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

    document.querySelector('.add-book-modal').style.display = 'block'
}

function onSaveBook() {

    const title = document.querySelector('.book-title-input').value
    const price = +document.querySelector('.book-price-input').value

    if (!title || !price) {
        document.querySelector('.add-error-msg').innerText =
            "Title and price are required!"
        return
    }

    const id = getNewId()

    addBook(id, title, price)

    render()

    onCloseAddModal()

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

    <div class="rating">
        <button onclick="onChangeRating('${book.id}', -1)">−</button>
        <span>${getRatingStars(book.rating)}</span>
        <button onclick="onChangeRating('${book.id}', 1)">+</button>
    </div>
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

    document.querySelector('.title-filter').value = ''
    document.querySelector('.rating-filter').value = '0'

    history.pushState(null, '', location.pathname)

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
           
                <p>Rating: ${getRatingStars(book.rating)}</p>

                <button class="read" onclick="onShowDetails('${book.id}')">Read</button>
                <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                <button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button>

            </div>
        `
    })

    elGrid.innerHTML = strHTML
}

function onCloseAddModal() {

    document.querySelector('.add-book-modal').style.display = 'none'

    document.querySelector('.book-title-input').value = ''
    document.querySelector('.book-price-input').value = ''

    document.querySelector('.add-error-msg').innerText = ''
}

function onChangeRating(bookId, change) {

    const book = getBookById(bookId)

    let newRating = book.rating + change

    if (newRating < 0) newRating = 0
    if (newRating > 5) newRating = 5

    updateRating(bookId, newRating)

    onShowDetails(bookId)
    render()
}

function onFilter() {

    const title = document.querySelector('.title-filter').value
    const minRating = +document.querySelector('.rating-filter').value

    const field = document.querySelector('.sort-by').value
    const order = document.querySelector('input[name="sort"]:checked').value

    const filterBy = {
        title: title,
        minRating: minRating
    }

    const sortBy = {
        field: field,
        order: order
    }

    const books = getBooks(filterBy, sortBy)

    setQueryParams(filterBy)

    render(books)
}

function setQueryParams(filterBy) {

    const params = new URLSearchParams()

    if (filterBy.title) {
        params.set('title', filterBy.title)
    }

    if (filterBy.minRating) {
        params.set('minRating', filterBy.minRating)
    }

    const queryString = params.toString()

    const newUrl = queryString
        ? `${location.pathname}?${queryString}`
        : location.pathname

    history.pushState(null, '', newUrl)
}

function getFilterFromQueryParams() {

    const params = new URLSearchParams(location.search)

    return {
        title: params.get('title') || '',
        minRating: +params.get('minRating') || 0
    }
}

function onSort() {

    const title = document.querySelector('.title-filter').value
    const minRating = +document.querySelector('.rating-filter').value

    const field = document.querySelector('.sort-by').value
    const order = document.querySelector('input[name="sort"]:checked').value

    const filterBy = {
        title: title,
        minRating: minRating
    }

    const sortBy = {
        field: field,
        order: order
    }

    const books = getBooks(filterBy, sortBy)

    render(books)
}