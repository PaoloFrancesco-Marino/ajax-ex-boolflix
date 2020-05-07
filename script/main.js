$(document).ready(function () {

    //  refs
    var inputSearch = $('.input-search'); // input
    var buttonSearch = $('.button-search'); // button
    var movieContainer = $('.movie-container'); //html append

    // Init Hndlenars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // event click
    buttonSearch.click(function() {
        // richiamo function api
        search(template, inputSearch, movieContainer);
    });

    // send message with enter 
    inputSearch.keyup(function (e) { 
        if(e.which == 13 || e.keycode == 13) {
             // richiamo function api
            search(template, inputSearch, movieContainer);
        }
    });

}); // <-- End Doc Ready


/*************
 * Function
 ************/

//  fucntion search movie
function search(template, input, addHtml) {
    // reset html with function reset
    reset(addHtml);
    // refs api
    var apiKey = '6fafa94922a93eb4871222ee2c1df6c9';
    var apiLang = 'it-IT';
    // prendo valore dall'input
    var search = input.val().trim();
    
    if (search !== '') {
        // richiamo API movies
        var dataMovie = {
            url: 'https://api.themoviedb.org/3/search/movie',
            key: apiKey,
            query: search,
            lang: apiLang,
            type: 'Film'
        }
        getData(dataMovie, template, addHtml);
        // richiamo API TV Shows
        var dataTvShows = {
            url: 'https://api.themoviedb.org/3/search/tv',
            key: apiKey,
            query: search,
            lang: apiLang,
            type: 'Serie TV'
        }
        getData(dataTvShows, template, addHtml);
    } else {
        alert(' Campo Vuoto, inserire un valore di ricerca');
        input.focus(); 
    }
}

function getData(dataMovie, template, addHtml) {
    // richiamo api movies
    $.ajax ({
        url: dataMovie.url,
        method: 'GET',
        data: {
            api_key: dataMovie.key,
            query: dataMovie.query,
            language: dataMovie.lang,
        },
        success: function(res) {
            var risultati = res.results;
            
            if (risultati.length > 0 ) {
                // richiamo function print
                print(template, risultati, addHtml, dataMovie.type);
            } else {
                // alert('nessun elemento trovato'); 
                input.select(); 
            }
        },
        error: function() {
            addHtml.append('Chiamata API non riuscita');
        }
    })
}

// funcition reset elemento lista
function reset(element) {
    element.html('');
}

// stars function
function stars (voto) {
    // icone stars
    var icoStarFull = '<i class="fas fa-star"></i>';
    var icoStarEmpty = '<i class="far fa-star"></i>';
    // save the result
    var result = '';
    // range vote + math.floor
    var finalVote = Math.floor(voto / 2);
    // ciclo il voto ed aggiungo le stars
    for (var i = 0; i < 5; i++ ) {
        if (finalVote > i) {
            result = result + icoStarFull;
        } else {
            result = result + icoStarEmpty;
        }
    }
    // returtn risultato
    return result;
}

// flag change function
function flag (flagLanguage) {
    // img bandiere
    var imgFlag = '';

    if (flagLanguage === 'it') {
        imgFlag = '<img src="img/it.svg" alt="it-flag">'
    } else if (flagLanguage === 'en') {
        imgFlag = '<img src="img/en.svg" alt="en-flag">'
    } else {
        imgFlag = flagLanguage;
    }
    return imgFlag;
}

// function for print
function print(template, risultati, addHtml, type) {
    for (var i = 0; i < risultati.length; i++) {
        var risultatiRicerca = risultati[i];
        // refs
        var titolo, titoloOriginale;
        // poster
        var poster = risultatiRicerca.poster_path;
        // stampa img
        var copertinaImg = 'https://image.tmdb.org/t/p/w342'
        var noCopertina =  'img/no-poster.png'
        // stampa titolo
        if (type == 'Film') {
            titolo = risultatiRicerca.title,
            titoloOriginale = risultatiRicerca.original_title
        } else if (type == 'Serie TV') {
            titolo = risultatiRicerca.name,
            titoloOriginale = risultatiRicerca.original_name
        }
        // stampa img
        if (poster === null) {
            poster = noCopertina;
        } else {
            poster = copertinaImg + poster;
        }
        // template date
        var movie = {
            titolo: titolo,
            titoloOriginale: titoloOriginale,
            linguaOriginale: flag(risultatiRicerca.original_language),
            voto: stars(risultatiRicerca.vote_average),
            copertina: poster,
            type: type,
            trama: risultatiRicerca.overview.substring(0, 500)
        }  
        
        // print in html
        var html = template(movie);
        addHtml.append(html);
    }
}