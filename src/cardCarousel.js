import utils from "./utils";

const Direction = {
    "LEFT": 0,
    "RIGHT": 1
};

class CardCarousels
{
    firstVisibleCardIndexes = [];   
    cardCarousels;

    /** Constructs logic behind card carousels (Carousel moves on click on arrows to show more cards)
     * @constructor
     * @param {NodeListOf<Element>} cardCarousels - Card carousels
    */
    constructor(cardCarousels)
    {
        this.cardCarousels = cardCarousels;
        this.initFirstVisibleCardOfCarousels();
        this.initCarouselsDirectionArrows();
    }

    /** Get length of card carousels 
     * @public
     * @method
     * @returns {number} - Length of card carousels
    */
    getLength()
    {
        return this.cardCarousels.length;
    }

    /** Initializes first visible card index of each carousel
     * @private
     * @method
    */
    initFirstVisibleCardOfCarousels()
    {
        for (let index = 0; index < this.cardCarousels.length; index++) 
        {       
            this.firstVisibleCardIndexes.push(0);
        }
    }

    /** Initializes each card carousel with arrows to move cards
     * @private
     * @method
    */
    initCarouselsDirectionArrows()
    {        
        for (let index = 0; index < this.cardCarousels.length; index++) 
        {
            this.initCarouselDirectionArrows(index);
        }
    }

    /** Checks if card is the last visible card in carousel to hide it when moving cards
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @param {number} cardIndex - Index of card
     * @returns {boolean} - Flag if card is the last visible card in carousel
    */
    isLastVisibleCard(carouselIndex, cardIndex)
    {
        return cardIndex == this.firstVisibleCardIndexes[carouselIndex] + utils.getMaxNbActiveCards() - 1; //Todo: Utiliser la triple égalité pour confirmer le type
    }

    /** Get cards of a carousel
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @returns {(NodeListOf<Element>|null)} - Cards of a carousel if carousel exists, null otherwise
    */
    getCards(carouselIndex)
    {
        if(this.cardCarousels[carouselIndex] == undefined)
        {
            return null;
        }
        else
        {
            return this.cardCarousels[carouselIndex].querySelectorAll('.card');
        }
    }
    
    /** Get direction arrow button of a carousel
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @param {Direction} direction - Direction of arrow button
     * @returns {(Element|null)} - Direction arrow button of a carousel if carousel exists, null otherwise
     * @see Direction
    */
    getDirectionArrowButton(carouselIndex, direction)
    {
        if(direction == Direction.LEFT)
        {
            return this.cardCarousels[carouselIndex].querySelector('.prev');
        }
        else if(direction == Direction.RIGHT)
        {
            return this.cardCarousels[carouselIndex].querySelector('.next');
        }
        else
        {
            return null;
        }
    }

    /** Checks if it is the last page of carousel to avoid moving cards on right
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @returns {boolean} - Flag if it is the last page of carousel
     * @see getCards
     * @see getMaxNbActiveCards
    */
    isLastPage(carouselIndex)
    {
        return this.firstVisibleCardIndexes[carouselIndex] == this.getCards(carouselIndex).length - utils.getMaxNbActiveCards();
    }
    
    /** Moves cards on left in carousel
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @see isLastVisibleCard
     * @see getCards
     * @see updateCardCarousel
    */
    moveCardsOnLeftInCarousel(carouselIndex)
    {
        let firstVisibleCardIndex = this.firstVisibleCardIndexes[carouselIndex];
        let cards = this.getCards(carouselIndex);
        if(firstVisibleCardIndex > 0)
        { 
            cards.forEach((card, i) => {
                if(card.classList.contains('active') && this.isLastVisibleCard(carouselIndex, i))
                { 
                    card.style.animation = 'slideRightAndFade 0.4s forwards';                        
                    setTimeout(() => { 
                        card.classList.remove('active');
                        card.style.animation = '';
                        this.updateCardCarousel(carouselIndex);  
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
                        slideRightAnimation.onfinish = () => {
                            slideRightAnimation.cancel();
                        }
                        slideRightAnimation.play();
                    }                         
                }
            });
        }
        
        firstVisibleCardIndex -= 1;
        this.firstVisibleCardIndexes[carouselIndex] = firstVisibleCardIndex; 
    }

    /** Moves cards on right in carousel
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @see isLastPage
     * @see getCards
     * @see updateCardCarousel
    */
    moveCardsOnRightInCarousel(carouselIndex)
    {
        let firstVisibleCardIndex = this.firstVisibleCardIndexes[carouselIndex];                  
        let cards = this.getCards(carouselIndex);

        if(!this.isLastPage(carouselIndex))
        {
            cards.forEach((card, i) => {
                if(i == firstVisibleCardIndex && card.classList.contains('active'))
                {
                    card.style.animation = 'slideLeftAndFade 0.4s forwards';
                    setTimeout(() => { 
                        card.classList.remove('active');
                        card.style.animation = '';
                        this.updateCardCarousel(carouselIndex); 
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
                        slideLeftAnimation.onfinish = () => {
                            slideLeftAnimation.cancel();
                        }
                        slideLeftAnimation.play();
                    }                                          
                }
            });
            firstVisibleCardIndex += 1;
        }
        
        this.firstVisibleCardIndexes[carouselIndex] = firstVisibleCardIndex;
    }
    
    /** Initializes direction arrows of a carousel with move of cards on click
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @see moveCardsOnLeftInCarousel
     * @see moveCardsOnRightInCarousel
     * @see getDirectionArrowButton
     * @see Direction
    */
    initCarouselDirectionArrows(carouselIndex)
    {        
        let prev = this.getDirectionArrowButton(carouselIndex, Direction.LEFT);
        let next = this.getDirectionArrowButton(carouselIndex, Direction.RIGHT);        

        
        prev.onclick = this.moveCardsOnLeftInCarousel.bind(this, carouselIndex);
        next.onclick = this.moveCardsOnRightInCarousel.bind(this, carouselIndex);
    }

    /** Updates card carousel to only display a certain number of cards
     * @private
     * @method
     * @param {number} carouselIndex - Index of carousel
     * @see getCards
     * @see getMaxNbActiveCards
    */
    updateCardCarousel(carouselIndex)
    {                
        let cards = this.getCards(carouselIndex);
        let max_nb_active_cards = utils.getMaxNbActiveCards();
        let nb_active_cards = 0;
        
        //Hide all cards
        cards.forEach((card) => {
            card.classList.remove('active');
        });
        
        // Correct the first visible card index if it is out of bounds
        if((cards.length - (this.firstVisibleCardIndexes[carouselIndex])) < max_nb_active_cards)
        {
            //If there are more cards than the maximum number of active cards
            // Set the first visible card index to display the maximum number of active cards
            if(cards.length >= max_nb_active_cards)
            {
                this.firstVisibleCardIndexes[carouselIndex] = cards.length - max_nb_active_cards;
            }
            //Else set index to display only the number of cards available         
            else
            {
                this.firstVisibleCardIndexes[carouselIndex] = 0;
            }            
        }

        //Display cards
        for (let i = this.firstVisibleCardIndexes[carouselIndex]; i < cards.length; i++) 
        {
            let card = cards[i];

            if(nb_active_cards < max_nb_active_cards)
            {
                card.classList.add('active');
                nb_active_cards++;
            }
        }

    }
}



export default CardCarousels;