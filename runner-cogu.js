// Importações das bibliotecas necessárias
const cypress = require('cypress')   // O motor de testes Cypress
const chalk = require('chalk')       // Biblioteca para colorir textos no terminal
const figlet = require('figlet')     // Biblioteca para criar textos grandes em ASCII (banners)
const os = require('os')             // Módulo nativo do Node.js para pegar infos do Sistema Operacional
const inquirer = require('inquirer') // Biblioteca para criar menus interativos (perguntas/seleção)

// Base de dados simulada de usuários. 
// Cada objeto representa um perfil que pode executar a ferramenta.
// Adicione, remova ou modifique perfis conforme necessário.
const USERS_DB = [
    { 
        name: 'Champignon', 
        role: 'Analista de Qualidade (QA)', 
        access: 'Maintainer', 
        themePrimary: '#D946EF', // Cor primária 
        themeSecondary: '#8B5CF6' // Cor secundária
    },
    { 
        name: 'Shiitake', 
        role: 'Engenheiro de Automação', 
        access: 'Maintainer', 
        themePrimary: '#3B82F6', 
        themeSecondary: '#1E40AF'
    },
    { 
        name: 'Shimeji', 
        role: 'Gerente de Testes', 
        access: 'Admin', 
        themePrimary: '#800e0eff', 
        themeSecondary: '#ff0000ff'
    },
    { 
        name: 'Reishi', 
        role: 'Segurança de QA', 
        access: 'Admin', 
        themePrimary: '#10B981', 
        themeSecondary: '#047857'
    }
]

// Configurações gerais da aplicação
// Ajuste os valores conforme necessário para sua equipe/projeto
const CONFIG = {
    thresholds: {
        qualityGate: 85, // Porcentagem mínima de testes que devem passar para ser considerado sucesso
        performance: 2000 // Limite de tempo (em ms) esperado para performance (apenas referência)
    }
}

// Variável que armazenará o usuário selecionado no menu inicial. Começa com o primeiro da lista.
let CURRENT_USER = USERS_DB[0]

// FUNÇÕES UTILITÁRIAS (HELPERS)

// Formata bytes para Megabytes (MB) com 2 casas decimais
const formatMemory = (bytes) => `${Math.round(bytes / 1024 / 1024 * 100) / 100} MB`

// Cria uma linha separadora visual
const separator = (char = '─', length = 90) => chalk.hex('#333333')(char.repeat(length))

// Centraliza um texto adicionando espaços à esquerda e direita
const padCenter = (str, length) => {
    const padding = Math.max(0, length - str.length)
    const left = Math.ceil(padding / 2)
    return ' '.repeat(left) + str + ' '.repeat(padding - left)
}

// Aplica um efeito degradê (gradiente) linha a linha em um texto
const gradientText = (text) => {
    const lines = text.split('\n')
    // Array de cores para o degradê do título
    const colors = [
        '#FF0080', '#FF00CC', '#CC00FF', '#800080', 
        '#4B0082', '#0000FF', '#0000CC', '#000080'
    ]
    return lines.map((line, i) => {
        // Seleciona a cor baseada no índice da linha, limitando ao tamanho do array de cores
        const color = colors[Math.min(i, colors.length - 1)]
        return chalk.hex(color)(line)
    }).join('\n')
}

// FUNÇÕES DE RENDERIZAÇÃO (INTERFACE)

// Renderiza o cabeçalho principal com o nome "RUNNER-COGU" em ASCII
const renderHeader = () => {
    console.clear() // Limpa o terminal antes de começar
    console.log('\n')
    
    // Gera o texto ASCII com o novo nome
    const title = figlet.textSync('RUNNER-COGU', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })
    
    // Aplica o gradiente e exibe
    console.log(gradientText(title))
    
    // Subtítulo centralizado, ajustando para 90 para cobrir a largura do nome ASCII
    const subtitleText = padCenter(' CLI DE GARANTIA DE QUALIDADE v1.0 ', 93) // AJUSTADO para 90
    console.log(chalk.bgHex('#000000').hex('#FFFFFF').bold(subtitleText))
    console.log('\n' + separator('━', 93))
}

// Usa a biblioteca 'inquirer' para perguntar quem é o usuário atual
const selectUserProfile = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',            // Tipo de input: Lista de seleção
            name: 'selectedUser',    // Nome da variável onde a resposta será salva
            message: 'Identifique-se para iniciar a sessão:',
            choices: USERS_DB.map(u => u.name), // As opções são os nomes dos usuários
            prefix: '👤'             // Ícone antes da pergunta
        }
    ])
    // Atualiza o usuário atual com base na escolha
    CURRENT_USER = USERS_DB.find(u => u.name === response.selectedUser)
}

