// creat small product cards
const createSmallCards = (data) => {
    return `
    <div class="sm-product">
        <img src="${data.image}" class="sm-product-img" alt="">
        <div class="sm-text">
            <p class="sm-product-name">${data.name}</p>
            <p class="sm-des">${data.shortDes}</p>
        </div>
        <p class="sm-price" data-price="${data.sellPrice}">$${data.sellPrice * data.item}</p>
        <div class="item-counter">
            <button class="counter-btn decrement">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increment">+</button>
        </div>
        <button class="sm-delete-btn"><img src="img/close.png" alt=""></button>
    </div>
    `;
}

let totalBill = 0;

const setProducts = (name) => {
    const element = document.querySelector(`.${name}`);
    let data = JSON.parse(localStorage.getItem(name));
    const cartImg = document.querySelector('.cart-img');

    if (data == null || data.length === 0) {
        element.innerHTML = `<img src="img/empty-cart.png" class="empty-img" alt="">`;
    } else {
        cartImg.src = `../img/loaded-cart.png`;
        for (let i = 0; i < data.length; i++) {
            element.innerHTML += createSmallCards(data[i]);
            if (name == 'cart') {
                totalBill += Number(data[i].sellPrice * data[i].item);
            }
            updateBill();
        }
        let billPrice = document.querySelector('.bill');
        billPrice.innerHTML = `$${totalBill.toFixed(2)}`;
    }

    setupEvents(name);
}

const updateBill = () => {
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `$${totalBill.toFixed(2)}`
}

const setupEvents = (name) => {
    // setup counter events
    const counterMinus = document.querySelectorAll(`.${name} .decrement`);
    const counterPlus = document.querySelectorAll(`.${name} .increment`);
    const counts = document.querySelectorAll(`.${name} .item-count`);
    const price = document.querySelectorAll(`.${name} .sm-price`);
    const deleteBtn = document.querySelectorAll(`.${name} .sm-delete-btn`);

    let product = JSON.parse(localStorage.getItem(name));

    counts.forEach((item, i) => {
        let cost = Number(price[i].getAttribute('data-price'));

        counterMinus[i].addEventListener('click', () => {
            if (item.innerHTML > 1) {
                item.innerHTML --;
                totalBill -= cost;
                var newPrice = item.innerHTML * cost;
                var roundedPrice = newPrice.toFixed(2);
                price[i].innerHTML = `$${roundedPrice}`;
                if (name == 'cart') {
                    updateBill();
                }
                product[i].item = item.innerHTML;
                localStorage.setItem(name, JSON.stringify(product));
            }
        })
        counterPlus[i].addEventListener('click', () => {
            if (item.innerHTML < 9) {
                item.innerHTML ++;
                totalBill += cost;
                var newPrice = item.innerHTML * cost;
                var roundedPrice = newPrice.toFixed(2);
                price[i].innerHTML = `$${roundedPrice}`;
                if (name == 'cart') {
                    updateBill();
                }
                product[i].item = item.innerHTML;
                localStorage.setItem(name, JSON.stringify(product));
            }
        })
    })

    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            product = product.filter((data, index) => index != i);
            localStorage.setItem(name, JSON.stringify(product));
            location.reload();
        })
    })
}

setProducts('cart');
setProducts('wishlist');