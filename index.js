// modulos externos
import chalk from 'chalk';
import inquirer from 'inquirer';

// modulos internos
import fs from 'fs';

operation();

function operation(){
    inquirer.prompt([
        {
            type: 'list',
            name:'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar conta',
                'Consultar saldo',
                'Depositar',
                'Sacar',
                'Sair'
                ]
        }
]).then((answer)=>{
    const action = answer['action'];
    if(action == 'Criar conta'){
        criandoConta();
    }else if(action == 'Consultar saldo'){
        mostrarSaldo()
    }else if(action == 'Depositar'){
        adicionarSaldo();
    }else if(action == 'Sacar'){
        salcarDinheiro();
    }else if(action == 'Sair'){
        console.log(chalk.bgCyanBright.black('Obrigado por usar nosso banco'));
        process.exit;
    }


    console.log(action);
})
.catch((err)=>{console.log(err)})

}

function criandoConta(){
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'));
    console.log(chalk.bgGreen.black('Defina as opções da sua conta a seguir:'));
    buildConta();
}


function buildConta(){
    inquirer.prompt([
        {
        name: 'accountName',
        message: 'Digite o nome para sua conta: \n'
        }
    ]).then((resposta)=>{
       let nomeConta = resposta['accountName'];

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts');
        }

        if(fs.existsSync(`accounts/${nomeConta}.json`)){
            console.log('Conta já existênte, escolha o nome da conta diferente');
            buildConta();
            return;
        } else{
            fs.writeFileSync(
                `accounts/${nomeConta}.json`,
                '{"saldo": 0}',
                function(err){
                    console,log(err);
                }
            )
            operation();
        }
        console.log(chalk.bgGreen.white('Parabens por criar sua conta!'))
    }).catch((err)=>console.log(err))
    
}


function adicionarSaldo(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta: \n'
        }
    ])
    .then(
        (resposta1) => {
            
            if(!verificarConta(resposta1['accountName'])){
                console.log("Conta inserida não existe");
                return adicionarSaldo();
            }else{
                
                inquirer.prompt([
                    {
                        name: 'deposito',
                        message: 'Quanto você deseja depositar:'
                    }
                ]).then(
                    (resposta2) => {
                        const account = getAccount(resposta1['accountName'])
                        account.saldo = parseFloat(account.saldo) + parseFloat(resposta2['deposito'])

                            fs.writeFileSync(
                                `accounts/${resposta1['accountName']}.json`,
                                JSON.stringify(account),
                                function (err){
                                    console.log(err)
                                },
                            );
                            console.log(chalk.bgGreen.black(`Foi depositado o valor de ${resposta2['deposito']}\n`))
                            operation();
                    }
                ).catch(function(err){
                    console.log(err);
                })
            }
        }
    )
    .catch(function(err){
        console.log(err);
    })
}


function verificarConta(nomeConta){
    if(!fs.existsSync(`accounts/${nomeConta}.json`)){
        return false;
    }
    return true;
}



function getAccount(nomeConta){
    const accountJSON = fs.readFileSync(`accounts/${nomeConta}.json`, 
    {   
        enconding: 'utf8', 
        flag: 'r'
    });
    return JSON.parse(accountJSON);
}



function mostrarSaldo(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta: \n'
        }
    ])
    .then(
        (resposta) => {
            let nomeConta = resposta['accountName'];
            if(!verificarConta(nomeConta)){
                console.log('Cnta não existe');
                operation();
            }else {
               const conta = JSON.parse(fs.readFileSync(`accounts/${nomeConta}.json`))
                console.log(conta.saldo)
                operation();
            }

        }
    )
    .catch((err) => console.log(err))
    
}


function salcarDinheiro(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta que deseja sacar dinheiro: \n'
        }
    ])
    .then(
        (resposta1) => {
            let nomeConta = resposta1['accountName'];
            if(!verificarConta(nomeConta)){
                console.log('Cnta não existe');
                operation();
            }else {
                inquirer.prompt([
                    {
                        name: 'saque',
                        message: 'Quanto você deseja sacar:'
                    }
                ]).then(
                    (resposta2) => {
                        const account = getAccount(resposta1['accountName']);

                        if(parseFloat(resposta2['saque']) <= parseFloat(account.saldo) && (parseFloat(resposta2['saque']) != 0 || parseFloat(resposta2['saque']) == '')){
                        console.log('aqui');
                        account.saldo = parseFloat(account.saldo) - parseFloat(resposta2['saque'])

                            fs.writeFileSync(
                                `accounts/${resposta1['accountName']}.json`,
                                JSON.stringify(account),
                                function (err){
                                    console.log(err)
                                },
                            );
                            console.log(chalk.bgGreen.black(`Foi sacado o valor de ${resposta2['saque']}\n`))
                            operation();
                        }else {
                            console.log('Valor de saque indisponível');
                        }


                        
                    }
                ).catch(function(err){
                    console.log(err);
                })
            }

        }
    )
    .catch((err) => console.log(err))

}