// Coleta e exibe informações técnicas da máquina onde o teste está rodando
const renderSystemTelemetry = () => {
    let cypressVersion = 'Desconhecida'
    try {
        // Tenta ler a versão do Cypress instalado
        cypressVersion = require('cypress/package.json').version
    } catch (e) {
        cypressVersion = 'N/A'
    }

    // Array com as informações formatadas
    const sysInfo = [
        `SISTEMA     : ${os.type()} ${os.release()}`, // Ex: Windows_NT 10.0.19045
        `ARQUITETURA : ${os.arch()} / ${os.platform()}`, // Ex: x64 / win32
        `HOSTNAME    : ${os.hostname()}`, // Nome do computador na rede
        `NODE        : ${process.version}`, // Versão do Node.js
        `CYPRESS     : v${cypressVersion}`, // Versão do Cypress
        `CPU MODEL   : ${os.cpus()[0].model.trim()}`, // Modelo do processador
        `CORES       : ${os.cpus().length} Núcleos`, // Quantidade de núcleos
        `MEMÓRIA     : ${formatMemory(os.freemem())} livre / ${formatMemory(os.totalmem())} total`
    ]

    console.log(chalk.hex(CURRENT_USER.themePrimary).bold(' ➤ TELEMETRIA AVANÇADA DO SISTEMA'))
    
    // Lógica para dividir as informações em duas colunas visuais
    const midPoint = Math.ceil(sysInfo.length / 2)
    const col1 = sysInfo.slice(0, midPoint)
    const col2 = sysInfo.slice(midPoint)

    for(let i = 0; i < col1.length; i++) {
        const c1 = col1[i].padEnd(50) // Preenche com espaços para alinhar
        const c2 = col2[i] ? col2[i] : ''
        console.log(chalk.hex('#A0A0A0')(`   ▒ ${c1} ▒ ${c2}`))
    }
    console.log(separator())
}

// Exibe os dados do usuário que foi selecionado
const renderProfileLoad = () => {
    console.log(chalk.hex(CURRENT_USER.themePrimary).bold(' ➤ PERFIL DE USUÁRIO CARREGADO'))
    console.log(chalk.white(`   USUÁRIO : `) + chalk.hex(CURRENT_USER.themePrimary).bold(CURRENT_USER.name))
    console.log(chalk.white(`   CARGO   : `) + chalk.hex(CURRENT_USER.themeSecondary)(CURRENT_USER.role))
    console.log(chalk.white(`   ACESSO  : `) + chalk.green(CURRENT_USER.access))
    console.log(separator())
}


