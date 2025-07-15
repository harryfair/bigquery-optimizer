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
  let retries = 3;
  let lastError;
  
  while (retries > 0) {
    try {
      return SpreadsheetApp.openById(YOUR_SHEET_ID);
    } catch (error) {
      lastError = error;
      retries--;
      
      if (retries > 0) {
        console.log(`⚠️ Failed to open main spreadsheet, retrying... (${retries} attempts left)`);
        // Exponential backoff: 2s, 4s, 6s
        Utilities.sleep((3 - retries) * 2000);
      }
    }
  }
  
  console.error('Failed to open spreadsheet after 3 attempts:', lastError);
  throw new Error(`Cannot access spreadsheet with ID: ${YOUR_SHEET_ID}. Error: ${lastError.message}`);
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
        
        // Write to individual sheet with retry logic
        let retries = 3;
        let success = false;
        let lastError;
        
        while (retries > 0 && !success) {
          try {
            const targetSheet = SpreadsheetApp.openById(config.sheetId);
            SheetFormatter.writeToSheet(targetSheet, 'campaign', filteredHeaders, finalRows);
            success = true;
            
            results.push({
              name: name,
              rowCount: finalRows.length,
              column: config.column,
              sheetName: targetSheet.getName()
            });
            
            console.log(`✅ ${name}: ${finalRows.length} rows distributed from ${config.column} column`);
          } catch (error) {
            lastError = error;
            retries--;
            if (retries > 0) {
              console.log(`⚠️ ${name}: Retrying... (${retries} attempts left)`);
              // Add delay with exponential backoff
              Utilities.sleep((3 - retries) * 2000); // 2s, 4s, 6s
            }
          }
        }
        
        if (!success) {
          console.error(`❌ ${name}: ${lastError.message}`);
          results.push({name, error: lastError.message});
        }
        
        // Add delay between individuals to avoid rate limiting
        if (Object.keys(individuals).indexOf(name) < Object.keys(individuals).length - 1) {
          Utilities.sleep(1000); // 1 second delay between individuals
        }
        
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
 * Safe wrapper for automated execution that prevents post-completion timeouts
 */
function safeAutomatedDailyUpdate() {
  try {
    // Run the main automation
    const result = automatedDailyUpdate();
    
    // Ensure clean exit without any additional spreadsheet access
    console.log('\n✨ Automation wrapper completed. Exiting cleanly.');
    
    // Force garbage collection hint
    SpreadsheetApp.flush();
    
    return result;
  } catch (error) {
    console.error('❌ Safe automation wrapper error:', error);
    // Don't re-throw to prevent additional error handling that might access sheets
    return { success: false, error: error.message };
  }
}

/**
 * AUTOMATED COMPLETE WORKFLOW - Fetch data and distribute to all squads
 * THIS IS THE MAIN AUTOMATION FUNCTION
 */
