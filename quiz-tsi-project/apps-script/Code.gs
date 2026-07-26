const FOLDER_NAME='Quiz_TSI';
const PROGRESS_FILE='progression.json';
const SHEET_NAME='Historique_Quiz_TSI';

function doGet(){return HtmlService.createHtmlOutput('Connecteur Quiz TSI actif.');}

function getOrCreateFolder_(){
 const folders=DriveApp.getFoldersByName(FOLDER_NAME);
 return folders.hasNext()?folders.next():DriveApp.createFolder(FOLDER_NAME);
}

function loadProgress(){
 const folder=getOrCreateFolder_();const files=folder.getFilesByName(PROGRESS_FILE);
 if(!files.hasNext())return null;
 return JSON.parse(files.next().getBlob().getDataAsString('UTF-8'));
}

function saveProgress(state){
 const folder=getOrCreateFolder_();const content=JSON.stringify(state,null,2);const files=folder.getFilesByName(PROGRESS_FILE);
 if(files.hasNext())files.next().setContent(content);else folder.createFile(PROGRESS_FILE,content,MimeType.PLAIN_TEXT);
 return {ok:true,savedAt:new Date().toISOString()};
}

function appendAttempt(attempt){
 let spreadsheet;const files=DriveApp.getFilesByName(SHEET_NAME);
 if(files.hasNext())spreadsheet=SpreadsheetApp.open(files.next());else spreadsheet=SpreadsheetApp.create(SHEET_NAME);
 const sheet=spreadsheet.getSheets()[0];if(sheet.getLastRow()===0)sheet.appendRow(['Date','Chapitre','Notion','Question','Difficulté','Résultat']);
 sheet.appendRow([attempt.at,attempt.chapterId,attempt.notionId,attempt.questionId,attempt.difficulty,attempt.result]);
 return {ok:true};
}
