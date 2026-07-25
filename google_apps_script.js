// =========================================================================
// Thamilalayam Bad Schwalbach - Dynamic Cloud Website Backend Apps Script
// =========================================================================

function doGet(e) {
  // Safeguard: Check if event parameter exists (prevents crash on manual Run in Apps Script Editor)
  if (!e || !e.parameter) {
    return HtmlService.createHtmlOutput("<h1>Thamilalayam Apps Script Active</h1><p>API is running correctly. (Manual test run: parameters are undefined, which is normal inside the Google Editor).</p>");
  }
  
  var action = e.parameter.action;
  
  if (action === 'getConfig') {
    return handleGetConfig();
  }
  
  return HtmlService.createHtmlOutput("<h1>Thamilalayam Google Apps Script Active</h1><p>Dynamic cloud database services are running correctly.</p>");
}

function doPost(e) {
  // Safeguard: Check if event parameter exists
  if (!e || !e.parameter) {
    return createJsonResponse({ status: "error", message: "No event parameter provided." });
  }
  
  var action = e.parameter.action;
  
  if (action === 'saveConfig') {
    return handleSaveConfig(e);
  }
  
  // Default POST action: Save sports application registration submissions
  return handleRegistration(e);
}

// 1. FETCH CONFIGURATION (GET action=getConfig)
function handleGetConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("SiteConfig");
  var jsonStr = "";
  
  if (sheet) {
    // Read all rows in column A to reconstruct the split JSON config string
    var range = sheet.getDataRange();
    var values = range.getValues();
    for (var i = 0; i < values.length; i++) {
      jsonStr += values[i][0];
    }
  }
  
  if (!jsonStr) {
    return ContentService.createTextOutput(JSON.stringify({ status: "empty" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(jsonStr)
                       .setMimeType(ContentService.MimeType.JSON);
}

// 2. SAVE CONFIGURATION (POST action=saveConfig)
function handleSaveConfig(e) {
  try {
    var passcode = e.parameter.passcode;
    var configDataStr = e.parameter.configData || e.postData.contents;
    
    if (!configDataStr) {
      return createJsonResponse({ status: "error", message: "No config data provided" });
    }
    
    var configObj = JSON.parse(configDataStr);
    
    // Passcode Verification for Security
    var savedPasscode = configObj.adminPasscode || (configObj.formConfig && configObj.formConfig.adminPasscode) || "admin123";
    if (passcode !== savedPasscode) {
      return createJsonResponse({ status: "error", message: "தவறான கடவுச்சொல்! (Invalid passcode)" });
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("SiteConfig");
    if (!sheet) {
      sheet = ss.insertSheet("SiteConfig");
    }
    
    // Clear the sheet and save config by chunking to bypass Google Sheet 50k character cell limit
    sheet.clear();
    var jsonStr = JSON.stringify(configObj);
    var chunkSize = 45000; // Safe size below 50,000
    var values = [];
    for (var i = 0; i < jsonStr.length; i += chunkSize) {
      values.push([jsonStr.substring(i, i + chunkSize)]);
    }
    if (values.length > 0) {
      sheet.getRange(1, 1, values.length, 1).setValues(values);
    }
    
    return createJsonResponse({ status: "success", message: "வலைத்தளத் தரவுகள் கூகுள் கிளவுடில் நேரடியாகச் சேமிக்கப்பட்டுவிட்டது!" });
  } catch(err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// 3. REGISTER STUDENT SUBMISSION (POST)
function handleRegistration(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Submissions");
    if (!sheet) {
      sheet = ss.insertSheet("Submissions");
      sheet.appendRow([
        "Submitted At", "Child Name (Tamil)", "Child Name (English)", 
        "Date of Birth", "Gender", "Class / Year", 
        "Parent Name", "Email Address", "Phone Number", 
        "WhatsApp Number", "Selected Games/Events", "Other Comments"
      ]);
    }
    
    var p = e.parameter;
    var childNameTa = p.childNameTa || "";
    var childNameEn = p.childNameEn || "";
    var dob = p.dob || "";
    var gender = p.gender || "";
    var studentYear = p.studentYear || "";
    var parentName = p.parentName || "";
    var email = p.email || "";
    var phone = p.phone || "";
    var whatsapp = p.whatsapp || "";
    var games = p.games || "";
    var comments = p.comments || "";
    var submittedAt = p.submittedAt || new Date().toLocaleString();
    
    // Duplicate submission prevention check
    if (childNameEn && dob) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][2].toString().toLowerCase() === childNameEn.toLowerCase() && 
            data[i][3].toString() === dob) {
          return createJsonResponse({ status: "duplicate", message: "Duplicate entry" });
        }
      }
    }
    
    // Append submission entry
    sheet.appendRow([
      submittedAt, childNameTa, childNameEn, 
      dob, gender, studentYear, 
      parentName, email, phone, 
      whatsapp, games, comments
    ]);
    
    // Send email alert to parent
    if (email) {
      sendConfirmationEmail(email, childNameEn, parentName, games);
    }
    
    return createJsonResponse({ status: "success", message: "Registration successful" });
  } catch(err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function sendConfirmationEmail(email, childName, parentName, games) {
  var subject = "விளையாட்டுப் போட்டி - விண்ணப்ப உறுதிப்படுத்தல்";
  var htmlBody = "<div style='font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background:#fff;'>" +
                 "<h2 style='color: #800020; margin-top:0;'>தமிழாலயம் பாட்சுவல்பாக்</h2>" +
                 "<p>அன்பான பெற்றோர் <b>" + parentName + "</b>,</p>" +
                 "<p>தங்கள் பிள்ளை <b>" + childName + "</b> விளையாட்டுப் போட்டியில் பங்குபற்றுவதற்கான விண்ணப்பம் வெற்றிகரமாகப் பெறப்பட்டது.</p>" +
                 "<p style='background:#f8fafc; padding:12px; border-radius:6px; border-left:4px solid #800020;'><b>தெரிவு செய்த போட்டிகள்:</b> " + games + "</p>" +
                 "<p>மாணவர் வயதுப்பிரிவின் அடிப்படையில் போட்டிகள் இறுதி செய்யப்படும்.</p>" +
                 "<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;'>" +
                 "<p style='font-size: 11px; color: #94a3b8; text-align:center;'>இது ஒரு தானியங்கி மின்னஞ்சல் ஆகும். தயவுசெய்து பதில் அனுப்ப வேண்டாம்.</p>" +
                 "</div>";
                 
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}
