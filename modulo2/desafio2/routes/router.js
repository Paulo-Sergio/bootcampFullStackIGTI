const express = require('express')
const router = express.Router()
const fs = require('fs').promises

/**
 * 1) Crie um endpoint para criar uma grade. Este endpoint deverá receber como parâmetros os campos student, subject, type e value conforme descritos acima. 
 * Essa grade deverá ser salva no arquivo json grades.json, e deverá ter um id único associado. No campo timestamp deverá ser salvo a data e hora do momento da inserção. 
 * O endpoint deverá retornar o objeto da grade que foi criada. A API deverá garantir o incremento automático desse identificador, de forma que ele não se repita entre os registros. 
 * Dentro do arquivo grades.json que foi fornecido para utilização no desafio, o campo nextId já está com um valor definido. 
 * Após a inserção é preciso que esse nextId seja incrementado e salvo no próprio arquivo, de forma que na próxima inserção ele possa ser utilizado.
 */
router.post('/grades', async (req, res) => {
  let grade = req.body

  try {
    let data = await fs.readFile(global.grades, 'utf-8')
    let json = JSON.parse(data)

    grade = { id: json.nextId++, ...grade, timestamp: new Date().toISOString() }
    json.grades.push(grade)

    await fs.writeFile(global.grades, JSON.stringify(json))

    res.send({ result: 'Cadastrado com sucesso' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 2) Crie um endpoint para atualizar uma grade. Esse endpoint deverá receber como parâmetros o id da grade a ser alterada e os campos student, subject, type e value. 
 * O endpoint deverá validar se a grade informada existe, caso não exista deverá retornar um erro. Caso exista, o endpoint deverá atualizar as informações 
 * recebidas por parâmetros no registro, e realizar sua atualização com os novos dados alterados no arquivo grades.json.
 */
router.put('/grades/:id', async (req, res) => {
  let grade = req.body
  let idGrade = req.params.id

  try {
    let data = await fs.readFile(global.grades, 'utf-8')
    let json = JSON.parse(data)

    let index = json.grades.findIndex(i => i.id == idGrade)
    if (index < 0) {
      res.status(404).send({ error: 'Registro não encontrado' })
      return
    }

    json.grades[index].student = grade.student
    json.grades[index].subject = grade.subject
    json.grades[index].type = grade.type
    json.grades[index].value = grade.value

    await fs.writeFile(global.grades, JSON.stringify(json))

    res.send({ result: 'Atualizado com sucesso' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 3) Crie um endpoint para excluir uma grade. Esse endpoint deverá receber como parâmetro o id da grade e realizar sua exclusão do arquivo grades.json.
 */
router.delete('/grades/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.grades, 'utf-8')
    let json = JSON.parse(data)

    let grades = json.grades.filter(i => i.id != req.params.id)
    json.grades = grades

    await fs.writeFile(global.grades, JSON.stringify(json))

    res.send({ result: 'Excluido com sucesso' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 5) Crie um endpoint para consultar a nota total de um aluno em uma disciplina. O endpoint deverá receber como parâmetro o student e o subject, e realizar a 
 * soma de todas as notas de atividades correspondentes àquele subject, para aquele student. O endpoint deverá retornar a soma da propriedade 
 * value dos registros encontrados.
 */
router.get('/grades/student/:student/subject/:subject', async (req, res) => {
  let student = req.params.student
  let subject = req.params.subject

  try {
    let data = await fs.readFile(global.grades, 'utf-8')
    let json = JSON.parse(data)

    const filterGradesStudent = json.grades.filter(i => i.student == student)
    const filterGradesStudentSubject = filterGradesStudent.filter(i => i.subject == subject)

    const resultado = filterGradesStudentSubject.reduce((accumulator, current) => {
      return accumulator + current.value
    }, 0)

    res.send({ somaDasNotas: resultado })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})


/**
 * 6) Crie um endpoint para consultar a média das grades de determinado subject e type. O endpoint deverá receber como parâmetro um subject e um type, e retornar a média. 
 * A média é calculada somando o registro value de todos os registros que possuem o subject e type informados, dividindo pelo total de registros que possuem este 
 * mesmo subject e type.
 */
router.get('/grades/subject/:subject/type/:type', async (req, res) => {
  let subject = req.params.subject
  let type = req.params.type

  try {
    let data = await fs.readFile(global.grades, 'utf-8')
    let json = JSON.parse(data)

    const filterGradesSubject = json.grades.filter(i => i.subject == subject)
    const filterGradesSubjectType = filterGradesSubject.filter(i => i.type == type)

    const resultado = filterGradesSubjectType.reduce((accumulator, current) => {
      return accumulator + current.value
    }, 0)

    res.send({ somaDasNotas: resultado / (filterGradesSubjectType.length) })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

/**
 * 6) Crie um endpoint para retornar as três melhores grades de acordo com determinado subject e type. O endpoint deve receber como parâmetro
 *  um subject e um type, e retornar um array com os três registros de maior value daquele subject e type. A ordem deve ser do maior para o menor.
 */
router.get('/gradesTopValue/subject/:subject/type/:type', async (req, res) => {
  let subject = req.params.subject
  let type = req.params.type

  try {
    let data = await fs.readFile(global.grades, 'utf-8')
    let json = JSON.parse(data)

    const filterGradesSubject = json.grades.filter(i => i.subject == subject)
    const filterGradesSubjectType = filterGradesSubject.filter(i => i.type == type)

    filterGradesSubjectType.sort((a, b) => {
      return a.value > b.value ? -1 : a.value < b.value ? 1 : 0
    })

    res.send({ result: filterGradesSubjectType })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: err.message })
  }
})

module.exports = router