'use strict'

function onInit() {
    render()
}

function render() {

    const books = getBooks()

    const elTbody = document.querySelector('tbody')

    let strHTML = ''

    books.forEach(function (book) {

        strHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td>
                    <button class="read" onclick="read">Read</button>
                    <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button>
                </td>
            </tr>
        `
    })

    elTbody.innerHTML = strHTML
}

onInit()

function onRemoveBook(bookId) {

    removeBook(bookId)
    render()
}

function onUpdateBook(bookId) {

    const newPrice = +prompt('Enter new price:')

    updatePrice(bookId, newPrice)

    render()
}