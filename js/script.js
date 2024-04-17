document.addEventListener("DOMContentLoaded", () => {    
    let hamburger = document.querySelector('.hamburger');
    let navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', function() {
        navbar.style.display = navbar.style.display === 'block' ? 'none' : 'block';
        if(this.children[0].attributes.getNamedItem('src').value === 'images/hamburger.svg')
        {
            this.children[0].attributes.getNamedItem('src').value = 'images/times.svg';
        }
        else if(this.children[0].attributes.getNamedItem('src').value === 'images/times.svg')
        {
            this.children[0].attributes.getNamedItem('src').value = 'images/hamburger.svg';
        }
    });

    // Écoutez les changements de taille de la fenêtre
    window.addEventListener('resize', function() {
        // Vérifiez si le document correspond à la requête de média
        if (window.matchMedia('(min-width: 768px)').matches) {
            // Si le breakpoint est dépassé, vérifiez si l'élément hamburger est caché
            if (getComputedStyle(hamburger).display === 'none') {                
                navbar.style.display = 'block';
                hamburger.children[0].attributes.getNamedItem('src').value = 'images/hamburger.svg';
            }
        }
        else
        {
            navbar.style.display = 'none';
            hamburger.children[0].attributes.getNamedItem('src').value = 'images/hamburger.svg';
        }
    });
});