/**
 * Usage Examples for BigQuery Optimizer
 * 
 * This file contains practical examples of how to use the BigQuery Optimizer
 * for different scenarios and use cases.
 */

/**
 * Example 1: Basic usage - Fetch and distribute all data
 * This is the main function that replaces multiple BigQuery calls
 */
function example1_BasicUsage() {
  try {
    console.log('=== Example 1: Basic Usage ===');
    
    // This single call replaces multiple BigQuery queries
    fetchAndDistributeData();
    
    // Get optimization statistics
    const stats = getOptimizationStats();
    console.log('Optimization Stats:', stats);
    
  } catch (error) {
    console.error('Example 1 failed:', error);
  }
}

/**
 * Example 2: Backward compatibility - Use existing function names
 * Your existing scripts will continue to work without changes
 */
function example2_BackwardCompatibility() {
  try {
    console.log('=== Example 2: Backward Compatibility ===');
    
    // This works exactly like your original script
    exportKevinAggregates();
    
    console.log('Kevin aggregates exported to campaign sheet');
    
  } catch (error) {
    console.error('Example 2 failed:', error);
  }
}

/**
 * Example 3: Export specific filter data
 * Export data for different levels using predefined filters
 */
function example3_SpecificFilters() {
  try {
    console.log('=== Example 3: Specific Filters ===');
    
    // Export high performers
    exportFilteredData('high_performers', 'top_campaigns');
    
    // Export active campaigns
    exportFilteredData('active_campaigns', 'active_campaigns');
    
    // Export by DM
    exportFilteredData('dm_kevin', 'kevin_campaigns');
    
    console.log('Specific filters exported successfully');
    
  } catch (error) {
    console.error('Example 3 failed:', error);
  }
}

/**
 * Example 4: Custom filtering
 * Create and use custom filters for specific business needs
 */
function example4_CustomFiltering() {
  try {
    console.log('=== Example 4: Custom Filtering ===');
    
    // Fetch all data once
    const allData = BigQueryFetcher.fetchAllData();
    
    // Create custom filter for campaigns with high ROAS and high spend
    const customFilter = {
      name: 'High Value Campaigns',
      sheetName: 'high_value_campaigns',
      filter: (row, headers) => {
        const roasIndex = headers.indexOf('roas_ads_l30d');
        const costIndex = headers.indexOf('cost_l30d');
        
        const roas = parseFloat(row[roasIndex]);
        const cost = parseFloat(row[costIndex]);
        
        return !isNaN(roas) && !isNaN(cost) && roas > 1.5 && cost > 50000;
      }
    };
    
    // Apply custom filter
    const filteredData = DataDistributor.applyFilter(allData, customFilter);
    
    // Write to sheet
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'high_value_campaigns',
      filteredData.headers,
      filteredData.rows
    );
    
    console.log(`Custom filter applied: ${filteredData.rows.length} high-value campaigns found`);
    
  } catch (error) {
    console.error('Example 4 failed:', error);
  }
}

/**
 * Example 5: Multiple filters with different criteria
 * Apply multiple filters to create specialized reports
 */
function example5_MultipleFilters() {
  try {
    console.log('=== Example 5: Multiple Filters ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    
    // Filter 1: Active campaigns with good performance
    const activeGoodPerformers = DataDistributor.applyMultipleFilters(allData, [
      {
        type: 'custom',
        filter: FilterConfigs.getFilter('active_campaigns').filter
      },
      {
        type: 'custom',
        filter: (row, headers) => {
          const roasIndex = headers.indexOf('roas_ads_l30d');
          const roas = parseFloat(row[roasIndex]);
          return !isNaN(roas) && roas > 1.2;
        }
      }
    ]);
    
    // Filter 2: Kevin's campaigns that need attention (low ROAS)
    const kevinLowPerformers = DataDistributor.applyMultipleFilters(allData, [
      {
        type: 'custom',
        filter: FilterConfigs.getFilter('dm_kevin').filter
      },
      {
        type: 'custom',
        filter: FilterConfigs.getFilter('low_performers').filter
      }
    ]);
    
    // Write results
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'active_good_performers',
      activeGoodPerformers.headers,
      activeGoodPerformers.rows
    );
    
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'kevin_needs_attention',
      kevinLowPerformers.headers,
      kevinLowPerformers.rows
    );
    
    console.log(`Active good performers: ${activeGoodPerformers.rows.length}`);
    console.log(`Kevin campaigns needing attention: ${kevinLowPerformers.rows.length}`);
    
  } catch (error) {
    console.error('Example 5 failed:', error);
  }
}

