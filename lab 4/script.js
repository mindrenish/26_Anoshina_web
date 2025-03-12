function toggleDark(){
    var element = document.body;
    element.classList.toggle("dark-mode")
}

function storeInput(){

    const newReview = [{
            name: newName = document.getElementById("name").value,
            rating: newRating = document.getElementById("rating").value,
            text: newText = document.getElementById("text").value
    }]

    if (newReview[0].name == ''){
        alert("МУНДО СКАЗАЛ ЗАПОЛНИТЬ ИМЯ")
        return 0;
    }
    if (newReview[0].rating == 0){
        alert("МУНДО СКАЗАЛ ВЛЕПИТЬ ОЦЕНКУ (ЖЕЛАТЕЛЬНО ПЯТЬ (5))")
        return 0;
    }
    if (newReview[0].text==''){
        alert("МУНДО НЕ ЧИТАТЬ ОТЗЫВЫ БЕЗ ТЕКСТА")
        return 0;
    }
    if (newReview[0].rating == 1){
        alert("МУНДО ТЕБЕ ПРИПОМНИТ ЭТО")
    }

    let newRevStars = ""
    for (i = 1; i <=newReview[0].rating; i++){
        newRevStars += "★";
    }
    const newReviewParsed = "<div class='oneReview'><h3>"+ newReview[0].name +"</h3><p>"+ newRevStars +"</p><i>"+newReview[0].text+"</i></div>"

    reviewsParsed += newReviewParsed
    document.getElementById('review').innerHTML = reviewsParsed
    document.getElementById('form').reset()
}


    let reviewsParsed = ""
    let reviews = [{
            name: "Super Eva",
            rating: 5,
            text: "я так счастлива!я купила сотку за 50 а оказалось что она стоит 20"
        }, {
            name: "h0ruS",
            rating: 5,
            text: "$БОБЛОУ$ недорого!"
        }, {
            name: "saint",
            rating: 1,
            text: "тяжело отмыть аргентинские песо через Мундо, так как он печатает деньги на 4д принтере"
        }]

        reviews.forEach(rev => {
            let revStars = ""
            for (i = 1; i <=rev.rating; i++){
                revStars += "★";
            }
            reviewsParsed += "<div class='oneReview'><h3>"+ rev.name +"</h3><p>"+ revStars +"</p><i>"+rev.text+"</i></div>"
        }

    )

    document.getElementById('review').innerHTML = reviewsParsed
