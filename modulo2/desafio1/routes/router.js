const express = require('express')
const router = express.Router()
const fs = require('fs').promises

/**
 * Listar todos os estados
 */
router.get('/estados', async (req, res) => {
  try {
    let estados = await fs.readFile(global.estados, 'utf-8')

    res.send(JSON.parse(estados))
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * Listar cidades de acordo com o ID do estado
 */
router.get('/cidades/:idEstado/estado', async (req, res) => {
  try {
    let data = await fs.readFile(global.cidades, 'utf-8')
    data = JSON.parse(data)
    const cidades = data.filter(cidade => cidade.Estado === req.params.idEstado)

    res.send(cidades)
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 1) Implementar um método que irá criar um arquivo JSON para cada estado representado no arquivo Estados.json, e o seu conteúdo 
 * será um array das cidades pertencentes aquele estado, de acordo com o arquivo Cidades.json. O nome do arquivo deve ser o UF do estado, por exemplo: MG.json.
 */
router.get('/criarArquivosEstadosComSuasCidades', async (req, res) => {
  try {
    const estados = await fs.readFile(global.estados, 'utf-8')
    const estadosJson = JSON.parse(estados)
    const cidades = await fs.readFile(global.cidades, 'utf-8')
    const cidadesJson = JSON.parse(cidades)

    estadosJson.forEach(estado => {
      const cidades = cidadesJson.filter(cidade => cidade.Estado === estado.ID)
      let nomeArquivo = `./data/result/${estado.Sigla}.json`
      fs.writeFile(nomeArquivo, JSON.stringify(cidades))
    });

    res.send({ result: 'Sucesso' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 2) Criar um método que recebe como parâmetro o UF do estado, realize a leitura do arquivo JSON correspondente e retorne a quantidade de cidades daquele estado.
 */
router.get('/cidades/:uf', async (req, res) => {
  try {
    const arquivo = `./data/result/${(req.params.uf).toUpperCase()}.json`
    const cidades = await fs.readFile(arquivo, 'utf-8')

    res.send({ quantidadeTotalCidades: JSON.parse(cidades).length })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 3) Criar um método que imprima no console um array com o UF dos cinco estados que mais possuem cidades, 
 * seguidos da quantidade, em ordem decrescente. Utilize o método criado no tópico anterior. 
 * Exemplo de impressão: [“UF - 93”, “UF - 82”, “UF - 74”, “UF - 72”, “UF - 65”]
 */
router.get('/maisCidadesPorUF', async (req, res) => {
  let results = [];

  try {
    let estados = await fs.readFile(global.estados, 'utf-8')
    estados = JSON.parse(estados)
    let cidades = await fs.readFile(global.cidades, 'utf-8')
    cidades = JSON.parse(cidades)

    estados.forEach(estado => {
      const result = cidades.filter(cidade => cidade.Estado == estado.ID)
      results.push({ uf: estado.Sigla, qtd: result.length })
    });

    results.sort(function (a, b) {
      return a.qtd > b.qtd ? -1 : a.qtd < b.qtd ? 1 : 0;
    });

    res.send({ resultado: results.slice(0, 5) })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 4) Criar um método que imprima no console um array com o UF dos cinco estados que menos possuem cidades, 
 * seguidos da quantidade, em ordem decrescente. Utilize o método criado no tópico anterior. 
 * Exemplo de impressão: [“UF - 30”, “UF - 27”, “UF - 25”, “UF - 23”, “UF - 21”]
 */
router.get('/menosCidadesPorUF', async (req, res) => {
  let results = [];

  try {
    let estados = await fs.readFile(global.estados, 'utf-8')
    estados = JSON.parse(estados)
    let cidades = await fs.readFile(global.cidades, 'utf-8')
    cidades = JSON.parse(cidades)

    estados.forEach(estado => {
      const result = cidades.filter(cidade => cidade.Estado == estado.ID)
      results.push({ uf: estado.Sigla, qtd: result.length })
    });

    results.sort(function (a, b) {
      return a.qtd < b.qtd ? -1 : a.qtd > b.qtd ? 1 : 0;
    });

    res.send({ resultado: results.slice(0, 5) })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 5) Criar um método que imprima no console um array com a cidade de maior nome de cada estado, seguida de seu UF. 
 * Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro. 
 * Por exemplo: [“Nome da Cidade – UF”, “Nome da Cidade – UF”, ...].
 */
router.get('/cidadeComMaiorNomePorEstado', async (req, res) => {
  let results = [];

  try {
    let estados = await fs.readFile(global.estados, 'utf-8')
    estados = JSON.parse(estados)
    let cidades = await fs.readFile(global.cidades, 'utf-8')
    cidades = JSON.parse(cidades)

    estados.forEach(estado => {
      let maiorNome = ''
      cidades.filter((cidade) => {
        if (cidade.Estado == estado.ID) {
          if ((cidade.Nome).length > maiorNome.length) {
            maiorNome = cidade.Nome
          }
        }
      })
      results.push({ uf: estado.Sigla, maiorNome: maiorNome })
    });

    res.send({ resultado: results })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 6) Criar um método que imprima no console um array com a cidade de menor nome de cada estado, seguida de seu UF. Em caso de empate, 
 * considerar a ordem alfabética para ordená-los e então retorne o primeiro. 
 * Por exemplo: [“Nome da Cidade – UF”, “Nome da Cidade – UF”, ...].
 */
router.get('/cidadeComMenorNomePorEstado', async (req, res) => {
  let results = [];

  try {
    let estados = await fs.readFile(global.estados, 'utf-8')
    estados = JSON.parse(estados)
    let cidades = await fs.readFile(global.cidades, 'utf-8')
    cidades = JSON.parse(cidades)

    estados.forEach(estado => {
      let menorNome = 'cidadeComMenorNomePorEstado'
      cidades.filter((cidade) => {
        if (cidade.Estado == estado.ID) {
          if ((cidade.Nome).length < menorNome.length) {
            menorNome = cidade.Nome
          }
        }
      })
      results.push({ uf: estado.Sigla, menorNome: menorNome })
    });

    res.send({ resultado: results })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 7) Criar um método que imprima no console a cidade de maior nome entre todos os estados, seguido do seu UF. 
 * Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro. 
 * Exemplo: “Nome da Cidade - UF".
 */
router.get('/cidadeComMaiorNomeEntreTodosEstados', async (req, res) => {
  let results = [];

  try {
    let estados = await fs.readFile(global.estados, 'utf-8')
    estados = JSON.parse(estados)
    let cidades = await fs.readFile(global.cidades, 'utf-8')
    cidades = JSON.parse(cidades)

    let maiorCidadeNome = ''
    let estadoNome = ''
    cidades.forEach((cidade) => {
      if ((cidade.Nome).length > maiorCidadeNome.length) {
        maiorCidadeNome = cidade.Nome
        estados.find(estado => {
          if (cidade.Estado == estado.ID) {
            estadoNome = estado.Sigla
          }
        })
      }
    })
    results.push({ uf: estadoNome, maiorCidadeNome: maiorCidadeNome })

    res.send({ resultado: results })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 8) Criar um método que imprima no console a cidade de menor nome entre todos os estados, seguido do seu UF. 
 * Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro. 
 * Exemplo: “Nome da Cidade - UF".
 */
router.get('/cidadeComMenorNomeEntreTodosEstados', async (req, res) => {
  let results = [];

  try {
    let estados = await fs.readFile(global.estados, 'utf-8')
    estados = JSON.parse(estados)
    let cidades = await fs.readFile(global.cidades, 'utf-8')
    cidades = JSON.parse(cidades)

    let menorCidadeNome = 'cidadeComMenorNomeEntreTodosEstados'
    let estadoNome = ''
    cidades.forEach((cidade) => {
      if ((cidade.Nome).length < menorCidadeNome.length) {
        menorCidadeNome = cidade.Nome
        estados.find(estado => {
          if (cidade.Estado == estado.ID) {
            estadoNome = estado.Sigla
          }
        })
      }
    })
    results.push({ uf: estadoNome, menorCidadeNome: menorCidadeNome })

    res.send({ resultado: results })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})


module.exports = router