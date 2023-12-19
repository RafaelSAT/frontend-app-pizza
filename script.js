let quantidadeModal = 1;
let keyModal = 0;
let carrinho = [];

//Listagem das pizzas

pizzaJson.map((item, index) => {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.preco.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.nome;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.descricao;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        keyModal = key;
        quantidadeModal = 1;

        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].nome;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].descricao;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].preco.toFixed(2)}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((tamanho, tamanhoIndex) => {
            if(tamanhoIndex == 2){
                tamanho.classList.add('selected');
            }
            tamanho.querySelector('span').innerHTML = pizzaJson[key].tamanho[tamanhoIndex];
        });

        document.querySelector('.pizzaInfo--qt').innerHTML = quantidadeModal;

        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() =>{
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        } , 200);
    });

    document.querySelector('.pizza-area').append(pizzaItem);
});

//Eventos do Modal

function fecharModal(){
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', fecharModal);
});

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(quantidadeModal > 1){
        quantidadeModal--;
        document.querySelector('.pizzaInfo--qt').innerHTML = quantidadeModal;
    }
});

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    quantidadeModal++;
    document.querySelector('.pizzaInfo--qt').innerHTML = quantidadeModal;
});

document.querySelectorAll('.pizzaInfo--size').forEach((tamanho, tamanhoIndex) => {
    tamanho.addEventListener('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        tamanho.classList.add('selected');
    });
});

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let tamanho = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identificador = pizzaJson[keyModal].id+'@'+tamanho;
    let key = carrinho.findIndex((item) => {
        return item.identificador == identificador;
    });

    if(key > -1){
        carrinho[key].quantidade += quantidadeModal;
    }else{
        carrinho.push({
            identificador,
            id:pizzaJson[keyModal].id,
            tamanho,
            quantidade:quantidadeModal
        });
    }
    atualizarCarrinho();
    fecharModal();
});

document.querySelector('.menu-openner').addEventListener('click', () => {
    if(carrinho.length > 0){
        document.querySelector('aside').style.left = '0';
    }
});

document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = '100vw';
});

function atualizarCarrinho(){

    document.querySelector('.menu-openner span').innerHTML = carrinho.length;

    if(carrinho.length > 0){

        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in carrinho){

            let pizzaItem = pizzaJson.find((item) => {
                return item.id == carrinho[i].id;
            });

            subtotal += pizzaItem.preco * carrinho[i].quantidade;
            
            let carrinhoItem = document.querySelector('.models .cart--item').cloneNode(true);
            let pizzaTamanho;
            switch(carrinho[i].tamanho){
                case 0:
                    pizzaTamanho = 'P';
                    break;
                case 1:
                    pizzaTamanho = 'M';
                    break;
                case 2:
                    pizzaTamanho = 'G';
                    break;
            }
            
            carrinhoItem.querySelector('img').src = pizzaItem.img;
            carrinhoItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.nome} ${pizzaTamanho}`;
            carrinhoItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade;
            carrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(carrinho[i].quantidade > 1){
                    carrinho[i].quantidade--;
                }else{
                    carrinho.splice(i, 1);
                }
                atualizarCarrinho();
            });
            carrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                carrinho[i].quantidade++;
                atualizarCarrinho();
            });

            document.querySelector('.cart').append(carrinhoItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}