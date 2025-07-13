/**
 * Team-Specific Examples for BigQuery Optimizer
 * 
 * Examples using your actual team structure:
 * - SQUADS: AREA 3, AREA 1, AREA 2, PROGRAM, HOSPITAL, INBOUND
 * - CONTENT: 41 content creators
 * - DM: 19 digital marketers
 */

/**
 * Example 1: Generate all team member filters
 * This creates individual filters for every team member
 */
function generateAllTeamFilters() {
  try {
    console.log('=== Generating All Team Filters ===');
    
    // Generate filters for all 41 content creators and 19 DMs
    FilterConfigs.generateTeamFilters();
    
    // List all available filters
    const allFilters = FilterConfigs.listFilters();
    console.log(`Total filters available: ${allFilters.length}`);
    
    // Show squad filters
    const squads = FilterConfigs.getSquads();
    console.log('Squad filters:', squads.map(s => `squad_${s.toLowerCase().replace(' ', '_')}`));
    
  } catch (error) {
    console.error('Error generating team filters:', error);
  }
}

/**
 * Example 2: Export data for all squads
 * Creates individual sheets for each squad
 */
function exportAllSquadData() {
  try {
    console.log('=== Exporting All Squad Data ===');
    
    const squads = ['AREA 1', 'AREA 2', 'AREA 3', 'PROGRAM', 'HOSPITAL', 'INBOUND'];
    
    squads.forEach(squad => {
      const filterKey = `squad_${squad.toLowerCase().replace(' ', '_')}`;
      const sheetName = `squad_${squad.toLowerCase().replace(' ', '_')}`;
      
      try {
        exportFilteredData(filterKey, sheetName);
        console.log(`✅ Exported ${squad} data to ${sheetName}`);
      } catch (error) {
        console.error(`❌ Failed to export ${squad}:`, error);
      }
    });
    
  } catch (error) {
    console.error('Error exporting squad data:', error);
  }
}

/**
 * Example 3: Export key content creator data
 * Focus on top performers or key team members
 */
function exportKeyContentCreators() {
  try {
    console.log('=== Exporting Key Content Creator Data ===');
    
    // Key content creators (you can modify this list)
    const keyCreators = ['MONICA', 'TAZKIYA', 'SHAFIRA', 'VORA', 'BUNGA'];
    
    keyCreators.forEach(creator => {
      const filterKey = `content_${creator.toLowerCase()}`;
      const sheetName = `content_${creator.toLowerCase()}`;
      
      try {
        exportFilteredData(filterKey, sheetName);
        console.log(`✅ Exported ${creator} content data`);
      } catch (error) {
        console.error(`❌ Failed to export ${creator}:`, error);
      }
    });
    
  } catch (error) {
    console.error('Error exporting content creator data:', error);
  }
}

/**
 * Example 4: Export key DM data
 * Focus on key digital marketers
 */
function exportKeyDMData() {
  try {
    console.log('=== Exporting Key DM Data ===');
    
    // Key DMs (you can modify this list)
    const keyDMs = ['KEVIN', 'MIQDAD', 'NAUFAL', 'HAMAM', 'TAUFIK'];
    
    keyDMs.forEach(dm => {
      const filterKey = `dm_${dm.toLowerCase()}`;
      const sheetName = `dm_${dm.toLowerCase()}`;
      
      try {
        exportFilteredData(filterKey, sheetName);
        console.log(`✅ Exported ${dm} DM data`);
      } catch (error) {
        console.error(`❌ Failed to export ${dm}:`, error);
      }
    });
    
  } catch (error) {
    console.error('Error exporting DM data:', error);
  }
}

/**
 * Example 5: Team performance comparison
 * Compare performance across different squads
 */
