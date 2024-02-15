const setupSlidingEffect = () => {

    const productContainers = [...document.querySelectorAll('.product-container')];
    const nextBtn = [...document.querySelectorAll('.next-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];
    
    productContainers.forEach((item, i) => {
        let containerDim = item.getBoundingClientRect();
        let containerWidth = containerDim.width;
    
        nextBtn[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth;
        })
    
        preBtn[i].addEventListener('click', () => {
            item.scrollLeft -= containerWidth;
        })
    })
}

// fetch product cards
const getProducts = (tag) => {
    return fetch('/get-products', {
        method: "post",
        headers: new Headers({'Content-Type': "application/json"}),
        body: JSON.stringify({tag: tag})
    })
    .then(res => res.json())
    .then(data => {
        return data;
    })
}

// cretate product slider
const createProductSlider = (data, parent, title) => {
    let slideContainer = document.querySelector(`${parent}`);

    slideContainer.innerHTML += `
    <section class="product">
        <h2 class="product-category">${title}</h2>
        <button class="pre-btn"><img src="../img/arrow.png" alt=""></button>
        <button class="next-btn"><img src="../img/arrow.png" alt=""></button>
        ${createProductCards(data)}
    </section>
    `

    setupSlidingEffect();
}

const createProductCards = (data, parent) => {
    let start = '<div class="product-container">';
    let middle = '';
    let end = '</div>';

    for (let i = 0; i < data.length; i++) {
        if (data[i].id != decodeURI(location.pathname.split('/').pop())) {
            middle += `
            <div class="product-card">
                   <div class="product-image">
                       ${data[i].draft ? `<span class="tag">Coming Soon</span>` : ''}
                       ${data[i].sellPrice === data[i].actPrice || data[i].draft ? '': `<span class="discount-tag">${data[i].disc}% off</span>`}
                       <img src="${data[i].images[0]}" onclick="location.href = '/product/${data[i].id}'" class="prdouct-thumb" alt="">
                       <button class="card-btn">add to wishlist</button>
                   </div>
                   <div class="product-info" onclick="location.href = '/product/${data[i].id}'">
                       <h2 class="product-brand">${data[i].name}</h2>
                       <p class="product-short-desc">${data[i].shortDes}</p>
                       <span class="price">$${data[i].sellPrice} ${data[i].sellPrice === data[i].actPrice || data[i].draft ? '' : `</span><span class="actual-price">$${data[i].actPrice}</span>`}
                   </div>
               </div>
            ` 
        }
    }

    if (parent) {
        let cardContainer = document.querySelector(parent);
        cardContainer.innerHTML = start + middle + end;
    } else {
        return start + middle + end;
    }
    
}

const add_product_to_cart_or_wishlist = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type));
    if (data == null) {
        data = [];
    }

    product = {
        item: 1,
        name: product.name,
        sellPrice: product.sellPrice,
        size: size || null,
        shortDes: product.shortDes,
        image: product.images[0]
    }

    data.push(product);
    localStorage.setItem(type, JSON.stringify(data));
    return 'added';
}