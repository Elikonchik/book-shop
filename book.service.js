'use strict'

const STORAGE_KEY = 'books'

const gDemoBooks = [
    {
        id: 'bg4J78',
        title: 'The adventures of Lori Ipsi',
        price: 120,
        imgUrl: 'lori-ipsi.jpg'
    },
    {
        id: 'bg4J79',
        title: 'World atlas',
        price: 300,
        imgUrl: 'World atlas.jpg'
    },
    {
        id: 'bg4J80',
        title: 'Zorba the greek',
        price: 87,
        imgUrl: 'Zorba the greek.jpg'
    }
]

let gBooks = []

function getBooks(filterBy = '') {

    const filteredBooks = gBooks.filter(function (book) {
        return book.title.toLowerCase().includes(filterBy.toLowerCase())
    })

    return filteredBooks
}

function removeBook(bookId) {

    const bookIdx = gBooks.findIndex(book => book.id === bookId)

    // console.log(bookIdx)
    gBooks.splice(bookIdx, 1)

    _saveBooks()
}

function updatePrice(bookId, newPrice) {

    const bookIdx = gBooks.findIndex(book => book.id === bookId)

    gBooks[bookIdx].price = newPrice

    _saveBooks()
}

function addBook(id, title, price) {

    const newBook = {
        id: id,
        title: title,
        price: price,
        imgUrl: `${title}.jpg`
    }

    gBooks.push(newBook)

    _saveBooks()
}

function getBookById(bookId) {

    return gBooks.find(function (book) {
        return book.id === bookId
    })
}

function loadBooks() {

    const books = loadFromStorage(STORAGE_KEY)

    if (books && books.length) {
        gBooks = books
    } else {
        gBooks = gDemoBooks.slice()
        _saveBooks()
    }
}

loadBooks()

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}