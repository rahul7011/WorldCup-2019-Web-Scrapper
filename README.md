# WorldCup-2019-Web-Scrapper:dart::cricket_game:	

Designed a WebScraping Program which scraps data of WorldCup -2019 cricket world cup from([cric-info](https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results)) and stored theinformation in many forms like in:
* .pdf file
* .csv file

![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)   ![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)


![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)
 
 
  ![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg) ![forthebadge](https://forthebadge.com/images/badges/for-you.svg)
## Features
* Separate DataFolder for each Team, which contains all the pdfs of that team.
* Integrated django-crispy-forms for the management of django forms.
* Crispy forms allows forms properties(such as methods, send button or CSS classes) on the backend without having to re-write them in the template .
* Integrated Stripe’s payments APIs for carrying out the online payment process.


## Features
* Separate DataFolder for each Team, which contains all the pdfs of that team
* CSV file which contains the data of all the matches placed in WorldCup 2k19
* Separate Pdf for each team which contains all the details of the matches played by that team

## Setup process

1. Install [node.js](https://nodejs.org/en/download/package-manager/)
2. Install all the dependencies
3. `npm install minimist`
4. `npm install axios`
5. `npm install excel4node`
6. `npm install pdf-lib`
7. `node CricInfoExtractor.js --excel=WorldCup2019.csv --dir=WorldCup2019 --url=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results`


## Screenshots
<table>
 <tr>
  <td>
   <img width="420" alt="DM1" src="https://user-images.githubusercontent.com/52202163/138326520-5b03e583-1e88-42fe-ad3f-0ba3b8517d9e.png">
  </td>
  <td>
   <img width="420" alt="DM2" src="https://user-images.githubusercontent.com/52202163/138326524-1ea1a86d-0170-46ae-9b8c-bbe6b9cab44f.png">
  </td>
 </tr>
 <tr>
  <td>
   <img width="420" alt="DM4" src="https://user-images.githubusercontent.com/52202163/138327112-43f3a641-d241-4c51-aaa8-b05b4fb844a2.png">
   </td>
  <td>
   <img width="420" alt="DM3" src="https://user-images.githubusercontent.com/52202163/138326530-2d46de47-a2c7-432b-adb1-0f8dc2150ba2.png">
  </td>
 </tr>
