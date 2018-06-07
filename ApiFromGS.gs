/*https://medium.freecodecamp.org/use-google-sheets-and-google-apps-script-to-build-a-blog-cms-c2eab3fb0b2b*/
/*https://openclassrooms.com/courses/creez-des-pages-web-interactives-avec-javascript/la-theorie-http-ajax-et-json*/
/*var API_KEY = 'abcdef';*/

var SPREADSHEET_ID = '1eH_jGWy7zIIJtiwrOAnVMsbMJFOFVqKPvLbw8cfY-PY';
var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
var worksheet = spreadsheet.getSheets()[1];
var lastRow = worksheet.getRange("A1:A").getValues().filter(String).length;
var posts = worksheet.getRange("B4:O"+lastRow).getValues();
var headings = worksheet.getRange("B2:O2").getValues()[0];
var PostAsDic=buildDic2(posts,headings);

function getDate(ReportDate){
  //Permet de récupérer la date dans le sujet (colonne B)
  return ReportDate.split(" ")[3];
};

function ProperDateFormat(StringDate){
  var day=+StringDate.split("/")[0];
  var month=+StringDate.split("/")[1];
  var year=+'20'+StringDate.split("/")[2];
  var mydate=new Date(year, month - 1, day);
  mydate=new Date(mydate.getTime()+18*3600000); //Permet de retomber sur 18h (plutôt que 00:00...)
  return mydate;
};  
  
function buildDic2(posts, headings){
  var MyDic={};
  var MyMainDic={};
  var MyDicValo={};
  var MyDicChange1D={};
  var MyDicChangeMtD={};
  var MyDicChangeYtD={};
  for (j=0;j<posts.length;j++){
    for (i=1;i<headings.length;i++){
      while (i<=2){
        MyDicValo[headings[i]]=+posts[j][i].toFixed(2)
        i++
      };
      MyDic['Valo']=MyDicValo
      while (i<=5){
        MyDicChange1D[headings[i]]=posts[j][i]
        i++
      };
      MyDic['Change 1D']=MyDicChange1D
      while (i<=8){
        MyDicChangeMtD[headings[i]]=posts[j][i]
        i++
      };
      MyDic['Change MtD']=MyDicChangeMtD      
      while (i<=11){
        MyDicChangeYtD[headings[i]]=posts[j][i]
        i++
      };
      MyDic['Change YtD']=MyDicChangeYtD 

      MyDic[headings[i]]=posts[j][i]
    };
    MyMainDic[ProperDateFormat(getDate(posts[j][0]))]=MyDic
    MyDicValo={};
    MyDic={};
    MyDicChange1D={};
    MyDicChangeMtD={};
    MyDicChangeYtD={};
  };
  return MyMainDic;
};


function doGet(e) {
  /*if (!isAuthorized(e)) {
    return buildErrorResponse('not authorized');
  }*/
  return buildSuccessResponse();
}

function isAuthorized(e) {
  return 'key' in e.parameters && e.parameters.key[0] === API_KEY;
}

function buildSuccessResponse() {
  var output = JSON.stringify({
    status: 'success',
    'Report PEA': PostAsDic
  });
  
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

function buildErrorResponse(message) {
  var output = JSON.stringify({
    status: 'error',
    message: message
  });
  
  return ContentService.createTextOutput(output)
   .setMimeType(ContentService.MimeType.JSON);
}
