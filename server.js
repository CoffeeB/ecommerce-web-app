// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const exp = require('constants');
const nodemailer = require('nodemailer');

// firebase admin setup
let serviceAccount = require("./ecom-website-d5555-firebase-adminsdk-fmmyd-1c0dd20a3f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// aws config
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// aws parameters
const region = "eu-west-3";
const bucketName = "ecom-fmt";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

// init s3
const s3 = new aws.S3();

// generate upload link
async function generateUrl(){
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);

    const imageName = `${id}${date.getTime()}.jpg`;

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300, //300 ms
        ContentType: 'image/jpeg'
    })
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}

// declare static path

let staticPath = path.join(__dirname, "Public",)

// initializing express

const app = express();

// middlewares

app.use(express.static(staticPath));
app.use(express.json());

// routes
// home route
app.get("/", (req,res) => {
    res.sendFile(path.join(staticPath, "index.html"));
});


// signup route
app.get("/signup", (req,res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
});

app.post('/signup', (req,res) => {
    let { name, username, email, password, number, tnc, notify} = req.body;

    // form validation
    if(!name.length){
       return res.json({'alert': 'enter your name'})
    } else if(name.length < 3){
        return res.json({'alert': 'name must be 3 letters long'});
    } else if(username.length < 3){
        return res.json({'alert': 'Username must be 3 letters long'});
    } else if(!email.length){
        return res.json({'alert': 'enter your email'});
    } else if(password.length < 8){
        return res.json({'alert': 'password should be 8 characters long'});
    }else if(!number.length){
        return res.json({'alert': 'enter your phone number'});
    }else if(!Number(number)){
        return res.json({'alert': 'Please enter a valid phone number'});
    } else if (!tnc ){
        return res.json({'alert': 'You must agree to our terms and conditions'});
    }
    
    // save user in db
    db.collection('users').doc(email).get()
    .then(user => {
        if(user.exists){
            return res.json({'alert': 'email already exists'});
        } else {
            // encrypt the password before storing
            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(password, salt, (err,hash) => {
                    req.body.password = hash;
                    db.collection('users').doc(email).set(req.body)
                    .then(data => {
                        res.json({
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
                            seller: req.body.seller,
                        })
                    })
                })
            })
        }
    })

})

// seller routes
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) => {
    let { name, about, address, number, tnc, legit, email } = req.body;
    if (!name.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
        return res.json({'alert': 'some information(s) are invalid'});
    } else if (!tnc || !legit) {
        return res.json({'alert': 'agree to our terms and conditions to proceed'});
    } else {
        // update users tab to seller
        db.collection('sellers').doc(email).set(req.body)
        .then(data => {
            db.collection('users').doc(email).update({
                seller: true
            }) .then(data => {
                res.json(true);
            })
        })
    }
})

// login route

app.get('/login', (req,res) => {
    res.sendFile(path.join(staticPath, "login.html"))
})

app.post('/login', (req,res) => {
    let {email, password} = req.body;
    // validation
    if(!email.length || !password.length){
        return res.json({'alert': 'fill in login details'});
    } 
    // validate in database
    db.collection('users').doc(email).get()
    .then(user => {
        if(!user.exists){ // if email doesn't exist
            return res.json({'alert': "Account doesn't exists"});
        } else {
            // encrypt the password before storing
            bcrypt.compare(password, user.data().password, (err, result) => {
                if (result) {
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        seller: data.seller
                    })
                } else {
                    return res.json({'alert': 'incorrect password'});
                }
            })
        }
    })
})

// add product
app.get('/add-product', (req,res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"))
})

app.get('/add-product/:id', (req,res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"))
})

// get upload link
app.get('/s3url', (req, res) => {
    generateUrl().then(url => res.json(url));
})

