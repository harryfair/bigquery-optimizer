/**
 * Data Distributor Module
 * 
 * Handles local filtering and distribution of BigQuery data to different sheets
 * based on configurable filter criteria.
 */

const DataDistributor = {
  
  // Distribution statistics
  stats: {
    lastDistribution: null,
    lastSheetCount: 0,
    distributionSummary: {}
  },

  /**
   * Main function to distribute data by configured levels
   * @param {Object} allData - Complete dataset from BigQuery with headers and rows
   */
  distributeByLevels(allData) {
    try {
      console.log('Starting data distribution by levels...');
      const startTime = new Date();
      
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const levelConfigs = FilterConfigs.getAllFilters();
      const summary = {};
      
      // Process each configured level
      Object.keys(levelConfigs).forEach(levelName => {
        const config = levelConfigs[levelName];
        console.log(`Processing level: ${levelName}`);
        
        try {
          const filteredData = this.applyFilter(allData, config);
          SheetFormatter.writeToSheet(ss, config.sheetName, filteredData.headers, filteredData.rows);
          
          summary[levelName] = {
            sheetName: config.sheetName,
            rowCount: filteredData.rows.length,
            status: 'success'
          };
          
        } catch (error) {
          console.error(`Error processing level ${levelName}:`, error);
          summary[levelName] = {
            sheetName: config.sheetName,
            rowCount: 0,
            status: 'error',
            error: error.message
          };
        }
      });
      
      // Create master sheet with all data
      try {
        SheetFormatter.writeToSheet(ss, 'master_data', allData.headers, allData.rows);
        summary['master'] = {
          sheetName: 'master_data',
          rowCount: allData.rows.length,
          status: 'success'
        };
      } catch (error) {
        console.error('Error creating master sheet:', error);
        summary['master'] = {
          sheetName: 'master_data',
          rowCount: 0,
          status: 'error',
          error: error.message
        };
      }
      
      // Update statistics
      this.stats.lastDistribution = new Date();
      this.stats.lastSheetCount = Object.keys(summary).length;
      this.stats.distributionSummary = summary;
      
      const executionTime = new Date() - startTime;
      console.log(`Data distribution completed in ${executionTime}ms`);
      console.log('Distribution summary:', summary);
      
    } catch (error) {
      console.error('Error in distributeByLevels:', error);
      throw new Error(`Data distribution failed: ${error.message}`);
    }
  },

  /**
   * Apply a filter to the dataset
   * @param {Object} data - Dataset with headers and rows
   * @param {Object} filterConfig - Filter configuration object
   * @returns {Object} Filtered dataset
   */
  applyFilter(data, filterConfig) {
    try {
      if (!filterConfig || !filterConfig.filter) {
        throw new Error('Invalid filter configuration');
      }
      
      const filteredRows = data.rows.filter(row => {
        try {
          const rowData = row.f ? row.f.map(c => c.v) : row;
          return filterConfig.filter(rowData, data.headers);
        } catch (error) {
          console.warn('Error applying filter to row:', error);
          return false;
        }
      });
      
      return {
        headers: data.headers,
        rows: filteredRows
      };
      
    } catch (error) {
      console.error('Error in applyFilter:', error);
      throw new Error(`Filter application failed: ${error.message}`);
    }
  },

  /**
   * Remove specified columns from the dataset
   * @param {Object} data - Dataset with headers and rows
   * @param {Array} columnsToRemove - Array of column names to remove
   * @returns {Object} Dataset with specified columns removed
   */
  removeColumns(data, columnsToRemove) {
    try {
      const columnIndices = columnsToRemove.map(colName => 
        data.headers.indexOf(colName)
      ).filter(index => index !== -1);
      
      if (columnIndices.length === 0) {
        return data; // No columns to remove
      }
      
      // Create new headers array without removed columns
      const newHeaders = data.headers.filter((_, index) => 
        !columnIndices.includes(index)
      );
      
      // Create new rows without removed columns
      const newRows = data.rows.map(row => {
        const rowData = row.f ? row.f.map(c => c.v) : row;
        const filteredRowData = rowData.filter((_, index) => 
          !columnIndices.includes(index)
        );
        
        // Maintain original structure if it was BigQuery format
        if (row.f) {
          return {
            f: filteredRowData.map(v => ({ v: v }))
          };
        } else {
          return filteredRowData;
        }
      });
      
      return {
        headers: newHeaders,
        rows: newRows
      };
      
    } catch (error) {
      console.error('Error in removeColumns:', error);
      throw new Error(`Column removal failed: ${error.message}`);
    }
  },

  /**
   * Filter data for a specific column value
   * @param {Object} data - Dataset with headers and rows
   * @param {string} columnName - Name of the column to filter on
   * @param {*} value - Value to filter for (supports operators)
   * @param {string} operator - Comparison operator ('=', '!=', 'contains', 'not_empty', etc.)
   * @returns {Object} Filtered dataset
   */
  filterByColumn(data, columnName, value, operator = '=') {
    try {
      const columnIndex = data.headers.indexOf(columnName);
      if (columnIndex === -1) {
        throw new Error(`Column '${columnName}' not found in headers`);
      }
      
      const filteredRows = data.rows.filter(row => {
        const rowData = row.f ? row.f.map(c => c.v) : row;
        const cellValue = rowData[columnIndex];
        
        switch (operator) {
          case '=':
            return cellValue === value;
          case '!=':
            return cellValue !== value;
          case 'contains':
            return cellValue && cellValue.toString().includes(value);
          case 'not_contains':
            return !cellValue || !cellValue.toString().includes(value);
          case 'not_empty':
            return cellValue !== null && cellValue !== undefined && cellValue !== '';
          case 'empty':
            return cellValue === null || cellValue === undefined || cellValue === '';
          case '>':
            return parseFloat(cellValue) > parseFloat(value);
          case '<':
            return parseFloat(cellValue) < parseFloat(value);
          case '>=':
            return parseFloat(cellValue) >= parseFloat(value);
          case '<=':
            return parseFloat(cellValue) <= parseFloat(value);
          default:
            return cellValue === value;
        }
      });
      
      return {
        headers: data.headers,
        rows: filteredRows
      };
      
    } catch (error) {
      console.error('Error in filterByColumn:', error);
      throw new Error(`Column filtering failed: ${error.message}`);
    }
  },

  /**
   * Apply multiple filters to the dataset
   * @param {Object} data - Dataset with headers and rows
   * @param {Array} filters - Array of filter objects
   * @returns {Object} Filtered dataset
   */
  applyMultipleFilters(data, filters) {
    try {
      let result = data;
      
      filters.forEach((filter, index) => {
        console.log(`Applying filter ${index + 1}/${filters.length}`);
        
        if (filter.type === 'column') {
          result = this.filterByColumn(
            result, 
            filter.columnName, 
            filter.value, 
            filter.operator
          );
        } else if (filter.type === 'custom' && filter.filter) {
          result = this.applyFilter(result, filter);
        }
      });
      
      return result;
      
    } catch (error) {
      console.error('Error in applyMultipleFilters:', error);
      throw new Error(`Multiple filters application failed: ${error.message}`);
    }
  },

  /**
   * Get summary statistics for a dataset
   * @param {Object} data - Dataset with headers and rows
   * @returns {Object} Summary statistics
   */
  getDataSummary(data) {
    try {
      const rowCount = data.rows.length;
      const columnCount = data.headers.length;
      
      // Find numeric columns and calculate basic stats
      const numericStats = {};
      data.headers.forEach((header, index) => {
        const values = data.rows.map(row => {
          const rowData = row.f ? row.f.map(c => c.v) : row;
          return parseFloat(rowData[index]);
        }).filter(v => !isNaN(v));
        
        if (values.length > 0) {
          numericStats[header] = {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values)
          };
        }
      });
      
      return {
        rowCount,
        columnCount,
        headers: data.headers,
        numericStats
      };
      
    } catch (error) {
      console.error('Error in getDataSummary:', error);
      return {
        rowCount: 0,
        columnCount: 0,
        headers: [],
        numericStats: {}
      };
    }
  },

  /**
   * Get the last distribution summary
   * @returns {Object} Summary of the last distribution operation
   */
  getLastDistributionSummary() {
    return this.stats.distributionSummary;
  },

  /**
   * Get the number of sheets created in the last distribution
   * @returns {number} Number of sheets created
   */
  getLastSheetCount() {
    return this.stats.lastSheetCount;
  },

  /**
   * Get comprehensive statistics about distribution operations
   * @returns {Object} Distribution statistics
   */
  getStats() {
    return {
      ...this.stats,
      totalSheetsProcessed: Object.keys(this.stats.distributionSummary).length,
      successfulSheets: Object.values(this.stats.distributionSummary)
        .filter(s => s.status === 'success').length,
      failedSheets: Object.values(this.stats.distributionSummary)
        .filter(s => s.status === 'error').length
    };
  },

  /**
   * Validate dataset structure
   * @param {Object} data - Dataset to validate
   * @returns {boolean} True if valid
   */
  validateDataset(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Data must be an object');
      }
      
      if (!Array.isArray(data.headers)) {
        throw new Error('Headers must be an array');
      }
      
      if (!Array.isArray(data.rows)) {
        throw new Error('Rows must be an array');
      }
      
      if (data.headers.length === 0) {
        throw new Error('Headers array cannot be empty');
      }
      
      // Validate row structure
      if (data.rows.length > 0) {
        const firstRow = data.rows[0];
        const expectedColumns = data.headers.length;
        const actualColumns = firstRow.f ? firstRow.f.length : firstRow.length;
        
        if (actualColumns !== expectedColumns) {
          console.warn(`Row column count (${actualColumns}) doesn't match headers (${expectedColumns})`);
        }
      }
      
      return true;
      
    } catch (error) {
      console.error('Dataset validation failed:', error);
      return false;
    }
  }
};