//Update Date
function updateDate(){
    const date_section = document.getElementById('date')
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yy = today.getFullYear().toString().slice(-2);
    today = dd + '/' + mm + '/' + yy;
    date_section.innerHTML = today
}
updateDate()

//Compettion Advancement
function getAdvancement(){
    const progress_bar = document.getElementById('progress_bar')
    axios.get('http://localhost:1337/api/matches', {})
    .then(function (response) {
        var played_match = 0
        response.data.data.forEach(item => {
            if(item.attributes.match_finis === true){
                played_match++
            }
        });
        played_match_percent = Math.round(((played_match/64)*100) * 10) / 10
        progress_bar.style.width = played_match_percent+"%";
    }) 
}
getAdvancement()

//ACTUAL MATCHES

var last_match
const drapeau_A_section = document.getElementById('drapeau_A_section')
const drapeau_B_section = document.getElementById('drapeau_B_section')
const score_section = document.getElementById('score_section')

function getActualMatch(){
    var done = false
    axios.get('http://localhost:1337/api/matches?populate=*', {})
    .then(function (response) {
        response.data.data.forEach(item => {
            if (item.attributes.match_finis === false && done === false){
                last_match = item
                done = true
            }
        })
        var drapeau_A = last_match.attributes.Drapeau_Equipe_A.data.attributes.formats.thumbnail.url
        var drapeau_B = last_match.attributes.Drapeau_Equipe_B.data.attributes.formats.thumbnail.url
        drapeau_A_section.style.backgroundImage = "url('http://localhost:1337"+drapeau_A+"')";
        drapeau_B_section.style.backgroundImage = "url('http://localhost:1337"+drapeau_B+"')";

        var score_A = last_match.attributes.score_a
        var score_B = last_match.attributes.score_b
        score_section.innerHTML = ''+score_A+' - '+score_B+''

        getProno()
    }) 
}

getActualMatch()

//GET TWO PODIUM
function getClassement(){
    var usersArr = []

    const classements_classique_section = document.getElementById('classements_classique_section')
    const classements_coef_section = document.getElementById('classements_coef_section')
    axios.get('http://localhost:1337/api/classements', {})
    .then(function (response) {
        response.data.data.forEach(item => {
            const name = item.attributes.nom
            const score = item.attributes.total_score
            const coef_seum = item.attributes.coef_seum
            usersArr.push({name, score, coef_seum})
        });

        usersArr.sort((a, b) => a.score - b.score);
        usersArr = usersArr.reverse();
        const podiumArr = usersArr.slice(0, 3);

        classements_classique_section.innerHTML = ''
        classements_coef_section.innerHTML = ''

        podiumArr.forEach(item =>{
            classements_classique_section.innerHTML += '<span>'+item.name+' : '+item.score+'pts</span>'
            classements_coef_section.innerHTML += '<span>'+item.name+' : '+item.coef_seum+'</span>'
        })


    })
}
getClassement()

//GET PRONOSTRIQUE

const prono_section = document.getElementById('prono_section').querySelector('ul')

function getProno(){
    const match_id = last_match.attributes.match_id
    
    axios.get('http://localhost:1337/api/pronos?filters[match_id][$eq]='+match_id+'', {})
    .then(function (response) {
        prono_section.innerHTML = ''
        var i = 0;
        response.data.data.forEach(item => {i ++})
        if(i === 11){
            response.data.data.forEach(item => {
                const nom = item.attributes.nom
                const score_A = item.attributes.score_a
                const score_B = item.attributes.score_b
                prono_section.innerHTML += "<li>"+
                                                "<span class='prono_player_name'>"+nom+"</span>"+
                                                "<span class='player_prono'><span class='prono_scoreA'>"+score_A+"</span> - <span class='prono_scoreB'>"+score_B+"</span></span>"+
                                            "</li>"
            })
        }
        
        else{
            prono_section.innerHTML = "<li>Les pronostiques de ce match ne sont pas encore disponibles, ils apparaitront lorsque tous les joueurs auront donner leur pronostique</li>"
        }
        getGoodScore()
    }) 
    
}

function getGoodScore(){
    const playerprono = document.querySelectorAll('.player_prono')
    playerprono.forEach(item => {
        if (item.textContent === score_section.textContent){
            console.log('good');
            item.style.color = '#19ff9f'
        }
    })
}




