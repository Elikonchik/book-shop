'use strict'

const gBooks = [{
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
}]

'use strict'

function getBooks() {
    return gBooks
}

function removeBook(bookId) {

    const bookIdx = gBooks.findIndex(book => book.id === bookId)

    // console.log(bookIdx)
    gBooks.splice(bookId, 1)
}