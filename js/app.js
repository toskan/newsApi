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

function optionPadding() {
     $('.dropdown-list').children().css({'padding-top': '7px', 'padding-bottom': '7px'});
}

//needed to set styles in javascript for header h1 animation
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

//click header h1 back to home feed
function resetFeed(event) {
     $('.main').hide();
     $('.title-divs').remove();
     selectedSection = '';
     section = '';
     source = newsApiAll;
     newsApiGet();
     guardianGet();
     if ($('.dropdown-list-item').toggleClass('display', false)) {
          openDropDown();
     }
}

//click on search and toggle input on and off
function searchInputShow() {
     $('.input-div').toggleClass('display');
     $('.search-div').toggleClass('active');
}

//press enter and toggle input off if input on 
function closeInputOnEnter(event) {
     event.preventDefault();
     if (event.keyCode === 13 && $('.input-div').toggleClass('display', false)) {
          $('.search-div').toggleClass('active', true);
          $('#search-div-id').click();
     }
}

//hover into main div closes dropdown
function hoverOutDropDownClose() {
     if ($('.dropdown-list-item').toggleClass('display', false)) {
          openDropDown();
     }
}

//click section and sections dropdown opens
function openDropDown(event) {
     $('.dropdown-list-item').toggleClass('animation');
     $('.dropdown-list-item').toggleClass('dropdown-class');
     $('.dropdown-list-item').toggleClass('display');
     $(this).toggleClass('toggle');
}

//press X to close the modal
function closeModal() {
     event.preventDefault();
     $('#popUp').hide();
     $('.main').css('opacity', '1');
}

//select a section and change content to new section / source; Set through HTML and event data
function dropDownSectionChange(event) {
     selectedSection = event.currentTarget.innerHTML;
     openDropDown();
     $('.title-divs').empty();
     $('.countries-h2').html(selectedSection).css({'font-size': '1.5em', 'line-height': '150%'});
     if ((((window.matchMedia('(max-width: 414px)').matches)) && ((window.matchMedia('(orientation: portrait)').matches))) || (((window.matchMedia('(max-width: 823px)').matches)) && ((window.matchMedia('(orientation: landscape)').matches)))) {
          $('.countries-h2').html(selectedSection).css({'font-size': '1.05em', 'line-height': '120%'});
     }
     if (selectedSection === 'News') {
          $('.main').hide();
          $('.loader-container').show();
          $('.title-divs').remove();
          section = event.target.id;
          source = newsApiGeneral;
          newsApiGet();
          guardianGet();
     }
     if (selectedSection === 'Business') {
          $('.main').hide();
          $('.loader-container').show();
          $('.title-divs').remove();
          section = event.target.id;
          source = newsApiBusiness;
          newsApiGet();
          guardianGet();
     }
     if (selectedSection === 'Technology') {
          $('.main').hide();
          $('.loader-container').show();
          $('.title-divs').remove();
          section = event.target.id;
          source = newsApiTechnology;
          newsApiGet();
          guardianGet();
     }
     if (selectedSection === 'Entertainment') {
          $('.main').hide();
          $('.loader-container').show();
          $('.title-divs').remove();
          section = event.target.id;
          source = newsApiEntertainment;
          newsApiGet();
          guardianGet();
     } 
     if (selectedSection === 'Lifestyle') {
          $('.main').hide();
          $('.loader-container').show();
          $('.title-divs').remove();
          section = event.target.id;
          source = newsApiHealth;
          newsApiGet();
          guardianGet();
     } 
     if (selectedSection === 'Reddit') {
          $('.main').hide();
          $('.loader-container').show();
          $('.title-divs').remove();
          redditGet();
     }
}

