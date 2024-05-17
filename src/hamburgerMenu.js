import hamburgerImg from "./images/hamburger.svg";
import timesImg from "./images/times.svg";
import utils from "./utils";

class HamburgerMenu 
{
    hamburger;
    navbar;
    hamburgerImgChanged = false;

    /** Constructs hamburger menu and its behavior on click(show and hide navbar)
     * @constructor
     * @param {HTMLElement} hamburger - Hamburger menu button
     * @param {HTMLElement} navbar - Navbar
     */
    constructor(hamburger, navbar)
    {
        this.hamburger = hamburger;
        this.navbar = navbar;
        this.initHamburger();
    }

    /** Initializes hamburger menu with image and its behavior on click(show and hide navbar)
     * @private
     * @method
    */
    initHamburger() 
    {
        this.hamburger.addEventListener('click', function() 
        {
            this.navbar.style.display = this.navbar.style.display === 'block' ? 'none' : 'block';

            if(this.hamburger.children[0].attributes.getNamedItem('src').value == hamburgerImg) //Todo: Code à expliquer, il existe surement une solution plus simple et qui ne pose pas de problème de typage... :)
            {
                this.hamburger.children[0].attributes.getNamedItem('src').value = timesImg;
            }
            else
            {
                this.hamburger.children[0].attributes.getNamedItem('src').value = hamburgerImg;
            }
           this.hamburgerImgChanged = true;
        }.bind(this));

        const img = new Image(); //Todo: toujours const
        img.src = hamburgerImg;
        this.hamburger.appendChild(img);
    }

    /** Get flag of hamburger's image changed
     * @public
     * @method
     * @returns {boolean} - Flag of hamburger's image changed
     */
    get hamburgerImgChanged()//Todo: Cette fonction semble inutilisée, code mort ? Nommage suspect :)
    {
        return this.hamburgerImgChanged;
    }

    /** Set flag of hamburger's image changed
     * @public
     * @method
     * @param {boolean} value - Flag of hamburger's image changed
     */
    set hamburgerImgChanged(value)
    {
        this.hamburgerImgChanged = value;
    }

    /** Hide or show hamburger menu and navbar according to screen size)
     * @public
     * @method
     */
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