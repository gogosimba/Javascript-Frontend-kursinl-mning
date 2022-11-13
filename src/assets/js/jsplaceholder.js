const resultOutput = document.querySelector(".container");
const randomBeer = "https://api.punkapi.com/v2/beers/random";
const allPosts = "https://jsonplaceholder.typicode.com/todos/"
let beerData;
let output = "";
function request() {
    fetch(allPosts)
        .then(function (response) {
            return response.json()
        })
        .then((response) => {
            console.log(response);
            setOutput(response);
        })
}

postData = function () {
    fetch(randomBeer)
        .then(res => res.json())
        .then(data => {
            beerData = data;
            console.log(typeof beerData);
            console.log(beerData);
        })
        fetch(allPosts, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(beerData) 
        })
            .then(response => response.text())
            .then(result => { console.log(result,beerData); })
            .catch(err => { console.error(err.message); }); 
}
setOutput = function (response) {
    for (let i = 0; i < 20; i++) {
        output += `
        <p>ID: ${response[i].id}</p>
        <p>TITLE: ${response[i].title}</p>
    `;
    }
    resultOutput.innerHTML = output;
}