//filters (shows and hides) all the news-titles on the page by input on each keystroke (uses length (number of title-list-item shown) then goes through each one specifying .eq(i) and .text and indexOf (positive (not -1))
//after sorting the divs by UTC this stopped working. had to attribute the id after the UTC sort (ids repeated)
//no longer true: don't need to use id
function filterTitlesByInput() {
     let inputValue = (this.value).toUpperCase();
     for (let i=0; i < ($('.title-list-item').length); i++) {
          console.log($('.title-list-item').length);
          let newsApiTitles = $('.title-list-item').eq(i);
          console.log(newsApiTitles);
          if ($(newsApiTitles).text().indexOf(inputValue) >= 0){
               console.log($(newsApiTitles).text().indexOf(inputValue));
               $('.title-divs').eq(i).show();
          }
          else {
               $('.title-divs').eq(i).hide();
          }
     }
} 

//fetches again (page++ for Guardian and newsApi)/ reddit uses after parameter in url call (appended to class attribute for #title-div-container) after first call
function pageLoadApi() {
     if($(window).scrollTop() == $(document).height() - $(window).height() && selectedSection != 'Reddit') {
          console.log('scroll newsapi guardian end reached');
          page++;
          guardianGet();
          if (page < 3) {
               newsApiGet();
          }
     }
     else if ($(window).scrollTop() == $(document).height() - $(window).height() && selectedSection == 'Reddit') {
          console.log('reddit end reached');
          redditGet();
     } 
}

//newsApi get data
function newsApiGet() {
     let newsApiSource = 'sources=' + source;
     let newsApikey =  'e7c27081cd0748348581645c8a953c94';
     let apiKey = 'apiKey=' + newsApikey + '&';
     let pageSize = 'pageSize=10&';
     let pageCall = 'page=' + page + '&';
     let url = 'https://newsapi.org/v2/top-headlines?' + apiKey + pageCall + pageSize + newsApiSource; 
     fetch(url)
     .then(convertToJson)
     .then(jsonDataAppend)
     .catch((error) => {
               console.log(error)
     }); 
}

function convertToJson(response) {
     if (response.ok) {
          console.log('ok')
          return response.json();
     }
     else {
          alert('Something went wrong');
     }
}

function jsonDataAppend(jsonData){    
     let articleTitles = [];
     let articleContent = [];
     let articleUrl = [];
     let articleImage = [];
     let articleSourceName =[];
     let UTCNews = [];
     for (let i = 0; i < jsonData.articles.length; i++) {   
          articleTitles[i] = jsonData.articles[i].title;   
          articleContent[i] = jsonData.articles[i].content; 
          articleUrl[i] = jsonData.articles[i].url; 
          articleImage[i] = jsonData.articles[i].urlToImage;
          articleSourceName[i] = jsonData.articles[i].source.name;    
          UTCNews[i] =  Date.parse(jsonData.articles[i].publishedAt);
          if (articleImage[i] === null || articleUrl[i] === "image") {
               articleImage[i] = 'images/news_holder.png';
          }
          if (articleTitles[i] != null && articleContent[i] != null && articleUrl[i] != null) {
               $('#title-div-container').append(' <div class="title-divs" data-index="' + UTCNews[i] + '"><div class="image-div"><img class="center" id="image" src="' + articleImage[i] + '"/></div><div class="title-content-div"><a href="#"><h3 class="title-list-item title-list-item-newsapi" id="title-' + i + '"> '  + articleTitles[i].toUpperCase() +  ' </h3></a><h4 class="source-name">' + articleSourceName[i] + '</h4></div></div></div>'); 
          }
          $('.title-list-item-newsapi').on('click', function(event){
               console.log(event);
               event.preventDefault();
               let targetId = (event.target.id).split('-')[1];
               let modalHeight = (event.pageY) - 150;
               $('#popUp').css('top', modalHeight + 'px');
               $('.main').css('opacity', '0.2');
               $('#popUp h1').html(event.target.innerHTML);
               $('#popUp p').html(articleContent[targetId]);
               $('.popUpAction').attr('href',articleUrl[targetId]);
               $('.popUpAction').html('Read More at ' + articleSourceName[targetId]);
               $('#popUp').show();
          });
     }
}

