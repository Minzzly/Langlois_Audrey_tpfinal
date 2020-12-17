document.addEventListener("DOMContentLoaded", function () {
    const scrollButton = document.querySelector('footer .material-icons');

    scrollButton.addEventListener('click', scrollToTop);

    function scrollToTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior:"smooth",
        });
    }

    let initDB = new MovieDB();

    if (document.location.pathname.search("fiche-film.html") > 0) {
        let params = new URL(document.location).searchParams;
        initDB.requestInfoFilm(params.get("id"));
        initDB.requeteActeur(params.get("id"));

        var mySwiper = new Swiper('.swiper-2', {

            slidesPerView: 3,
            spaceBetween: 10,
            grabCursor: true,
            // Responsive breakpoints
            breakpoints: {
                375: {
                    slidesPerView: 1,
                    spaceBetween: 30
                },
                780: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1000: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
            },

            pagination: {
                el: '.swiper-pagination',
            }

        });
   }
    else {
        initDB.requeteFilmsPopulaires();
        initDB.requeteFilmsNote();

        var mySwiper = new Swiper('.swiper',{
            slidesPerView: 3,
            spaceBetween: 10,
            grabCursor: true,
            // Responsive breakpoints
            breakpoints: {
                375: {
                    slidesPerView: 1,
                    spaceBetween: 30
                },
                780: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1000: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
            },

            pagination: {
                el: '.swiper-pagination',
            }
        });
    }
});

class MovieDB {
    constructor() {
        console.log('new MovieDB()');
        this.appiKey = 'edfc0d8a17f0e7d7374973505bfaedc8';
        this.lang = 'fr-CA';
        this.baseURL = 'https://api.themoviedb.org/3/';
        this.imgPath = 'https://image.tmdb.org/t/p/';
        this.totaleFilmPopulaire = 9;
        this.totaleFilmNote = 6;
    }

    requeteFilmsPopulaires() {
        let request = new XMLHttpRequest();
        request.addEventListener('loadend', this.retourRequeteFilmsPopulaires.bind(this));
        request.open('GET', this.baseURL + 'movie/popular?api_key=' + this.appiKey + '&language=' + this.lang + '&page=1')
        request.send();
    }

    retourRequeteFilmsPopulaires(event) {
        //console.log('ça marche');
        let target = event.currentTarget;
        let data = JSON.parse(target.responseText).results;
        //console.log(data);
        this.afficheFilmsPopulaires(data);
    }

    afficheFilmsPopulaires(data) {
        let section = document.querySelector(".swiperFilmPopulaires");

        for (let i = 0; i < this.totaleFilmPopulaire; i++) {
            //console.log(data[i].title);
            //console.log(data[i].overview);
            let article = document.querySelector(".filmPopulaire").cloneNode(true);
            article.querySelector("h3").innerHTML = data[i].title
            article.querySelector(".noteFilm p").innerHTML = data[i].vote_average;

            let src = this.imgPath + "w500" + data[i].poster_path;
            let image = article.querySelector("img");
            image.setAttribute("src", src);
            image.setAttribute("alt", data[i].title);

            article.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);


            section.appendChild(article);
        }
    }

    requeteFilmsNote() {
        let request = new XMLHttpRequest();
        request.addEventListener('loadend', this.retourRequeteFilmsNote.bind(this));
        request.open('GET', this.baseURL + 'movie/top_rated?api_key=' + this.appiKey + '&language=' + this.lang + '&page=1')
        request.send();
    }

    retourRequeteFilmsNote(event){
        //console.log('ça marche');
        let target = event.currentTarget;
        let data = JSON.parse(target.responseText).results;
        console.log(data);
        this.afficheFilmsNote(data);
    }

    afficheFilmsNote(data){
        let section = document.querySelector(".filmsNoter .wrapper");

        for (let i = 0; i < this.totaleFilmNote; i++) {
            //console.log(data[i].title);
            //console.log(data[i].overview);
            let article = document.querySelector(".filmNoter").cloneNode(true);
            article.querySelector("h3").innerHTML = data[i].title;
            article.querySelector(".noteFilm p").innerHTML = data[i].vote_average;

            let src = this.imgPath + "w500" + data[i].poster_path;
            let image = article.querySelector("img");
            image.setAttribute("src", src);
            image.setAttribute("alt", data[i].title);

            article.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);


            section.appendChild(article);
        }
    }

    requestInfoFilm(movieId) {
        let request = new XMLHttpRequest();
        request.addEventListener('loadend', this.retourRequestInfoFilm.bind(this));
        request.open('GET', this.baseURL + "movie/" + movieId + "?api_key=" + this.appiKey + '&language=' + this.lang)
        request.send();
    }

    retourRequestInfoFilm(event) {
        //console.log('ça marche');
        let target = event.currentTarget;
        let data = JSON.parse(target.responseText);
        this.afficheInfoFilm(data);
    }

    afficheInfoFilm(data) {
        //requete acteur()
        document.querySelector("h4").innerHTML = data.title;
        document.querySelector(".annee .texteAnne").innerHTML = data.release_date;
        document.querySelector(".duree .texteDuree").innerHTML = data.runtime + "min";
        document.querySelector(".langue .texteLangue").innerHTML = data.original_language;
        document.querySelector(".budget .texteBudget").innerHTML = data.budget + "$";
        document.querySelector(".noteFilm p").innerHTML = data.vote_average;
        document.querySelector(".recette .texteRecette").innerHTML = data.revenue + "$";
        document.querySelector(".description").innerHTML = data.overview || "Aucune description n'est disponible.";

        let src = this.imgPath + "w500" + data.poster_path;
        let image = document.querySelector(".infoPrincipalFilm img");
        image.setAttribute("src", src);
        image.setAttribute("alt", data.title);
    }

    requeteActeur(movieId){
        //GET Credits(moviedb)-requete AJAX
        let request = new XMLHttpRequest();
        request.addEventListener('loadend', this.retourRequeteActeur.bind(this));
        request.open("GET",this.baseURL + "movie/" + movieId + "/credits?api_key=" + this.appiKey);
        request.send();
    }
    retourRequeteActeur(event){
        //Faire attention au JSON...il n'y a pas de resultats
        let target = event.currentTarget;
        let data = JSON.parse(target.responseText);
        console.log(data.cast);
        this.afficheActeur(data);
    }
    afficheActeur(data){
        let section = document.querySelector(".swiperActeurs");
        //boucle pour afficher tous les acteur avec un cloneNode
        for (let i = 0; i < data.cast.length; i++) {
            let article = document.querySelector(".acteur").cloneNode(true);
            article.querySelector(".nom").innerHTML = data.cast[i].name;

            let src = this.imgPath + "w500" + data.cast[i].profile_path ;
            if(data.cast[i].profile_path==null){
                src = "images/image-temp.jpg"
            }
            let image = article.querySelector(".acteur img");
            image.setAttribute("src", src);
            image.setAttribute("alt", data.cast.title);

            section.appendChild(article);
        }

    }
}