function compareSquadPerformance() {
  try {
    console.log('=== Squad Performance Comparison ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    const squads = FilterConfigs.getSquads();
    const performanceData = [];
    
    squads.forEach(squad => {
      const squadData = DataDistributor.filterByColumn(allData, 'SQUAD', squad);
      const summary = DataDistributor.getDataSummary(squadData);
      
      // Calculate squad totals
      let totalCost = 0;
      let totalGdv = 0;
      let activeCampaigns = 0;
      
      squadData.rows.forEach(row => {
        const rowData = row.f ? row.f.map(c => c.v) : row;
        const cost = parseFloat(rowData[allData.headers.indexOf('cost_l30d')]) || 0;
        const gdv = parseFloat(rowData[allData.headers.indexOf('gdv_l30d')]) || 0;
        const status = rowData[allData.headers.indexOf('status_ads')];
        
        totalCost += cost;
        totalGdv += gdv;
        if (status === 'ACTIVE') activeCampaigns++;
      });
      
      const avgRoas = totalCost > 0 ? totalGdv / totalCost : 0;
      
      performanceData.push([
        squad,
        summary.rowCount,
        activeCampaigns,
        totalCost,
        totalGdv,
        avgRoas.toFixed(2)
      ]);
    });
    
    // Create performance comparison sheet
    const headers = ['Squad', 'Total Campaigns', 'Active Campaigns', 'Total Cost L30D', 'Total GDV L30D', 'Avg ROAS'];
    
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'squad_performance_comparison',
      headers,
      performanceData.map(row => ({ f: row.map(v => ({ v: v })) })),
      {
        headerColor: '#4285f4',
        conditionalFormatting: true,
        addFilters: true
      }
    );
    
    console.log('Squad performance comparison created');
    
  } catch (error) {
    console.error('Error comparing squad performance:', error);
  }
}

/**
 * Example 6: Content creator performance analysis
 * Analyze which content creators are performing best
 */
function analyzeContentCreatorPerformance() {
  try {
    console.log('=== Content Creator Performance Analysis ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    const contentCreators = FilterConfigs.getContentCreators();
    const performanceData = [];
    
    // Analyze top 10 content creators (you can adjust this)
    const topCreators = contentCreators.slice(0, 10);
    
    topCreators.forEach(creator => {
      const creatorData = DataDistributor.filterByColumn(allData, 'content', creator);
      
      if (creatorData.rows.length > 0) {
        let totalCost = 0;
        let totalGdv = 0;
        let activeCampaigns = 0;
        
        creatorData.rows.forEach(row => {
          const rowData = row.f ? row.f.map(c => c.v) : row;
          const cost = parseFloat(rowData[allData.headers.indexOf('cost_l30d')]) || 0;
          const gdv = parseFloat(rowData[allData.headers.indexOf('gdv_l30d')]) || 0;
          const status = rowData[allData.headers.indexOf('status_ads')];
          
          totalCost += cost;
          totalGdv += gdv;
          if (status === 'ACTIVE') activeCampaigns++;
        });
        
        const avgRoas = totalCost > 0 ? totalGdv / totalCost : 0;
        
        performanceData.push([
          creator,
          creatorData.rows.length,
          activeCampaigns,
          totalCost,
          totalGdv,
          avgRoas.toFixed(2)
        ]);
      }
    });
    
    // Sort by ROAS descending
    performanceData.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]));
    
    // Create performance sheet
    const headers = ['Content Creator', 'Total Campaigns', 'Active Campaigns', 'Total Cost L30D', 'Total GDV L30D', 'Avg ROAS'];
    
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'content_creator_performance',
      headers,
      performanceData.map(row => ({ f: row.map(v => ({ v: v })) })),
      {
        headerColor: '#34a853',
        conditionalFormatting: true,
        addFilters: true
      }
    );
    
    console.log('Content creator performance analysis created');
    
  } catch (error) {
    console.error('Error analyzing content creator performance:', error);
  }
}

/**
 * Example 7: DM workload and performance analysis
 * Analyze DM workload and effectiveness
 */
function analyzeDMWorkload() {
  try {
    console.log('=== DM Workload Analysis ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    const dms = FilterConfigs.getDigitalMarketers();
    const workloadData = [];
    
    dms.forEach(dm => {
      const dmData = DataDistributor.filterByColumn(allData, 'dm', dm);
      
      if (dmData.rows.length > 0) {
        let totalCost = 0;
        let totalGdv = 0;
        let activeCampaigns = 0;
        let highPerformingCampaigns = 0;
        
        dmData.rows.forEach(row => {
          const rowData = row.f ? row.f.map(c => c.v) : row;
          const cost = parseFloat(rowData[allData.headers.indexOf('cost_l30d')]) || 0;
          const gdv = parseFloat(rowData[allData.headers.indexOf('gdv_l30d')]) || 0;
          const roas = parseFloat(rowData[allData.headers.indexOf('roas_ads_l30d')]) || 0;
          const status = rowData[allData.headers.indexOf('status_ads')];
          
          totalCost += cost;
          totalGdv += gdv;
          if (status === 'ACTIVE') activeCampaigns++;
          if (roas > 1.5) highPerformingCampaigns++;
        });
        
        const avgRoas = totalCost > 0 ? totalGdv / totalCost : 0;
        const performanceRate = dmData.rows.length > 0 ? (highPerformingCampaigns / dmData.rows.length * 100) : 0;
        
        workloadData.push([
          dm,
          dmData.rows.length,
          activeCampaigns,
          totalCost,
          totalGdv,
          avgRoas.toFixed(2),
          performanceRate.toFixed(1) + '%'
        ]);
      }
    });
    
    // Sort by total campaigns (workload) descending
    workloadData.sort((a, b) => b[1] - a[1]);
    
    // Create workload sheet
    const headers = ['DM', 'Total Campaigns', 'Active Campaigns', 'Total Cost L30D', 'Total GDV L30D', 'Avg ROAS', 'High Performance Rate'];
    
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'dm_workload_analysis',
      headers,
      workloadData.map(row => ({ f: row.map(v => ({ v: v })) })),
      {
        headerColor: '#ff9800',
        conditionalFormatting: true,
        addFilters: true
      }
    );
    
    console.log('DM workload analysis created');
    
  } catch (error) {
    console.error('Error analyzing DM workload:', error);
  }
}

