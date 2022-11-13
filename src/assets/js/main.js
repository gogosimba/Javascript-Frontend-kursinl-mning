const api_url = "https://api.punkapi.com/v2/beers?page=2&per_page=80";
const api_random = "https://api.punkapi.com/v2/beers/random"
const newBeers = document.getElementById("newbeers");
const randomBeer = document.getElementById("randombeer")
const emptycart = document.getElementById("emptycart");
const gallery = document.querySelector(".productcont");
const addtocartBtns = document.getElementsByClassName("addtocart");
let apiData = [];
let beerNumber = 21;
let lastBeer = 0;
let cartOutput = document.getElementById('carttable');
let output = "";

window.onload = () => {
    loadBeers();
    addListeners();
    updateCart();
}

//Loopar igenom alla addtocart buttons och ger de en listener.
addListeners = function () {
    for (var i = 0; i < addtocartBtns.length; i++) {
        addtocartBtns[i].addEventListener('click', function () { addToCart(this); });
    }
}

//Hämtar data och sparar den i en lokal array
loadBeers = function () {
    fetch(api_url)
        .then(res => res.json())
        .then(beers => {
            apiData = beers;
            getBeers();
        })
}

//Hämtar data från apiData och visar på skärmen. Använder finalBeer för att minnas var loopen slutade och fortsätter därifrån för att få nya öl
getBeers = function () {
    if (lastBeer === apiData.length - 1) {
        lastBeer = 0;
    }
    let beerName, beerImg, beerDescription, beerPrice, beerVolume, finalBeer;
    finalBeer = lastBeer + beerNumber;
    for (i = lastBeer; i < finalBeer; i++) {
        //Försöker fånga ett error om API'et tar slut under loopen och sätter då lastBeer till 0 och börjar om från början.
        try {
            beerName = apiData[i].name;
            beerImg = apiData[i].image_url;
            beerDescription = apiData[i].description;
            beerPrice = apiData[i].ebc;
            beerVolume = apiData[i].volume;
            beerTips = apiData[i].brewers_tips;
            lastBeer = i;
        }
        catch (TypeError) {
            lastBeer = 0;
        }
        output += `<div class="product">
                <h3 class="productname">${beerName}</h3>
                <p class="description">${beerDescription}</p>
                <img src="${beerImg}" alt="a beer">
                <p class="price">$${beerPrice}</p>
                <p class="volume">${beerVolume.value} ${beerVolume.unit}</p>
                <p class="tips">${beerTips}</p>
                <button class="addtocart">Add To Cart</button>
                </div>
                `;
        gallery.innerHTML = output;
        addListeners();
    };

};

//Hämtar nya öl
newBeers.addEventListener("click", function () {
    gallery.innerHTML = "";
    output = "";
    getBeers();
})

randomBeer.addEventListener("click", function (randomData) {
    generateBeer();
})

//Kör fetch först och kör sedan displayRandomBeer när fetch är färdigt. 
generateBeer = function () {
    fetch(api_random)
        .then(res => res.json())
        .then(data => {
            displayRandomBeer(data)
        })
}

displayRandomBeer = function (data) {
    
    beerName = data[0].name;
    beerImg = data[0].image_url;
    beerDescription = data[0].description;
    beerPrice = data[0].ebc;
    beerVolume = data[0].volume;
    
    //I vissa fall returneras ingen bild/pris och då får jag 404 error, detta fungerade bättre än try and catch.
    if(beerImg == null)
    {
        beerImg = "https://image.ibb.co/cK8ghx/pexels_photo_681847_1.jpg";
    }
    else if(beerPrice == null)
    {
        beerPrice = 1;
    }
    output = "";
    output += `<div class="product">
    <h3 class="productname">${beerName}</h3>
    <p class="description">${beerDescription}</p>
    <img src="${beerImg}" alt="a beer">
    <p class="price">$${beerPrice}</p>
    <p class="volume">${beerVolume.value} ${beerVolume.unit}</p>
    <button class="addtocart">Add To Cart</button>
    </div>              `;
    gallery.innerHTML = output;
    addListeners();
}

addToCart = function (elem) {
    let getprice;
    let getproductName;
    let cart = [];
    let stringCart;
    //Går igenom alla siblings i 'närheten' av knappen som togs med och hittar relevant information såsom pris,produktnamn.
    while (elem = elem.previousSibling) {
        if (elem.nodeType === 3) continue; // Skippar textnoder
        if (elem.className == "price") {
            getprice = elem.innerText;
        }
        if (elem.className == "productname") {
            getproductName = elem.innerText;
        }
    }
    cartOutput.innerHTML += "<tr><td>" + getproductName + "<td>" + getprice;
    //Skapar ett objekt av produkten
    var product = {
        productname: getproductName,
        price: getprice
    };
    //Konverterar produktobjektet till JSON så de kan lagras i localstorage 
    let stringProduct = JSON.stringify(product);
    //Om cart inte finns så skapa den
    if (!localStorage.getItem('cart')) {
        cart.push(stringProduct);
        stringCart = JSON.stringify(cart);
        localStorage.setItem('cart', stringCart);
        addedToCart(getproductName);
        updateCart();
    }
    //Annars hämta ut cartdata och konvertera tillbaka den till en array
    else {
        cart = JSON.parse(localStorage.getItem('cart'));
        cart.push(stringProduct);
        stringCart = JSON.stringify(cart);
        localStorage.setItem('cart', stringCart);
        addedToCart(getproductName);
        updateCart();
    }

}

function addedToCart(pname) {
    $('#alerts').fadeIn('fast');
    var message = pname + " was added to the cart";
    var alerts = document.getElementById("alerts");
    alerts.style.visibility = "visible";
    alerts.innerHTML = message;
    if (!alerts.classList.contains("message")) {
        alerts.classList.add("message");
    }
    setTimeout(function () {
        $('#alerts').fadeOut('fast');
    }, 3000);
}

updateCart = function () {
    var total = 0;
    var price = 0;
    var items = 0;
    var productname = "";
    var carttable = "";
    if (localStorage.getItem('cart')) {
        //hämtar cart data och parsar till en array
        var cart = JSON.parse(localStorage.getItem('cart'));
        items = cart.length;
        //loopar igenom cart arrayen
        for (var i = 0; i < items; i++) {
            var x = JSON.parse(cart[i]);
            price = parseFloat(x.price.split('$')[1]);
            productname = x.productname;
            carttable += "<tr><td>" + productname + "</td><td>$" + price + "</td></tr>";
            total += price;
        }

    }

    document.getElementById("total").innerHTML = total;
    document.getElementById("carttable").innerHTML = carttable;
    document.getElementById("itemsquantity").innerHTML = items;
}
emptycart.addEventListener("click", function () {
    //Tömmer kundvagnen och rensar localstorage
    if (confirm("Are you sure you want to empty your cart?")) {
        if (localStorage.getItem('cart')) {
            localStorage.removeItem('cart');
            updateCart();
        }
    }
})