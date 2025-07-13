# BigQuery Optimizer for Google Sheets

An optimized Google Apps Script solution that reduces BigQuery costs by fetching data once and distributing it locally to multiple sheets based on configurable filters.

## 🚀 Quick Start

1. **Copy the script files** to your Google Apps Script project
2. **Enable BigQuery API** in your Google Cloud Console
3. **Run the main function**:
   ```javascript
   fetchAndDistributeData();
   ```

## 💰 Cost Savings

- **Before**: Multiple BigQuery calls for each sheet = 5x costs
- **After**: Single BigQuery call + local filtering = 80% cost reduction
- **Estimated Monthly Savings**: $50-200+ depending on data volume

## 📁 Project Structure

```
bigquery-optimizer/
├── src/
│   ├── main.gs                 # Main orchestration functions
│   ├── bigquery-fetcher.gs     # BigQuery data fetching with caching
│   ├── data-distributor.gs     # Local filtering and distribution
│   └── sheet-formatter.gs      # Sheet formatting utilities
├── config/
│   ├── appsscript.json         # Apps Script configuration
│   └── filter-configs.js       # Centralized filter configurations
├── examples/
│   └── usage-examples.gs       # 10+ practical examples
└── docs/
    ├── SETUP.md               # Detailed setup guide
    └── COST-ANALYSIS.md       # Cost comparison analysis
```

## 🔧 Core Functions

### Main Functions
- `fetchAndDistributeData()` - Primary function that replaces multiple BigQuery calls
- `exportKevinAggregates()` - Backward compatible with your existing script
- `exportFilteredData(filterName, sheetName)` - Export specific filtered data

### Key Features
- **Single BigQuery Call**: Fetch all data once, filter locally
- **Configurable Filters**: 20+ predefined filters for different levels
- **Automatic Formatting**: Maintains your existing number/date formatting
- **Performance Monitoring**: Built-in performance and cost tracking
- **Backward Compatibility**: Existing scripts continue to work

## 📊 Available Filters

### Squad Levels
- `kevin_squad` - AREA 2 data (backward compatibility)
- `squad_area1`, `squad_area2`, `squad_area3` - By squad

### Content Types
- `content_active` - Campaigns with content
- `content_video` - Video content campaigns
- `content_image` - Image content campaigns

### Performance
- `high_performers` - ROAS > 2.0
- `low_performers` - ROAS < 1.0
- `active_campaigns` - Currently active
- `paused_campaigns` - Paused campaigns

### Spending
- `high_spend` - >100k last 30 days
- `low_spend` - <10k last 30 days

## 📋 Usage Examples

### Basic Usage
```javascript
// Replace multiple BigQuery calls with single optimized call
fetchAndDistributeData();
```

### Backward Compatibility
```javascript
// Your existing script works unchanged
exportKevinAggregates();
```

### Specific Filters
```javascript
// Export high performers to specific sheet
exportFilteredData('high_performers', 'top_campaigns');

// Export Kevin's campaigns
exportFilteredData('dm_kevin', 'kevin_campaigns');
```

### Custom Filtering
```javascript
// Create custom filter
const allData = BigQueryFetcher.fetchAllData();
const customFilter = {
  filter: (row, headers) => {
    const roas = parseFloat(row[headers.indexOf('roas_ads_l30d')]);
    const cost = parseFloat(row[headers.indexOf('cost_l30d')]);
    return roas > 1.5 && cost > 50000; // High value campaigns
  }
};

const filtered = DataDistributor.applyFilter(allData, customFilter);
SheetFormatter.writeToSheet(spreadsheet, 'high_value', filtered.headers, filtered.rows);
```

## ⚙️ Configuration

### Filter Configuration
Add custom filters in `config/filter-configs.js`:

```javascript
FilterConfigs.addCustomFilter('my_filter', {
  sheetName: 'my_sheet',
  description: 'My custom filter',
  filter: (row, headers) => {
    // Your filtering logic here
    return row[0] === 'some_value';
  }
});
```

### BigQuery Configuration
Update configuration in `src/bigquery-fetcher.gs`:

```javascript
const BigQueryFetcher = {
  config: {
    projectId: 'your-project-id',
    datasetId: 'your-dataset',
    tableId: 'your-table',
    location: 'your-location'
  }
};
```

## 📈 Performance Monitoring

```javascript
// Get optimization statistics
const stats = getOptimizationStats();
console.log('Cost savings:', stats.monthlySavings);
console.log('Queries reduced from', stats.sheetsCount, 'to 1');
```

## 🔄 Migration from Existing Script

1. **Backup** your current Apps Script project
2. **Copy** all files from this optimizer to your project
3. **Update** the BigQuery configuration with your project details
4. **Test** with `exportKevinAggregates()` - should work identically
5. **Replace** multiple function calls with `fetchAndDistributeData()`

## 🕐 Automation

Set up automated triggers:
1. Go to **Extensions > Apps Script**
2. Click **Triggers** (clock icon)
3. Add trigger for `fetchAndDistributeData()`
4. Set schedule (daily, hourly, etc.)

## 🔍 Troubleshooting

### Common Issues
- **BigQuery permissions**: Ensure your account has BigQuery access
- **API not enabled**: Enable BigQuery API in Google Cloud Console
- **Memory limits**: Use caching and batch operations for large datasets

### Performance Tips
- Data is cached for 5 minutes to avoid unnecessary BigQuery calls
- Use `BigQueryFetcher.clearCache()` to force fresh data
- Monitor performance with `getOptimizationStats()`

## 📚 Learn More

- [Setup Guide](docs/SETUP.md) - Detailed installation instructions
- [Cost Analysis](docs/COST-ANALYSIS.md) - ROI calculation details
- [Examples](examples/usage-examples.gs) - 10+ practical examples

## 🆘 Support

- Check [examples/usage-examples.gs](examples/usage-examples.gs) for common use cases
- Review error logs in Apps Script console
- Validate filters with `FilterConfigs.validateFilter()`

## 🔄 Version History

- **v1.0** - Initial release with core optimization features
- Reduced BigQuery costs by 80%
- Maintained 100% backward compatibility
- Added 20+ predefined filters