const api_url = "https://api.punkapi.com/v2/beers";
let output = "";
let gallery = document.querySelector('.productcont')
window.onload =() => {
            getBeers();

}

getBeers = function()
{
    let beerName,beerImg;
    let data = fetch(api_url)
        .then(res => res.json())
        .then(data => {
            data.forEach((element) => {
                beerName = element.name;
                console.log(beerName);
            output += `<div class="product">
                <h3 class="productname"${beerName}</h3>
                <p>Placeholder for api</p>
                <p class="price">$5.05</p>
                <button class="addtocart">Add To Cart</button>
                </div>
            `;
            gallery.innerHTML = output;
            });
        
        })};


