/**
 * Simplified BigQuery Optimizer - Just Get Data
 * Only includes functions needed for quickTestYourSheet()
 */

// Your specific sheet ID
const YOUR_SHEET_ID = '10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ';

// Squad external sheet IDs
const SQUAD_SHEETS = {
  'AREA 1': '1XrTr5XO6EjuU_h-Y7k0AxCJAoNmmyqDmUzsFlRqcCAs',
  'HOSPITAL & INBOUND': '1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo',
  'AREA 3': '1XOlGgtIRVYEg2Z_9V3T_Loq-HoTj42EMVEsfsGXLTAU',
  'AREA 2': '1sU117oq1vwvTQR7WY_qgulAVQkF_2PhC0_wEaD9liNs',
  'PROGRAM': '1FZJPHX13UgU58vajXnwHLfh3_SL-Ry7AwGLuNNxfZUU'
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

/**
 * Check what squad values exist in your data
 */
function checkSquadValues() {
  try {
    console.log('🔍 Checking squad values in your data...');
    
    // Read from existing sheet instead of BigQuery
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      console.log('❌ No all_data sheet found. Run quickTestYourSheet() first.');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const squadIndex = headers.indexOf('SQUAD');
    if (squadIndex === -1) {
      console.log('❌ SQUAD column not found');
      return;
    }
    
    // Get unique squad values
    const squadValues = [...new Set(rows.map(row => row[squadIndex]))];
    console.log('📊 Found squad values:', squadValues);
    console.log(`📈 Total ${rows.length} rows in all_data sheet`);
    
    // Count rows per squad
    squadValues.forEach(squad => {
      const count = rows.filter(row => row[squadIndex] === squad).length;
      console.log(`  ${squad}: ${count} rows`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Distribute data to ALL squad sheets from existing data (NO new BigQuery call)
 */
function distributeToAllSquads() {
  try {
    console.log('🚀 Distributing data to ALL squad sheets...');
    
    // Read from existing all_data sheet (NO BigQuery call)
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      throw new Error('No all_data sheet found. Run quickTestYourSheet() first.');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log(`📊 Read ${rows.length} rows from existing all_data sheet`);
    
    // Distribute to each squad/group
    const results = [];
    
    // Individual squads
    const individualSquads = ['AREA 1', 'AREA 2', 'AREA 3', 'PROGRAM'];
    for (const squadName of individualSquads) {
      try {
        const result = distributeToSquad({headers, rows}, squadName, SQUAD_SHEETS[squadName]);
        results.push(result);
        console.log(`✅ ${squadName}: ${result.rowCount} rows → ${result.sheetName}`);
      } catch (error) {
        console.error(`❌ ${squadName}: ${error.message}`);
        results.push({squadName, error: error.message});
      }
    }
    
    // Combined HOSPITAL & INBOUND sheet
    try {
      const result = distributeCombinedHospitalInbound({headers, rows}, SQUAD_SHEETS['HOSPITAL & INBOUND']);
      results.push(result);
      console.log(`✅ HOSPITAL & INBOUND: ${result.rowCount} rows → ${result.sheetName}`);
    } catch (error) {
      console.error(`❌ HOSPITAL & INBOUND: ${error.message}`);
      results.push({squadName: 'HOSPITAL & INBOUND', error: error.message});
    }
    
    console.log('🎉 Distribution complete!');
    return results;
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test function - distributes AREA 1 data from existing sheet (NO new BigQuery call)
 */
function testArea1DistributionFromSheet() {
  try {
    console.log('🧪 Testing AREA 1 data distribution from existing sheet...');
    
    // Read from existing all_data sheet (NO BigQuery call)
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      throw new Error('No all_data sheet found. Run quickTestYourSheet() first.');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log(`📊 Read ${rows.length} rows from existing all_data sheet`);
    
    // Distribute to AREA 1 only
    const result = distributeToSquad({headers, rows}, 'AREA 1', SQUAD_SHEETS['AREA 1']);
    console.log(`✅ Success! AREA 1: ${result.rowCount} rows → ${result.sheetName}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
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

/**
 * Filter data for AREA 1 and remove SQUAD column (backward compatibility)
 */
function filterDataForArea1(allData) {
  return filterDataForSquad(allData, 'AREA 1');
}

/**
 * Distribute combined HOSPITAL & INBOUND data to one sheet
 */
function distributeCombinedHospitalInbound(allData, sheetId) {
  // Find column indices to remove
  const squadIndex = allData.headers.indexOf('SQUAD');
  const visualIndex = allData.headers.indexOf('visual');
  
  if (squadIndex === -1) {
    throw new Error('SQUAD column not found in data');
  }
  
  // Filter rows for HOSPITAL or INBOUND squads
  const combinedRows = allData.rows.filter(row => {
    const squadValue = row[squadIndex] ? row[squadIndex].toString() : '';
    return squadValue === 'HOSPITAL' || squadValue === 'INBOUND';
  });
  
  // Remove SQUAD and visual columns from headers and rows
  const filteredHeaders = allData.headers.filter((header, index) => 
    index !== squadIndex && index !== visualIndex
  );
  const filteredRows = combinedRows.map(row => 
    row.filter((cell, index) => index !== squadIndex && index !== visualIndex)
  );
  
  // Open sheet and write data
  const squadSheet = SpreadsheetApp.openById(sheetId);
  SheetFormatter.writeToSheet(squadSheet, 'campaign', filteredHeaders, filteredRows);
  
  return {
    squadName: 'HOSPITAL & INBOUND',
    rowCount: filteredRows.length,
    sheetName: squadSheet.getName(),
    sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
  };
}

/**
 * Filter data for any squad and remove SQUAD and visual columns
 */
function filterDataForSquad(allData, squadName) {
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
  
  return {
    headers: filteredHeaders,
    rows: filteredRows
  };
}