//fetches Guardian data
function guardianGet() {
     let guardianApikey = '3913da98-56d9-45a0-90f7-5366bdca8593';
     let guardianSection = 'section=' + section + '&';
     let apiKey = 'api-key=' + guardianApikey + '&';
     let pageSize = 'page-size=10&';
     let pageCall = 'page=' + page + '&';
     let articleBody = 'show-blocks=body&';
     let articleImage = 'show-fields=thumbnail&';
     let url;
     if (section !== '') {
          url = 'https://accesscontrolalloworiginall.herokuapp.com/https://content.guardianapis.com/search?' + pageSize + pageCall + apiKey + articleBody + articleImage + guardianSection;
     }
     else { 
          url = 'https://accesscontrolalloworiginall.herokuapp.com/https://content.guardianapis.com/search?' + pageSize + pageCall + apiKey + articleBody + articleImage;
     }
     fetch(url)
     .then(jsonGuardianConvert)
     .then(jsonGuardianAppend)
     .catch((error) => {
          console.log(error)
     }); 
}


//learned this 
function jsonGuardianConvert(response) {
     if (response.ok) {
          console.log('ok')
          return response.json();
     }
     else {
          alert('Something went wrong');
     }
}

//had to change event.toElement.id (pop up wasn't working because couldn't parse id) to event.target.id because former does not exist in edge (and firefox?)
function jsonGuardianAppend(jsonData){
     let guardianImage = [];
     let guardianTitle = [];
     let guardianSection = [];
     let guardianUrl = [];
     let guardianSummary = [];
     let timeUTCG = [];
     for (let i = 0; i < jsonData.response.results.length; i++) {
          guardianTitle[i] = jsonData.response.results[i].webTitle;
          guardianSection[i] = jsonData.response.results[i].sectionName;
          guardianUrl[i] = jsonData.response.results[i].webUrl;
          guardianSummary[i] = jsonData.response.results[i].blocks.body[0].bodyHtml;
          timeUTCG[i] = Date.parse(jsonData.response.results[i].webPublicationDate);
          if ( jsonData.response.results[i].fields  == null ) {
               guardianImage[i] = 'images/news_holder.png';
          }
          else {
               guardianImage[i] =  jsonData.response.results[i].fields.thumbnail;
          }
          $('#title-div-container').append(' <div class="title-divs" data-index="' + timeUTCG[i] + '"><div class="image-div"><img class="center" id="image" src="' + guardianImage[i] + '"/></div><div class="title-content-div"><a href="#"><h3 class="title-list-item title-list-item-guardian" id="target-' + i + '"> '  + guardianTitle[i].toUpperCase() +  ' </h3></a><h4 class="source-name">The Guardian ' + guardianSection[i] + '</h4></div></div>');
          $('.title-list-item-guardian').on('click', function(event){
               event.preventDefault();
               let indexId = (event.target.id).split('-')[1];
               let modalHeight = event.pageY;
               $('#popUp').css('top', modalHeight);
               $('.main').css('opacity', '0.2');
               $('#popUp h1').html(event.target.innerHTML);
               $('#popUp p').html(guardianSummary[indexId]);
               $('.popUpAction').attr('href',guardianUrl[indexId]);
               $('.popUpAction').html('Read More at The Guardian');
               $('#popUp').show();
          });
     }
     sortByDate();
     //Timeout function runs after promise is completed
     setTimeout(function(){  
          $('.loader-container').hide();
          $('.main').show();
     }, 2000);
}

//get reddit data
function redditGet() {
     let sort = 'sort=top&'
     let limit = 'limit=20&';
     let subReddit = 'popular';
     let afterItem;
     let url;
          //condition sets first call
          if ($('#title-div-container').attr('class') == null) {
               url = 'https://www.reddit.com/r/' + subReddit + '/.json?' + limit + sort;
          }
          //condition for eacht call thereafter
          else {
               afterItem = $('#title-div-container').attr('class');
               let afterParameter = 'after=' + afterItem + '&';
               url = 'https://www.reddit.com/r/' + subReddit + '/.json?' + limit + sort + afterParameter;
          }
     fetch(url)
     .then(redditConvertToJson)
     .then(redditJsonDataAppend)
     .catch((error) => {
          console.log(error)
     }); 
}

