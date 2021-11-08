'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const productsCards = document.querySelector('.products__cards');

    // ban on expanding the card if there are less than 3 of them
    const styles = () => {
        if (body.clientWidth > 1406) {
            if (cardsContainer.length < 3) {
                productsCards.style.cssText = `
                    grid-template-columns: repeat(auto-fit, minmax(300px, 332px));
                `;
            }else {
                productsCards.style.cssText = `
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                `;
            }
        }else if (body.clientWidth < 1406 && body.clientWidth > 991.98) {
            if (cardsContainer.length < 2) {
                productsCards.style.cssText = `
                    grid-template-columns: repeat(auto-fit, minmax(300px, 319px));
                `;
            }else {
                productsCards.style.cssText = `
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                `;
            }
        }else if (body.clientWidth < 991.98 && body.clientWidth > 540) {
            if (cardsContainer.length < 2) {
                productsCards.style.cssText = `
                    grid-template-columns: repeat(auto-fit, 220px);
                `;
            }else {
                productsCards.style.cssText = `
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                `;
            }
        }
        
    };

    const cards = [{
            name: 'компьютер',
            description: `компьютер apple`,
            link: `
                https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-gallery5-202110?wid=2000&hei=1536&fmt=jpeg&qlt=95&.v=1632799183000
            `,
            price: '10 000',
        },
        {
            name: 'компьютер',
            description: `компьютер apple`,
            link: `
                https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-gallery5-202110?wid=2000&hei=1536&fmt=jpeg&qlt=95&.v=1632799183000
            `,
            price: '10 000',
        },
        {
            name: 'Путевка на водопад',
            description: `Испытайте не себе величие природы`,
            link: `
                https://nikonpro.ru/sites/default/files/uploaded/plato_putorana_23901_0.jpg
            `,
            price: '10 000',
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
            price: '10 000',
        }
    ];

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
        }
    }

    // add cardds on page
    cards.forEach(({name, description, link, price, id}, i) => {
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

    // object for writing data from inputs for creating a new card
    const emptyCard = {
        name: '',
        description: '',
        link: '',
        price: '',
    };

    // if all inputs are filled, then the button is activated
    const handleChange = () => {
        for (const input of inputs) {
            if (input.value === "") {
                btn.classList.add('disabled');
                return;
            }
        }
        btn.classList.remove('disabled');
    };

    // hang an event handler for each input,
    // check with the "name" attribute and add data to the "blank card"
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.name === 'name') {
                emptyCard.name = input.value;
            } else if (input.name === 'link') {
                emptyCard.link = input.value;
            } else if (input.name === 'price') {
                // validate the price value
                input.value = input.value.replace(/\D/gi, '').replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
                emptyCard.price = input.value;
            }
        });
        // every time the input changes, call the button check function
        input.onkeydown = input.onkeyup = input.onkeypress = input.change = handleChange;
    });
    // hang event handler on textarea
    textarea.addEventListener('input', () => {
        emptyCard.description = textarea.value;
    });

    // functionality of adding a card
    const addCards = ({name, description, link, price}) => {
        const id = baskets.length;
        new Card(name, description, link, price, id).render();

        // find the newly created basket and hang the card deletion handler on it
        let trash = document.querySelectorAll('.card__trash');
        trash = trash[trash.length - 1];
        trash.addEventListener('click', () => {
            deleteCards(id);
        });

        cardsContainer = [...productsCards.childNodes].filter(card => card.nodeName === 'DIV');

        styles();
    };


    form.addEventListener('submit', e => {
        e.preventDefault();
        // checking inputs
        inputs.forEach(input => {
            if (input.value === '') {
                input.classList.add('req');
                form.classList.add('req');
            }else {
                input.classList.remove('req');
                form.classList.remove('req');
            }
        });
        // if there is data in the inputs, then the form is processed
        if (!form.classList.contains('req')) {
            btn.classList.add('disabled');
            addCards(emptyCard);
            form.reset();
        }
    });
    //* ADD====================================================================================

    //* FILTERING====================================================================================
    const filterList = document.querySelector('#filter'),
          filterValue = filterList.querySelector('#filter p'),
          filterItems = filterList.querySelectorAll('#filter li');

    // expand the list of filters
    filterList.addEventListener('click', e => {
        if (e.target && e.target.tagName === 'P'){
            filterValue.classList.toggle('active');
        }
    });

    // insert the filter value into the select box
    const addValueOnFilter = (item) => {
        filterValue.innerHTML = `${item.innerHTML}`;
    };

    // sort by name
    const sortByName = () => {
        const filtered = [...cardsContainer];
        // find the name in the array of DOM elements and sort it
        filtered.sort((a, b) => {
            const aName = a.children[1].children[1].children[0].innerText.toLowerCase();
            const bName = b.children[1].children[1].children[0].innerText.toLowerCase();
            return (aName < bName) ? -1 : 1;
        });
        productsCards.innerHTML = '';
        productsCards.append(...filtered);
    };

    // sort by price
    const sortByPrice = (value) => {
        const filtered = [...cardsContainer];
        // find the price in the array of elements and sort it
        filtered.sort((a, b) => {
            const aPrice = +a.children[1].children[1].children[2].innerText.replace(/\D/gi, '');
            const bPrice = +b.children[1].children[1].children[2].innerText.replace(/\D/gi, '');
            // if the value is "min", then ascending, if "max", then descending
            return (value === 'min') ? aPrice - bPrice : bPrice - aPrice;
        });
        productsCards.innerHTML = '';
        productsCards.append(...filtered);
    };

    // reset sorting
    const sortDefault = () => {
        productsCards.innerHTML = '';
        productsCards.append(...cardsContainer);
    };

    // we hang a handler for each filtering element
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            filterItems.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
            if (item.getAttribute('value') === 'min') {
                addValueOnFilter(item);
                sortByPrice(item.getAttribute('value'));
            }else if (item.getAttribute('value') === 'max') {
                addValueOnFilter(item);
                sortByPrice(item.getAttribute('value'));
            }else if (item.getAttribute('value') === 'name') {
                addValueOnFilter(item);
                sortByName();
            }else if (item.getAttribute('value') === 'default') {
                addValueOnFilter(item);
                sortDefault();
            }
        });
    });
    //* FILTERING====================================================================================
});