const cartBtn = document.querySelector('.cart')
const openViewCart = document.querySelector('.overlay-bg')
const closeBtn = document.getElementById('btn-close')
const filters = document.querySelectorAll('.filter')
const beverageList = document.querySelector('.beverage')
const foodList = document.querySelector('.food')
const cartCounter = document.querySelector('.count')
const cartItems = document.querySelectorAll('.cart-item').length
const menuList = document.querySelector('.menu-items.active')
const base_URL = "consumableList.php";
const checkoutBtn = document.querySelector('.checkout-btn')
const openCheckout = document.querySelector('.checkout-bg')
const checkoutCloseBtn = document.getElementById('check-close')


//Cart item counter
cartCounter.innerHTML = cartItems

//upon clicking the menu button in the navbar, beverages will auto load
document.getElementById('menu-btn').addEventListener('click', getConsumables('displayBeverages'))
console.log(cartItems)

// implementation of AXIOS upon clicking on 'beverages' or 'food' filter buttons in menu.html
filters.forEach(value => {
    value.addEventListener('click', e => {
        e.preventDefault()

        if (value.innerHTML == "Beverages") {
            beverageList.classList.add('active')
            foodList.classList.remove('active')
            beverageList.innerHTML = ''
            getConsumables('displayBeverages');

        } else {
            foodList.classList.add('active')
            beverageList.classList.remove('active')
            foodList.innerHTML = ''
            getConsumables('displayFood');
        }
    })
})

cartBtn.addEventListener('click', e => {
    e.preventDefault()
    openViewCart.classList.toggle('active')
})

closeBtn.addEventListener('click', e => {
    e.preventDefault()
    openViewCart.classList.toggle('active')
})

checkoutBtn.addEventListener('click', e => {
    e.preventDefault()
    openViewCart.classList.toggle('active')
    openCheckout.classList.toggle('active')
})

checkoutCloseBtn.addEventListener('click', e => {
    e.preventDefault()
    getCustomerName()
    //openCheckout.classList.toggle('active')
})


// gets all data from consumableList.php
function getConsumables(consumableType) {
    axios
        .get(base_URL)
        .then(res => {
            if (consumableType === 'displayBeverages') {
                axios.get('getSizes.php')
                    .then(result => {
                        // console.log(result)
                        loadBeverages(res.data, result.data)
                    })
                    .catch(err => console.log(err))
            } if (consumableType === 'displayFood') {
                loadFood(res.data)
            }
            getAllItems()
            getReceiptItems()
        })
        .catch(err => console.log(err));
}

function loadBeverages(data, sizes) {

    data.forEach(value => {

        if (value['consumable'] === 'beverage') {
            beverageList.innerHTML += `
            <div class="item-card">
                <img src="${value['images']}" alt="">
                <h5 id="${value['itemNo']}" class="itemName">${value['itemName']}</h5>
                <span class="row 1"> 
                    <select class="select-size" >
                        <option class='size' value="Tall">Tall</option>
                        <option class='size' value="Grande">Grande</option>
                        <option class='size' value="Venti">Venti</option>
                    </select>
                    <small id="price-tag"> ${value['price']}</small>
                </span>
                <span class="row 2">
                    <h6 class="variant">${value['variant']}</h6>
                    <button class="add" id="add">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </span>
            </div>
                `
        }
    });
    document.querySelectorAll('.item-card').forEach(item => {
        const currentPrice = item.querySelector('#price-tag').innerHTML
        item.querySelector('.select-size').addEventListener('change', (event) => {
            console.log(event.target.value)
            let selectedSize = sizes.find(size => size.name === event.target.value);
            item.querySelector('#price-tag').innerHTML = parseInt(currentPrice) + parseInt(selectedSize.price)
        })
        
        const itemID = item.querySelector('.itemName').id
        item.querySelector('.add').addEventListener('click', () => {
            const price = item.querySelector('#price-tag').innerHTML
            const select = item.querySelector('.select-size')
            let itemSize = select.options[select.selectedIndex].value
            addItem(itemID, itemSize, price)
        })
    })
}


function loadFood(data) {
    data.forEach(value => {
        if (value['consumable'] === 'food') {
            foodList.innerHTML += `
            <div class="item-card">
            <img src="${value['images']}" alt="">
            <h5 id="${value['itemNo']}" class="itemName">${value['itemName']}</h5>
            <small id="price-tag">${value['price']}</small>
            <span class="row"><h6 class="variant">${value['variant']}</h6>
            <button class="add" id="add" href="#"><i class="fa-solid fa-plus"></i></button></span>
            </div>`
        }
    })
    document.querySelectorAll('.item-card').forEach(item => {
        const itemID = item.querySelector('.itemName').id
        item.querySelector('.add').addEventListener('click', () => {
            const price = item.querySelector('#price-tag').innerHTML
            addItem(itemID, '', price)
        })
    })
}