function automatedDailyUpdate() {
  let ss = null;
  try {
    console.log('🤖 Starting automated daily update...');
    const startTime = new Date();
    
    // Step 1: Fetch all data from BigQuery
    console.log('📊 Step 1: Fetching data from BigQuery...');
    ss = getYourSpreadsheet();
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
      // Use the already-fetched data instead of re-reading from sheet
      const sheetHeaders = allData.headers;
      const sheetRows = formattedRows;
      
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
            
            // Write to individual sheet with retry logic
            let retries = 3;
            let success = false;
            let lastError;
            
            while (retries > 0 && !success) {
              try {
                const targetSheet = SpreadsheetApp.openById(config.sheetId);
                SheetFormatter.writeToSheet(targetSheet, 'campaign', filteredHeaders, finalRows);
                success = true;
                
                individualResults.push({
                  name: name,
                  rowCount: finalRows.length,
                  column: config.column,
                  sheetName: targetSheet.getName()
                });
                
                console.log(`✅ ${name}: ${finalRows.length} rows distributed from ${config.column} column`);
              } catch (error) {
                lastError = error;
                retries--;
                if (retries > 0) {
                  console.log(`⚠️ ${name}: Retrying... (${retries} attempts left)`);
                  // Add delay with exponential backoff
                  Utilities.sleep((3 - retries) * 2000); // 2s, 4s, 6s
                }
              }
            }
            
            if (!success) {
              console.error(`❌ ${name}: ${lastError.message}`);
              individualResults.push({name, error: lastError.message});
            }
            
            // Add delay between individuals to avoid rate limiting
            if (Object.keys(individuals).indexOf(name) < Object.keys(individuals).length - 1) {
              Utilities.sleep(1000); // 1 second delay between individuals
            }
            
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
    
    // Add integrated workflow summary
    const totalSquadRows = squadDistributionResults.reduce((sum, r) => sum + (r.rowCount || 0), 0);
    const totalIndividualRows = individualResults.reduce((sum, r) => sum + (r.rowCount || 0), 0);
    const successfulSquads = squadDistributionResults.filter(r => !r.error).length;
    const successfulIndividuals = individualResults.filter(r => !r.error).length;
    
    console.log('\n✅ BigQuery Optimizer completed successfully!');
    console.log(`   - Total rows distributed: ${totalSquadRows}`);
    console.log(`   - Squad sheets updated: ${successfulSquads}`);
    console.log(`   - Individual sheets updated: ${successfulIndividuals}`);
    
    console.log('\n🎉 INTEGRATED WORKFLOW COMPLETE!');
    console.log('=================================');
    console.log(`⏱️  Total execution time: ${duration} seconds`);
    console.log(`📅 Timestamp: ${Utilities.formatDate(endTime, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')} WIB`);
    
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
  for (let i = 0; i < actualSquads.length; i++) {
    const actualSquad = actualSquads[i];
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
    
    // Add delay between squads to avoid rate limiting (except for the last one)
    if (i < actualSquads.length - 1) {
      Utilities.sleep(500); // 0.5 second delay between squads
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
 * Run ONLY individual distribution (useful if main automation succeeds but individual fails)
 */
function runIndividualDistributionOnly() {
  try {
    console.log('👤 Running individual distribution only...');
    
    // Get data from all_data sheet
    const ss = getYourSpreadsheet();
    const sheet = ss.getSheetByName('all_data');
    if (!sheet) {
      throw new Error('all_data sheet not found. Run automatedDailyUpdate() first.');
    }
    
    // Use the distributeToNewSheets function which has retry logic
    const results = distributeToNewSheets();
    
    console.log('\n👤 Individual Distribution Results:');
    results.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.name}: ${result.error}`);
      } else {
        console.log(`✅ ${result.name}: ${result.rowCount} rows`);
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Individual distribution failed:', error);
    throw error;
  }
}

/**
 * Set up time-based triggers for automation
 */
function setupAutomationTriggers() {
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'automatedDailyUpdate' || 
        trigger.getHandlerFunction() === 'safeAutomatedDailyUpdate' ||
        trigger.getHandlerFunction() === 'runIndividualDistributionDelayed') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Set up daily trigger at 6 AM using the safe wrapper
  ScriptApp.newTrigger('safeAutomatedDailyUpdate')
    .timeBased()
    .atHour(6)
    .everyDays(1)
    .create();
    
  console.log('✅ Daily automation trigger set for 6 AM (using safe wrapper)');
}

/**
 * Alternative: Run automation in two phases with delay
 */
function automatedDailyUpdatePhase1() {
  try {
    console.log('🤖 Starting automated daily update (Phase 1)...');
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
    const formattedRows = allData.rows.map(row => {
      if (row.f && Array.isArray(row.f)) {
        return row.f.map(cell => cell.v === null || cell.v === undefined ? '' : cell.v);
      }
      if (Array.isArray(row)) {
        return row.map(value => value === null || value === undefined ? '' : value);
      }
      return [String(row)];
    });
    
    const squadDistributionResults = distributeToAllSquadsFromData({headers: allData.headers, rows: formattedRows});
    
    console.log('✅ Phase 1 Complete! Squad distribution finished.');
    console.log('⏰ Individual distribution will run in 2 minutes...');
    
    // Schedule Phase 2 to run in 2 minutes
    ScriptApp.newTrigger('runIndividualDistributionDelayed')
      .timeBased()
      .after(2 * 60 * 1000) // 2 minutes in milliseconds
      .create();
    
    return {
      success: true,
      phase: 1,
      totalRows: allData.rows.length,
      squadDistributionResults: squadDistributionResults
    };
    
  } catch (error) {
    console.error('❌ Phase 1 failed:', error);
    throw error;
  }
}

/**
 * Phase 2: Run individual distribution after delay
 */
function runIndividualDistributionDelayed() {
  try {
    console.log('🤖 Running Phase 2: Individual distribution...');
    
    // Remove the trigger that called this function
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'runIndividualDistributionDelayed') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Run individual distribution
    const results = distributeToNewSheets();
    
    console.log('\n👤 Individual Distribution Results:');
    results.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.name}: ${result.error}`);
      } else {
        console.log(`✅ ${result.name}: ${result.rowCount} rows`);
      }
    });
    
    console.log('🎉 AUTOMATION FULLY COMPLETE!');
    
    return {
      success: true,
      phase: 2,
      individualDistributionResults: results
    };
    
  } catch (error) {
    console.error('❌ Phase 2 failed:', error);
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