const wppconnect = require('@wppconnect-team/wppconnect');

var userStages = [];

wppconnect.create({
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) =>
        client.onMessage((message) => {
            console.log('Mensagem digitada pelo usuário: ' + message.body);
            stages(client, message);
        }))
    .catch((error) =>
        console.log(error));


//  Stages = Olá  >>  Nome  >>  Pedido  >> Endereco >> Fim
function stages(client, message) {
    stage = userStages[message.from];
    switch (stage) {
        case 'Nome':
            const nome = message.body;
            sendWppMessage(client, message.from, 'Obrigado, ' + nome);
            sendWppMessage(client, message.from, 'Cardápio: www.google.com.br');
            sendWppMessage(client, message.from, 'Qual o seu *Pedido*:');
            userStages[message.from] = 'Pedido';
            break;
        
        case 'Pedido':
            const pedido = message.body;
            sendWppMessage(client, message.from, 'Obrigado por informar seu pedido:' + pedido);
            sendWppMessage(client, message.from, 'Qual o seu *Endereço*:');
            userStages[message.from] = 'Endereco';
            break;

        case 'Endereco':
            const endereco = message.body;
            sendWppMessage(client, message.from, 'Seu pedido será entregue no endereço:' + endereco);
            sendWppMessage(client, message.from, 'Obrigado pela sua preferência.');
            userStages[message.from] = 'Fim';
            break;

        case 'Fim':
            break;

        default: // Olá 
            console.log('*Usuário atual* from:' + message.from);
            sendWppMessage(client, message.from, 'Bem vindo...');
            sendWppMessage(client, message.from, 'Digite seu *NOME*:');
            userStages[message.from] = 'Nome';
    }
}


function sendWppMessage(client, sendTo, text) {
    client
        .sendText(sendTo, text)
        .then((result) => {
            // console.log('SUCESSO: ', result); 
        })
        .catch((erro) => {
            console.error('ERRO: ', erro);
        });
}
