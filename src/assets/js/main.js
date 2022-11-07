const api_url = "https://api.punkapi.com/v2/beers?page=2&per_page=80";
const newBeers = document.getElementById("newbeers");
const gallery = document.querySelector('.productcont');
const addtocartBtns = document.getElementsByClassName('addtocart');
let apiData = [];
let lastBeer = 0;
let output = "";

window.onload = () => {
    loadBeers();
    addListeners();
}


addListeners = function () {
    for (var i = 0; i < addtocartBtns.length; i++) {
        addtocartBtns[i].addEventListener('click', function() {addToCart(this);});
    }
}
addToCart = function(elem){
    
}

//Laddar in API till apiData så att fetch inte körs mer än en gång och uppdaterar sidan
loadBeers = function () {
    fetch(api_url)
        .then(res => res.json())
        .then(data => {
            apiData = data;
            getBeers();
        })
}

//Hämtar data från apiData och visar på skärmen. Använder finalBeer för att minnas var loopen slutade och fortsätter därifrån för att få nya öl
getBeers = function () {
    if (lastBeer === apiData.length -1) {
        lastBeer = 0;
    }
    let beerName, beerImg, beerDescription, beerPrice, beerVolume, finalBeer;
    finalBeer = lastBeer + 12;
    for (i = lastBeer; i < finalBeer; i++) {
        try{
        beerName = apiData[i].name;
        beerImg = apiData[i].image_url;
        beerDescription = apiData[i].description;
        beerPrice = apiData[i].ebc;
        beerVolume = apiData[i].volume;
        lastBeer = i;
        }
        catch(TypeError)
        {
            lastBeer=0;
        }
        output += `<div class="product">
                <h3 class="productname">${beerName}</h3>
                <p class="description">${beerDescription}</p>
                <img src="${beerImg}" alt="a beer">
                <p class="price">$${beerPrice}</p>
                <p class="volume">${beerVolume.value} ${beerVolume.unit}</p>
                <button class="addtocart">Add To Cart</button>
                </div>
                `;
        gallery.innerHTML = output;
        addListeners();
    };

};

//Hämtar nya öl utan att sidan hämtas igen
newBeers.addEventListener("click", function () {
    gallery.innerHTML = "";
    output = "";
    getBeers();
})