// add product
app.post('/add-product', (req, res) => {
    let {name, shortDes, des, images, sizes, actPrice, disc, sellPrice, stock, tags, tnc, email, draft, id} = req.body;

    // validation
    if (!draft) {
        if (!name.length) {
            productName.classList.add('warn');
            productName.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'enter product name'});
        } else if (shortDes.length > 100 || shortDes.length < 10) {
           shortLine.classList.add('warn');
           shortLine.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'snippet must be between 10 and 100 letters long'});
        } else if (!des.length) {
            des.classList.add('warn');
            des.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'enter detailed description about the product'});
        } else if (!images.length) { // image link array
            pictures.classList.add('warn');
            pictures.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'upload at least one product image'});
        } else if (!sizes.length) { // size array
            sizeSelector.classList.add('warn');
            sizeSelector.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'select at least one size'});
        } else if (!actPrice.length || !disc.length || !sellPrice.length) {
            actualPrice.classList.add('warn');
            sellingPrice.classList.add('warn');
            actualPrice.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'you must add pricings'});
        } else if (stock < 20) {
            stock.classList.add('warn');
            stock.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'you must have at least 20 items in stock'});
        } else if (!tags.length) {
            tags.classList.add('warn');
            tags.scrollIntoView({behavior: 'smooth'});
            return res.json({'alert':'enter few tags to help ranking your product in search'});
        } else if (!tnc) {
            return res.json({'alert':'you must agree to our terms and conditions'});
        }
    } else {
        
    }

    // add product
    let docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}` : id;
    db.collection('products').doc(docName).set(req.body)
    .then(data => {
        res.json({'product': name});
    })
    .catch(err => {
        return res.json({'alert': 'some error occured. Try again'});
    })
})

// get products
app.post('/get-products', (req, res) => {
    let { email, id, tag } = req.body;

    if (id) {
        docRef = db.collection('products').doc(id)
    } else if (tag) {
        docRef = db.collection('products').where('tags', 'array-contains', tag)
    } else {
        docRef = db.collection('products').where('email', '==', email)
    }

    docRef.get()
    .then(products => {
        if (products.empty) {
            return res.json('no products');
        }
        let productArr = [];
        if (id) {
            return res.json(products.data());
        } else {
            products.forEach(item => {
            let data = item.data();
            data.id = item.id;
            productArr.push(data);
        })
        res.json(productArr);
        }
    })
    .catch(error => {
        console.log('Error getting products:' + error);
        res.status(500).json('An error occurred while retrieving products');
    });
})

app.post('/delete-product', (req, res) => {
    let {id} = req.body;

    db.collection('products').doc(id).delete()
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json('err');
    })
})

// product page
app.get('/product/:id', (req,res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})

app.get('/search/:key', (req,res) => {
    res.sendFile(path.join(staticPath, "search.html"));
})

app.get('/cart', (req, res) => {
    res.sendFile(path.join(staticPath, "cart.html"));
})

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(staticPath, "checkout.html"));
})

app.post('/order', (req, res) => {
    const { order, email, add } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'abafonijessejackson2@gmail.com',
            pass: 'upxwqnavgybnhajh'
        }
    })

    const mailOption = {
        from: `abafonijessejackson2@gmail.com`,
        to: email,
        subject: 'Clothing : Order Placed',
        html: `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>Ecomm</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body{
                            min-height: 90vh;
                            background: #f5f5f5;
                            font-family: sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
    
                        }
                        .heading{
                            text-align: center;
                            font-size: 40px;
                            width: 50%;
                            display: block;
                            line-height: 50px;
                            margin: 30px auto 60px;
                            text-transform: capitalize;
                        }
                        .heading span{
                            font-weight: 500;
                        }
                        .btn{
                            width: 200px;
                            height: 50px;
                            border-radius: 5px;
                            background: #3f3f3f;
                            color: #fff;
                            display: block;
                            margin: auto;
                            font-size: 18px;
                            text-transform: capitalize;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <h1 class="heading">dear ${email.split('@')[0]}, <span>your order has successfully been placed</span></h1>
                        <button class="btn">check status</button>
                    </div>
                </body>
            </html>
        `
    }
    

    let docName = email + Math.floor(Math.random() * 12345678912345);
    db.collection('order').doc(docName).set(req.body)
    .then(data => {

        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                res.json({'alert': 'your order could not be placed. Try Again!'});;
            } else {
                res.json({'alert': 'your order has been placed'});
            }
        })

    })
})

// 404 route
app.get('/404', (req,res) => {
    res.sendFile(path.join(staticPath, "404.html"));
})
app.use((req,res) => {
    res.redirect('/404');
})

// listen for port name
app.listen(3001, '0.0.0.0', () => {
    console.log('listening on port 3001........')
})