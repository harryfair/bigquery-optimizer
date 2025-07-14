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

## 📁 **Project Structure**

```
bigquery-optimizer/
├── main.gs                    # Core automation function: automatedDailyUpdate()
├── bigquery-fetcher.gs        # Optimized BigQuery data fetching
├── sheet-formatter.gs         # Google Sheets formatting with date support
├── appsscript.json            # Apps Script configuration
├── README.md                  # Project overview and automation guide
├── DEPLOYMENT.md              # Technical deployment and setup details
└── AUTOMATION-GUIDE.md        # Complete automation setup guide
```

## 🔧 **Core Functions**

### **Primary Functions**
```javascript
automatedDailyUpdate()
// - COMPLETE AUTOMATION: Fetch + Distribute in one function
// - Fetches ALL campaign data from BigQuery (single query)
// - Updates main 'all_data' sheet with formatted results
// - Distributes to all 6 squad sheets automatically
// - Distributes to 5 individual content creator and DM sheets
// - Uses in-memory data to avoid timeouts
// - Perfect for daily triggers - saves 85-95% on BigQuery costs

distributeToNewSheets()
// - Distributes data to individual content creator and DM sheets
// - Filters by content/dm columns (not SQUAD)
// - Removes SQUAD and visual columns from output
// - Has retry logic with exponential backoff

runIndividualDistributionOnly()
// - Fallback function if individual distribution fails
// - Runs only the individual distribution part
// - Useful for manual recovery

automatedDailyUpdatePhase1()
// - Alternative: Runs automation in two phases
// - Phase 1: BigQuery fetch + squad distribution
// - Automatically schedules Phase 2 after 2 minutes
// - Use if timeout issues persist

quickTestYourSheet()
// - Manual BigQuery fetch and main sheet update
// - Creates 'all_data' sheet with formatted results
// - Use for testing or one-time data refresh

distributeToAllSquads()
// - Uses existing data (NO new BigQuery call)
// - Distributes filtered data to all squad sheets
// - Removes SQUAD and visual columns from squad sheets
// - Maintains cost efficiency

checkSquadValues()
// - Shows what squad names exist in your data
// - Counts rows per squad for verification
```

### **What You Get**
- **All campaign data** in one sheet: `all_data`
- **Individual squad sheets** with filtered data (no additional BigQuery costs)
- **Team structure**: SQUAD, content creators, DMs, campaigns
- **Metrics**: Cost, GDV, ROAS for today, yesterday, L3D, L30D, this month, this year
- **Formatting**: Numbers with commas, ROAS with decimals, percentages, dates (M/d/yyyy)
- **Status tracking**: ACTIVE/PAUSED campaigns

## 📊 **Your Team Configuration**

### **Squad Distribution (5 sheets)**:
- **AREA 1** → Individual sheet: `1XrTr5XO6EjuU_h-Y7k0AxCJAoNmmyqDmUzsFlRqcCAs`
- **AREA 2** → Individual sheet: `1sU117oq1vwvTQR7WY_qgulAVQkF_2PhC0_wEaD9liNs`
- **AREA 3** → Individual sheet: `1XOlGgtIRVYEg2Z_9V3T_Loq-HoTj42EMVEsfsGXLTAU`
- **PROGRAM** → Individual sheet: `1FZJPHX13UgU58vajXnwHLfh3_SL-Ry7AwGLuNNxfZUU`
- **HOSPITAL & INBOUND** → Combined sheet: `1aSyTNwUqfYk11yhkcVuND4SjkPOcz8zb_pHWun1Revo`

### **Individual Distribution (5 sheets)**:
- **MELATI** → Content sheet: `1bTJfS0fh35NmZ3eRG5OmXDA2kRmdxGeG-6CtB9Y-qn4`
- **GITA** → Content sheet: `1EsHZOAcgMdUWM0RNs2MM1U69aPDW4xqEEJIBoe9PHXA`
- **ABI** → Content sheet: `1I3oJQJ1cxYbblG38CtGAtPxVDVexYlFntP5YKpGB6HE`
- **TAUFIK** → DM sheet: `1AM4Hv1A3KcnrACtDlTTPRVPhnam8ueXbRUKPUqfAMfg`
- **KEVIN** → DM sheet: `1eajXhjCIc0yLROM62SM0G10nDbEMBbyIEissdCNY40I`

### **Squads (6 total)**:
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

### **🤖 Automated Workflow** (Recommended)
```javascript
// SINGLE FUNCTION - Complete automation for daily triggers
automatedDailyUpdate();
// - Fetches BigQuery data
// - Updates main sheet  
// - Distributes to all squad sheets
// - Provides complete execution summary
```

### **Manual Workflow** (For testing)
```javascript
// Step 1: Get all data from BigQuery (manual)
quickTestYourSheet();

// Step 2: Check squad names in your data
checkSquadValues();

// Step 3: Distribute to all squad sheets (uses existing data)
distributeToAllSquads();
```

