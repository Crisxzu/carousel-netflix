import utils from "./utils";

const Direction = {
    "LEFT": 0,
    "RIGHT": 1
};

class CardCarousels
{
    firstVisibleCardIndexes = [];   
    cardCarousels;

    constructor(cardCarousels)
    {
        this.cardCarousels = cardCarousels;
        this.initFirstVisibleCardOfCarousels();
        this.initCardCarousels();
    }

    getLength()
    {
        return this.cardCarousels.length;
    }

    initFirstVisibleCardOfCarousels()
    {
        for (let index = 0; index < this.cardCarousels.length; index++) 
        {       
            this.firstVisibleCardIndexes.push(0);
        }
    }

    initCardCarousels()
    {        
        for (let index = 0; index < this.cardCarousels.length; index++) 
        {
            this.initCardCarouselArrows(index);
        }
    }

    isLastVisibleCard(carouselIndex, cardIndex)
    {
        return cardIndex == this.firstVisibleCardIndexes[carouselIndex] + utils.getMaxNbActiveCards() - 1;
    }

    getCards(carouselIndex)
    {
        return this.cardCarousels[carouselIndex].querySelectorAll('.card');
    }

    getDirectionButton(carouselIndex, direction)
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

    isLastPage(carouselIndex)
    {
        return this.firstVisibleCardIndexes[carouselIndex] == this.getCards(carouselIndex).length - utils.getMaxNbActiveCards();
    }
    

    initCardCarouselArrows(index)
    {        
        let prev = this.getDirectionButton(index, Direction.LEFT);
        let next = this.getDirectionButton(index, Direction.RIGHT);
        let cards = this.getCards(index);

        
        prev.onclick = function(){        
            let firstVisibleCardIndex = this.firstVisibleCardIndexes[index];
            if(firstVisibleCardIndex > 0)
            { 
                cards.forEach((card, i) => {
                    if(card.classList.contains('active') && this.isLastVisibleCard(index, i))
                    { 
                        card.style.animation = 'slideRightAndFade 0.4s forwards';                        
                        setTimeout(() => { 
                            card.classList.remove('active');
                            card.style.animation = '';
                            this.updateCardCarousel(index);  
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
            this.firstVisibleCardIndexes[index] = firstVisibleCardIndex;        
       }.bind(this);

        next.onclick = function() {            
            let firstVisibleCardIndex = this.firstVisibleCardIndexes[index];                  

            if(!this.isLastPage(index))
            {
                cards.forEach((card, i) => {
                    if(i == firstVisibleCardIndex && card.classList.contains('active'))
                    {
                        card.style.animation = 'slideLeftAndFade 0.4s forwards';
                        setTimeout(() => { 
                            card.classList.remove('active');
                            card.style.animation = '';
                            this.updateCardCarousel(index); 
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
            
            this.firstVisibleCardIndexes[index] = firstVisibleCardIndex;
        }.bind(this);
    }

    updateCardCarousel(index)
    {                
        let cards = this.getCards(index);
        let max_nb_active_cards = utils.getMaxNbActiveCards();
        let nb_active_cards = 0;

        cards.forEach((card) => {
            card.classList.remove('active');
        });

        if((cards.length - (this.firstVisibleCardIndexes[index]+1)) < max_nb_active_cards)
        {
            if(cards.length >= max_nb_active_cards)
            {
                this.firstVisibleCardIndexes[index] = cards.length - max_nb_active_cards;
            }
            else
            {
                this.firstVisibleCardIndexes[index] = 0;
            }
        }


        for (let i = this.firstVisibleCardIndexes[index]; i < cards.length; i++) 
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