import hamburgerImg from "./images/hamburger.svg";
import timesImg from "./images/times.svg";
import utils from "./utils";

class HamburgerMenu 
{
    hamburger;
    navbar;
    hamburgerImgChanged = false;

    constructor(hamburger, navbar)
    {
        this.hamburger = hamburger;
        this.navbar = navbar;
        this.initHamburger();
    }

    initHamburger() 
    {
        this.hamburger.addEventListener('click', function() 
        {
            this.navbar.style.display = this.navbar.style.display === 'block' ? 'none' : 'block';

            if(this.hamburger.children[0].attributes.getNamedItem('src').value == hamburgerImg)
            {
                this.hamburger.children[0].attributes.getNamedItem('src').value = timesImg;
            }
            else
            {
                this.hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
            }
           this.hamburgerImgChanged = true;
        }.bind(this));

        let img = new Image();
        img.src = hamburgerImg;
        this.hamburger.appendChild(img);
    }

    get hamburgerImgChanged()
    {
        return this.hamburgerImgChanged;
    }

    set hamburgerImgChanged(value)
    {
        this.hamburgerImgChanged = value;
    }

    updateHamburger()	
    {
        if (utils.breakpointMd.matches)
        {            
            if (getComputedStyle(this.hamburger).display === 'none') {                
                this.navbar.style.display = 'block';
                this.hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
            }
        }

        else
        {
            this.navbar.style.display = 'none';
            this.hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
        }
    }
}

export default HamburgerMenu;