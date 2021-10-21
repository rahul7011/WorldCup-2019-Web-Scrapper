let minimist = require("minimist");
let fs = require("fs");
let axios = require("axios");
let jsdom = require("jsdom");
let excel = require("excel4node");
let pdf = require("pdf-lib");
let path = require("path");
//node CricInfoExtractor.js --excel=WorldCup2019.csv --dir=WorldCup2019 --url=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results

let clargs=minimist(process.argv);

// convert matches to teams
// save teams to excel using excel4node
// create folders and save pdf using pdf-lib

let responsePromise=axios.get(clargs.url);
responsePromise.then(function(response){
    let html=response.data;
    let dom =new jsdom.JSDOM(html);
    let document=dom.window.document;
    let matchScoreDivs=document.querySelectorAll("div.match-score-block");
    let matches=[];
    for(let i=0;i<matchScoreDivs.length;i++)
    {
        let match={
            t1:"",
            t2:"",
            t1s:"",
            t2s:"",
            result:""
        }
        let teamParas=matchScoreDivs[i].querySelectorAll("div.name-detail>p.name");
        match.t1=teamParas[0].textContent;
        match.t2=teamParas[1].textContent;
        let teamScore=matchScoreDivs[i].querySelectorAll("div.score-detail>span.score");
        //To avoid the matches Score that were abondoned during the worldCup
        if(teamScore.length==1)
        {
            match.t1s=teamScore[0].textContent;
            match.t2s="";
        }
        else if(teamScore.length==2)
        {
            match.t1s=teamScore[0].textContent;
            match.t2s=teamScore[1].textContent;
        }
        else
        {
            match.t1s="";
            match.t2s="";
        }
        
        match.result=matchScoreDivs[i].querySelector("div.status-text").textContent;
        // console.log(match);
        matches.push(match);
    }
    let matchesJSON=JSON.stringify(matches);
    fs.writeFileSync("matches.json",matchesJSON,"utf-8");
    //add team inside the teams[]
    let teams=[];
    for(let i=0;i<matches.length;i++)
    {
        addTeam(teams,matches[i].t1);
        addTeam(teams,matches[i].t2);
    }

    // add match to their respective teams
    for(let i=0;i<matches.length;i++)
    {
        addMatches(teams,matches[i].t1,matches[i].t2,matches[i].t1s,matches[i].t2s,matches[i].result);
        addMatches(teams,matches[i].t2,matches[i].t1,matches[i].t2s,matches[i].t1s,matches[i].result);
    }


    let teamsJSON=JSON.stringify(teams);
    fs.writeFileSync("teams.json",teamsJSON,"utf-8");
    prepareExcel(teams,clargs.excel);
    prepareFoldersAndPdfs(teams, clargs.dir);
})

function prepareFoldersAndPdfs(teams,directory)
{
    if(fs.existsSync(directory)==true)
    {
        fs.rmdirSync(directory,{recursive:true});
    }
    fs.mkdirSync(directory);

    for(let i=0;i<teams.length;i++)
    {
        let TeamfolderName=path.join(directory,teams[i].name);
        fs.mkdirSync(TeamfolderName);
        for(let j=0;j<teams[i].matches.length;j++)
        {
            let match=teams[i].matches[j];
            createMatchScoreCardPdf(TeamfolderName,teams[i].name,match);
        }
    }
}

function createMatchScoreCardPdf(folderName,teamName,match)
{
    let matchFileName=path.join(folderName,match.vs);
    let templateBytesPromise=fs.readFileSync("Template.pdf");
    let pdfDocPromise=pdf.PDFDocument.load(templateBytesPromise);
    pdfDocPromise.then(function(pdfdoc){
        let page=pdfdoc.getPage(0);
        page.drawText(teamName, {
            x: 320,
            y: 703,
            size: 8
        });
        page.drawText(match.vs, {
            x: 320,
            y: 688,
            size: 8
        });
        page.drawText(match.SelfScore, {
            x: 320,
            y: 673,
            size: 8
        });
        page.drawText(match.OppScore, {
            x: 320,
            y: 658,
            size: 8
        });
        page.drawText(match.result, {
            x: 320,
            y: 647,
            size: 8
        });
        let PdfBytesPromise=pdfdoc.save();
        PdfBytesPromise.then(function(changedBytes){
            if(fs.existsSync(matchFileName+".pdf")==true)
            {
                fs.writeFileSync(matchFileName+"1.pdf",changedBytes,"utf-8");
            }
            else
            {
                fs.writeFileSync(matchFileName+".pdf",changedBytes,"utf-8");
            }
        })
    })
}

function prepareExcel(teams,excelFileName)
{
    let wb=new excel.Workbook();
    for(let i=0;i<teams.length;i++)
    {
        let tsheet=wb.addWorksheet(teams[i].name);
        tsheet.cell(1,1).string('Vs');
        tsheet.cell(1,2).string('SelfScore');
        tsheet.cell(1,3).string('OppScore');
        tsheet.cell(1,4).string('Result');
        for(let j=0;j<teams[i].matches.length;j++)
        {
            tsheet.cell(2+j,1).string(teams[i].matches[j].vs);
            tsheet.cell(2+j,2).string(teams[i].matches[j].SelfScore);
            tsheet.cell(2+j,3).string(teams[i].matches[j].OppScore);
            tsheet.cell(2+j,4).string(teams[i].matches[j].result);
        }
    }
    wb.write(excelFileName);
}

function addMatches(teams,HomeTeam,OppTeam,SelfScore,OppScore,result)
{
    let idx=-1;
    for(let i=0;i<teams.length;i++)
    {
        if(teams[i].name==HomeTeam)
        {
            idx=i;
            break;
        }
    }
    let team=teams[idx];
    // console.log(team);
    team.matches.push({
        vs:OppTeam,
        SelfScore:SelfScore,
        OppScore:OppScore,
        result:result
    });
}

function addTeam(teams,teamName)
{
    //if a team is already present don't add it inside the teams[] and vice-versa
    let flag=true;
    for(let i=0;i<teams.length;i++)
    {
        if(teams[i].name==teamName)
        {
            flag=false;
            break;
        }
    }
    if(flag==true)
    {
        teams.push({
            name:teamName,
            matches:[]
        })
    }
}