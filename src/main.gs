/**
 * BigQuery Optimizer - Main Orchestration Functions
 * 
 * This module provides the main entry points for the BigQuery optimization system.
 * It coordinates data fetching, filtering, and distribution to reduce BigQuery costs.
 */

/**
 * Main function to fetch all data from BigQuery and distribute to level-specific sheets
 * This is the primary entry point for the optimization system
 */
function fetchAndDistributeData() {
  try {
    console.log('Starting BigQuery data fetch and distribution...');
    
    // Fetch all data once from BigQuery
    const allData = BigQueryFetcher.fetchAllData();
    console.log(`Fetched ${allData.rows.length} rows from BigQuery`);
    
    // Distribute data to different sheets based on configured filters
    DataDistributor.distributeByLevels(allData);
    console.log('Data distribution completed successfully');
    
    // Log summary
    const summary = DataDistributor.getLastDistributionSummary();
    console.log('Distribution Summary:', summary);
    
  } catch (error) {
    console.error('Error in fetchAndDistributeData:', error);
    throw error;
  }
}

/**
 * Backward compatibility function for Kevin's specific case
 * Maintains the same interface as the original exportKevinAggregates function
 */
function exportKevinAggregates() {
  try {
    console.log('Exporting Kevin aggregates using optimized approach...');
    
    // Fetch all data
    const allData = BigQueryFetcher.fetchAllData();
    
    // Filter for AREA 2 (Kevin's squad)
    const kevinFilter = FilterConfigs.getFilter('kevin_squad');
    const filteredData = DataDistributor.applyFilter(allData, kevinFilter);
    
    // Remove SQUAD column to match original format
    const cleanedData = DataDistributor.removeColumns(filteredData, ['SQUAD']);
    
    // Write to campaign sheet
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(), 
      'campaign', 
      cleanedData.headers, 
      cleanedData.rows
    );
    
    console.log(`Kevin aggregates exported: ${cleanedData.rows.length} rows`);
    
  } catch (error) {
    console.error('Error in exportKevinAggregates:', error);
    throw error;
  }
}

/**
 * Generic function to export data for a specific filter
 * @param {string} filterName - Name of the filter from FilterConfigs
 * @param {string} sheetName - Name of the target sheet
 */
function exportFilteredData(filterName, sheetName) {
  try {
    console.log(`Exporting filtered data: ${filterName} to ${sheetName}`);
    
    const allData = BigQueryFetcher.fetchAllData();
    const filter = FilterConfigs.getFilter(filterName);
    const filteredData = DataDistributor.applyFilter(allData, filter);
    
    SheetFormatter.writeToSheet(
      SpreadsheetApp.getActiveSpreadsheet(),
      sheetName,
      filteredData.headers,
      filteredData.rows
    );
    
    console.log(`Export completed: ${filteredData.rows.length} rows`);
    
  } catch (error) {
    console.error(`Error exporting ${filterName}:`, error);
    throw error;
  }
}

/**
 * Utility function to refresh all data and clear cache if needed
 */
function refreshAllData() {
  try {
    console.log('Refreshing all data...');
    
    // Clear any cached data if cache is implemented
    BigQueryFetcher.clearCache();
    
    // Re-fetch and distribute
    fetchAndDistributeData();
    
    console.log('Data refresh completed');
    
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
}

/**
 * Get optimization statistics and cost savings information
 * @returns {Object} Statistics about queries and potential savings
 */
function getOptimizationStats() {
  try {
    const stats = {
      lastFetchTime: BigQueryFetcher.getLastFetchTime(),
      totalRowsFetched: BigQueryFetcher.getLastRowCount(),
      sheetsGenerated: DataDistributor.getLastSheetCount(),
      estimatedCostSavings: calculateCostSavings()
    };
    
    console.log('Optimization Stats:', stats);
    return stats;
    
  } catch (error) {
    console.error('Error getting optimization stats:', error);
    return null;
  }
}

/**
 * Calculate estimated cost savings compared to multiple query approach
 * @returns {Object} Cost savings information
 */
function calculateCostSavings() {
  const sheetsCount = DataDistributor.getLastSheetCount() || 5; // Default estimate
  const bytesProcessed = BigQueryFetcher.getLastBytesProcessed() || 0;
  
  // BigQuery pricing: ~$5 per TB processed
  const costPerTB = 5.0;
  const bytesPerTB = 1024 * 1024 * 1024 * 1024; // 1 TB in bytes
  
  const singleQueryCost = (bytesProcessed / bytesPerTB) * costPerTB;
  const multipleQueryCost = singleQueryCost * sheetsCount;
  const savings = multipleQueryCost - singleQueryCost;
  const savingsPercentage = sheetsCount > 1 ? ((savings / multipleQueryCost) * 100) : 0;
  
  return {
    singleQueryCost: parseFloat(singleQueryCost.toFixed(4)),
    multipleQueryCost: parseFloat(multipleQueryCost.toFixed(4)),
    monthlySavings: parseFloat((savings * 30).toFixed(2)), // Assuming daily runs
    savingsPercentage: parseFloat(savingsPercentage.toFixed(1)),
    sheetsCount: sheetsCount
  };
}