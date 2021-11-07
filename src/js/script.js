'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const productsCards = document.querySelector('.products__cards');

    const cards = [{
            name: 'компьютер',
            description: `компьютер apple`,
            link: `
                https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-gallery5-202110?wid=2000&hei=1536&fmt=jpeg&qlt=95&.v=1632799183000
            `,
            price: '10 000р',
        },
        {
            name: 'компьютер',
            description: `компьютер apple`,
            link: `
                https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-gallery5-202110?wid=2000&hei=1536&fmt=jpeg&qlt=95&.v=1632799183000
            `,
            price: '10 000р',
        },
        {
            name: 'Путевка на водопад',
            description: `Испытайте не себе величие природы`,
            link: `
                https://nikonpro.ru/sites/default/files/uploaded/plato_putorana_23901_0.jpg
            `,
            price: '10 000р',
        },
        {
            name: 'Наименование товара',
            description: `
                Довольно-таки интересное описание товара в несколько строк. Довольно-таки
                интересное описание товара в несколько строк
            `,
            link: `
                https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-gallery5-202110?wid=2000&hei=1536&fmt=jpeg&qlt=95&.v=1632799183000
            `,
            price: '10 000р',
        }
    ];

    // ban on expanding the card if there are less than 3 of them
    const styles = () => {
        if (cardsContainer.length < 3) {
            productsCards.style.cssText = `
                grid-template-columns: repeat(auto-fit, minmax(300px, 332px));
            `;
        } else {
            productsCards.style.cssText = `
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            `;
        }
    };

    // create card
    class Card {
        constructor(name, description, link, price, id) {
            this.name = name;
            this.description = description;
            this.link = link;
            this.price = price;
            this.id = id;
        }

        render() {
            const item = document.createElement('div');
            item.classList.add('products__card', 'card');
            item.setAttribute('data-id', this.id);
            item.innerHTML = `
                <div class="card__trash">
                    <img src="img/trash.png" alt="Корзина">
                </div>
                <div class="card__item">
                    <div class="card__img">
                        <img src=${this.link}
                            alt=${this.name}>
                    </div>
                    <div class="card__text">
                        <div class="card__title">
                            <h3>${this.name}</h3>
                        </div>
                        <div class="card__descr">
                            <p>${this.description}</p>
                        </div>
                        <div class="card__price">
                            <h2>${this.price} руб.</h2>
                        </div>
                    </div>
                </div>
            `;
            productsCards.append(item);
            // return item;
        }
    }

    // add cardds on page
    cards.forEach(({
        name,
        description,
        link,
        price,
        id
    }, i) => {
        new Card(name, description, link, price, i).render();
    });

    // convert the NodeList to a regular array and get rid of unnecessary elements
    let cardsContainer = [...productsCards.childNodes].filter(card => card.nodeName === 'DIV');

    //* DELETE====================================================================================
    // find cards by date attribute and delete
    const deleteCards = (i) => {
        const idx = cardsContainer.findIndex(card => +card.getAttribute('data-id') === i);
        const d = cardsContainer.splice(idx, 1);
        const s = baskets.splice(i, 1);
        productsCards.innerHTML = '';
        productsCards.append(...cardsContainer);
        styles();
        console.log(productsCards);
        console.log(baskets);
        console.log(i);
        console.log(idx);
    };

    // hang an event handler with a delete function on the basket
    const baskets = [...document.querySelectorAll('.card__trash')];
    baskets.forEach((basket, i) => {
        basket.addEventListener('click', () => {
            deleteCards(i);
        });
    });
    //* DELETE====================================================================================
    
    //* ADD====================================================================================
    const form = document.querySelector('.form'),
          inputs = form.querySelectorAll('.form input'),
          textarea = form.querySelector('.form textarea'),
          btn = form.querySelector('.form button');

    const emptyCard = {
        name: '',
        description: '',
        link: '',
        price: '',
    };

    const handleChange = () => {
        for (const input of inputs) {
            if (input.value === "") {
                btn.classList.add('disabled');
                return;
            }
        }
        btn.classList.remove('disabled');
    };

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.name === 'name') {
                emptyCard.name = input.value;
            } else if (input.name === 'link') {
                emptyCard.link = input.value;
            } else if (input.name === 'price') {
                input.value = input.value.replace(/\D/gi, '').replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
                emptyCard.price = input.value;
                console.log(emptyCard);
            }
        });
        input.onkeydown = input.onkeyup = input.onkeypress = input.change = handleChange;
    });
    textarea.addEventListener('input', () => {
        emptyCard.description = textarea.value;
    });

    const addCards = ({
        name,
        description,
        link,
        price
    }) => {
        const id = baskets.length;
        new Card(name, description, link, price, id).render();

        let trash = document.querySelectorAll('.card__trash');
        trash = trash[trash.length - 1];
        cardsContainer = [...productsCards.childNodes].filter(card => card.nodeName === 'DIV');

        baskets.push(trash);

        trash.addEventListener('click', () => {
            deleteCards(id);
        });

        styles();
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        inputs.forEach(input => {
            if (input.value === '') {
                input.classList.add('req');
                form.classList.add('req');
            } else {
                input.classList.remove('req');
                form.classList.remove('req');
            }
        });
        if (!form.classList.contains('req')) {
            btn.classList.add('disabled');
            addCards(emptyCard);
            form.reset();
        }
    });
    //* ADD====================================================================================

    
});