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
  'Inbound': '1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo',
  
  // New distribution sheets
  'MELATI': '1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4',
  'Melati': '1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4',
  'melati': '1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4',
  
  'GITA': '1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA',
  'Gita': '1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA',
  'gita': '1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA',
  
  'ABI': '1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE',
  'Abi': '1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE',
  'abi': '1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE',
  
  'TAUFIK': '1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg',
  'Taufik': '1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg',
  'taufik': '1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg',
  
  'KEVIN': '1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I',
  'Kevin': '1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I',
  'kevin': '1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I'
};

/**
 * Get your specific spreadsheet
 */
function getYourSpreadsheet() {
  return SpreadsheetApp.openById(YOUR_SHEET_ID);
}

/**
 * Manual distribution to new individual sheets
 */
function distributeToNewSheets() {
  try {
    console.log('📊 Starting distribution to new individual sheets...');
    
    // Get data from all_data sheet
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      throw new Error('all_data sheet not found. Run quickTestYourSheet() first.');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Find column indices
    const contentIndex = headers.indexOf('content');
    const dmIndex = headers.indexOf('dm');
    const visualIndex = headers.indexOf('visual');
    const squadIndex = headers.indexOf('SQUAD');
    
    if (contentIndex === -1 || dmIndex === -1) {
      throw new Error('Required columns (content, dm) not found in data');
    }
    
    // Define individuals and their columns
    const individuals = {
      'MELATI': { column: 'content', sheetId: '1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4' },
      'GITA': { column: 'content', sheetId: '1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA' },
      'ABI': { column: 'content', sheetId: '1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE' },
      'TAUFIK': { column: 'dm', sheetId: '1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg' },
      'KEVIN': { column: 'dm', sheetId: '1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I' }
    };
    
    const results = [];
    
    for (const [name, config] of Object.entries(individuals)) {
      try {
        // Filter rows based on content or dm column
        const columnIndex = config.column === 'content' ? contentIndex : dmIndex;
        const filteredRows = rows.filter(row => {
          const value = row[columnIndex];
          return value && value.toString().toUpperCase() === name;
        });
        
        if (filteredRows.length === 0) {
          console.log(`⚠️ ${name}: No data found in ${config.column} column`);
          results.push({name, rowCount: 0, column: config.column});
          continue;
        }
        
        // Remove SQUAD and visual columns from headers and rows
        const filteredHeaders = headers.filter((header, index) => 
          index !== visualIndex && index !== squadIndex
        );
        const finalRows = filteredRows.map(row => 
          row.filter((cell, index) => index !== visualIndex && index !== squadIndex)
        );
        
        // Write to individual sheet
        const targetSheet = SpreadsheetApp.openById(config.sheetId);
        SheetFormatter.writeToSheet(targetSheet, 'campaign', filteredHeaders, finalRows);
        
        results.push({
          name: name,
          rowCount: finalRows.length,
          column: config.column,
          sheetName: targetSheet.getName()
        });
        
        console.log(`✅ ${name}: ${finalRows.length} rows distributed from ${config.column} column`);
        
      } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        results.push({name, error: error.message});
      }
    }
    
    console.log('🎉 Distribution to new sheets complete!');
    return results;
    
  } catch (error) {
    console.error('❌ Distribution failed:', error);
    throw error;
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
    
    const squadDistributionResults = distributeToAllSquadsFromData({headers: allData.headers, rows: formattedRows});
    
    // Step 4: Distribute to individual sheets
    console.log('👤 Step 4: Distributing to individual sheets...');
    let individualResults = [];
    try {
      // Get data from the all_data sheet we just created
      const sheet = ss.getSheetByName('all_data');
      const sheetData = sheet.getDataRange().getValues();
      const sheetHeaders = sheetData[0];
      const sheetRows = sheetData.slice(1);
      
      // Find column indices
      const contentIndex = sheetHeaders.indexOf('content');
      const dmIndex = sheetHeaders.indexOf('dm');
      const visualIndex = sheetHeaders.indexOf('visual');
      const squadIndex = sheetHeaders.indexOf('SQUAD');
      
      if (contentIndex !== -1 && dmIndex !== -1) {
        // Define individuals and their columns
        const individuals = {
          'MELATI': { column: 'content', sheetId: '1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4' },
          'GITA': { column: 'content', sheetId: '1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA' },
          'ABI': { column: 'content', sheetId: '1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE' },
          'TAUFIK': { column: 'dm', sheetId: '1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg' },
          'KEVIN': { column: 'dm', sheetId: '1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I' }
        };
        
        for (const [name, config] of Object.entries(individuals)) {
          try {
            // Filter rows based on content or dm column
            const columnIndex = config.column === 'content' ? contentIndex : dmIndex;
            const filteredRows = sheetRows.filter(row => {
              const value = row[columnIndex];
              return value && value.toString().toUpperCase() === name;
            });
            
            if (filteredRows.length === 0) {
              console.log(`⚠️ ${name}: No data found in ${config.column} column`);
              individualResults.push({name, rowCount: 0, column: config.column});
              continue;
            }
            
            // Remove SQUAD and visual columns from headers and rows
            const filteredHeaders = sheetHeaders.filter((header, index) => 
              index !== visualIndex && index !== squadIndex
            );
            const finalRows = filteredRows.map(row => 
              row.filter((cell, index) => index !== visualIndex && index !== squadIndex)
            );
            
            // Write to individual sheet
            const targetSheet = SpreadsheetApp.openById(config.sheetId);
            SheetFormatter.writeToSheet(targetSheet, 'campaign', filteredHeaders, finalRows);
            
            individualResults.push({
              name: name,
              rowCount: finalRows.length,
              column: config.column,
              sheetName: targetSheet.getName()
            });
            
            console.log(`✅ ${name}: ${finalRows.length} rows distributed from ${config.column} column`);
            
          } catch (error) {
            console.error(`❌ ${name}: ${error.message}`);
            individualResults.push({name, error: error.message});
          }
        }
      } else {
        console.error('⚠️ Skipping individual distribution - required columns not found');
      }
    } catch (error) {
      console.error('❌ Individual distribution failed:', error);
    }
    
    // Step 5: Summary
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('🎉 AUTOMATION COMPLETE!');
    console.log(`⏱️ Total time: ${duration} seconds`);
    console.log(`📊 Main sheet: ${allData.rows.length} rows`);
    
    console.log('\n📋 Squad Distribution Results:');
    squadDistributionResults.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.squadName}: ${result.error}`);
      } else {
        console.log(`✅ ${result.squadName}: ${result.rowCount} rows`);
      }
    });
    
    console.log('\n👤 Individual Distribution Results:');
    individualResults.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.name}: ${result.error}`);
      } else {
        console.log(`✅ ${result.name}: ${result.rowCount} rows`);
      }
    });
    
    return {
      success: true,
      totalRows: allData.rows.length,
      duration: duration,
      squadDistributionResults: squadDistributionResults,
      individualDistributionResults: individualResults
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

/**
 * Quick test - fetch from BigQuery and write to your sheet
 */
function quickTestYourSheet() {
  try {
    // 1. Fetch data from BigQuery
    console.log('📊 Fetching data from BigQuery...');
    const allData = BigQueryFetcher.fetchAllData();
    console.log(`✅ Got ${allData.rows.length} rows`);
    
    // 2. Write to sheet
    console.log('📝 Writing to sheet...');
    const ss = getYourSpreadsheet();
    SheetFormatter.writeToSheet(ss, 'all_data', allData.headers, allData.rows);
    
    console.log('✅ Success! Check your sheet.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Distribute to ALL squad sheets (reads from all_data sheet)
 */
function distributeToAllSquads() {
  try {
    console.log('📊 Starting distribution to all squad sheets...');
    
    // Get data from all_data sheet
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      throw new Error('all_data sheet not found. Run quickTestYourSheet() first.');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Distribute to all squads
    const results = distributeToAllSquadsFromData({headers, rows});
    
    console.log('🎉 Distribution complete!');
    return results;
    
  } catch (error) {
    console.error('❌ Distribution failed:', error);
    throw error;
  }
}

/**
 * Check actual squad values in your data
 */
function checkSquadValues() {
  try {
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      console.error('❌ all_data sheet not found. Run quickTestYourSheet() first.');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const squadIndex = headers.indexOf('SQUAD');
    
    if (squadIndex === -1) {
      console.error('❌ SQUAD column not found');
      return;
    }
    
    // Get unique squad values
    const squads = new Set();
    for (let i = 1; i < data.length; i++) {
      const squadValue = data[i][squadIndex];
      if (squadValue) {
        squads.add(squadValue);
      }
    }
    
    console.log('📊 Found SQUAD values in data:');
    Array.from(squads).sort().forEach(squad => {
      const mapped = SQUAD_SHEETS[squad] ? '✅ Mapped' : '❌ Not mapped';
      console.log(`  - "${squad}" ${mapped}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}