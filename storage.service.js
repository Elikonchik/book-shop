'use strict'

function loadFromStorage(key) {
    const data = localStorage.getItem(key)

    return JSON.parse(data)
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}