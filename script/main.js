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
    });

    // send message with enter 
    inputSearch.keyup(function (e) { 
        if(e.which == 13 || e.keycode == 13) {
             // richiamo function api
            searchMovie(template, inputSearch, movieContainer);
        }
    });

}); // <-- End Doc Ready


/**
 * Function
 */

function searchMovie(template, input, addHtml) {
    // reset html with function reset
    reset(addHtml);

    // prendo valore dall'input
    var search = input.val().trim();
    
    if (search !== '') {
        // richiamo api
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
                    for (var i = 0; i < risultati.length; i++) {
                        var risultatiRicerca = risultati[i];
                        
                        // template date
                        var movie = {
                            Titolo: risultatiRicerca.title,
                            TitoloOriginale: risultatiRicerca.original_title,
                            LinguaOriginale: flag(risultatiRicerca),
                            Voto: stars(risultatiRicerca.vote_average),
                            type: 'Film'
                        }  
                        
                        // print in html
                        var html = template(movie);
                        addHtml.append(html);
                    }
                } else {
                    alert('nessun film trovato');
                    input.select(); //to fix
                }
    
            },
            error: function() {
                addHtml.append('Chiamata API non riuscita');
            }
        })
    } else {
        alert(' Campo Vuoto, inserire un valore di ricerca');
        input.focus(); // to fix
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
    var finalVote = Math.floor(voto * 0.5);

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
function flag (risultatiRicerca) {
    // img bandiere
    var imgFlag = '';

    if (risultatiRicerca === 'it') {
        imgFlag = '<img src="img/it.svg" alt="italian-flag">'
    } else if (risultatiRicerca === 'en') {
        imgFlag = '<img src="img/en.svg" alt="italian-flag">'
    } else {
        imgFlag = risultatiRicerca.original_language;
        console.log(imgFlag);
    }
    return imgFlag;
}