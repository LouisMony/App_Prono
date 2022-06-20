const Database_URL = "https://secret-hamlet-62040.herokuapp.com"

const bet_section = document.querySelector('#displayBet')
const form = document.querySelector('form');

const match_select = document.getElementById('match-select');
const player_select = document.getElementById('player-select');

function loadNameOptions(){
    match_select.innerHTML = '';
    player_select.innerHTML = '';

    axios.get(Database_URL+'/api/classements', {})
    .then(function (response) {
        response.data.data.forEach(item => {
            const player_name = item.attributes.nom
            player_select.innerHTML += '<option value="'+player_name+'">'+player_name+'</option>'

            player_select.value = localStorage.getItem('currentplayerselect');
        });
        loadMatch()
    })  
}

function loadMatch(){
    var match_list = []

    axios.get(Database_URL+'/api/pronos/?filters[nom][$eq]='+player_select.value+'', {})
    .then(function (response) {
        response.data.data.forEach(item => {
            match_list.push(item.attributes.match_id)
        });
    })

    axios.get(Database_URL+'/api/matches', {})
    .then(function (response) {
        match_select.innerHTML = ''
        response.data.data.forEach(item => {
            const match_name = item.attributes.match_id
            if (match_list.includes(match_name)){}
            else {
                match_select.innerHTML += '<option value="'+match_name+'">'+match_name+'</option>'
            }
        });
    })
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const player_name = document.querySelector('#player-select').value;
    const match_name = document.querySelector('#match-select').value;
    const score_A = document.querySelector('#score_a').value;
    const score_B = document.querySelector('#score_b').value;

    addBet(player_name, match_name, score_A, score_B);  

});

function addBet(player_name, match_name, score_A, score_B){
    axios.post(Database_URL+'/api/pronos', {
        data:{
            match_id: match_name,
            score_a: score_A,
            score_b: score_B,
            nom: player_name
        }
    })
    .then((response) => {
        localStorage['currentplayerselect'] = player_select.value;
        location.reload();
    }, 
    (error) => {console.log(error);});
}

player_select.addEventListener("change", loadMatch);

loadNameOptions()