// Artes de cogumelos podem ser substituídas ou removidas de acordo com a necessidade
// Renderiza a arte ASCII do cogumelo (Sucesso ou Falha)
const renderMushroom = (type = 'success') => {
    // Arte para quando há FALHA (Cogumelo raivado)
    const mushroomFail = `
⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠉⠙⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⣠⠄⠀⠀⠀⠀⢀⣈⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠠⠛⠁⠀⠀⣴⣦⡄⠈⠙⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⢀⡄⠀⠀⠀⠀⠘⠻⠟⠀⠀⠀⣀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⢀⣴⣿⣿⠃⠀⢰⣷⠀⠀⠀⠀⡀⠀⠙⠓⠀⠀⠘⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⣾⣿⣿⠟⠀⠀⠈⠋⠀⠀⡐⠀⢀⣐⠀⠀⠠⢀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠁⠀⠀⠛⠋⠁⠀⢀⠐⠠⠀⠄⡁⠠⠀⢹⣿⣇⠀⠐⠀⠄⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⠂⠀⠄⠁⠠⢀⠂⠌⠀⠄⠂⢁⠠⠐⠀⠄⠀⠻⠋⠀⠀⠌⠀⠀⠀⠀⠘⡹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⠂⠀⠐⠠⠈⠐⡀⠄⠂⢁⠐⠈⡀⠄⠂⠄⠈⡀⠄⠀⠄⡈⠠⠀⢠⡇⠀⠀⠀⠐⠍⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠠⠁⠠⠁⢂⠀⠐⠈⠀⠀⠁⠠⠐⢀⠂⠐⠀⠐⠈⠀⠐⠀⠄⠈⠓⠀⠈⠠⠀⠀⠉⠉⢙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⢀⠂⠄⠁⢂⠈⢀⠀⠀⣤⠇⠀⠈⠄⡐⠀⠠⠁⠀⢠⣤⣁⠂⡀⠀⢂⠀⠄⠁⠂⠁⠄⠠⠀⠀⠈⠁⠂⠉⣙⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡿⠟⠋⠁⠀⠀⢀⠐⠀⠠⠈⡀⠂⢀⠂⠀⠀⠋⠀⠀⠂⠄⠐⠈⡀⠄⠁⠈⢻⣿⣷⣄⠀⠀⢂⠐⠈⠠⢈⠀⢂⠈⠐⠠⠐⠀⡀⠀⠉⠝⢿⣿⣿⣿⣿⣿⠟⠋⠉⢚⢿
⣿⣿⡟⠋⠀⠀⠀⠀⠀⠀⠀⠂⠈⠄⠐⠀⡁⠠⢀⠁⠂⠠⢀⠁⡐⠈⢀⠁⠠⠀⠈⡀⠀⠉⠛⠉⠀⢀⠂⠠⠁⢂⠀⠂⠄⠠⠁⡐⠈⡀⠄⠐⠀⠀⢸⠿⣟⠋⠁⠀⠀⠀⠀⡾⢨
⣿⠏⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠐⠈⠀⡁⠠⠐⠀⠀⡀⠀⠂⠀⠄⡈⠀⠄⠁⠄⠁⡀⠐⠀⠠⠀⠂⠠⢀⠁⡐⠀⠄⠁⠂⠀⡄⠀⠀⠐⠀⠂⠀⠀⠊⠀⠀⠀⠀⠀⠀⠀⣸⡇⣸
⡯⠀⠀⠀⢰⣴⣏⣑⡒⠲⠤⣥⣄⣂⠀⠀⡀⠀⠀⠀⠃⢀⠀⠈⢀⠐⠈⢀⠂⠈⠄⠀⠐⠀⠀⠂⡁⠐⡀⠠⠀⢀⠀⠁⠂⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⢠⣿
⣿⡀⠄⠐⣦⣬⣍⣉⣉⣙⣒⣂⣂⣩⢍⠁⠸⣶⣤⣤⣀⣀⠀⠀⠀⠀⠈⠀⠀⠈⠀⠀⠀⠀⠀⠐⠀⠁⠠⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡾⠋⣰⣿⣿
⣿⣷⣤⣀⠀⠒⠒⠲⠒⠒⠒⣐⣀⣥⣤⣴⡀⠘⢿⣿⣿⣿⣿⣿⡶⢶⣶⠤⣶⣤⣤⣀⠄⣀⣀⣀⡀⣀⣀⡰⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣠⣴⣶⡿⠏⢀⣴⣿⣿⣿
⣿⣿⣿⣿⣶⣶⣶⣤⣶⣶⣶⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⣿⣿⣷⣾⣿⣦⣭⣙⣛⣿⣤⣽⣿⡿⠃⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣶⣿⣿⣿⣿⠟⠁⣠⣾⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⢠⣿⡿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣰⣿⣿⣿⣿⣿⠿⠋⢁⣴⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⢀⣾⣿⣶⣶⣶⣶⣤⣍⡛⠿⠿⠛⠋⡉⢄⣤⠀⣴⣿⣦⡐⡀⠀⠄⠀⠀⠀⠀⣀⢠⣾⣿⡿⠿⠟⠋⣁⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢂⣼⢿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠰⠶⢌⠊⠉⣀⢸⣿⣿⣷⡀⢀⣠⣲⣴⣬⣷⠾⠟⠋⠅⢀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⣼⣿⡈⠻⢿⡿⠿⠿⠿⢿⣿⣿⡟⠀⢀⣤⣶⣿⣿⢀⣿⣿⣿⣧⠘⠿⠿⠿⠛⠋⣀⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠈⣰⣿⣿⣿⣷⣶⡄⠒⣆⠲⣄⠂⠍⠀⣴⣿⣿⣿⣿⡇⠸⢿⣿⣿⣿⣷⣆⠀⢶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⢰⣿⣿⣿⣿⣿⣿⣿⣦⣄⣁⣈⣡⣴⣿⣿⣿⣿⣿⣿⣿⣶⣼⣿⣿⣿⣿⡿⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿     ⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟      ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟       ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋         ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠙⢿⣿⣿⣿⣿⣿⣿⣿⡟⠀⣁⣁⠙⢻⣿⣿⣿⣿⡿⠁⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡌    ⣿⣿⣿⣿⣿⡿⠀⣼⣿⣿⡆    ⣿⣿⣿⡟⠠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄     ⣿⣿⣿⣿⠁⠘⣿⣿⣿⣧⡀⠿⠿⡿⠖⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣟⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣌⣉⠛⠛⠂⣴⣿⣿⣿⣿⡿⣶⢶⣶⣶⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`

    // Arte para quando há SUCESSO (Cogumelo feliz)
    const mushroomSuccess = `
⠱⡜⡡⢎⠕⣚⢥⠝⣢⣙⠦⡍⣈⠇⢏⢒⠦⢓⡠⠝⠬⡍⠧⢹⠜⣡⠛⡖⣨⢉⠖⡻⢦⣳⠬⡍⠜⣆⢳⠪⡅⠙⠘⠄⠢⠅⠌⠶⢁⢎⡀⡐⢂⠱⠚⢒⣉⡜⣣⣿⢞⣿⡿⢠⢅
⠙⢆⡕⢲⠼⡰⣍⠎⣇⠣⢊⠕⢂⡍⡎⢼⣨⢃⣳⢎⡩⢙⡱⢣⡋⢄⠫⠱⠐⠪⡜⢡⣒⣐⠆⠓⡌⠚⢈⠡⠠⡐⡠⠆⣡⠘⣀⠧⠠⢉⠥⠱⡜⠼⠉⣅⠞⠀⡟⣴⢿⣯⣿⣀⢚
⣩⠍⠎⠣⡔⠑⡌⢎⡤⠋⣬⠈⣦⠓⡌⢲⡰⢋⢶⡐⣬⠣⡑⢎⡙⡌⡥⠂⢭⢢⠘⡐⠣⣬⠚⠑⠈⢧⡈⠄⢡⣄⣘⠦⣁⠦⠌⢪⡱⢍⡔⠃⠍⣘⣉⢆⡹⠀⢿⢹⡯⣏⡟⡄⣩
⡔⢊⡵⢘⢠⠩⠔⡣⠔⡲⢈⠗⠮⣑⡊⣡⠐⡊⠤⠱⢊⠴⣙⣂⠵⡈⠄⣉⠂⠠⢄⡠⡱⠦⡔⠣⣍⠠⣐⢚⡁⠴⡈⡑⣌⠶⠡⠆⠼⠴⠢⢍⣀⠃⢈⠎⣐⠆⠰⠧⠋⠀⠈⠀⠄
⡈⢧⣉⠌⡼⠡⠎⢄⡃⡶⢉⠸⢆⡲⠒⣐⠲⡌⢆⡃⠞⣡⠑⡆⢖⡑⠾⠁⠋⠁⠈⡁⠁⠀⠉⠁⠊⠖⡱⢊⡵⠫⠤⠩⢄⢛⣠⠈⢃⠄⠏⢈⠂⠆⡈⢂⠄⠀⠀⠀⢀⠀⠀⠀⡀
⡰⠇⠸⠰⠈⢷⡈⡸⢈⠸⢀⠁⠎⢁⣁⠁⠏⠸⢀⠇⠉⠀⠀⠀⠀⠰⠀⠀⠀⠀⡀⠀⠀⡀⠀⠀⠀⠀⠀⠈⢈⠰⠈⠇⢀⡸⠀⠇⢈⠈⠶⠀⢆⠀⠀⠀⠀⠁⠀⠀⠀⠀⢀⠁⠀
⠒⠴⣋⡑⢋⠅⡰⢌⠡⡖⡜⡊⠥⠒⠠⠉⠀⠀⠀⠀⠀⠐⠈⠀⠉⠀⠁⠐⠈⠀⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠊⢑⣈⠢⠁⡆⠀⠆⢒⡀⠀⠌⡒⢊⠔⠂⠀⠀⠀⠀⠀⠀⠀⠈
⢨⠐⡂⠧⢉⠘⠤⡍⢲⠲⠜⠁⠀⠂⠀⡀⠈⣠⣄⣂⠠⠂⣓⣆⡄⡔⣦⣄⠠⡄⣀⡀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠃⡘⣀⢂⡐⠄⠈⢡⠠⠜⠢⢎⠀⠀⠀⠀⠀⠀⠀⠐⠀
⢄⡋⠱⢈⡐⢋⢅⠹⡀⠁⠀⠀⠀⢓⣶⣾⣆⡘⣿⡿⡅⢤⢿⡟⣦⡀⠿⣿⠆⣰⣻⣧⣾⡧⠠⣤⢄⣀⣀⠀⠀⠀⠀⠀⠀⠑⢌⣤⢈⠌⣱⠢⢓⠩⣁⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢘⡜⣁⢣⠜⡈⠆⡢⠁⢰⢰⣾⣷⡄⠻⣷⠿⣧⣨⣽⣗⡈⠫⢯⣹⠣⣉⡿⠱⠠⢟⢲⡽⢡⢸⣿⣻⢿⢽⢍⢒⡀⡀⠀⠀⠀⠀⠰⠤⢢⠐⣌⢡⠁⠔⢪⠄⠀⠀⠀⠀⠀⠀⠀⠀
⣎⡠⠗⢌⣓⡈⢆⠁⠀⢠⡨⣽⣾⣿⣷⡬⡩⣍⡛⢋⠾⠻⢶⠆⠀⠀⢁⢉⣐⣀⣘⣀⡀⠵⠩⠴⠨⢋⣠⣾⡿⣱⠌⠄⠀⠀⠀⠀⠈⠞⡉⢄⠢⡙⡘⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠄⠇⡐⣆⠳⠘⢇⠀⡀⡉⢹⣦⣭⠿⣿⣪⢽⣓⣛⣝⡻⣭⡵⢀⣴⡾⠿⣿⣿⣿⢳⣿⣷⣶⡄⠐⠛⢽⢿⡶⡟⢃⣢⣶⣷⣀⠀⡀⠀⠐⠰⣌⠲⡐⡉⡉⢆⢊⡰⠀⡀⠀⠀⠀⠀
⢥⣃⠐⠈⢳⠀⠜⠆⠀⢹⣠⣙⣿⠻⢿⣳⠏⠛⢚⡏⡹⠖⢠⣮⣿⣤⣤⠿⠿⢿⣿⣀⢉⣿⣯⡇⠀⠲⠤⢤⣶⢟⣿⡿⡊⠐⢴⡀⠀⠠⠑⡢⢀⡅⢒⢂⡣⢆⡔⠒⢘⡠⢁⡂⣀
⢱⠌⡒⢌⡀⢦⠸⡄⠄⠈⢛⠿⢿⣷⢾⢿⣃⢳⣶⣮⣁⠂⣼⣿⣵⣿⣿⣧⣤⣾⣟⣿⡯⣿⠗⢡⣶⣾⣾⠈⢽⣦⡶⢷⣷⣿⣿⣏⠀⠀⠠⠐⠡⡌⣕⠢⡐⠢⠌⣡⠃⠴⠉⢰⠀
⠂⢣⡑⠄⠉⡄⡈⡉⠞⣄⠠⠉⢿⣷⡯⢜⢺⠌⢻⣿⣵⠎⣽⡿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣇⠸⣵⣯⡹⠅⣰⡜⢨⢌⣙⢛⣻⠙⣡⡬⠁⠀⠄⢂⠀⠆⠐⣠⠑⣈⠔⡒⠭⣐⠌⠒
⠤⠂⠎⣓⢨⠕⡲⢤⠂⡄⢆⣈⡀⠉⠸⢱⣩⢷⡄⢻⣿⣿⣿⣷⣾⣾⣙⣟⣿⣿⣿⣿⣿⣿⢧⡬⡷⠃⠀⡠⠔⣻⣿⡿⣿⣿⣿⣿⠿⠃⠀⢀⡒⠚⢠⠣⠔⡤⠘⡄⢚⠐⡈⠍⢃
⣀⡉⡀⢆⠈⠸⠀⡉⠈⢸⢸⣰⠉⡇⢀⠱⠈⠉⠉⠀⣿⣾⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢀⢀⡈⠹⢾⣿⣿⡿⠹⠆⠀⠁⢆⠉⠀⠀⡎⢰⠁⠰⡆⢉⠎⠁⠈⣁
⡔⢦⠑⡪⠔⣦⡔⢠⠐⡤⠈⠡⣍⠸⠅⢂⠒⠤⡀⠐⢹⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠰⠻⠿⢷⡾⠣⢈⠄⠀⠤⡀⠠⠀⠀⠖⡀⠄⠀⠀⠉⢄⠂⠀⠁⡄
⢐⠄⣉⠙⣢⠅⠶⣉⢏⡒⣉⠲⠌⠡⠨⣍⠚⡐⠡⠒⢸⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠉⠁⠔⠠⠀⠀⠈⠐⢀⠁⠦⠀⢈⡄⠱⡁⢈⠂⠌⡄⢃⢂⠁⠀
⠘⠦⡐⢫⡰⢉⠀⠌⠁⡑⠠⠳⠀⣘⠣⠀⢤⡉⠌⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠠⠆⠤⢃⠀⠠⠖⡀⠠⠒⠈⠖⣢⠑⠂⣨⠂⠁⢐⠎⡀⠀⠒
⠴⣠⠰⠣⡜⢂⢃⡊⠵⡀⠠⢁⠠⡡⠅⢋⠒⡘⢈⣤⣿⣿⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⡿⢽⡆⠘⠠⠂⡍⠌⡁⡘⢡⡡⠜⠴⢀⠠⠘⠠⡑⢠⠔⢂⡡⠄⠃
⡜⢠⠓⠑⠉⠓⡈⣍⠑⡘⠠⠮⠑⠆⠉⣐⣤⣼⣿⣿⣷⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣎⣷⡁⢉⡆⢅⠢⡑⠊⢌⠠⠁⢃⡄⠂⡅⣀⢒⠢⢌⠣⡜⢐⠱⠈⡖⣁⠢⣑
⢃⠢⠔⣊⠜⡁⢶⣈⠒⣁⠒⠤⡛⣘⠤⠙⠟⠿⠿⠝⢛⡋⢉⠙⠛⠯⠽⡯⡗⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢏⠃⡔⠐⢌⢠⠁⢃⡄⠂⡅⣀⢒⠢⢌⠣⡜⢐⠱⠈⡖⣁⠢⣑
⠉⠀⠙⠀⢊⡙⠬⡌⠊⢁⠈⢃⠅⢣⢄⠮⡑⠶⠐⢎⠴⡀⢧⠒⢬⢺⡀⢤⠈⠁⢶⢾⣿⣷⣿⣿⣽⣿⣿⣿⡏⠃⠰⡀⠌⠂⠆⠐⢂⠬⠙⠌⢠⢃⡸⠤⠓⠜⣂⠣⠤⡼⠄⣀⠃
⡐⠲⢀⠺⣁⠬⠀⠄⢂⡌⡐⡈⢚⡂⠌⡡⢭⢃⠛⡄⠓⢬⢃⠘⠲⠴⢘⠄⣩⢒⡌⠙⠻⣿⠿⡿⣿⣿⣚⠂⢀⡖⠁⡀⠐⠀⡂⠤⢈⠖⠹⡌⠂⠦⡜⢠⡙⠜⣀⢣⠐⣈⢐⣄⢂
⠐⠣⢂⠡⢤⡐⡄⠒⡅⢠⠅⠙⠒⢈⠰⢑⠠⠒⠈⠐⠨⠄⠈⠒⡡⠃⠜⢈⠀⠁⠆⠤⡀⠸⡚⠼⢷⡟⠁⠀⢀⠀⠂⠐⠉⠖⣁⡒⢌⣠⠑⢠⠀⠓⡈⠒⠀⠋⣠⠂⣜⢂⠣⡌⢤
⢂⠵⢁⠆⠤⡑⠬⠅⢔⠂⢡⠂⢂⠈⠐⠈⠂⡌⠀⠆⡐⠠⢁⡉⠥⡁⢃⠀⠣⠀⠈⡐⠁⡀⠩⣃⣢⠂⠔⠠⠄⣁⠦⠑⠌⡱⢄⡘⠀⠁⡐⠠⠈⢀⠐⠤⢒⠩⣀⠟⡄⠉⡁⢀⠦
⠈⠶⠆⣾⠰⠀⠀⢀⠀⠶⢀⠾⡀⠁⢀⠉⡆⠰⢀⠀⠀⠶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠀⡰⠆⠹⠆⠀⡸⢀⠈⠀⡀⠆⢀⡰⠆⡉⠀⠇⠰⢀⢁⠀⡆⠀⠀⡀⠎⢰⠰⠀⢀⠆⡀
⠡⢂⠣⡀⢃⡜⠰⣀⠊⠔⠁⣀⠤⠁⡂⠄⠠⢁⠃⠔⡈⠰⠈⢁⠒⠄⠀⣀⠂⠀⠁⠠⣐⠀⣀⢀⠀⠆⠑⠌⠁⣀⢡⠰⡉⣄⠳⠀⢃⢀⠃⡞⠀⣐⠀⠢⠄⡀⠈⢊⠓⡬⡉⢂⠀
⠩⠔⡔⠠⣇⠘⠰⢌⡵⡂⠴⣉⠖⠱⢒⠋⡒⠄⢎⠒⢡⡉⠁⠂⠄⠠⠀⠤⠐⠠⡈⢅⡂⠧⢄⠎⡡⢄⠂⢀⡀⠆⠂⠄⠠⠄⡁⢋⠌⠠⠉⠀⠂⢀⠠⠐⠠⠑⢈⠒⣈⠰⡁⠈⣠
⡐⢍⠢⡅⠢⢉⠃⡌⠒⡔⡒⣄⡘⢃⡋⠦⣅⠎⠴⢀⠄⡀⠠⠐⠠⢃⡈⢘⡈⠱⢈⠠⠈⠔⠢⢌⠴⠈⠁⠃⠈⡱⢈⠚⠐⠡⠃⠊⠀⢂⠄⠄⢐⠂⠄⢁⠂⡜⠂⢁⠀⡠⠥⢄⠥
⠈⠇⢖⢨⡡⠄⠘⡠⠓⠴⠁⢲⠘⢆⡰⡙⠬⡙⢆⢊⡱⠐⢍⡢⠑⠪⠔⠠⠌⢡⢀⡒⢈⣌⠑⠀⠀⡀⢰⡒⢤⣡⠁⡀⠦⣀⣀⠂⣂⠁⠀⢠⢈⠐⢨⢃⠁⡐⠡⠌⢌⠱⠈⠄⠠
⡚⡀⢱⠂⣆⢒⠀⠡⠥⠃⠄⢠⡙⣈⠤⠳⢈⠥⡘⠄⡁⠜⠢⡔⢉⠔⣉⠔⡪⢀⡁⡘⢂⠈⢠⡔⡩⠡⠖⣰⠂⡬⣡⢢⠉⠒⡐⠌⠀⣀⠔⣠⢌⡂⢤⡈⠎⠔⠋⡒⢎⡐⣀⠦⢱`

    // Seleciona a string ASCII correta com base no tipo
    const mushroom = type === 'failure' ? mushroomFail : mushroomSuccess
    const lines = mushroom.split('\n')

    // Itera por cada linha da string ASCII para centralizá-la e colori-la
    lines.forEach(line => {
        if (line.trim().length > 0) {
            const txt = padCenter(line, 190) // Centraliza com largura ajustada para 190 caracteres
            
            // Lógica de cores simplificada conforme solicitado:
            if (type === 'failure') {
                // Se falhou: TUDO VERMELHO (chalk.red)
                console.log(chalk.red(txt))
            } else {
                // Se passou: TUDO VERDE (chalk.green)
                console.log(chalk.green(txt))
            }
        }
    })
}

