# BigQuery Optimizer for Google Sheets

A simplified Google Apps Script solution that reduces BigQuery costs by 80-90% by fetching data once instead of running multiple expensive queries.

## 🎯 **What This Does**

**Before**: Multiple BigQuery queries = High costs  
**After**: Single BigQuery query + local data = 80-90% cost savings  

**Main Function**: `quickTestYourSheet()` - Gets all your campaign data in one optimized call

## 🚀 **Quick Start**

1. **Open the deployed script**: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit
2. **Select function**: `quickTestYourSheet` from dropdown
3. **Click Run** ▶️
4. **View your data**: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit

## 💰 **Cost Savings**

**Example Scenario**:
- **Before**: 5 queries/day × 30 days = 150 queries/month → ~$7.50/month
- **After**: 1 query/day × 30 days = 30 queries/month → ~$1.50/month
- **Savings**: $6/month (80% reduction)

## 📁 **Project Structure (Simplified)**

```
bigquery-optimizer/
├── main.gs                    # Main function: quickTestYourSheet()
├── bigquery-fetcher.gs        # Simplified BigQuery data fetching
├── sheet-formatter.gs         # Basic Google Sheets formatting
├── appsscript.json            # Apps Script configuration
└── docs/                      # Documentation
```

## 🔧 **Core Functions**

### **Primary Function**
```javascript
quickTestYourSheet()
// - Connects to your specific Google Sheet
// - Fetches ALL campaign data from BigQuery (single query)
// - Creates 'all_data' sheet with formatted results
// - Saves 80-90% on BigQuery costs
```

### **What You Get**
- **All campaign data** in one sheet: `all_data`
- **Team structure**: SQUAD, content creators, DMs, campaigns
- **Metrics**: Cost, GDV, ROAS for today, yesterday, L3D, L30D, this month, this year
- **Formatting**: Numbers with commas, ROAS with decimals, percentages
- **Status tracking**: ACTIVE/PAUSED campaigns

## 📊 **Your Team Configuration**

### **Squads (6)**:
- AREA 1, AREA 2, AREA 3, PROGRAM, HOSPITAL, INBOUND

### **Content Creators (41)**:
- MONICA, TAZKIYA, SHAFIRA, VORA, BUNGA, NOURMA, PHANIE, AUZIAH
- GITA, YASYI, ABI, ATI, DEWI, RESTY, NABILLA, DZULFIKAR
- DIMAS, NADIAUM, BIMA, LUI, INTA, HANIFA, OKTA, VICKY
- ALYA, LINDY, AHDANIA, HASNA, NOYA, JULI, GINA, RENNI
- UNIKE, RAHMAH, SYAHID, WINNY, EVINTA, NAIMMAH, MELATI, DELA, WITRI

### **Digital Marketers (19)**:
- MIQDAD, NAUFAL, HAMAM, TAUFIK, CITRA, AKBAR, LUTHFI, DANNY
- ARIES, IBECK, ILHAM, DHANI, ALVIN, KEVIN, FAHMI, DINI
- ICA, RIEFAN, NABILAH

## 📋 **Usage Examples**

### **Basic Usage** (What you need now)
```javascript
// Run this to get all your data
quickTestYourSheet();
```

### **Configuration Check**
```javascript
// Test connection to your sheet
testYourSheetConnection();
```

### **Data Verification**
```javascript
// Fetch data without writing to sheet (for testing)
const allData = BigQueryFetcher.fetchAllData();
console.log(`Fetched ${allData.rows.length} campaigns`);
```

## ⚙️ **Configuration**

### **Your Sheet ID** (Already configured)
```javascript
const YOUR_SHEET_ID = '10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ';
```

### **BigQuery Configuration** (Already configured)
```javascript
config: {
  projectId: 'numeric-button-449507-v7',
  datasetId: 'gdv',
  tableId: 'gdv-daily',
  location: 'asia-southeast2'
}
```

## 🔄 **How It Works**

1. **Single BigQuery Call**: Fetches all campaign data with complex aggregations
2. **Local Processing**: No additional BigQuery queries needed
3. **Sheet Writing**: Creates formatted `all_data` sheet in your Google Sheet
4. **Cost Savings**: 80-90% reduction vs multiple queries

## 🕐 **Automation (Optional)**

Set up automated triggers in Apps Script:
1. **Triggers** (clock icon) → **Add Trigger**
2. **Function**: `quickTestYourSheet`
3. **Event**: Time-driven (daily recommended)

## 🔍 **Troubleshooting**

### **Common Issues**
- **"Permission denied"**: Enable BigQuery API in Google Cloud Console
- **"Table not found"**: Verify project/dataset/table names are correct
- **No data**: Check if campaigns exist for recent dates

### **Performance Tips**
- Run once daily to minimize costs
- Check console logs for execution details
- Data includes all time periods (today through this year)

## 📚 **Documentation**

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Cost Analysis](docs/COST-ANALYSIS.md) - ROI and savings breakdown
- [Deployment Summary](DEPLOYMENT.md) - Current deployment details

## 🚀 **Future Expansion**

This simplified version provides the foundation for:
- Individual team member sheets
- Advanced filtering and analytics
- Performance monitoring dashboards
- Automated reporting

## 📞 **Support**

**Deployed Apps Script**: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit  
**Your Google Sheet**: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit  
**GitHub Repository**: https://github.com/harryfair/bigquery-optimizer

## 🎯 **Current Status**

✅ **Deployed and Working**: Apps Script live with your specific sheet  
✅ **Cost Optimized**: Single query replaces multiple expensive calls  
✅ **Production Ready**: Simplified, clean codebase  
✅ **Documented**: Complete setup and usage guides  

**Start with**: `quickTestYourSheet()` - Your data, optimized costs, one function call! 🎉