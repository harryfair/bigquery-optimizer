/**
 * Simplified BigQuery Optimizer - Just Get Data
 * Only includes functions needed for quickTestYourSheet()
 */

// Your specific sheet ID
const YOUR_SHEET_ID = '10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ';

/**
 * Get your specific spreadsheet
 */
function getYourSpreadsheet() {
  return SpreadsheetApp.openById(YOUR_SHEET_ID);
}

/**
 * Test connection to your sheet
 */
function testYourSheetConnection() {
  try {
    const ss = getYourSpreadsheet();
    console.log('✅ Successfully connected to your sheet:', ss.getName());
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to your sheet:', error);
    return false;
  }
}

/**
 * Quick test function - gets all BigQuery data and saves to your sheet
 * THIS IS THE MAIN FUNCTION YOU NEED
 */
function quickTestYourSheet() {
  try {
    console.log('🧪 Fetching BigQuery data to your sheet...');
    
    // Test connection
    if (!testYourSheetConnection()) {
      throw new Error('Cannot connect to your sheet');
    }
    
    // Get your spreadsheet
    const ss = getYourSpreadsheet();
    
    // Fetch all data from BigQuery
    const allData = BigQueryFetcher.fetchAllData();
    console.log(`📊 Fetched ${allData.rows.length} rows from BigQuery`);
    
    // Write to 'all_data' sheet
    SheetFormatter.writeToSheet(ss, 'all_data', allData.headers, allData.rows);
    
    console.log('✅ Success! Data saved to "all_data" sheet');
    console.log('🔗 View: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}