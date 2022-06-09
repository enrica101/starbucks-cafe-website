const selectBtn = document.querySelectorAll('.btn-select-item')
const itemWindow = document.querySelector('.view-item-window')
const closeBtn = document.getElementById('btn-close')

selectBtn.forEach(value => {
    value.addEventListener('click', e => {
        e.preventDefault()
        itemWindow.classList.add('active')
    })
})

closeBtn.addEventListener('click', e => {
    e.preventDefault()
    itemWindow.classList.remove('active')

})