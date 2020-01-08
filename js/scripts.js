let page = 1;
let section = "";
let newsApiGeneral = 'abc-news, al-jazeera-english, associated-press, bbc-news, cbs-news, cnn, google-news, google-news-uk, independent, msnbc, national-review, nbc-news, newsweek, new-york-magazine, politico, reuters,  the-huffington-post, the-new-york-times, time, usa-today, vice-news';
let newsApiBusiness = 'the-wall-street-journal, fortune, financial-post, bloomberg, australian-financial-review, business-insider, cnbc';
let newsApiTechnology = 'ars-technica, crypto-coins-news, engadget, hacker-news, recode, techcrunch, techradar, the-next-web, the-verge, wired';
let newsApiEntertainment = 'buzzfeed, entertainment-weekly, ign, mashable, mtv-news, mtv-news-uk, polygon,the-lad-bible';
let newsApiHealth = 'medical-news-today';
let newsApiAll = newsApiGeneral + newsApiBusiness + newsApiTechnology + newsApiEntertainment + newsApiHealth;
let source = newsApiAll;
let selectedSection;
let newsApikey = config.newsApikey;
let guardianApikey = config.guardianApikey;

function optionPadding() {
          $('.dropdown-list').children().css({'padding-top': '7px', 'padding-bottom': '7px'});
          console.log('blah');
}

function h1LetterSpacing() {
     let h1 = document.querySelector('.header-div-h1 h1');
     h1.style.setProperty('letter-spacing', 'normal', 'important');
     h1.addEventListener('animationstart', function () {
          this.style.letterSpacing = "normal";
     });
     h1.addEventListener('animationend', function () {
          this.style.letterSpacing = "-20px";
     });
}

function openDropDown(event) {
     $('.dropdown-list-item').toggleClass('animation');
     $('.dropdown-list-item').toggleClass('dropdown-class');
     $('.dropdown-list-item').toggleClass('display');
     $(this).toggleClass('toggle');
     console.log(event);
     }

function dropDownHeadlineChange(event) {
     let selectedCountry = event.currentTarget.innerHTML;
     $('.title-divs').empty();
     $('.countries-h2').html(selectedCountry).css({'font-size': '1.5em', 'line-height': '150%'});
     apiHeadLGet(event.target.id);
}

function apiHeadLGet(country = 'us') {
     let countryHeadLines = 'country=' + country + '&';
     let url = 'https://newsapi.org/v2/top-headlines?' +
          countryHeadLines +
          'apiKey=e7c27081cd0748348581645c8a953c94';
     fetch(url)
     .then(convertToJson)
     .then(jsonDataAppend); 
}

function convertToJson(response) {
     return response.json();
}

function jsonDataAppend(jsonData){    
     let articleTitles = [];
     let articleAuthor = [];
     let articleDescription = [];
     let articleContent = [];
     let articleUrl = [];
     for (let i = 0; i < jsonData.articles.length; i++) {   
          articleTitles[i] = jsonData.articles[i].title;   
          articleContent[i] = jsonData.articles[i].content; 
          articleUrl[i] = jsonData.articles[i].url;     
          if (articleUrl[i].match(/https?:\/\/(www\.)/) == null) {
               articleUrl[i] = ((articleUrl[i].substring(0, 8) + "www." + articleUrl[i].substring(8, articleUrl[i].length-1)));
          }
          if (articleTitles[i] != null && articleContent[i] != null && articleUrl[i] != null) {
               console.log(articleUrl[i]);
               $('.title-div-container').append(' <div class="title-divs" id="title-div-' + i +  ' " ><div class="title-content-div"><h3 class="title-list-item" id="title-list-item-' + i + ' "> '  + articleTitles[i].toUpperCase() +  ' </h3><p> ' + articleContent[i] + 
               ' </p></div><div class="arrow-read-more-div"><div class="arrow-div" id="arrow-div-' + i + ' "></div><div class="read-more-div"><ul class="read-more-ul"><li class="read-more-li"><a class="read-more-a" target="_blank" title="&#8212;&#62; news-article" href=" ' + articleUrl[i] + '">READ MORE</a></li></ul></div></div></div>'); 
          }
     }
}

function onReady() {
     $('.dropdown-list-item').toggleClass('display', true);
     apiHeadLGet();
     h1LetterSpacing();
     optionPadding();  
     $('.countries-h2').on("click", openDropDown);
     $('.dropdown-list-item').on("click", dropDownHeadlineChange);
}

$('document').ready(onReady);
