const express = require('express')
const MercadoPago = require('mercadopago')
const app = express()

MercadoPago.configure({//Utilizando SDK do Mercado Pago
    sandbox: true,//Informando que estamos em modo de producao
    access_token: 'TEST-1902451117295509-031012-dee9008f3f3509fb8eda0023850bb2a4-56842569'//Token de acesso disponibilizado pelo MP
})

app.get('/', (req, res) => {
    res.send('Testando Rota')
})

app.get('/pagar', async (req, res) => {
    let id = '' + Date.now()//Passando dado para String(ID da compra)
    let emailDoPagador = 'jacobkleuber@gmail.com'//Email do usuario que esta realizando a compra

    let dados = {
        items: [
            item = {
                id: id,
                title: '5x Camisa Cruzeiro Centenario, 2x Jaquetas Nike Jordan, 4x Tenis Nike Shocks Elite Premium',
                quantity: 1,//Multiplicador
                currency_id: 'BRL',//Moeda do pagamento 
                unit_price: parseFloat(4790.89)//Valor total dos produtos
            }
        ], 
        payer: {
            email: emailDoPagador
        },
        external_reference: id
    }

    try {
        let pagamento = await MercadoPago.preferences.create(dados)
        console.log(pagamento)
        //DB.SalvarPagamento({id: id, pagador: emailDoPagador})Aqui estariamos inserindo no DB o pagamento realizado
        return res.redirect(pagamento.body.init_point)
    } catch (error) {
        return res.send(error.message)
    }    
})

app.post('/not', (req, res) => {
    let id = req.query.id

    setTimeout(() => {
        let filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            let pagamento = data.body.results[0]

            if(pagamento != undefined){
                console.log(pagamento.external_reference)
                console.log(pagamento.status)
            }else{
                console.log('Pagamento nao existe!')
            }
        }).catch(err => {
            console.log(err)
        })
        
    },20000)

    res.send('OK')
})

app.listen(80, () => {
    console.log('Server Running')
})

//Senha servidor de Teste Digital Ocean: Abc201317!Abc