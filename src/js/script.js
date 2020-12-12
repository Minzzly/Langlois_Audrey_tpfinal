document.addEventListener("DOMContentLoaded", function () {


});


var mySwiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    // Responsive breakpoints
    breakpoints: {
        480: {
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
})