/**
 * Example 6: Performance monitoring and alerting
 * Monitor campaign performance and create alerts
 */
function example6_PerformanceMonitoring() {
  try {
    console.log('=== Example 6: Performance Monitoring ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    
    // Find campaigns that significantly decreased in performance
    const performanceAlerts = allData.rows.filter(row => {
      const rowData = row.f ? row.f.map(c => c.v) : row;
      const headers = allData.headers;
      
      const roasTodayIndex = headers.indexOf('roas_ads_today');
      const roasL30dIndex = headers.indexOf('roas_ads_l30d');
      const costTodayIndex = headers.indexOf('cost_today');
      
      const roasToday = parseFloat(rowData[roasTodayIndex]);
      const roasL30d = parseFloat(rowData[roasL30dIndex]);
      const costToday = parseFloat(rowData[costTodayIndex]);
      
      // Alert if today's ROAS is 50% lower than 30-day average and we're spending money
      return !isNaN(roasToday) && !isNaN(roasL30d) && 
             costToday > 0 && roasL30d > 0 &&
             roasToday < (roasL30d * 0.5);
    });
    
    // Create alert sheet
    if (performanceAlerts.length > 0) {
      SheetFormatter.writeToSheet(
        SpreadsheetApp.getActiveSpreadsheet(),
        'performance_alerts',
        allData.headers,
        performanceAlerts,
        {
          headerColor: '#ff9999',
          conditionalFormatting: true
        }
      );
      
      console.log(`⚠️ ${performanceAlerts.length} campaigns need attention!`);
    } else {
      console.log('✅ All campaigns performing within normal range');
    }
    
  } catch (error) {
    console.error('Example 6 failed:', error);
  }
}

/**
 * Example 7: Data summary and reporting
 * Create summary reports and statistics
 */
function example7_SummaryReporting() {
  try {
    console.log('=== Example 7: Summary Reporting ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    
    // Get data summary
    const summary = DataDistributor.getDataSummary(allData);
    
    // Calculate business metrics
    const businessMetrics = {
      totalCampaigns: allData.rows.length,
      activeCampaigns: DataDistributor.filterByColumn(allData, 'status_ads', 'ACTIVE').rows.length,
      totalSpendL30d: 0,
      totalGdvL30d: 0,
      averageRoas: 0
    };
    
    // Calculate totals
    allData.rows.forEach(row => {
      const rowData = row.f ? row.f.map(c => c.v) : row;
      const costL30d = parseFloat(rowData[allData.headers.indexOf('cost_l30d')]) || 0;
      const gdvL30d = parseFloat(rowData[allData.headers.indexOf('gdv_l30d')]) || 0;
      
      businessMetrics.totalSpendL30d += costL30d;
      businessMetrics.totalGdvL30d += gdvL30d;
    });
    
    businessMetrics.averageRoas = businessMetrics.totalSpendL30d > 0 ? 
      businessMetrics.totalGdvL30d / businessMetrics.totalSpendL30d : 0;
    
    // Create summary sheet
    const summaryData = {
      'Total Campaigns': businessMetrics.totalCampaigns,
      'Active Campaigns': businessMetrics.activeCampaigns,
      'Total Spend L30D': businessMetrics.totalSpendL30d.toLocaleString(),
      'Total GDV L30D': businessMetrics.totalGdvL30d.toLocaleString(),
      'Average ROAS': businessMetrics.averageRoas.toFixed(2),
      'Data Freshness': new Date().toLocaleString(),
      'Last BigQuery Fetch': BigQueryFetcher.getLastFetchTime()
    };
    
    SheetFormatter.createSummarySheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      summaryData
    );
    
    console.log('Summary report created:', businessMetrics);
    
  } catch (error) {
    console.error('Example 7 failed:', error);
  }
}

/**
 * Example 8: Scheduled automation
 * Set up automated data refresh and distribution
 */
function example8_ScheduledAutomation() {
  try {
    console.log('=== Example 8: Scheduled Automation ===');
    
    // Clear cache to ensure fresh data
    BigQueryFetcher.clearCache();
    
    // Refresh all data
    refreshAllData();
    
    // Create performance alerts
    example6_PerformanceMonitoring();
    
    // Create summary report
    example7_SummaryReporting();
    
    // Log completion
    const stats = getOptimizationStats();
    console.log('Scheduled automation completed:', stats);
    
    // You can set this function to run on a trigger:
    // 1. Go to Extensions > Apps Script
    // 2. Click on "Triggers" (clock icon)
    // 3. Add a new trigger for this function
    // 4. Set it to run daily, hourly, etc.
    
  } catch (error) {
    console.error('Example 8 failed:', error);
  }
}

/**
 * Example 9: A/B Testing Data
 * Filter and analyze data for A/B testing scenarios
 */
function example9_ABTestingData() {
  try {
    console.log('=== Example 9: A/B Testing Data ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    
    // Split data by content type for A/B testing
    const videoContent = DataDistributor.filterByColumn(allData, 'content', 'video', 'contains');
    const imageContent = DataDistributor.filterByColumn(allData, 'content', 'image', 'contains');
    
    // Create A/B test sheets
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'ab_test_video',
      videoContent.headers,
      videoContent.rows
    );
    
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'ab_test_image',
      imageContent.headers,
      imageContent.rows
    );
    
    console.log(`A/B Test - Video: ${videoContent.rows.length}, Image: ${imageContent.rows.length}`);
    
  } catch (error) {
    console.error('Example 9 failed:', error);
  }
}

