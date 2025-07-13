/**
 * Sheet Formatter Module
 * 
 * Handles Google Sheets operations including writing data, applying formatting,
 * and managing sheet structure with optimized performance.
 */

const SheetFormatter = {
  
  // Formatting configuration
  formats: {
    // Number formatting for different column types
    currency: '#,##0',
    integer: '#,##0',
    decimal: '0.00',
    percentage: '0.00%',
    date: 'yyyy-mm-dd'
  },
  
  // Column type mappings for automatic formatting
  columnTypes: {
    cost: 'integer',
    gdv: 'integer',
    gdv_ads: 'integer',
    roas_ads: 'decimal',
    ads_donasi: 'percentage'
  },

  /**
   * Main function to write data to a sheet with formatting
   * @param {Spreadsheet} spreadsheet - The target spreadsheet
   * @param {string} sheetName - Name of the target sheet
   * @param {Array} headers - Column headers
   * @param {Array} rows - Data rows
   * @param {Object} options - Optional formatting and behavior settings
   */
  writeToSheet(spreadsheet, sheetName, headers, rows, options = {}) {
    try {
      console.log(`Writing to sheet: ${sheetName}, ${rows.length} rows`);
      const startTime = new Date();
      
      // Get or create sheet
      let sheet = this.getOrCreateSheet(spreadsheet, sheetName, options);
      
      // Clear existing content if specified
      if (options.clearContent !== false) {
        sheet.clearContents();
      }
      
      // Write headers
      if (headers && headers.length > 0) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        this.formatHeaders(sheet, headers.length, options);
      }
      
      // Write data if we have rows
      if (rows && rows.length > 0) {
        const dataRows = this.prepareDataRows(rows);
        
        // Batch write for performance
        const startRow = headers ? 2 : 1;
        const range = sheet.getRange(startRow, 1, dataRows.length, dataRows[0].length);
        range.setValues(dataRows);
        
        // Apply formatting
        this.applyDataFormatting(sheet, headers, dataRows.length, startRow, options);
      }
      
      // Apply final sheet formatting
      this.finalizeSheet(sheet, headers, rows.length, options);
      
      const executionTime = new Date() - startTime;
      console.log(`Sheet write completed in ${executionTime}ms`);
      
    } catch (error) {
      console.error(`Error writing to sheet ${sheetName}:`, error);
      throw new Error(`Sheet write failed: ${error.message}`);
    }
  },

  /**
   * Get existing sheet or create new one
   * @param {Spreadsheet} spreadsheet - Target spreadsheet
   * @param {string} sheetName - Sheet name
   * @param {Object} options - Sheet creation options
   * @returns {Sheet} The sheet object
   */
  getOrCreateSheet(spreadsheet, sheetName, options = {}) {
    try {
      let sheet = spreadsheet.getSheetByName(sheetName);
      
      if (!sheet) {
        console.log(`Creating new sheet: ${sheetName}`);
        sheet = spreadsheet.insertSheet(sheetName);
        
        // Apply sheet-level settings
        if (options.gridlines === false) {
          sheet.setHiddenGridlines(true);
        }
        
        if (options.frozenRows) {
          sheet.setFrozenRows(options.frozenRows);
        }
        
        if (options.frozenColumns) {
          sheet.setFrozenColumns(options.frozenColumns);
        }
      }
      
      return sheet;
      
    } catch (error) {
      console.error(`Error getting/creating sheet ${sheetName}:`, error);
      throw error;
    }
  },

  /**
   * Prepare data rows for writing (handle different input formats)
   * @param {Array} rows - Raw data rows
   * @returns {Array} Prepared 2D array for writing
   */
  prepareDataRows(rows) {
    try {
      return rows.map(row => {
        // Handle BigQuery format (row.f.map(c => c.v))
        if (row.f && Array.isArray(row.f)) {
          return row.f.map(cell => {
            const value = cell.v;
            // Handle null/undefined values
            return value === null || value === undefined ? '' : value;
          });
        }
        
        // Handle plain array format
        if (Array.isArray(row)) {
          return row.map(value => 
            value === null || value === undefined ? '' : value
          );
        }
        
        // Handle object format (convert to array based on headers)
        if (typeof row === 'object') {
          return Object.values(row).map(value => 
            value === null || value === undefined ? '' : value
          );
        }
        
        // Fallback: convert to string
        return [String(row)];
      });
      
    } catch (error) {
      console.error('Error preparing data rows:', error);
      throw new Error(`Data preparation failed: ${error.message}`);
    }
  },

  /**
   * Format header row
   * @param {Sheet} sheet - Target sheet
   * @param {number} headerCount - Number of header columns
   * @param {Object} options - Formatting options
   */
  formatHeaders(sheet, headerCount, options = {}) {
    try {
      if (headerCount === 0) return;
      
      const headerRange = sheet.getRange(1, 1, 1, headerCount);
      
      // Default header formatting
      headerRange
        .setFontWeight('bold')
        .setBackground(options.headerColor || '#f0f0f0')
        .setHorizontalAlignment('center');
      
      // Freeze header row by default
      if (options.freezeHeaders !== false) {
        sheet.setFrozenRows(1);
      }
      
      // Auto-resize columns
      if (options.autoResize !== false) {
        for (let col = 1; col <= headerCount; col++) {
          sheet.autoResizeColumn(col);
        }
      }
      
    } catch (error) {
      console.error('Error formatting headers:', error);
    }
  },

  /**
   * Apply data formatting based on column types
   * @param {Sheet} sheet - Target sheet
   * @param {Array} headers - Column headers
   * @param {number} rowCount - Number of data rows
   * @param {number} startRow - Starting row number for data
   * @param {Object} options - Formatting options
   */
  applyDataFormatting(sheet, headers, rowCount, startRow, options = {}) {
    try {
      if (!headers || rowCount === 0) return;
      
      const customFormats = options.columnFormats || {};
      
      headers.forEach((header, colIndex) => {
        const col = colIndex + 1;
        const range = sheet.getRange(startRow, col, rowCount, 1);
        
        // Apply custom format if specified
        if (customFormats[header]) {
          range.setNumberFormat(customFormats[header]);
          return;
        }
        
        // Auto-detect format based on column name
        const format = this.detectColumnFormat(header);
        if (format) {
          range.setNumberFormat(format);
        }
      });
      
      // Apply special formatting rules
      this.applySpecialFormatting(sheet, headers, rowCount, startRow, options);
      
    } catch (error) {
      console.error('Error applying data formatting:', error);
    }
  },

  /**
   * Detect appropriate format for a column based on its name
   * @param {string} columnName - Name of the column
   * @returns {string|null} Number format string or null
   */
  detectColumnFormat(columnName) {
    const lowerName = columnName.toLowerCase();
    
    // Cost and revenue columns
    if (lowerName.includes('cost') || lowerName.includes('gdv')) {
      return this.formats.integer;
    }
    
    // ROAS columns
    if (lowerName.includes('roas')) {
      return this.formats.decimal;
    }
    
    // Percentage columns
    if (lowerName.includes('ads/donasi') || lowerName.includes('_pct') || lowerName.includes('percent')) {
      return this.formats.percentage;
    }
    
    // Date columns
    if (lowerName.includes('date') || lowerName.includes('_date')) {
      return this.formats.date;
    }
    
    return null;
  },

  /**
   * Apply special formatting rules (matching original script behavior)
   * @param {Sheet} sheet - Target sheet
   * @param {Array} headers - Column headers
   * @param {number} rowCount - Number of data rows
   * @param {number} startRow - Starting row number for data
   * @param {Object} options - Formatting options
   */
  applySpecialFormatting(sheet, headers, rowCount, startRow, options = {}) {
    try {
      // Format integer metrics (cost and gdv columns) with comma separators
      const integerColumns = [];
      const roasColumns = [];
      const percentColumns = [];
      
      headers.forEach((header, index) => {
        const lowerName = header.toLowerCase();
        
        if ((lowerName.includes('cost') || lowerName.includes('gdv')) && !lowerName.includes('roas')) {
          integerColumns.push(index + 1);
        } else if (lowerName.includes('roas')) {
          roasColumns.push(index + 1);
        } else if (lowerName.includes('ads/donasi')) {
          percentColumns.push(index + 1);
        }
      });
      
      // Apply integer formatting
      if (integerColumns.length > 0) {
        integerColumns.forEach(col => {
          sheet.getRange(startRow, col, rowCount, 1).setNumberFormat(this.formats.integer);
        });
      }
      
      // Apply ROAS formatting (2 decimals)
      if (roasColumns.length > 0) {
        roasColumns.forEach(col => {
          sheet.getRange(startRow, col, rowCount, 1).setNumberFormat(this.formats.decimal);
        });
      }
      
      // Apply percentage formatting
      if (percentColumns.length > 0) {
        percentColumns.forEach(col => {
          sheet.getRange(startRow, col, rowCount, 1).setNumberFormat(this.formats.percentage);
        });
      }
      
    } catch (error) {
      console.error('Error applying special formatting:', error);
    }
  },

  /**
   * Finalize sheet formatting and properties
   * @param {Sheet} sheet - Target sheet
   * @param {Array} headers - Column headers
   * @param {number} rowCount - Number of data rows
   * @param {Object} options - Formatting options
   */
  finalizeSheet(sheet, headers, rowCount, options = {}) {
    try {
      // Add filters if requested
      if (options.addFilters && headers && headers.length > 0) {
        const totalRows = rowCount + (headers ? 1 : 0);
        if (totalRows > 1) {
          const filterRange = sheet.getRange(1, 1, totalRows, headers.length);
          filterRange.createFilter();
        }
      }
      
      // Add conditional formatting for status columns
      if (options.conditionalFormatting && headers) {
        this.addConditionalFormatting(sheet, headers, rowCount);
      }
      
      // Protect sheet if requested
      if (options.protect) {
        const protection = sheet.protect().setDescription('Auto-generated data protection');
        protection.removeEditors(protection.getEditors());
        protection.addEditor(Session.getActiveUser());
      }
      
    } catch (error) {
      console.error('Error finalizing sheet:', error);
    }
  },

  /**
   * Add conditional formatting for status and performance indicators
   * @param {Sheet} sheet - Target sheet
   * @param {Array} headers - Column headers
   * @param {number} rowCount - Number of data rows
   */
  addConditionalFormatting(sheet, headers, rowCount) {
    try {
      const statusColIndex = headers.findIndex(h => h.toLowerCase().includes('status'));
      
      if (statusColIndex !== -1 && rowCount > 0) {
        const statusRange = sheet.getRange(2, statusColIndex + 1, rowCount, 1);
        
        // Active status - green background
        const activeRule = SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo('ACTIVE')
          .setBackground('#d4edda')
          .setFontColor('#155724')
          .setRanges([statusRange])
          .build();
        
        // Paused status - yellow background
        const pausedRule = SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo('PAUSED')
          .setBackground('#fff3cd')
          .setFontColor('#856404')
          .setRanges([statusRange])
          .build();
        
        sheet.setConditionalFormatRules([activeRule, pausedRule]);
      }
      
    } catch (error) {
      console.error('Error adding conditional formatting:', error);
    }
  },

  /**
   * Bulk write multiple sheets efficiently
   * @param {Spreadsheet} spreadsheet - Target spreadsheet
   * @param {Object} sheetsData - Object with sheetName as key and {headers, rows, options} as value
   */
  bulkWriteSheets(spreadsheet, sheetsData) {
    try {
      console.log(`Bulk writing ${Object.keys(sheetsData).length} sheets`);
      const startTime = new Date();
      
      Object.keys(sheetsData).forEach(sheetName => {
        const { headers, rows, options = {} } = sheetsData[sheetName];
        this.writeToSheet(spreadsheet, sheetName, headers, rows, options);
      });
      
      const executionTime = new Date() - startTime;
      console.log(`Bulk write completed in ${executionTime}ms`);
      
    } catch (error) {
      console.error('Error in bulk write:', error);
      throw new Error(`Bulk write failed: ${error.message}`);
    }
  },

  /**
   * Get default formatting options for campaign data
   * @returns {Object} Default options object
   */
  getDefaultOptions() {
    return {
      clearContent: true,
      freezeHeaders: true,
      autoResize: true,
      addFilters: true,
      conditionalFormatting: true,
      headerColor: '#4285f4',
      gridlines: true
    };
  },

  /**
   * Create a formatted summary sheet
   * @param {Spreadsheet} spreadsheet - Target spreadsheet
   * @param {Object} summaryData - Summary statistics and information
   */
  createSummarySheet(spreadsheet, summaryData) {
    try {
      const sheetName = 'Summary';
      const sheet = this.getOrCreateSheet(spreadsheet, sheetName);
      sheet.clearContents();
      
      // Title
      sheet.getRange('A1').setValue('BigQuery Optimizer Summary').setFontSize(16).setFontWeight('bold');
      
      // Last update time
      sheet.getRange('A3').setValue('Last Updated:');
      sheet.getRange('B3').setValue(new Date());
      
      // Statistics
      let row = 5;
      Object.keys(summaryData).forEach(key => {
        sheet.getRange(row, 1).setValue(key);
        sheet.getRange(row, 2).setValue(summaryData[key]);
        row++;
      });
      
      // Format summary sheet
      sheet.getRange('A:A').setFontWeight('bold');
      sheet.autoResizeColumns(1, 2);
      
    } catch (error) {
      console.error('Error creating summary sheet:', error);
    }
  }
};