function addItem(itemID, size, price) {
    console.log(itemID)
    console.log(price)
    axios
        .get(base_URL)
        .then(res => {
            let itemInfo = res.data.find(value => value.itemNo === itemID)
            let itemImg = itemInfo.images
            let itemNo = itemInfo.itemNo
            let itemName = itemInfo.itemName
            let itemSize = size
            let itemPrice = price

            axios.get('orderProcess.php',{
                params: {
                    trigger: 'insertItem',
                    itemNo: itemNo,
                    itemName: itemName,
                    itemSize: itemSize,
                    itemPrice: itemPrice,
                    itemImg: itemImg
                }
            })
            .then(getAllItems(), getReceiptItems())
        }).catch(err => console.log(err))

}


function getAllItems(){
    axios
    .get('orderProcess.php',{
        params: {
            trigger: 'displayOrdersToCart'
        }
    }).then(res => {
        displayItemsToCart(res.data)    })
    .catch(err => console.log(err))
}

function getReceiptItems(){
    // console.log(itemData)
    axios
    .get('orderProcess.php',{
        params: {
            trigger: 'displayOrdersToCheckout'
        }
    }).then(res => {
        displayItemsToCheckout(res.data)
    })
    .catch(err => console.log(err))
}

function displayItemsToCart(data){
    document.querySelector('.orders').innerHTML = ''
    console.log(data)
    let totalPrice = 0;
    let totalQuantity = 0;
    data.forEach(value => {
        totalPrice += parseFloat(value['price']);
        totalQuantity += parseInt(value['quantity']);
        document.querySelector('.orders').innerHTML += `
        <span class="cart-item">
            <img src="${value['images']}" alt="${value['itemName']}">
            <h5 id="${value['itemNo']}" class="itemName">${value['itemName']}</h5>
            <h5 class="itemQuantity">${value['quantity']}</h5>
            <small id="price-tag">₱ ${value['price']}.00</small>
            <span id="delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </span>
        </span>
        `
    })
    document.querySelector('.orders').innerHTML += `
        <span class="cart-total" style="margin-left: 12%;">
            <h3 class="itemName">Total Amount: </h3>
            <h3 class="itemName" style="margin-left: 5%;">${totalQuantity}</h3>
            <h3 class="itemName" style="margin-left: 2%;">₱ ${totalPrice}.00</h3>
        </span>
        `
    cartCounter.innerHTML = data.length

    document.querySelectorAll('.cart-item').forEach(item => {
            item.querySelector('#delete-btn').addEventListener('click', () => {
            itemNo = item.querySelector('.itemName').id
            removeItemFromCart(itemNo)
        })
    })
}

function removeItemFromCart(itemNo) {
    console.log(itemNo)
    axios.get('orderProcess.php',{
            params: {
                trigger: 'deleteItem',
                itemNo: itemNo,
            }
        }).then(getAllItems()).catch(err => console.log(err))
}

function displayItemsToCheckout(data){
    document.querySelector('.receipts').innerHTML = ''
    console.log(data)
    let subTotal = 0;
    let totalQuantity = 0;
    let vat_tax = 0.12;
    let totalPrice = 0;
    data.forEach(value => {
        console.log(value)
        subTotal += parseFloat(value['price']);
        totalQuantity += parseInt(value['quantity']);
        taxwsubTotal = subTotal*vat_tax;
        totalPrice = subTotal+taxwsubTotal;
        document.querySelector('.receipts').innerHTML += `
        <span class="cart-item">
            <img src="${value['images']}" alt="${value['itemName']}">
            <h5 id="${value['itemNo']}" class="itemName">${value['itemName']}</h5>
            <h5 class="itemQuantity">${value['quantity']}</h5>
            <small id="price-tag">₱ ${value['price']}.00</small>
        </span>
        `
    })
    document.querySelector('.receipts').innerHTML += `
        <border></border>
        <span class="total-item">
            <h3 class="itemName">Sub-Total: </h3>
            <h3 class="itemName" style="margin-left: 2%;">₱ ${subTotal}.00</h3>
        </span>
        <span class="total-item">
            <h3 class="itemName">VAT Tax: </h3>
            <h3 class="itemName" style="margin-left: 2%;">12%</h3>
        </span>
        <span class="total-item">
            <h3 class="itemName">Total Price: </h3>
            <h3 class="itemName" style="margin-left: 2%;">₱ ${totalPrice}.00</h3>
        </span>
        `
    cartCounter.innerHTML = data.length
}

function getCustomerName(){
    axios
    .get('orderProcess.php',{
        params: {
            trigger: 'getCustomer'
        }
    }).then(res => {showMessage(res.data)})
    .catch(err => console.log(err))
}

async function showMessage(customerName) {
    
    document.querySelector('.view-checkout').innerHTML = ''
    if (customerName) {
        document.querySelector('.view-checkout').innerHTML += `
            <br><br><br><h2>Hi, ${customerName}!</h2><br>
            <h4>Thank you for ordering from Not Starbucks!</h4>
            <h6>We will redirect you to our home page shortly..</h6>`

        await new Promise(r => setTimeout(r, 4000))
        window.location.href = "home.html";
        destroySession()
    } 
}

// checkoutBtn.addEventListener('click', destroySession)

function destroySession(){
    axios.get('orderProcess.php', {
        params: {
            triggerValue: 'destroySession'
        }}).then(res => console.log(res.data))
            .catch(err => console.log(err))
}