const productImages = document.querySelectorAll(".product-images img");
const productImageSlide = document.querySelector(".image-slider");

let activeImageSlide = 0;

productImages.forEach((item, i) => {
    item.addEventListener('click',() => {
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url('${item.src}')`;
        activeImageSlide = i;
    })
});

const sizeBtns = document.querySelectorAll(".size-radio-btn");
let checkedBtn = 0;
let size;

sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i;
        size = item.innerHTML;
    })
})

const setData = (data) => {
    let title = document.querySelector('title');

    // setup images
    productImages.forEach((img,i) => {
        if (data.images[i]) {
            img.src = data.images[i];
        } else {
            img.style.display = 'none';
        }
    })
    productImages[0].click();

    // setup size buttons
    sizeBtns.forEach(item => {
        if (!data.sizes.includes(item.innerHTML)) {
            item.style.display = 'none';
        }
    })

    // setting up texts
    const name = document.querySelector('.product-brand');
    const shortDes = document.querySelector('.prod-short-desc');
    const des = document.querySelector('.des');

    
    title.innerHTML += name.innerHTML = data.name;
    shortDes.innerHTML = data.shortDes;
    des.innerHTML = data.des;

    // pricing'
    const sellPrice = document.querySelector('.prod-price');
    const actPrice = document.querySelector('.prod-actual-price');
    const disc = document.querySelector('.prod-disc-price');

    sellPrice.innerHTML = `$${data.sellPrice}`;
    actPrice.innerHTML = `$${data.actPrice}`;
    disc.innerHTML = `(${data.disc}% off)`;

    // check if its a discount product
    if (data.sellPrice === data.actPrice) {
        actPrice.style.display = 'none';
        disc.style.display = 'none';
    }

    // wishlist and cart btn
    const cartBtn = document.querySelector('.cart-btn');
    const wBtn = document.querySelector('.wishlist-btn');

    wBtn.addEventListener('click', () => {
        wBtn.innerHTML = add_product_to_cart_or_wishlist('wishlist', data);
    })
    cartBtn.addEventListener('click', () => {
        cartBtn.innerHTML = add_product_to_cart_or_wishlist('cart', data);
    })

    if(data.draft){
        name.innerHTML = data.name += " (coming soon)";
        sellPrice.style.display = 'none';
        actPrice.style.display = 'none';
        cartBtn.style.display = 'none';
        disc.style.display = 'none';
    }

}

// fetch correct data
const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productId})
    }).then(res => res.json())
    .then(data => {
        setData(data);
        getProducts(data.tags[1]).then(data => createProductSlider(data, '.container-for-card-slider', 'similar products'))
    })
    .catch(err => {
        console.log(err);
    })
    
}

let productId = null;
if (location.pathname != '/product') {
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}