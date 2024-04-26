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

export default { breakpointSm, breakpointMd, breakpointLg, breakpointXl, breakpointXxl, breakpointXxxl, getMaxNbActiveCards };