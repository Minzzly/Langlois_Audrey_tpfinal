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
        console.log(data);
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
        request.addEventListener('loadend', this.retourRequeteFilmsPopulaires.bind(this));
        request.open('GET', this.baseURL + 'movie/popular?api_key=' + this.appiKey + '&language=' + this.lang + '&page=1')
        request.send();
    }
    retourRequeteActeur(){
        //Faire attention au JSON...il n'y a pas de results
    }
    afficheActeur(){
        //boucle pour afficher tous les acteur avec un cloneNode
    }
}


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3Qgc2Nyb2xsQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9vdGVyIC5tYXRlcmlhbC1pY29ucycpO1xyXG5cclxuICAgIHNjcm9sbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbFRvVG9wKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzY3JvbGxUb1RvcCgpIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsKHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICBiZWhhdmlvcjpcInNtb290aFwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbml0REIgPSBuZXcgTW92aWVEQigpO1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5zZWFyY2goXCJmaWNoZS1maWxtLmh0bWxcIikgPiAwKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24pLnNlYXJjaFBhcmFtcztcclxuICAgICAgICBpbml0REIucmVxdWVzdEluZm9GaWxtKHBhcmFtcy5nZXQoXCJpZFwiKSk7XHJcbiAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluaXREQi5yZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKCk7XHJcbiAgICAgICAgaW5pdERCLnJlcXVldGVGaWxtc05vdGUoKTtcclxuXHJcbiAgICAgICAgdmFyIG15U3dpcGVyID0gbmV3IFN3aXBlcignLnN3aXBlcicse1xyXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICBncmFiQ3Vyc29yOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBSZXNwb25zaXZlIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAzNzU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMzBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3ODA6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMzBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAxMDAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY2xhc3MgTW92aWVEQiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbmV3IE1vdmllREIoKScpO1xyXG4gICAgICAgIHRoaXMuYXBwaUtleSA9ICdlZGZjMGQ4YTE3ZjBlN2Q3Mzc0OTczNTA1YmZhZWRjOCc7XHJcbiAgICAgICAgdGhpcy5sYW5nID0gJ2ZyLUNBJztcclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy8nO1xyXG4gICAgICAgIHRoaXMuaW1nUGF0aCA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC8nO1xyXG4gICAgICAgIHRoaXMudG90YWxlRmlsbVBvcHVsYWlyZSA9IDk7XHJcbiAgICAgICAgdGhpcy50b3RhbGVGaWxtTm90ZSA9IDY7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWV0ZUZpbG1zUG9wdWxhaXJlcygpIHtcclxuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIHRoaXMucmV0b3VyUmVxdWV0ZUZpbG1zUG9wdWxhaXJlcy5iaW5kKHRoaXMpKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHRoaXMuYmFzZVVSTCArICdtb3ZpZS9wb3B1bGFyP2FwaV9rZXk9JyArIHRoaXMuYXBwaUtleSArICcmbGFuZ3VhZ2U9JyArIHRoaXMubGFuZyArICcmcGFnZT0xJylcclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXRvdXJSZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKGV2ZW50KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnw6dhIG1hcmNoZScpO1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KS5yZXN1bHRzO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgdGhpcy5hZmZpY2hlRmlsbXNQb3B1bGFpcmVzKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVGaWxtc1BvcHVsYWlyZXMoZGF0YSkge1xyXG4gICAgICAgIGxldCBzZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXJGaWxtUG9wdWxhaXJlc1wiKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvdGFsZUZpbG1Qb3B1bGFpcmU7IGkrKykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0udGl0bGUpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0ub3ZlcnZpZXcpO1xyXG4gICAgICAgICAgICBsZXQgYXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsbVBvcHVsYWlyZVwiKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGFydGljbGUucXVlcnlTZWxlY3RvcihcImgzXCIpLmlubmVySFRNTCA9IGRhdGFbaV0udGl0bGVcclxuICAgICAgICAgICAgYXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiLm5vdGVGaWxtIHBcIikuaW5uZXJIVE1MID0gZGF0YVtpXS52b3RlX2F2ZXJhZ2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3NTAwXCIgKyBkYXRhW2ldLnBvc3Rlcl9wYXRoO1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XHJcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpO1xyXG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YVtpXS50aXRsZSk7XHJcblxyXG4gICAgICAgICAgICBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTtcclxuXHJcblxyXG4gICAgICAgICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGFydGljbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXRlRmlsbXNOb3RlKCkge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgdGhpcy5yZXRvdXJSZXF1ZXRlRmlsbXNOb3RlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdGhpcy5iYXNlVVJMICsgJ21vdmllL3RvcF9yYXRlZD9hcGlfa2V5PScgKyB0aGlzLmFwcGlLZXkgKyAnJmxhbmd1YWdlPScgKyB0aGlzLmxhbmcgKyAnJnBhZ2U9MScpXHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZUZpbG1zTm90ZShldmVudCl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnw6dhIG1hcmNoZScpO1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KS5yZXN1bHRzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuYWZmaWNoZUZpbG1zTm90ZShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlRmlsbXNOb3RlKGRhdGEpe1xyXG4gICAgICAgIGxldCBzZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWxtc05vdGVyIC53cmFwcGVyXCIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG90YWxlRmlsbU5vdGU7IGkrKykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0udGl0bGUpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0ub3ZlcnZpZXcpO1xyXG4gICAgICAgICAgICBsZXQgYXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsbU5vdGVyXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgYXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDNcIikuaW5uZXJIVE1MID0gZGF0YVtpXS50aXRsZTtcclxuICAgICAgICAgICAgYXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiLm5vdGVGaWxtIHBcIikuaW5uZXJIVE1MID0gZGF0YVtpXS52b3RlX2F2ZXJhZ2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3NTAwXCIgKyBkYXRhW2ldLnBvc3Rlcl9wYXRoO1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XHJcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpO1xyXG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YVtpXS50aXRsZSk7XHJcblxyXG4gICAgICAgICAgICBhcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTtcclxuXHJcblxyXG4gICAgICAgICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGFydGljbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0SW5mb0ZpbG0obW92aWVJZCkge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgdGhpcy5yZXRvdXJSZXF1ZXN0SW5mb0ZpbG0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB0aGlzLmJhc2VVUkwgKyBcIm1vdmllL1wiICsgbW92aWVJZCArIFwiP2FwaV9rZXk9XCIgKyB0aGlzLmFwcGlLZXkgKyAnJmxhbmd1YWdlPScgKyB0aGlzLmxhbmcpXHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWVzdEluZm9GaWxtKGV2ZW50KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnw6dhIG1hcmNoZScpO1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB0aGlzLmFmZmljaGVJbmZvRmlsbShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlSW5mb0ZpbG0oZGF0YSkge1xyXG4gICAgICAgIC8vcmVxdWV0ZSBhY3RldXIoKVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoNFwiKS5pbm5lckhUTUwgPSBkYXRhLnRpdGxlO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYW5uZWUgLnRleHRlQW5uZVwiKS5pbm5lckhUTUwgPSBkYXRhLnJlbGVhc2VfZGF0ZTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmR1cmVlIC50ZXh0ZUR1cmVlXCIpLmlubmVySFRNTCA9IGRhdGEucnVudGltZSArIFwibWluXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sYW5ndWUgLnRleHRlTGFuZ3VlXCIpLmlubmVySFRNTCA9IGRhdGEub3JpZ2luYWxfbGFuZ3VhZ2U7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idWRnZXQgLnRleHRlQnVkZ2V0XCIpLmlubmVySFRNTCA9IGRhdGEuYnVkZ2V0ICsgXCIkXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ub3RlRmlsbSBwXCIpLmlubmVySFRNTCA9IGRhdGEudm90ZV9hdmVyYWdlO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVjZXR0ZSAudGV4dGVSZWNldHRlXCIpLmlubmVySFRNTCA9IGRhdGEucmV2ZW51ZSArIFwiJFwiO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25cIikuaW5uZXJIVE1MID0gZGF0YS5vdmVydmlldyB8fCBcIkF1Y3VuZSBkZXNjcmlwdGlvbiBuJ2VzdCBkaXNwb25pYmxlLlwiO1xyXG5cclxuICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3NTAwXCIgKyBkYXRhLnBvc3Rlcl9wYXRoO1xyXG4gICAgICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb1ByaW5jaXBhbEZpbG0gaW1nXCIpO1xyXG4gICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpO1xyXG4gICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhLnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXRlQWN0ZXVyKG1vdmllSWQpe1xyXG4gICAgICAgIC8vR0VUIENyZWRpdHMobW92aWVkYiktcmVxdWV0ZSBBSkFYXHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCB0aGlzLnJldG91clJlcXVldGVGaWxtc1BvcHVsYWlyZXMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB0aGlzLmJhc2VVUkwgKyAnbW92aWUvcG9wdWxhcj9hcGlfa2V5PScgKyB0aGlzLmFwcGlLZXkgKyAnJmxhbmd1YWdlPScgKyB0aGlzLmxhbmcgKyAnJnBhZ2U9MScpXHJcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICByZXRvdXJSZXF1ZXRlQWN0ZXVyKCl7XHJcbiAgICAgICAgLy9GYWlyZSBhdHRlbnRpb24gYXUgSlNPTi4uLmlsIG4neSBhIHBhcyBkZSByZXN1bHRzXHJcbiAgICB9XHJcbiAgICBhZmZpY2hlQWN0ZXVyKCl7XHJcbiAgICAgICAgLy9ib3VjbGUgcG91ciBhZmZpY2hlciB0b3VzIGxlcyBhY3RldXIgYXZlYyB1biBjbG9uZU5vZGVcclxuICAgIH1cclxufVxyXG5cclxuIl0sImZpbGUiOiJzY3JpcHQuanMifQ==
