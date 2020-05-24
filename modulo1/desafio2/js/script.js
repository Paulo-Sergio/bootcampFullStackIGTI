let tabUsers = null;
let tabStatistics = null;

let allUsers = [];
let searchUsers = [];

let countUsers = 0;

let btnSearch = null;
let inputSearch = null;

let numberFormat = Intl.NumberFormat('pt-BR');

const loading = document.querySelector('#loading');

window.addEventListener('load', () => {
  setTimeout(() => {
    tabUsers = document.querySelector('#tabUsers');
    tabStatistics = document.querySelector('#tabStatistics');
    countUsers = document.querySelector('#countUsers');

    btnSearch = document.querySelector('#btnSearch');
    inputSearch = document.querySelector('#inputSearch');

    handlerButton();

    fetchUsers();
  }, 1000);
});

async function fetchUsers() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();

  allUsers = json.results;
  searchUsers = json.results;

  inputSearch.focus();
  loading.removeAttribute('src');
}

function render() {
  renderUsersList();
  renderStatistics();
}

function renderUsersList() {
  let usersHTML = '<div>';

  searchUsers.forEach(user => {
    const { name, dob, picture } = user;
    const userHTML = `
      <div class='media mb-3'>
          <img class='mr-3' src='${picture.thumbnail}' alt='${name.first}' />
          <div class="media-body mt-3">
            <span>${name.first} ${name.last}, ${dob.age}</span>
          </div>
      </div>
    `;

    usersHTML += userHTML;
  });
  usersHTML += '</div>';
  tabUsers.innerHTML = usersHTML;

  document.querySelector('#txtUsers').textContent = `${calcCountUsers()} usuários(s) encontrado(s)`;
}

function renderStatistics() {
  let statisticsHTML = `
    <span>Sexo masculino: <strong>${calcCountMales()}</strong></span> <br>
    <span>Sexo feminino: <strong>${calcCountFemales()}</strong></span> <br>
    <span>Soma das idades: <strong>${formatNumber(calcSumAges())}</strong></span> <br>
    <span>Média das idades: <strong>${formatNumber(calcAverageAges())}</strong></span> <br>
  `;

  document.querySelector('#txtStatistics').textContent = 'Estatísticas';
  tabStatistics.innerHTML = statisticsHTML;
}

function handlerButton() {
  btnSearch.addEventListener('click', () => {
    filterUsers();
  });

  inputSearch.addEventListener('keyup', (e) => {
    if (e.target.value.length > 0) {
      btnSearch.disabled = false;

      if (e.key === 'Enter') {
        filterUsers();
      }
    } else {
      btnSearch.disabled = true;
    }
  });
}

function filterUsers() {
  searchUsers = allUsers.filter(user => {
    const {first, last} = user.name;
    const fullName = first.toLowerCase() + last.toLowerCase();
    return fullName.includes(inputSearch.value.toLowerCase());
  });
  render();
}

function calcCountUsers() {
  return searchUsers.length;
}

function calcCountMales() {
  const usersMale = searchUsers.filter(user => user.gender === "male");
  return usersMale.length;
}

function calcCountFemales() {
  const usersFemale = searchUsers.filter(user => user.gender === "female");
  return usersFemale.length;
}

function calcSumAges() {
  const result = searchUsers.reduce((accumulator, current) => {
    return accumulator + current.dob.age;
  }, 0);
  return result;
}

function calcAverageAges() {
  const result = searchUsers.reduce((accumulator, current) => {
    return accumulator + current.dob.age;
  }, 0);
  
  return searchUsers.length === 0 ? 0 : (result / (searchUsers.length));
}

function formatNumber(number) {
  return numberFormat.format(number);
}