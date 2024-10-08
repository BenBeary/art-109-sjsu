document.addEventListener("DOMContentLoaded", function() {

    const projectItems = document.querySelectorAll(".project-item");

    function checkSlide() {
        projectItems.forEach((projectItem) => {

            const slideInAt = window.scrollY + window.innerHeight - projectItem.clientHeight/2;

            const itemBottom = projectItem.offsetTop + projectItem.clientHeight;

            const isHalfShown = slideInAt > projectItem.offsetTop;
            const isNotScrolledPast = window.scrollY < itemBottom;


            if(isHalfShown && isNotScrolledPast){
                projectItem.classList.add("slide-in")
            } else {
                projectItem.classList.remove("slide-in")
            }

        })
    }

    window.addEventListener("scroll", checkSlide);
    window.addEventListener("resize", checkSlide);

    checkSlide();

});