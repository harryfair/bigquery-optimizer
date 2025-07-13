/**
 * BigQuery Optimizer - Automated Daily Updates
 * Core functions for automated BigQuery to squad sheets distribution
 */

// Your specific sheet ID
const YOUR_SHEET_ID = '10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ';

// Squad external sheet IDs - try common variations
const SQUAD_SHEETS = {
  'AREA 1': '1XrTr5XO6EjuU_h-Y7k0AxCJAoNmmyqDmUzsFlRqcCAs',
  'Area 1': '1XrTr5XO6EjuU_h-Y7k0AxCJAoNmmyqDmUzsFlRqcCAs',
  'AREA1': '1XrTr5XO6EjuU_h-Y7k0AxCJAoNmmyqDmUzsFlRqcCAs',
  
  'AREA 2': '1sU117oq1vwvTQR7WY_qgulAVQkF_2PhC0_wEaD9liNs',
  'Area 2': '1sU117oq1vwvTQR7WY_qgulAVQkF_2PhC0_wEaD9liNs',
  'AREA2': '1sU117oq1vwvTQR7WY_qgulAVQkF_2PhC0_wEaD9liNs',
  
  'AREA 3': '1XOlGgtIRVYEg2Z_9V3T_Loq-HoTj42EMVEsfsGXLTAU',
  'Area 3': '1XOlGgtIRVYEg2Z_9V3T_Loq-HoTj42EMVEsfsGXLTAU',
  'AREA3': '1XOlGgtIRVYEg2Z_9V3T_Loq-HoTj42EMVEsfsGXLTAU',
  
  'PROGRAM': '1FZJPHX13UgU58vajXnwHLfh3_SL-Ry7AwGLuNNxfZUU',
  'Program': '1FZJPHX13UgU58vajXnwHLfh3_SL-Ry7AwGLuNNxfZUU',
  
  'HOSPITAL': '1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo',
  'Hospital': '1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo',
  'INBOUND': '1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo',
  'Inbound': '1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo'
};

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
 * AUTOMATED COMPLETE WORKFLOW - Fetch data and distribute to all squads
 * THIS IS THE MAIN AUTOMATION FUNCTION
 */
function automatedDailyUpdate() {
  try {
    console.log('🤖 Starting automated daily update...');
    const startTime = new Date();
    
    // Step 1: Fetch all data from BigQuery
    console.log('📊 Step 1: Fetching data from BigQuery...');
    if (!testYourSheetConnection()) {
      throw new Error('Cannot connect to your sheet');
    }
    
    const ss = getYourSpreadsheet();
    const allData = BigQueryFetcher.fetchAllData();
    console.log(`✅ Fetched ${allData.rows.length} rows from BigQuery`);
    
    // Step 2: Save to main sheet
    console.log('📝 Step 2: Saving to main all_data sheet...');
    SheetFormatter.writeToSheet(ss, 'all_data', allData.headers, allData.rows);
    console.log('✅ Main sheet updated');
    
    // Step 3: Distribute to all squad sheets
    console.log('🚀 Step 3: Distributing to all squad sheets...');
    // Convert BigQuery format to sheet format for distribution
    const formattedRows = allData.rows.map(row => {
      // Handle BigQuery format
      if (row.f && Array.isArray(row.f)) {
        return row.f.map(cell => cell.v === null || cell.v === undefined ? '' : cell.v);
      }
      // Handle array format
      if (Array.isArray(row)) {
        return row.map(value => value === null || value === undefined ? '' : value);
      }
      return [String(row)];
    });
    
    const distributionResults = distributeToAllSquadsFromData({headers: allData.headers, rows: formattedRows});
    
    // Step 4: Summary
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('🎉 AUTOMATION COMPLETE!');
    console.log(`⏱️ Total time: ${duration} seconds`);
    console.log(`📊 Main sheet: ${allData.rows.length} rows`);
    distributionResults.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.squadName}: ${result.error}`);
      } else {
        console.log(`✅ ${result.squadName}: ${result.rowCount} rows`);
      }
    });
    
    return {
      success: true,
      totalRows: allData.rows.length,
      duration: duration,
      distributionResults: distributionResults
    };
    
  } catch (error) {
    console.error('❌ Automation failed:', error);
    throw error;
  }
}


/**
 * Distribute data to ALL squad sheets from provided data (used by automation)
 */
function distributeToAllSquadsFromData(allData) {
  // Get unique squad values from data first
  const squadIndex = allData.headers.indexOf('SQUAD');
  if (squadIndex === -1) {
    console.error('❌ SQUAD column not found in data');
    return [];
  }
  
  const actualSquads = [...new Set(allData.rows.map(row => row[squadIndex]))].filter(squad => squad);
  console.log('🔍 Found actual squads in data:', actualSquads);
  
  // Distribute to each squad/group
  const results = [];
  
  // Try to distribute each actual squad found in data
  for (const actualSquad of actualSquads) {
    const squadName = actualSquad.toString();
    const sheetId = SQUAD_SHEETS[squadName];
    
    if (sheetId) {
      try {
        const result = distributeToSquad(allData, squadName, sheetId);
        results.push(result);
        console.log(`✅ ${squadName}: ${result.rowCount} rows → ${result.sheetName}`);
      } catch (error) {
        console.error(`❌ ${squadName}: ${error.message}`);
        results.push({squadName, error: error.message});
      }
    } else {
      console.log(`⚠️ No sheet mapping found for squad: "${squadName}"`);
      results.push({squadName, error: `No sheet mapping found for "${squadName}"`});
    }
  }
  
  console.log('🎉 Distribution complete!');
  return results;
}


/**
 * Distribute data to a specific squad sheet
 */
function distributeToSquad(allData, squadName, sheetId) {
  // Find column indices to remove
  const squadIndex = allData.headers.indexOf('SQUAD');
  const visualIndex = allData.headers.indexOf('visual');
  
  if (squadIndex === -1) {
    throw new Error('SQUAD column not found in data');
  }
  
  // Filter rows for specific squad
  const squadRows = allData.rows.filter(row => {
    return row[squadIndex] && row[squadIndex].toString() === squadName;
  });
  
  // Remove SQUAD and visual columns from headers and rows
  const filteredHeaders = allData.headers.filter((header, index) => 
    index !== squadIndex && index !== visualIndex
  );
  const filteredRows = squadRows.map(row => 
    row.filter((cell, index) => index !== squadIndex && index !== visualIndex)
  );
  
  // Open squad sheet and write data
  const squadSheet = SpreadsheetApp.openById(sheetId);
  SheetFormatter.writeToSheet(squadSheet, 'campaign', filteredHeaders, filteredRows);
  
  return {
    squadName: squadName,
    rowCount: filteredRows.length,
    sheetName: squadSheet.getName(),
    sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
  };
}