### **Individual Testing**
```javascript
// Test connection to your main sheet
testYourSheetConnection();

// Test AREA 1 distribution only
testArea1DistributionFromSheet();
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

### **Cost-Efficient Data Flow**
```
BigQuery (ONE call) → All Data → Local Filtering → Multiple Squad Sheets
       ↓                ↓              ↓                    ↓
   ~$0.05/day      17k+ rows      FREE process         5 sheets
```

1. **Single BigQuery Call**: Fetches all campaign data with complex aggregations
2. **Local Processing**: Filter and distribute data in Apps Script (FREE)
3. **Multi-Sheet Writing**: Main sheet + 5 squad sheets with proper formatting
4. **Cost Savings**: 80-90% reduction vs multiple queries

### **Distribution Logic**
- **Individual Squads**: AREA 1, AREA 2, AREA 3, PROGRAM get separate sheets
- **Combined Squad**: HOSPITAL + INBOUND share one sheet
- **Column Removal**: SQUAD and visual columns removed from squad sheets
- **Date Formatting**: start_cost_date and last_cost_date formatted as M/d/yyyy

## 🤖 **Complete Automation Setup**

### **🕐 Set Up Daily Automation**
1. **Open Apps Script**: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit
2. **Triggers** (clock icon) → **+ Add Trigger**
3. **Configure**:
   ```
   Function to run: automatedDailyUpdate
   Deployment: Head
   Event source: Time-driven
   Type: Day timer
   Time of day: 8am to 9am (Jakarta time)
   ```
4. **Save** and authorize permissions

### **🎯 What Happens Daily**
```
8:00 AM (Jakarta) → automatedDailyUpdate() runs →
├─ 📊 Fetch BigQuery data (1 optimized query)
├─ 📝 Update main sheet (all_data)
├─ 🚀 Distribute to 6 squads (5 sheets)
├─ 👤 Distribute to 5 individuals
└─ ✅ Complete execution summary
```

**Total time**: ~3.5 minutes  
**Manual work**: 0 minutes  
**Cost**: Single BigQuery call + 10 free distributions

## 🔍 **Troubleshooting**

### **Common Issues**
- **"Permission denied"**: Enable BigQuery API in Google Cloud Console
- **"Table not found"**: Verify project/dataset/table names are correct
- **No data**: Check if campaigns exist for recent dates
- **"Service Spreadsheets timed out"**: Use `runIndividualDistributionOnly()` or `automatedDailyUpdatePhase1()`

### **Timeout Solutions**
1. **Primary**: `automatedDailyUpdate()` now uses in-memory data (should work)
2. **Fallback**: Run `runIndividualDistributionOnly()` separately after main automation
3. **Alternative**: Use `automatedDailyUpdatePhase1()` for two-phase execution

### **Performance Tips**
- Run once daily to minimize costs
- Check console logs for execution details
- Data includes all time periods (today through this year)
- All sheets have retry logic with exponential backoff

## 📚 **Documentation**

- [AUTOMATION-GUIDE.md](AUTOMATION-GUIDE.md) - Complete automation setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Technical deployment and configuration details

## 🚀 **Current Features & Future Expansion**

### **✅ Currently Implemented**
- **Complete automation system** with daily triggers
- **Single BigQuery call optimization** (85-95% cost savings)
- **Multi-squad data distribution** (6 squads to 5 sheets)
- **Individual distribution** (5 content creators and DMs)
- **Smart squad detection** with flexible name matching
- **Combined HOSPITAL & INBOUND processing**
- **Automatic date formatting** (M/d/yyyy)
- **Column filtering** (removes SQUAD and visual columns)
- **In-memory data processing** to avoid timeouts
- **Retry logic** with exponential backoff for reliability
- **Two-phase automation** option for timeout handling

### **🔮 Future Expansion Possibilities**
- More individual content creator and DM sheets
- Advanced filtering and analytics
- Performance monitoring dashboards
- Email reporting summaries
- Custom alert notifications

## 📞 **Support**

**Deployed Apps Script**: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit  
**Your Google Sheet**: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit  
**GitHub Repository**: https://github.com/harryfair/bigquery-optimizer

## 🎯 **Current Status**

✅ **Fully Automated**: Complete daily automation system deployed  
✅ **Cost Optimized**: Single query + 10 free distributions (85-95% savings)  
✅ **Production Ready**: Automated squad and individual distribution  
✅ **Timeout Resistant**: In-memory processing with retry logic  
✅ **Multi-Distribution**: 6 squads + 5 individuals = 11 total distributions  
✅ **Zero Manual Work**: Set trigger once, runs forever  

**Latest Update**: Fixed timeout issues with in-memory data processing and retry logic! 🚀

**Automation**: `automatedDailyUpdate()` - Complete hands-free daily updates! 🤖