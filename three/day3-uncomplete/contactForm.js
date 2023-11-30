var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()

function intialSetip(){
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e){
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try{
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1,1,1, sheet.getLastColumn()).getValues()[0]

    var newRow = header.map(function(header){
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextrow, 1,1,newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({'result': 'success', 'row' : newRow}))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch(e){
    return CacheService
      .createTextOutput(JSON.stringify({'result': 'error' , 'error' : e}))
      .setMimeType(CacheService.MimeType.JSON)
  }
  finally{
    lock.releaseLock()
  }


}