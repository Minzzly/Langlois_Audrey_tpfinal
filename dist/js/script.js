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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3Qgc2Nyb2xsQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9vdGVyIC5tYXRlcmlhbC1pY29ucycpO1xyXG5cclxuICAgIHNjcm9sbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbFRvVG9wKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxUb1RvcCgpIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsKHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICBiZWhhdmlvcjpcInNtb290aFwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbml0REIgPSBuZXcgTW92aWVEQigpO1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5zZWFyY2goXCJmaWNoZS1maWxtLmh0bWxcIikgPiAwKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24pLnNlYXJjaFBhcmFtcztcclxuICAgICAgICBpbml0REIucmVxdWVzdEluZm9GaWxtKHBhcmFtcy5nZXQoXCJpZFwiKSk7XHJcbiAgICAgICAgaW5pdERCLnJlcXVldGVBY3RldXIocGFyYW1zLmdldChcImlkXCIpKTtcclxuXHJcbiAgICAgICAgdmFyIG15U3dpcGVyID0gbmV3IFN3aXBlcignLnN3aXBlci0yJywge1xyXG5cclxuICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAgICAgZ3JhYkN1cnNvcjogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gUmVzcG9uc2l2ZSBicmVha3BvaW50c1xyXG4gICAgICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICAgICAgMzc1OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzgwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgMTAwMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAzMFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgICAgIGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaW5pdERCLnJlcXVldGVGaWxtc1BvcHVsYWlyZXMoKTtcclxuICAgICAgICBpbml0REIucmVxdWV0ZUZpbG1zTm90ZSgpO1xyXG5cclxuICAgICAgICB2YXIgbXlTd2lwZXIgPSBuZXcgU3dpcGVyKCcuc3dpcGVyJyx7XHJcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIFJlc3BvbnNpdmUgYnJlYWtwb2ludHNcclxuICAgICAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgIDM3NToge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAzMFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc4MDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAzMFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDEwMDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMzBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5jbGFzcyBNb3ZpZURCIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZXcgTW92aWVEQigpJyk7XHJcbiAgICAgICAgdGhpcy5hcHBpS2V5ID0gJ2VkZmMwZDhhMTdmMGU3ZDczNzQ5NzM1MDViZmFlZGM4JztcclxuICAgICAgICB0aGlzLmxhbmcgPSAnZnItQ0EnO1xyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zLyc7XHJcbiAgICAgICAgdGhpcy5pbWdQYXRoID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wLyc7XHJcbiAgICAgICAgdGhpcy50b3RhbGVGaWxtUG9wdWxhaXJlID0gOTtcclxuICAgICAgICB0aGlzLnRvdGFsZUZpbG1Ob3RlID0gNjtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKCkge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgdGhpcy5yZXRvdXJSZXF1ZXRlRmlsbXNQb3B1bGFpcmVzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdGhpcy5iYXNlVVJMICsgJ21vdmllL3BvcHVsYXI/YXBpX2tleT0nICsgdGhpcy5hcHBpS2V5ICsgJyZsYW5ndWFnZT0nICsgdGhpcy5sYW5nICsgJyZwYWdlPTEnKVxyXG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91clJlcXVldGVGaWxtc1BvcHVsYWlyZXMoZXZlbnQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCfDp2EgbWFyY2hlJyk7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLnJlc3VsdHM7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB0aGlzLmFmZmljaGVGaWxtc1BvcHVsYWlyZXMoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWZmaWNoZUZpbG1zUG9wdWxhaXJlcyhkYXRhKSB7XHJcbiAgICAgICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlckZpbG1Qb3B1bGFpcmVzXCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG90YWxlRmlsbVBvcHVsYWlyZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YVtpXS50aXRsZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YVtpXS5vdmVydmlldyk7XHJcbiAgICAgICAgICAgIGxldCBhcnRpY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWxtUG9wdWxhaXJlXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgYXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDNcIikuaW5uZXJIVE1MID0gZGF0YVtpXS50aXRsZVxyXG4gICAgICAgICAgICBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCIubm90ZUZpbG0gcFwiKS5pbm5lckhUTUwgPSBkYXRhW2ldLnZvdGVfYXZlcmFnZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcmMgPSB0aGlzLmltZ1BhdGggKyBcInc1MDBcIiArIGRhdGFbaV0ucG9zdGVyX3BhdGg7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IGFydGljbGUucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcclxuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhW2ldLnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGFydGljbGUucXVlcnlTZWxlY3RvcihcImFcIikuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcImZpY2hlLWZpbG0uaHRtbD9pZD1cIiArIGRhdGFbaV0uaWQpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoYXJ0aWNsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcXVldGVGaWxtc05vdGUoKSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCB0aGlzLnJldG91clJlcXVldGVGaWxtc05vdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB0aGlzLmJhc2VVUkwgKyAnbW92aWUvdG9wX3JhdGVkP2FwaV9rZXk9JyArIHRoaXMuYXBwaUtleSArICcmbGFuZ3VhZ2U9JyArIHRoaXMubGFuZyArICcmcGFnZT0xJylcclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXRvdXJSZXF1ZXRlRmlsbXNOb3RlKGV2ZW50KXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCfDp2EgbWFyY2hlJyk7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLnJlc3VsdHM7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgdGhpcy5hZmZpY2hlRmlsbXNOb3RlKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVGaWxtc05vdGUoZGF0YSl7XHJcbiAgICAgICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbG1zTm90ZXIgLndyYXBwZXJcIik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b3RhbGVGaWxtTm90ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YVtpXS50aXRsZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YVtpXS5vdmVydmlldyk7XHJcbiAgICAgICAgICAgIGxldCBhcnRpY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWxtTm90ZXJcIikuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJoM1wiKS5pbm5lckhUTUwgPSBkYXRhW2ldLnRpdGxlO1xyXG4gICAgICAgICAgICBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCIubm90ZUZpbG0gcFwiKS5pbm5lckhUTUwgPSBkYXRhW2ldLnZvdGVfYXZlcmFnZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcmMgPSB0aGlzLmltZ1BhdGggKyBcInc1MDBcIiArIGRhdGFbaV0ucG9zdGVyX3BhdGg7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IGFydGljbGUucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcclxuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhW2ldLnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGFydGljbGUucXVlcnlTZWxlY3RvcihcImFcIikuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcImZpY2hlLWZpbG0uaHRtbD9pZD1cIiArIGRhdGFbaV0uaWQpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoYXJ0aWNsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RJbmZvRmlsbShtb3ZpZUlkKSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCB0aGlzLnJldG91clJlcXVlc3RJbmZvRmlsbS5iaW5kKHRoaXMpKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHRoaXMuYmFzZVVSTCArIFwibW92aWUvXCIgKyBtb3ZpZUlkICsgXCI/YXBpX2tleT1cIiArIHRoaXMuYXBwaUtleSArICcmbGFuZ3VhZ2U9JyArIHRoaXMubGFuZylcclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXRvdXJSZXF1ZXN0SW5mb0ZpbG0oZXZlbnQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCfDp2EgbWFyY2hlJyk7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIHRoaXMuYWZmaWNoZUluZm9GaWxtKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVJbmZvRmlsbShkYXRhKSB7XHJcbiAgICAgICAgLy9yZXF1ZXRlIGFjdGV1cigpXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImg0XCIpLmlubmVySFRNTCA9IGRhdGEudGl0bGU7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hbm5lZSAudGV4dGVBbm5lXCIpLmlubmVySFRNTCA9IGRhdGEucmVsZWFzZV9kYXRlO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHVyZWUgLnRleHRlRHVyZWVcIikuaW5uZXJIVE1MID0gZGF0YS5ydW50aW1lICsgXCJtaW5cIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxhbmd1ZSAudGV4dGVMYW5ndWVcIikuaW5uZXJIVE1MID0gZGF0YS5vcmlnaW5hbF9sYW5ndWFnZTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1ZGdldCAudGV4dGVCdWRnZXRcIikuaW5uZXJIVE1MID0gZGF0YS5idWRnZXQgKyBcIiRcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5vdGVGaWxtIHBcIikuaW5uZXJIVE1MID0gZGF0YS52b3RlX2F2ZXJhZ2U7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWNldHRlIC50ZXh0ZVJlY2V0dGVcIikuaW5uZXJIVE1MID0gZGF0YS5yZXZlbnVlICsgXCIkXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvblwiKS5pbm5lckhUTUwgPSBkYXRhLm92ZXJ2aWV3IHx8IFwiQXVjdW5lIGRlc2NyaXB0aW9uIG4nZXN0IGRpc3BvbmlibGUuXCI7XHJcblxyXG4gICAgICAgIGxldCBzcmMgPSB0aGlzLmltZ1BhdGggKyBcInc1MDBcIiArIGRhdGEucG9zdGVyX3BhdGg7XHJcbiAgICAgICAgbGV0IGltYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5pbmZvUHJpbmNpcGFsRmlsbSBpbWdcIik7XHJcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGEudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVldGVBY3RldXIobW92aWVJZCl7XHJcbiAgICAgICAgLy9HRVQgQ3JlZGl0cyhtb3ZpZWRiKS1yZXF1ZXRlIEFKQVhcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIHRoaXMucmV0b3VyUmVxdWV0ZUFjdGV1ci5iaW5kKHRoaXMpKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIix0aGlzLmJhc2VVUkwgKyBcIm1vdmllL1wiICsgbW92aWVJZCArIFwiL2NyZWRpdHM/YXBpX2tleT1cIiArIHRoaXMuYXBwaUtleSk7XHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICByZXRvdXJSZXF1ZXRlQWN0ZXVyKGV2ZW50KXtcclxuICAgICAgICAvL0ZhaXJlIGF0dGVudGlvbiBhdSBKU09OLi4uaWwgbid5IGEgcGFzIGRlIHJlc3VsdGF0c1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhc3QpO1xyXG4gICAgICAgIHRoaXMuYWZmaWNoZUFjdGV1cihkYXRhKTtcclxuICAgIH1cclxuICAgIGFmZmljaGVBY3RldXIoZGF0YSl7XHJcbiAgICAgICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlckFjdGV1cnNcIik7XHJcbiAgICAgICAgLy9ib3VjbGUgcG91ciBhZmZpY2hlciB0b3VzIGxlcyBhY3RldXIgYXZlYyB1biBjbG9uZU5vZGVcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuY2FzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgYXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0ZXVyXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgYXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiLm5vbVwiKS5pbm5lckhUTUwgPSBkYXRhLmNhc3RbaV0ubmFtZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcmMgPSB0aGlzLmltZ1BhdGggKyBcInc1MDBcIiArIGRhdGEuY2FzdFtpXS5wcm9maWxlX3BhdGggO1xyXG4gICAgICAgICAgICBpZihkYXRhLmNhc3RbaV0ucHJvZmlsZV9wYXRoPT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHNyYyA9IFwiaW1hZ2VzL2ltYWdlLXRlbXAuanBnXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCIuYWN0ZXVyIGltZ1wiKTtcclxuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhLmNhc3QudGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZChhcnRpY2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4iXSwiZmlsZSI6InNjcmlwdC5qcyJ9
