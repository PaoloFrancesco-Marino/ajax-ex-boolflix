$(document).ready(function () {
    /**
     * Milestone 1
     * Creare un layout base con una searchbar (una input e un button) in cui possiamo scriverecompletamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
     * Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 
            Titolo
            Titolo Originale
            Lingua Originale
            Voto (media)
     */


     /**
     * Milestone 2:
        Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
        Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
        Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

        Riferimento template
        Titolo: Barnyard - Ritorno al cortile
        Titolo Originale: Back at the Barnyard
        Lingua:  (bandiera o lingua)
        Voto:  (stelle da 1 a 5)
        Tipo: Tv o Film

    */

    /**
     * Milestone 3:
        In questa milestone come prima cosa  faremo un refactor delle chiamate ajax creando un’unica funzione alla quale passeremo la url, la apy key, la query, il type, ecc… In questo modo potremo chiamare la ricerca sia con il keypress su enter che con il click.

        Poi, aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.

     */

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
        searchMovie(template, inputSearch, movieContainer);
        searchTvShows(template, inputSearch, movieContainer);
    });

    // send message with enter 
    inputSearch.keyup(function (e) { 
        if(e.which == 13 || e.keycode == 13) {
             // richiamo function api
            searchMovie(template, inputSearch, movieContainer);
            searchTvShows(template, inputSearch, movieContainer);
        }
    });

}); // <-- End Doc Ready


/**
 * Function
 */

//  fucntion search movie
function searchMovie(template, input, addHtml) {
    // reset html with function reset
    reset(addHtml);

    // prendo valore dall'input
    var search = input.val().trim();
    
    if (search !== '') {
        // richiamo api movies
        $.ajax ({
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
                api_key: '6fafa94922a93eb4871222ee2c1df6c9',
                query: search,
                language: 'it-IT'
            },
            success: function(res) {
                var risultati = res.results;

                if (risultati.length > 0 ) {
                    // richiamo function print
                    print(template, risultati, addHtml, 'Film')
                } else {
                    // alert('nessun elemento trovato'); 
                    input.select(); 
                }
    
            },
            error: function() {
                addHtml.append('Chiamata API non riuscita');
            }
        })
    } else {
        alert(' Campo Vuoto, inserire un valore di ricerca');
        input.focus(); 
    }

}


// function search tv shows
function searchTvShows(template, input, addHtml) {
    // reset html with function reset
    reset(addHtml);

    // prendo valore dall'input
    var search = input.val().trim();
    
    if (search !== '') {
        // richiamo api tv shows
        $.ajax ({
            url: 'https://api.themoviedb.org/3/search/tv',
            method: 'GET',
            data: {
                api_key: '6fafa94922a93eb4871222ee2c1df6c9',
                query: search,
                language: 'it-IT'
            },
            success: function(res) {
                var risultati = res.results;

                if (risultati.length > 0 ) {
                    // richiamo function print
                    print(template, risultati, addHtml, 'Serie TV')
                } else {
                    // alert('nessun elemento trovato');
                    input.select();
                }
    
            },
            error: function() {
                addHtml.append('Chiamata API non riuscita');
            }
        })
    } else {
        alert(' Campo Vuoto, inserire un valore di ricerca');
        input.focus(); 
    }

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

        var titolo, titoloOriginale;

        if (type == 'Film') {
            titolo = risultatiRicerca.title,
            titoloOriginale = risultatiRicerca.original_title
        } else if (type == 'Serie TV') {
            titolo = risultatiRicerca.name,
            titoloOriginale = risultatiRicerca.original_name
        }
        
        // template date
        var movie = {
            titolo: titolo,
            titoloOriginale: titoloOriginale,
            linguaOriginale: flag(risultatiRicerca.original_language),
            voto: stars(risultatiRicerca.vote_average),
            copertina: risultatiRicerca.poster_path,
            type: type
        }  
        
        // print in html
        var html = template(movie);
        addHtml.append(html);
    }
}