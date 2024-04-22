import "./sass/mains.scss";
import hamburgerImg from "./images/hamburger.svg";
import timesImg from "./images/times.svg";
import netflixLogoImg from "./netflix-logo.png";

let i_card_carousel = [];   
let hamburger = document.querySelector('.hamburger');
let navbar = document.querySelector('.navbar');
let cardCarousels = document.querySelectorAll('.card-carousel');
let hamburgerImgChanged = false;

let breakpointSm = window.matchMedia('(min-width: 576px)');
let breakpointMd = window.matchMedia('(min-width: 768px)');
let breakpointLg = window.matchMedia('(min-width: 992px)');
let breakpointXl = window.matchMedia('(min-width: 1200px)');
let breakpointXxl = window.matchMedia('(min-width: 1400px)');
let breakpointXxxl = window.matchMedia('(min-width: 1600px)');
    


function getMaxNbActiveCards()
{
    let max_nb_active_cards = 0;

    if(breakpointXxxl.matches)
    {
        max_nb_active_cards = 6;
    }

    else if(breakpointXxl.matches)
    {
        max_nb_active_cards = 5;
    }

    else if(breakpointXl.matches)
    {
        max_nb_active_cards = 4;
    }
        
    else if(breakpointLg.matches)
    {
        max_nb_active_cards = 3;
    }
    
    else if(breakpointMd.matches)
    {
        max_nb_active_cards = 2;
    }

    else
    {
        max_nb_active_cards = 1;
    }

    return max_nb_active_cards;
}

function initIndexOfCardCarousels()
{
    for (let index = 0; index < cardCarousels.length; index++) 
    {       
        i_card_carousel.push(0);
    }
}


function initHamburger() 
{
    hamburger.addEventListener('click', function() 
    {
        navbar.style.display = navbar.style.display === 'block' ? 'none' : 'block';
        console.log("test");
        console.log(hamburger.children[0].attributes.getNamedItem('src').value == hamburgerImg);
        if(hamburger.children[0].attributes.getNamedItem('src').value == hamburgerImg)
        {
            hamburger.children[0].attributes.getNamedItem('src').value = timesImg;
        }
        else
        {
            hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
        }
        hamburgerImgChanged = true;
    });

    let img = new Image();
    img.src = hamburgerImg;
    hamburger.appendChild(img);
}

function updateHamburger()	
{
    console.log("Update hambyrger");
    if (window.matchMedia('(min-width: 768px)').matches)
    {            
        if (getComputedStyle(hamburger).display === 'none') {                
            navbar.style.display = 'block';
            hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
        }
    }

    else
    {
        navbar.style.display = 'none';
        hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
    }
}

function updateCardCarousel(index)
{        
    let cardCarousel = cardCarousels[index];
    let cards = cardCarousel.querySelectorAll('.card');
    let max_nb_active_cards = getMaxNbActiveCards();
    let nb_active_cards = 0;

    console.log(max_nb_active_cards);
    setTimeout(() => {
        max_nb_active_cards = getMaxNbActiveCards();
    }, 1000);
    cards.forEach((card) => {
        card.classList.remove('active');
    });

    if((cards.length - (i_card_carousel[index]+1)) < max_nb_active_cards)
    {
        i_card_carousel[index] = cards.length - max_nb_active_cards;
    }


    for (let i = i_card_carousel[index]; i < cards.length; i++) 
    {
        let card = cards[i];

        if(nb_active_cards < max_nb_active_cards)
        {
            card.classList.add('active');
            nb_active_cards++;
        }
    }

}

function updatePage()
{    
    if(!hamburgerImgChanged)
    {
        updateHamburger();        
    }
    else
    {
        hamburgerImgChanged = false;
    }
    for (let index = 0; index < cardCarousels.length; index++) 
    {
        updateCardCarousel(index);
    }
}

function initCardCarouselArrows(index)
{
    let cardCarousel = cardCarousels[index];
    let prev = cardCarousel.querySelector('.prev');
    let next = cardCarousel.querySelector('.next');
    let cards = cardCarousel.querySelectorAll('.card');

    
    prev.addEventListener('click', function() {
        let max_nb_active_cards = getMaxNbActiveCards();
        
        if(i_card_carousel[index] > 0)
        {
            cards.forEach((card, i) => {
                if(i == i_card_carousel[index] + max_nb_active_cards-1)
                {
                    card.style.animation = 'slideRightAndFade 0.4s forwards';                        
                    setTimeout(() => { 
                        card.classList.remove('active');
                        card.style.animation = '';
                        updateCardCarousel(index);  
                    }, 400);
                }

                else
                {
                    if(card.classList.contains('active'))
                    {
                        let nextCard = cards[i + 1];
                        let translateValue = nextCard.offsetLeft - card.offsetLeft;                         
                        let slideRightKeyFrames = new KeyframeEffect(
                            card, 
                            [
                                { transform: 'translateX(0px)' },
                                { transform: `translateX(${translateValue}px)` }
                            ], 
                            { duration: 400, fill: 'forwards' }
                        );
                        let slideRightAnimation = new Animation(slideRightKeyFrames, document.timeline);
                        slideRightAnimation.onfinish = (event) => {
                            slideRightAnimation.cancel();
                        }
                        slideRightAnimation.play();
                    }                         
                }
            });
        }
        
        i_card_carousel[index] -= 1;
        
        if(i_card_carousel[index] < 0)
        {
            i_card_carousel[index] = 0;
        }               
    });

    next.addEventListener('click', function() {
        let max_nb_active_cards = getMaxNbActiveCards();
        let iCard = i_card_carousel[index];
        let canPlayAnimation = true; 
        iCard += 1;            

        if((cards.length - (iCard)) < max_nb_active_cards)
        {
            iCard = cards.length - max_nb_active_cards;
            canPlayAnimation = false;
        }
        
        if(iCard <= cards.length - max_nb_active_cards)
        {
            if(canPlayAnimation)
            {
                cards.forEach((card, i) => {
                    if(i == iCard - 1 && card.classList.contains('active'))
                    {
                        card.style.animation = 'slideLeftAndFade 0.4s forwards';
                        setTimeout(() => { 
                            card.classList.remove('active');
                            card.style.animation = '';
                            updateCardCarousel(index); 
                        }, 400);
                    }
                    else
                    {
                        if(card.classList.contains('active'))
                        {
                            let previousCard = cards[i - 1];
                            let translateValue = previousCard.offsetLeft - card.offsetLeft;                         
                            let slideLeftKeyFrames = new KeyframeEffect(
                                card, 
                                [
                                    { transform: 'translateX(0px)' },
                                    { transform: `translateX(${translateValue}px)` }
                                ], 
                                { duration: 400, fill: 'forwards' }
                            );
                            let slideLeftAnimation = new Animation(slideLeftKeyFrames, document.timeline);
                            slideLeftAnimation.onfinish = (event) => {
                                slideLeftAnimation.cancel();
                            }
                            slideLeftAnimation.play();
                        }                                          
                    }
                });
            }
        }
        
        i_card_carousel[index] = iCard;

    });
}

function initCardCarousels()
{        
    for (let index = 0; index < cardCarousels.length; index++) 
    {
        initCardCarouselArrows(index);
    }
}

function initNetflixLogo()
{
    let netflixLogo = document.querySelector('.netflix-logo');
    netflixLogo.src = netflixLogoImg;
}

initNetflixLogo();
initHamburger();
initIndexOfCardCarousels();
initCardCarousels();    
updatePage();

let resizeObserver = new ResizeObserver(updatePage);
resizeObserver.observe(document.body);

