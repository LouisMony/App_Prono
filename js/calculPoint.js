function calculPoint(){
    for (let i = 1; i < 14; i++) {
        axios.put('http://localhost:1337/api/classements/'+i+'', {
            data:{
                total_score: 0,
                total_seum: 0,
            }
        })
    }

    axios.get('http://localhost:1337/api/matches', {})
    .then(function (response) {
        response.data.data.forEach(item => {
            const id = item.attributes.match_id
            const score_A = item.attributes.score_a
            const score_B = item.attributes.score_b
            const match_finis = item.attributes.match_finis
            const bonus = item.attributes.bonus

            if (match_finis === true){
                axios.get('http://localhost:1337/api/pronos?filters[match_id][$eq]='+id+'', {})
                .then(function (response) {
                    const pronolist = response.data.data
                    pronolist.forEach(item => {
                        const nom = item.attributes.nom
                        var count_point = 0;
                        var resultat = calcScore(item, score_A, score_B, bonus, count_point, true)

                        axios.get('http://localhost:1337/api/classements?filters[nom][$eq]='+nom+'', {})
                        .then(function (response) {
                            name_id = response.data.data[0].id
                            name_score = response.data.data[0].attributes.total_score
                            

                            axios.put('http://localhost:1337/api/classements/'+name_id+'', {
                                data:{
                                    total_score: name_score + resultat,
                                }
                            })          
                        }) 
                    })
                    
                    pronolist.forEach(item => {
                        const nom = item.attributes.nom
                        var count_pointseum = 0;
                        var seum = calcSeum(item, score_A, score_B, bonus, count_pointseum )
                        
                        
                        axios.get('http://localhost:1337/api/classements?filters[nom][$eq]='+nom+'', {})
                        .then(function (response) {
                            name_id = response.data.data[0].id
                            name_seum = response.data.data[0].attributes.total_seum
                            name_score = response.data.data[0].attributes.total_score
                            
                            axios.put('http://localhost:1337/api/classements/'+name_id+'', {
                                data:{
                                    total_seum: name_seum + seum,
                                }
                            }),(error) => {console.log(error)}
                            sortUser()
                        }) 

                    }) 
                }),(error) => {console.log(error)}
            }
            
        });
    })
    
}

function calcScore(item, score_A, score_B, bonus, result, boolean, pA, pB){
    if (boolean === true){
        var prono_A = item.attributes.score_a
        var prono_B = item.attributes.score_b
    }
    else {
        var prono_A  = pA
        var prono_B = pB
    }

    result = 0;
    var bon_score = false;
    
    if (score_A === prono_A && score_B === prono_B){
        result = result + 10
    bon_score = true
    }
    
    if (bon_score === false){
        
        var prediction = ''
        var resultat = ''
        
        if(score_A > score_B){resultat = 'A win'}
        if(score_A < score_B){resultat = 'B win'}
        if(score_A === score_B){resultat = 'nul'}
        
        if(prono_A > prono_B){
            prediction = 'A win'
        }
        if(prono_A < prono_B){prediction = 'B win'}
        if(prono_A === prono_B){prediction = 'nul'}
        
        if (prediction === resultat){
            result = result + 3
        }
    }
    
    if(bonus === true){
        result = result * 2
    }
    return result
}

function calcSeum(item, score_A, score_B, bonus, count_pointseum ){
    var prono_A = item.attributes.score_a
    var prono_B = item.attributes.score_b

    var seum1 = calcScore(item, score_A, score_B, bonus, count_pointseum, false, prono_A + 1, prono_B )
    var seum2 = calcScore(item, score_A, score_B, bonus, count_pointseum, false, prono_A - 1, prono_B )
    var seum3 = calcScore(item, score_A, score_B, bonus, count_pointseum, false, prono_A, prono_B + 1 )
    var seum4 = calcScore(item, score_A, score_B, bonus, count_pointseum, false, prono_A, prono_B - 1 )
    var seum5 = calcScore(item, score_A, score_B, bonus, count_pointseum, false, prono_A, prono_B )

    var tabSeum = [seum1, seum2, seum3, seum4, seum5]
    var seum = Math.max(...tabSeum);

    return seum
}

const user_section = document.querySelector('#displayuser')
var usersArr = []

function sortUser(){
    axios.get('http://localhost:1337/api/classements', {})
    .then(function (response) {
        user_section.innerHTML = '';
        usersArr = []
        response.data.data.forEach(item => {
            const name_id = item.id
            const name = item.attributes.nom
            const score = item.attributes.total_score
            const total_seum = item.attributes.total_seum
            
            var coef_seum = (total_seum/score).toFixed(2);
            if(isNaN(coef_seum) || coef_seum == Number.POSITIVE_INFINITY){
                coef_seum = 1.00
            }
            usersArr.push({name, score, coef_seum, total_seum})

            axios.put('http://localhost:1337/api/classements/'+name_id+'', {
                data:{
                    coef_seum: coef_seum,
                }
            })
            displayTable()
        });
        

        
    })
   
}

const score_columns = document.getElementById('score_column')
const score_seum_columns = document.getElementById('score_seum_columns')
const seum_columns = document.getElementById('seum_columns')

function sortTable(column){
    usersArr = usersArr.sort((a,b) => a[column] < b[column] ? 1 : -1) 
    displayTable()
}

function displayTable(){
    user_section.innerHTML = ''
    usersArr.forEach(item => {
        user_section.innerHTML += '<tr>'+
                                        '<td>'+item.name+'</td>'+
                                        '<td>'+item.score+'</td>'+
                                        '<td>'+item.total_seum+'</td>'+
                                        '<td>'+item.coef_seum+'</td>'+
                                  '<tr>'

    });
}

sortUser()
calculPoint()


