'use strict'

const STORAGE_KEY = 'books'
const LAYOUT_KEY = 'layout'

function getRandomRating() {
    return Math.floor(Math.random() * 6)
}

function getRatingStars(rating) {
    if (rating === 0) return 'Unrated'
    return '⭐'.repeat(rating)
}

const gDemoBooks = [
    {
        id: 'bg4J78',
        title: 'The adventures of Lori Ipsi',
        price: 120,
        imgUrl: 'lori-ipsi.jpg',
        rating: getRandomRating()
    },
    {
        id: 'bg4J79',
        title: 'World atlas',
        price: 300,
        imgUrl: 'World atlas.jpg',
        rating: getRandomRating()
    },
    {
        id: 'bg4J80',
        title: 'Zorba the greek',
        price: 87,
        imgUrl: 'Zorba the greek.jpg',
        rating: getRandomRating()
    }
]

let gBooks = []

function getBooks(filterBy = { title: '', minRating: 0 }) {

    const filteredBooks = gBooks.filter(function (book) {

        return book.title.toLowerCase().includes(filterBy.title.toLowerCase()) &&
            book.rating >= filterBy.minRating

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
        imgUrl: `${title}.jpg`,
        rating: getRandomRating()
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

function getBookStats() {

    return gBooks.reduce(function (stats, book) {

        if (book.price > 200) {
            stats.expensive++
        } else if (book.price >= 80) {
            stats.average++
        } else {
            stats.cheap++
        }

        return stats

    }, {
        expensive: 0,
        average: 0,
        cheap: 0
    })
}

function setLayout(layout) {
    saveToStorage(LAYOUT_KEY, layout)
}

function getLayout() {
    return loadFromStorage(LAYOUT_KEY) || 'table'
}

function updateRating(bookId, rating) {

    const bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId
    })

    gBooks[bookIdx].rating = rating

    _saveBooks()
}
