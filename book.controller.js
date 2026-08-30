'use strict'

let gQueryOptions = {
    filterBy: {
        title: '',
        minRating: 0
    },
    sortBy: {
        field: 'title',
        order: 'asc'
    },
    pageIdx: 0,
    pageSize: 5
}

let gEditingBookId = null

let gEditingRating = 0

function onInit() {

    gQueryOptions = getQueryOptionsFromParams()

    if (gQueryOptions.layout === 'grid') {
        document.body.classList.add('grid')
    } else {
        document.body.classList.remove('grid')
    }

    document.querySelector('.title-filter').value =
        gQueryOptions.filterBy.title

    document.querySelector('.rating-filter').value =
        gQueryOptions.filterBy.minRating

    document.querySelector('.sort-by').value =
        gQueryOptions.sortBy.field

    document.querySelector(
        `input[name="sort"][value="${gQueryOptions.sortBy.order}"]`
    ).checked = true

    render()

    const params = new URLSearchParams(location.search)
    const bookId = params.get('bookId')

    if (bookId) {
        onShowDetails(bookId)
    }
}

function render() {

    const books = getBooks(
        gQueryOptions.filterBy,
        gQueryOptions.sortBy
    )

    const startIdx = gQueryOptions.pageIdx * gQueryOptions.pageSize
    const endIdx = startIdx + gQueryOptions.pageSize

    const pageBooks = books.slice(startIdx, endIdx)

    const elTbody = document.querySelector('tbody')

    let strHTML = ''

    pageBooks.forEach(function (book) {

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

    renderGrid(pageBooks)

    const stats = getBookStats()

    document.querySelector('.expensive-count').innerText = stats.expensive
    document.querySelector('.average-count').innerText = stats.average
    document.querySelector('.cheap-count').innerText = stats.cheap

    renderPagination(books)
    renderSortIndicators()
}

function renderPagination(books) {

    const pageCount = Math.ceil(
        books.length / gQueryOptions.pageSize
    )

    document.querySelector('.page-number').innerText =
        gQueryOptions.pageIdx + 1
}

function onNextPage() {

    const books = getBooks(
        gQueryOptions.filterBy,
        gQueryOptions.sortBy
    )

    const pageCount = Math.ceil(
        books.length / gQueryOptions.pageSize
    )

    if (gQueryOptions.pageIdx < pageCount - 1) {
        gQueryOptions.pageIdx++
    } else {
        gQueryOptions.pageIdx = 0
    }

    setQueryParams()
    render()
}

function onPrevPage() {

    const books = getBooks(
        gQueryOptions.filterBy,
        gQueryOptions.sortBy
    )

    const pageCount = Math.ceil(
        books.length / gQueryOptions.pageSize
    )

    if (gQueryOptions.pageIdx > 0) {
        gQueryOptions.pageIdx--
    } else {
        gQueryOptions.pageIdx = pageCount - 1
    }

    setQueryParams()
    render()
}

onInit()

function onRemoveBook(bookId) {

    removeBook(bookId)
    render()

    showSuccessMsg('Book deleted successfully!')

}

function onUpdateBook(bookId) {

    const book = getBookById(bookId)

    gEditingBookId = bookId
    gEditingRating = book.rating

    document.querySelector('.book-title-input').value = book.title
    document.querySelector('.book-price-input').value = book.price

    document.querySelector('.edit-rating').innerText =
        getRatingStars(gEditingRating)

    document.querySelector('.book-details-modal').style.display = 'none'

    document.querySelector('.book-edit-modal').style.display = 'block'
}

function onAddBook() {

    gEditingBookId = null
    gEditingRating = 0

    document.querySelector('.book-title-input').value = ''
    document.querySelector('.book-price-input').value = ''
    document.querySelector('.edit-rating').innerText = 'Unrated'

    document.querySelector('.book-edit-modal').style.display = 'block'
}

function onSaveBook() {

    const title = document.querySelector('.book-title-input').value
    const price = +document.querySelector('.book-price-input').value

    if (!title || !price) {
        document.querySelector('.add-error-msg').innerText =
            'Title and price are required!'
        return
    }

    if (gEditingBookId) {
        updateBook(gEditingBookId, title, price, gEditingRating)
        showSuccessMsg('Book updated successfully!')
    } else {
        const id = getNewId()
        addBook(id, title, price, gEditingRating)
        showSuccessMsg('Book added successfully!')
    }

    render()

    onCloseEditModal()
}

function onShowDetails(bookId) {

    const book = getBookById(bookId)

    const elModal = document.querySelector('.book-details-modal')
    const elDetails = document.querySelector('.book-details')

    elDetails.innerHTML = `
    <img src="${book.imgUrl}" alt="${book.title}">
    <h2>${book.title}</h2>
    <p>Price: ${book.price}</p>
    <p>Rating: ${getRatingStars(book.rating)}</p>

    <div class="rating">
        <button onclick="onChangeRating('${book.id}', -1)">−</button>
        <span>${getRatingStars(book.rating)}</span>
        <button onclick="onChangeRating('${book.id}', 1)">+</button>
    </div>

    <button class="edit-details-btn" onclick="onUpdateBook('${book.id}')">
        Edit
    </button>
`

    elModal.style.display = 'block'

    const params = new URLSearchParams(location.search)
    params.set('bookId', bookId)

    history.pushState(
        null,
        '',
        `${location.pathname}?${params.toString()}`
    )
}

function onCloseModal() {

    document.querySelector('.book-details-modal').style.display = 'none'

    const params = new URLSearchParams(location.search)
    params.delete('bookId')

    const queryString = params.toString()

    history.pushState(
        null,
        '',
        queryString
            ? `${location.pathname}?${queryString}`
            : location.pathname
    )
}

function onCloseEditModal() {
    document.querySelector('.book-edit-modal').style.display = 'none'

    document.querySelector('.book-title-input').value = ''
    document.querySelector('.book-price-input').value = ''

    document.querySelector('.add-error-msg').innerText = ''

    gEditingBookId = null

    gEditingRating = 0
}

function onFilterByTitle(txt) {
    const books = getBooks(txt)
    render(books)
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

    gQueryOptions.layout = layout

    if (layout === 'grid') {
        document.body.classList.add('grid')
    } else {
        document.body.classList.remove('grid')
    }

    setQueryParams()
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

function onChangeRating(bookId, change) {

    const book = getBookById(bookId)

    let newRating = book.rating + change

    if (newRating < 0) newRating = 0
    if (newRating > 5) newRating = 5

    updateRating(bookId, newRating)

    onShowDetails(bookId)
    render()
}

function onChangeEditRating(change) {

    gEditingRating += change

    if (gEditingRating < 0) gEditingRating = 0
    if (gEditingRating > 5) gEditingRating = 5

    document.querySelector('.edit-rating').innerText =
        getRatingStars(gEditingRating)
}

function onFilter() {

    const title = document.querySelector('.title-filter').value
    const minRating = +document.querySelector('.rating-filter').value

    gQueryOptions.filterBy.title = title
    gQueryOptions.filterBy.minRating = minRating

    gQueryOptions.pageIdx = 0

    setQueryParams()

    render()
}

function onClearFilter() {

    gQueryOptions.filterBy.title = ''
    gQueryOptions.filterBy.minRating = 0

    gQueryOptions.pageIdx = 0

    document.querySelector('.title-filter').value = ''
    document.querySelector('.rating-filter').value = '0'

    history.pushState(null, '', location.pathname)

    render()
}

function setQueryParams() {

    const params = new URLSearchParams()

    if (gQueryOptions.filterBy.title) {
        params.set('title', gQueryOptions.filterBy.title)
    }

    if (gQueryOptions.filterBy.minRating) {
        params.set('minRating', gQueryOptions.filterBy.minRating)
    }

    params.set('sort', gQueryOptions.sortBy.field)
    params.set('order', gQueryOptions.sortBy.order)
    params.set('page', gQueryOptions.pageIdx + 1)

    const layout = getLayout()
    params.set('layout', layout)

    history.pushState(
        null,
        '',
        `${location.pathname}?${params.toString()}`
    )
}

function getQueryOptionsFromParams() {

    const params = new URLSearchParams(location.search)

    return {
        filterBy: {
            title: params.get('title') || '',
            minRating: +params.get('minRating') || 0
        },

        sortBy: {
            field: params.get('sort') || 'title',
            order: params.get('order') || 'asc'
        },

        pageIdx: Math.max(0, (+params.get('page') || 1) - 1),

        pageSize: 5,

        layout: params.get('layout') || 'table'
    }
}

function onSort() {

    const field = document.querySelector('.sort-by').value
    const order = document.querySelector('input[name="sort"]:checked').value

    gQueryOptions.sortBy.field = field
    gQueryOptions.sortBy.order = order

    gQueryOptions.pageIdx = 0

    setQueryParams()

    render()
}

function onSortBy(field) {

    if (gQueryOptions.sortBy.field === field) {

        gQueryOptions.sortBy.order =
            gQueryOptions.sortBy.order === 'asc'
                ? 'desc'
                : 'asc'

    } else {

        gQueryOptions.sortBy.field = field
        gQueryOptions.sortBy.order = 'asc'
    }

    gQueryOptions.pageIdx = 0

    setQueryParams()
    render()
}

function renderSortIndicators() {

    document.querySelector('.sort-title').innerText = ''
    document.querySelector('.sort-price').innerText = ''
    document.querySelector('.sort-rating').innerText = ''

    const field = gQueryOptions.sortBy.field
    const order = gQueryOptions.sortBy.order

    const sign = order === 'asc' ? '+' : '−'

    document.querySelector(`.sort-${field}`).innerText = ` ${sign}`
}