# Setup Guide - BigQuery Optimizer

This guide walks you through setting up the BigQuery Optimizer to reduce your Google Sheets + BigQuery costs.

## 📋 Prerequisites

- Google Cloud Project with BigQuery enabled
- Google Apps Script access
- BigQuery dataset with campaign data
- Basic familiarity with Google Apps Script

## 🚀 Step-by-Step Setup

### 1. Prepare Your Google Cloud Project

1. **Enable BigQuery API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to APIs & Services > Library
   - Search for "BigQuery API" and enable it

2. **Verify Permissions**:
   - Ensure your account has `BigQuery Data Viewer` role
   - For the dataset you're querying, you need `BigQuery User` role

### 2. Create New Apps Script Project

1. **Create Project**:
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Rename to "BigQuery Optimizer"

2. **Enable BigQuery Service**:
   - In Apps Script, go to Services (+ icon)
   - Add "BigQuery API" (select v2)
   - Set identifier as "BigQuery"

### 3. Copy Project Files

Copy all files from the optimizer to your Apps Script project:

#### Main Script Files
1. Create `main.gs` - Copy content from `src/main.gs`
2. Create `bigquery-fetcher.gs` - Copy from `src/bigquery-fetcher.gs`
3. Create `data-distributor.gs` - Copy from `src/data-distributor.gs`
4. Create `sheet-formatter.gs` - Copy from `src/sheet-formatter.gs`

#### Configuration Files
1. Create `filter-configs.gs` - Copy from `config/filter-configs.js` (rename .js to .gs)
2. Replace `appsscript.json` - Copy from `config/appsscript.json`

#### Examples (Optional)
1. Create `usage-examples.gs` - Copy from `examples/usage-examples.gs`

### 4. Configure Your Project Settings

1. **Update BigQuery Configuration**:
   Open `bigquery-fetcher.gs` and update:
   ```javascript
   config: {
     projectId: 'your-project-id',      // Your Google Cloud Project ID
     datasetId: 'your-dataset',         // Your BigQuery dataset ID
     tableId: 'your-table',             // Your BigQuery table ID
     location: 'your-location'          // e.g., 'asia-southeast2'
   }
   ```

2. **Set Time Zone**:
   In `appsscript.json`, verify:
   ```json
   {
     "timeZone": "Asia/Jakarta"  // Update to your timezone
   }
   ```

### 5. Test Basic Functionality

1. **Test BigQuery Connection**:
   ```javascript
   function testConnection() {
     try {
       const data = BigQueryFetcher.fetchAllData();
       console.log('Success! Fetched', data.rows.length, 'rows');
     } catch (error) {
       console.error('Connection failed:', error);
     }
   }
   ```

2. **Run the test** from Apps Script editor

### 6. Configure Filters for Your Data

1. **Review Available Filters**:
   In `filter-configs.gs`, check the predefined filters:
   ```javascript
   // List all available filters
   console.log(FilterConfigs.listFilters());
   ```

2. **Customize for Your Squads**:
   Update the squad filters to match your data:
   ```javascript
   squad_area1: {
     name: 'Squad AREA 1',
     sheetName: 'squad_area1',
     filter: (row, headers) => {
       const squadIndex = headers.indexOf('SQUAD');
       return squadIndex !== -1 && row[squadIndex] === 'YOUR_SQUAD_NAME';
     }
   }
   ```

### 7. Create Your Google Sheet

1. **Create New Spreadsheet**:
   - Name it appropriately (e.g., "Campaign Performance Dashboard")
   - Note the Spreadsheet ID from the URL

2. **Update Script to Use Your Sheet**:
   If not using the active spreadsheet, update the code to reference your specific sheet.

### 8. Run Initial Data Fetch

1. **First Run**:
   ```javascript
   // Test with your existing function first
   exportKevinAggregates();
   ```

2. **Full Optimization**:
   ```javascript
   // Run the optimized version
   fetchAndDistributeData();
   ```

### 9. Set Up Automation (Optional)

1. **Create Trigger**:
   - In Apps Script, click Triggers (clock icon)
   - Add new trigger
   - Function: `fetchAndDistributeData`
   - Event: Time-driven
   - Select frequency (daily recommended)

2. **Monitor Performance**:
   ```javascript
   function checkStats() {
     const stats = getOptimizationStats();
     console.log(stats);
   }
   ```

## 🔧 Advanced Configuration

### Custom Filter Examples

```javascript
// Add a filter for campaigns above budget
FilterConfigs.addCustomFilter('over_budget', {
  sheetName: 'over_budget_campaigns',
  description: 'Campaigns exceeding 100k spend',
  filter: (row, headers) => {
    const costIndex = headers.indexOf('cost_l30d');
    const cost = parseFloat(row[costIndex]);
    return !isNaN(cost) && cost > 100000;
  }
});
```

### Performance Tuning

1. **Cache Duration**:
   Adjust cache TTL in `bigquery-fetcher.gs`:
   ```javascript
   cache: {
     ttl: 10 * 60 * 1000  // 10 minutes instead of 5
   }
   ```

2. **Query Optimization**:
   Modify the SQL query to include only needed date ranges or add additional filters.

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Permission denied" Error
**Solution**: 
- Check BigQuery API is enabled
- Verify account has proper IAM roles
- Ensure project ID is correct

#### 2. "Table not found" Error
**Solution**:
- Verify `projectId`, `datasetId`, and `tableId` in configuration
- Check table exists in BigQuery console
- Ensure proper dataset location

#### 3. "Script timeout" Error
**Solution**:
- Reduce date range in query
- Implement pagination for large datasets
- Use triggers for long-running operations

#### 4. Sheet Creation Issues
**Solution**:
- Verify spreadsheet permissions
- Check sheet name conflicts
- Ensure proper sheet access

### Performance Issues

#### 1. Slow Query Execution
- Review query complexity
- Add appropriate BigQuery filters
- Consider query optimization

#### 2. Memory Limits
- Process data in smaller batches
- Use streaming for large datasets
- Implement incremental updates

## 📊 Validation Checklist

- [ ] BigQuery API enabled
- [ ] Correct project configuration
- [ ] Test query runs successfully
- [ ] Filters work as expected
- [ ] Sheets are created with correct data
- [ ] Formatting is applied properly
- [ ] Backward compatibility maintained
- [ ] Performance monitoring works
- [ ] Triggers set up (if needed)

## 🎯 Next Steps

1. **Monitor Cost Savings**: Check BigQuery usage in Google Cloud Console
2. **Customize Filters**: Add filters specific to your business needs
3. **Set Up Alerts**: Implement performance monitoring and alerts
4. **Train Team**: Share the new optimization with your team
5. **Expand Use Cases**: Apply to other BigQuery datasets

## 💡 Tips for Success

- Start with the existing `exportKevinAggregates()` to ensure compatibility
- Test filters with small datasets first
- Monitor BigQuery usage and costs regularly
- Use version control for your Apps Script project
- Document custom filters for team members

## 📞 Getting Help

If you encounter issues:

1. Check the console logs in Apps Script
2. Review the [examples](../examples/usage-examples.gs)
3. Validate your configuration step by step
4. Test with simplified queries first
5. Check BigQuery quotas and limits

Remember: The goal is to reduce costs while maintaining the same functionality. Take it step by step!