// FUNÇÃO PRINCIPAL (MAIN LOOP) 
const run = async () => {
    // Sequência de inicialização visual
    renderHeader()            // Exibe o título
    await selectUserProfile() // Aguarda a seleção do usuário
    renderSystemTelemetry()   // Exibe dados do sistema
    renderProfileLoad()       // Exibe perfil carregado

    // Aviso de início dos testes
    console.log(chalk.bgHex('#333').hex(CURRENT_USER.themePrimary).bold('  INICIALIZANDO MOTOR DE TESTES...  '))
    console.log(chalk.gray(`   Alvo: Electron (Headless) | Spec Pattern: cypress/e2e/**/* \n`))

    const startTime = Date.now() // Marca o tempo de início para calcular duração

    try {
        // Executa o Cypress via API do Node.js
        const results = await cypress.run({
            browser: 'electron', // Navegador utilizado
            headless: true,      // Modo sem interface gráfica (mais rápido)
            quiet: true,         // Menos logs no terminal nativo do Cypress
            config: {
                video: false,    // Não grava vídeo para economizar recursos
                screenshotOnRunFailure: false // Não tira print ao falhar
            }
        })

        const duration = Date.now() - startTime // Tempo total decorrido
        console.log('\n' + separator('━'))
        
        // Verifica se o Cypress quebrou antes mesmo de testar (erro de configuração, etc)
        if (results.status === 'failed') {
            console.error(chalk.red.bold('CRÍTICO: FALHA AO INICIAR O RUNNER DO CYPRESS'))
            process.exit(1)
        }

        // Consolida as estatísticas finais
        const stats = {
            total: results.totalTests,
            passed: results.totalPassed,
            failed: results.totalFailed,
            pending: results.totalPending,
            skipped: results.totalSkipped,
            duration: results.totalDuration
        }

        // Cálculos de métricas de qualidade
        const qualityScore = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0
        const stabilityIndex = Math.max(0, 100 - (stats.failed * 15)) // Penaliza estabilidade por falhas
        const avgTimePerTest = stats.total > 0 ? (stats.duration / stats.total).toFixed(2) : 0
        const throughput = stats.duration > 0 ? (stats.total / (stats.duration / 1000)).toFixed(2) : 0 // Testes por segundo

        // --- EXIBIÇÃO DO RELATÓRIO GERAL ---
        console.log(chalk.hex(CURRENT_USER.themePrimary).bold(' ➤ RELATÓRIO DE EXECUÇÃO E ANÁLISE'))
        
        // Tabela formatada manualmente
        console.log(chalk.white(`
    ┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
    │ MÉTRICA                 │ VALOR                   │ STATUS                  │
    ├─────────────────────────┼─────────────────────────┼─────────────────────────┤
    │ Suites Totais           │ ${String(results.totalSuites).padEnd(23)} │ ${chalk.blue('INFO')}                    │
    │ Testes Totais           │ ${String(stats.total).padEnd(23)} │ ${chalk.blue('INFO')}                    │
    │ Passou                  │ ${chalk.green(String(stats.passed).padEnd(23))} │ ${chalk.green('OK')}                      │
    │ Falhou                  │ ${stats.failed > 0 ? chalk.red(String(stats.failed).padEnd(23)) : chalk.gray(String(stats.failed).padEnd(23))} │ ${stats.failed > 0 ? chalk.red('CRÍTICO') : chalk.green('OK')}                      │
    │ Pendente/Pulado         │ ${chalk.yellow(String(stats.pending + stats.skipped).padEnd(23))} │ ${chalk.yellow('ATENÇÃO')}                 │
    │ Tempo Total             │ ${String(stats.duration + 'ms').padEnd(23)} │ ${chalk.blue('INFO')}                    │
    │ Média por Teste         │ ${String(avgTimePerTest + 'ms').padEnd(23)} │ ${avgTimePerTest > 5000 ? chalk.yellow('LENTO') : chalk.green('RÁPIDO')}                  │
    │ Throughput (T/s)        │ ${String(throughput).padEnd(23)} │ ${chalk.blue('VELOCIDADE')}              │
    └─────────────────────────┴─────────────────────────┴─────────────────────────┘
        `))

        // EXIBIÇÃO DE KPIS (Key Performance Indicators)
        console.log(chalk.hex(CURRENT_USER.themePrimary).bold(' ➤ KPI & QUALIDADE'))
        
        // Barra de progresso visual
        const barWidth = 40
        const filled = Math.round((qualityScore / 100) * barWidth)
        const empty = barWidth - filled
        const progressBar = '█'.repeat(filled) + chalk.hex('#333')('░'.repeat(empty))
        
        // Determina a cor da pontuação
        let scoreColor = chalk.green
        if(qualityScore < 80) scoreColor = chalk.yellow
        if(qualityScore < 50) scoreColor = chalk.red

        // Avaliação de risco baseada em falhas e pontuação
        let riskAssessment = 'BAIXO'
        let riskColor = chalk.green
        if(stats.failed > 0) { riskAssessment = 'MÉDIO'; riskColor = chalk.yellow; }
        if(stats.failed > 2 || qualityScore < 70) { riskAssessment = 'ALTO'; riskColor = chalk.red; }

        console.log(`   Pontuação de Qualidade : [${scoreColor(progressBar)}] ${scoreColor(qualityScore + '%')}`)
        console.log(`   Índice de Estabilidade : ${stabilityIndex === 100 ? chalk.green('A+ (Excelente)') : chalk.yellow('B (Requer Revisão)')}`)
        console.log(`   Avaliação de Risco     : ${riskColor(riskAssessment)}`)
        
        console.log('\n' + separator('─'))

        // DETALHAMENTO DOS TESTES (TABELA INDIVIDUAL)
        console.log(chalk.hex(CURRENT_USER.themePrimary).bold(' ➤ DETALHAMENTO DE CASOS DE TESTE'))
        
        // Cabeçalho da tabela de detalhes
        console.log(chalk.white(`
    ┌──────────┬────────────────────────────────────────┬──────────────────────────────────────────────────┐
    │ STATUS   │ SUITE / ARQUIVO                        │ CENÁRIO                                          │
    ├──────────┼────────────────────────────────────────┼──────────────────────────────────────────────────┤`))

        // Itera sobre as execuções (runs) para detalhar cada teste
        if (results.runs && results.runs.length > 0) {
            results.runs.forEach(run => {
                const specName = run.spec.name.split('\\').pop().split('/').pop() // Limpa o caminho do arquivo
                
                if (run.tests && run.tests.length > 0) {
                    run.tests.forEach(test => {
                        let statusStr = 'UNKNOWN'
                        let statusColor = chalk.gray
                        
                        // Define texto e cor baseado no estado do teste
                        if (test.state === 'passed') {
                            statusStr = '✔ PASSOU'
                            statusColor = chalk.green
                        } else if (test.state === 'failed') {
                            statusStr = '✖ FALHOU'
                            statusColor = chalk.red
                        } else if (test.state === 'pending' || test.state === 'skipped') {
                            statusStr = '○ PULOU '
                            statusColor = chalk.yellow
                        }

                        // Formatação para evitar que textos longos quebrem a tabela
                        const testNameRaw = test.title[test.title.length - 1] || 'Sem Nome'
                        const suiteNameRaw = test.title.slice(0, -1).join(' > ') || specName

                        const COL_SUITE_W = 38
                        const COL_TEST_W = 48
                        
                        const suiteFmt = suiteNameRaw.length > COL_SUITE_W 
                            ? suiteNameRaw.substring(0, COL_SUITE_W - 3) + '...' 
                            : suiteNameRaw.padEnd(COL_SUITE_W)
                            
                        const testFmt = testNameRaw.length > COL_TEST_W 
                            ? testNameRaw.substring(0, COL_TEST_W - 3) + '...' 
                            : testNameRaw.padEnd(COL_TEST_W)

                        // Imprime a linha da tabela
                        console.log(`    │ ${statusColor(statusStr.padEnd(8))} │ ${chalk.cyan(suiteFmt)} │ ${chalk.white(testFmt)} │`)
                    })
                }
            })
        } else {
             // Caso não encontre testes
            console.log(`    │ ${chalk.gray('N/A     ')} │ ${chalk.gray('Nenhum teste encontrado'.padEnd(38))} │ ${chalk.gray('Verifique seus arquivos de spec'.padEnd(48))} │`)
        }

        console.log(chalk.white(`    └──────────┴────────────────────────────────────────┴──────────────────────────────────────────────────┘`))

        console.log(separator('━'))

        // RESULTADO FINAL E ARTE ASCII
        if (stats.failed > 0) {
            // Se houver falhas: Imprime mensagem de erro e cogumelo vermelho
            console.log(chalk.bgRed.white.bold(`  FALHA  `) + chalk.red(` ${stats.failed} testes não passaram nos portões de qualidade.`))
            renderMushroom('failure', null) // Tipo failure ativa a cor vermelha na função
            process.exit(1) // Sai com código de erro
        } else {
            // Se tudo passar: Imprime sucesso e cogumelo verde
            console.log(chalk.bgGreen.black.bold(`  SUCESSO  `) + chalk.green(` Todos os critérios de qualidade foram atendidos.`))
            renderMushroom('success', null) // Tipo success ativa a cor verde na função
            process.exit(0) // Sai com sucesso
        }

    } catch (error) {
        // Tratamento de erros fatais de execução do script
        console.error(separator('!'))
        console.error(chalk.red.bold(' EXCEÇÃO DE ERRO FATAL'))
        console.error(chalk.red(error.message))
        console.error(separator('!'))
        process.exit(1)
    }
}

// Inicia a execução do script
run()