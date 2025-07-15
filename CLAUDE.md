# Claude Context File - BigQuery Optimizer Project

## Project Overview
This is a Google Apps Script project that automates BigQuery data fetching and distribution to multiple Google Sheets. It reduces costs by 85-95% through optimized single-query architecture.

## Key Components

### 1. Main Automation Function
- **Function**: `safeAutomatedDailyUpdate()` (use this for triggers, not `automatedDailyUpdate`)
- **Schedule**: Daily at 8 AM Jakarta time
- **Duration**: ~8 minutes (472 seconds typical)
- **Process**:
  1. Fetch ~17,000 rows from BigQuery (single optimized query)
  2. Save to main dashboard sheet
  3. Distribute to 6 squad sheets (AREA 1-3, HOSPITAL, INBOUND, PROGRAM)
  4. Distribute to 5 individual sheets (MELATI, GITA, ABI, TAUFIK, KEVIN)

### 2. Important IDs
```javascript
// Main Dashboard
YOUR_SHEET_ID = '10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ'

// Apps Script Project
PROJECT_ID = '1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP'

// BigQuery Config
PROJECT_ID = 'numeric-button-449507-v7'
DATASET = 'gdv'
TABLE = 'gdv-daily'
LOCATION = 'asia-southeast2'
```

### 3. Squad Sheet Mappings
- AREA 1: `1XrTr5XO6EjuU_h-Y7k0AxCJAoNmmyqDmUzsFlRqcCAs`
- AREA 2: `1sU117oq1vwvTQR7WY_qgulAVQkF_2PhC0_wEaD9liNs`
- AREA 3: `1XOlGgtIRVYEg2Z_9V3T_Loq-HoTj42EMVEsfsGXLTAU`
- PROGRAM: `1FZJPHX13UgU58vajXnwHLfh3_SL-Ry7AwGLuNNxfZUU`
- HOSPITAL/INBOUND: `1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo`

### 4. Individual Sheet Mappings
- MELATI (content column): `1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4`
- GITA (content column): `1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA`
- ABI (content column): `1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE`
- TAUFIK (dm column): `1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg`
- KEVIN (dm column): `1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I`

## Recent Issues & Fixes

### Timeout Error (Jul 15, 2025)
- **Issue**: Service timeout accessing main spreadsheet after automation completed
- **Solution**: Implemented `safeAutomatedDailyUpdate()` wrapper with:
  - Retry logic with exponential backoff
  - Clean exit handling
  - SpreadsheetApp.flush() to ensure pending operations complete
  - Updated triggers to use safe wrapper

## Commands to Remember

### Deployment
```bash
# Push changes to Google Apps Script
clasp push

# Pull latest from Google Apps Script
clasp pull

# Open in browser
clasp open
```

### Testing Functions
```javascript
// Test main automation (use this)
safeAutomatedDailyUpdate()

// Test squad distribution only
distributeToAllSquads()

// Test individual distribution only
distributeToNewSheets()

// Check squad values in data
checkSquadValues()
```

### Trigger Management
```javascript
// Set up daily automation trigger
setupAutomationTriggers()

// Remove all triggers
ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t))
```

## Performance Metrics
- BigQuery fetch: ~30-45 seconds
- Main sheet write: ~15-20 seconds
- Squad distribution: ~180-240 seconds (6 sheets)
- Individual distribution: ~120-180 seconds (5 sheets)
- Total execution: ~450-500 seconds

## Cost Optimization
- Single BigQuery query vs 6 separate queries
- Monthly cost: ~$2-5 (vs $15-30 manual)
- Cost reduction: 85-95%
- Time saved: 2.5 hours/month

## Error Handling Features
1. **Retry Logic**: All sheet operations retry 3x with exponential backoff
2. **Timeout Protection**: BigQuery queries timeout after 5 minutes
3. **Clean Exit**: Safe wrapper prevents post-completion errors
4. **Detailed Logging**: Console logs show progress and errors

## Common Issues

### 1. Permission Errors
- Re-authorize Apps Script
- Check BigQuery API access
- Verify sheet sharing permissions

### 2. Timeout Issues
- Use `safeAutomatedDailyUpdate()` not `automatedDailyUpdate()`
- Run during off-peak hours
- Check BigQuery performance

### 3. No Data in Sheets
- Run `checkSquadValues()` to verify squad names
- Check sheet IDs are correct
- Verify data exists for the date range

## Development Notes
- Always use absolute paths for file operations
- Maintain retry logic for Google API calls
- Use batch operations where possible
- Monitor execution time to stay under 6-minute limit
- Test changes with manual runs before updating triggers

## Contact & Resources
- GitHub: https://github.com/harryfair/bigquery-optimizer
- Apps Script: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit
- Main Dashboard: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit