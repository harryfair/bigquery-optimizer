/**
 * Simplified Sheet Formatter - Just Write Data
 * Removed advanced formatting features
 */

const SheetFormatter = {
  
  /**
   * Write data to a sheet (simplified version)
   */
  writeToSheet(spreadsheet, sheetName, headers, rows) {
    try {
      console.log(`Writing to sheet: ${sheetName}, ${rows.length} rows`);
      
      // Get or create sheet
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        console.log(`Created new sheet: ${sheetName}`);
      }
      
      // Clear existing content
      sheet.clearContents();
      
      // Write headers
      if (headers && headers.length > 0) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Basic header formatting
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight('bold')
          .setBackground('#f0f0f0');
      }
      
      // Write data
      if (rows && rows.length > 0) {
        const dataRows = rows.map(row => {
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
        
        // Write data starting from row 2
        const startRow = headers ? 2 : 1;
        sheet.getRange(startRow, 1, dataRows.length, dataRows[0].length).setValues(dataRows);
        
        // Basic number formatting
        this.applyBasicFormatting(sheet, headers, dataRows.length, startRow);
      }
      
      // Auto-resize columns
      for (let col = 1; col <= headers.length; col++) {
        sheet.autoResizeColumn(col);
      }
      
      console.log(`Sheet write completed: ${sheetName}`);
      
    } catch (error) {
      console.error(`Error writing to sheet ${sheetName}:`, error);
      throw new Error(`Sheet write failed: ${error.message}`);
    }
  },

  /**
   * Apply basic formatting for numbers
   */
  applyBasicFormatting(sheet, headers, rowCount, startRow) {
    try {
      if (!headers || rowCount === 0) return;
      
      headers.forEach((header, colIndex) => {
        const col = colIndex + 1;
        const range = sheet.getRange(startRow, col, rowCount, 1);
        
        const lowerName = header.toLowerCase();
        
        // Format cost and gdv columns with commas
        if (lowerName.includes('cost') || lowerName.includes('gdv')) {
          range.setNumberFormat('#,##0');
        }
        // Format ROAS columns with 2 decimals
        else if (lowerName.includes('roas')) {
          range.setNumberFormat('0.00');
        }
        // Format percentage columns
        else if (lowerName.includes('ads/donasi')) {
          range.setNumberFormat('0.00%');
        }
      });
      
    } catch (error) {
      console.error('Error applying formatting:', error);
    }
  }
};