/**
 * Example 8: Team dashboard - comprehensive view
 * Create a comprehensive team dashboard
 */
function createTeamDashboard() {
  try {
    console.log('=== Creating Team Dashboard ===');
    
    // Generate all team filters first
    FilterConfigs.generateTeamFilters();
    
    // Export main squad data
    exportAllSquadData();
    
    // Export key individual data
    exportKeyContentCreators();
    exportKeyDMData();
    
    // Create analysis sheets
    compareSquadPerformance();
    analyzeContentCreatorPerformance();
    analyzeDMWorkload();
    
    // Create summary dashboard
    const summaryData = {
      'Total Squads': FilterConfigs.getSquads().length,
      'Total Content Creators': FilterConfigs.getContentCreators().length,
      'Total DMs': FilterConfigs.getDigitalMarketers().length,
      'Last Updated': new Date().toLocaleString(),
      'Data Source': 'BigQuery Optimizer',
      'Update Frequency': 'Optimized - Single Query'
    };
    
    SheetFormatter.createSummarySheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      summaryData
    );
    
    console.log('✅ Team dashboard created successfully!');
    console.log('Created sheets for all squads, key team members, and performance analysis');
    
  } catch (error) {
    console.error('Error creating team dashboard:', error);
  }
}

/**
 * Example 9: Daily team reports
 * Generate daily reports for team managers
 */
function generateDailyTeamReports() {
  try {
    console.log('=== Generating Daily Team Reports ===');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Generate reports for each squad
    const squads = FilterConfigs.getSquads();
    
    squads.forEach(squad => {
      const filterKey = `squad_${squad.toLowerCase().replace(' ', '_')}`;
      const sheetName = `daily_${squad.toLowerCase().replace(' ', '_')}_${today}`;
      
      try {
        exportFilteredData(filterKey, sheetName);
        console.log(`✅ Daily report for ${squad} created`);
      } catch (error) {
        console.error(`❌ Failed to create daily report for ${squad}:`, error);
      }
    });
    
  } catch (error) {
    console.error('Error generating daily team reports:', error);
  }
}

/**
 * Example 10: Custom team combinations
 * Create custom filters for specific team combinations
 */
function createCustomTeamCombinations() {
  try {
    console.log('=== Creating Custom Team Combinations ===');
    
    // Example: All AREA squads combined
    FilterConfigs.addCustomFilter('area_squads_combined', {
      sheetName: 'area_squads_combined',
      description: 'Combined data for AREA 1, AREA 2, and AREA 3',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        const squad = row[squadIndex];
        return ['AREA 1', 'AREA 2', 'AREA 3'].includes(squad);
      }
    });
    
    // Example: Top DMs combined
    FilterConfigs.addCustomFilter('top_dms_combined', {
      sheetName: 'top_dms_combined',
      description: 'Combined data for top performing DMs',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        const dm = row[dmIndex];
        return ['KEVIN', 'MIQDAD', 'NAUFAL', 'HAMAM'].includes(dm);
      }
    });
    
    // Export the custom combinations
    exportFilteredData('area_squads_combined', 'area_squads_combined');
    exportFilteredData('top_dms_combined', 'top_dms_combined');
    
    console.log('Custom team combinations created');
    
  } catch (error) {
    console.error('Error creating custom team combinations:', error);
  }
}

// Helper function to run all team-specific examples
function runAllTeamExamples() {
  try {
    console.log('🚀 Running all team-specific examples...');
    
    generateAllTeamFilters();
    createTeamDashboard();
    createCustomTeamCombinations();
    
    console.log('✅ All team-specific examples completed!');
    
  } catch (error) {
    console.error('Error running team examples:', error);
  }
}