function redditConvertToJson(response) {
     if (response.ok) {
          console.log('ok')
          let afterClass = $('#title-div-container').attr('class');
          $('.' + afterClass).removeClass(afterClass);
          return response.json();
     }
     else {
          alert('Something went wrong');
     }
}

function redditJsonDataAppend(jsonData){
     console.log(jsonData.data.children);
     let redditImage = [];
     let redditTitle = [];
     let redditSection = [];
     let redditUrl = [];
     let redditRating = [];
     let outerUrl = [];
     let timeUTC = [];
     let afterParam = jsonData.data.after;
     console.log(afterParam + " after parameter after it has been declared a variable reddit");
     for (let i = 0; i < jsonData.data.children.length; i++) {
          console.log( jsonData.data.children[i].data.score.created_utc + "reddit param utc in for loop");
          redditTitle[i] = jsonData.data.children[i].data.title;
          redditSection[i] = jsonData.data.children[i].data.subreddit;
          redditUrl[i] = jsonData.data.children[i].data.permalink;
          outerUrl[i] = jsonData.data.children[i].data.url;
          redditRating[i] = jsonData.data.children[i].data.score;
          redditRating[i] = Number(redditRating[i]).toLocaleString();
          timeUTC[i] = jsonData.data.children[i].data.created_utc;
          if ( jsonData.data.children[i].data.thumbnail  == null || jsonData.data.children[i].data.thumbnail === 'default'  || jsonData.data.children[i].data.thumbnail === "self" || jsonData.data.children[i].data.thumbnail === 'spoiler' || jsonData.data.children[i].data.thumbnail === '' ||  jsonData.data.children[i].data.thumbnail=== "nsfw" || jsonData.data.children[i].data.thumbnail === "image") {
               redditImage[i] = 'images/news_holder.png';
          }
          else {
               redditImage[i] =  jsonData.data.children[i].data.thumbnail;
          }
          $('#title-div-container').append(' <div class="title-divs" data-index="' + timeUTC[i] + '"><div class="image-div"><img class="center" id="image" src="' + redditImage[i] + '"/></div><div class="title-content-div" id="utc_' + timeUTC[i] + '"><h3 class="title-list-item title-list-item-reddit"> '  + redditTitle[i].toUpperCase() +  ' </h3><h4 class="score-h4">score:</h4><h4 class="reddit-score">' +  redditRating[i] + '</h4><a href="http://www.reddit.com' + redditUrl[i] + '" class="reddit-link" target="_blank"><h4 class="source-name">Read More at Reddit ' + redditSection[i] + '</h4></a></div></div>');
     }
     $('#title-div-container').addClass(afterParam);
     sortByDate();
     //Timeout function runs after promise is completed
     setTimeout(function(){  
          $('.loader-container').hide();
          $('.main').show();
     }, 2000);
}

//sorts appended divs by UTC descending through data-index attribute of div.title-divs with appended data (converted Guardian and NewsApi data with date parse before appending to data-index)
function sortByDate() {
     $('#title-div-container').append($('.title-divs').sort(function(a, b) { return $(b).data('index') - $(a).data('index'); }));
}

function onReady() {
$('.main').hide();
$('#popUp').hide();
$('.dropdown-list-item').toggleClass('display', true);
$('.input-div').toggleClass('display', true);
$('.search-div').click(searchInputShow);
document.addEventListener("keyup", closeInputOnEnter);
$('.search-input').on('input', filterTitlesByInput);
newsApiGet();
guardianGet();
$(window).on('scroll', pageLoadApi);
h1LetterSpacing();
optionPadding();  
$('h1').on('click', resetFeed);
$('.countries-h2').on("click", openDropDown);
$('.dropdown-list-item').on("click", dropDownSectionChange);
$('.main').mouseover(hoverOutDropDownClose);
$('.closePopUp').click(closeModal);
}

$('document').ready(onReady);