/**
 * Example 10: Cost optimization analysis
 * Identify opportunities for cost optimization
 */
function example10_CostOptimization() {
  try {
    console.log('=== Example 10: Cost Optimization ===');
    
    const allData = BigQueryFetcher.fetchAllData();
    
    // Find high-spend, low-ROAS campaigns (optimization candidates)
    const optimizationCandidates = allData.rows.filter(row => {
      const rowData = row.f ? row.f.map(c => c.v) : row;
      const headers = allData.headers;
      
      const costL30d = parseFloat(rowData[headers.indexOf('cost_l30d')]);
      const roasL30d = parseFloat(rowData[headers.indexOf('roas_ads_l30d')]);
      
      // High spend (>50k) but low ROAS (<1.0)
      return !isNaN(costL30d) && !isNaN(roasL30d) && 
             costL30d > 50000 && roasL30d < 1.0;
    });
    
    // Calculate potential savings
    let potentialSavings = 0;
    optimizationCandidates.forEach(row => {
      const rowData = row.f ? row.f.map(c => c.v) : row;
      const cost = parseFloat(rowData[allData.headers.indexOf('cost_l30d')]);
      potentialSavings += cost * 0.5; // Assume 50% cost reduction potential
    });
    
    // Create optimization report
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      'cost_optimization',
      allData.headers,
      optimizationCandidates,
      {
        headerColor: '#ffcc99'
      }
    );
    
    console.log(`Found ${optimizationCandidates.length} optimization candidates`);
    console.log(`Potential monthly savings: ${potentialSavings.toLocaleString()}`);
    
  } catch (error) {
    console.error('Example 10 failed:', error);
  }
}

// Helper function to run all examples for demonstration
function runAllExamples() {
  try {
    console.log('Running all BigQuery Optimizer examples...');
    
    example1_BasicUsage();
    example2_BackwardCompatibility();
    example3_SpecificFilters();
    example4_CustomFiltering();
    example5_MultipleFilters();
    example6_PerformanceMonitoring();
    example7_SummaryReporting();
    example9_ABTestingData();
    example10_CostOptimization();
    
    console.log('All examples completed successfully!');
    
  } catch (error) {
    console.error('Error running examples:', error);
  }
}