$(document).ready(function () {
    /**
     * Creare un layout base con una searchbar (una input e un button) in cui possiamo scriverecompletamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
     * Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 
            Titolo
            Titolo Originale
            Lingua Originale
            Voto (media)
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

        // prendo valore dall'input
        var search = inputSearch.val();
        // richiamo function api
        searchMovie(template, search, movieContainer);
        // reset input
        inputSearch.val('');
    });

    // send message with enter 
    inputSearch.keyup(function (e) { 
        if(e.which == 13 || e.keycode == 13) {

            // prendo valore dall'input
            var search = inputSearch.val();
             // richiamo function api
            searchMovie(template, search, movieContainer);
            // reset input
            inputSearch.val('');
        }
    });

}); // <-- End Doc Ready


/**
 * Function
 */

function searchMovie(template, input, addHtml) {

    addHtml.html('');
    // richiamo api
    $.ajax ({
        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
            api_key: '6fafa94922a93eb4871222ee2c1df6c9',
            query: input.trim(),
            language: 'it-IT'
        },
        success: function(res) {
            var risultati = res.results;

            for (var i = 0; i < risultati.length; i++) {
                var risultatiRicerca = risultati[i];
                
                // template date
                var movie = {
                    Titolo: risultatiRicerca.title,
                    TitoloOriginale: risultatiRicerca.original_title,
                    LinguaOriginale: risultatiRicerca.original_language,
                    Voto: risultatiRicerca.vote_average
                }  
    
                var html = template(movie);
                addHtml.append(html);
            }
        },
        error: function() {
            addHtml.append('Nessun Risultato');
            }
        }
)}