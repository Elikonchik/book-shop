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
                    <button class="read">Read</button>
                    <button class="update">Update</button>
                    <button class="delete">Delete</button>
                </td>
            </tr>
        `
    })

    elTbody.innerHTML = strHTML
}

onInit()