# Setup Guide - BigQuery Optimizer (Simplified Version)

## 🎯 **Quick Setup - It's Already Done!**

**Good News**: Your BigQuery Optimizer is already deployed and configured! This guide explains what was set up and how to use it.

## ✅ **Pre-Configured Setup**

### **Apps Script Project** (Ready to Use)
- **Project URL**: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit
- **BigQuery API**: Already enabled
- **Configuration**: Pre-configured for your project/dataset
- **Main Function**: `quickTestYourSheet()` - Ready to run

### **Google Sheet Connection** (Already Connected)
- **Your Sheet**: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit
- **Target Sheet**: Will create 'all_data' tab automatically
- **Permissions**: Already configured

### **BigQuery Configuration** (Already Set)
```javascript
// These settings are already applied in your deployed script
config: {
  projectId: 'numeric-button-449507-v7',
  datasetId: 'gdv',
  tableId: 'gdv-daily',
  location: 'asia-southeast2'
}
```

## 🚀 **How to Use (3 Simple Steps)**

### **Step 1: Open Apps Script**
Click here: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit

### **Step 2: Select Function**
- In the function dropdown, select: `quickTestYourSheet`

### **Step 3: Run**
- Click the **Run** button ▶️
- Wait for completion (usually 30-60 seconds)
- Check console for "✅ Success!" message

### **Step 4: View Results**
Open your sheet: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit
- Look for new 'all_data' tab
- All your campaign data will be there with proper formatting

## 📊 **What You'll Get**

### **'all_data' Sheet Contains**:
- **Team Structure**: SQUAD, short_url, content, dm, isu, visual
- **Today's Data**: cost_today, gdv_today, gdv_ads_today
- **Yesterday's Data**: cost_yesterday, gdv_yesterday, gdv_ads_yesterday
- **Period Data**: L3D, this month, L30D, this year metrics
- **ROAS Analysis**: Calculated for all time periods
- **Campaign Status**: ACTIVE/PAUSED status

### **Automatic Formatting**:
- ✅ Numbers with commas (e.g., 1,234,567)
- ✅ ROAS with 2 decimals (e.g., 1.25)
- ✅ Percentages properly formatted (e.g., 12.34%)
- ✅ Headers in bold with background color

## 🔧 **Advanced Setup (Optional)**

### **Set Up Automation** (Recommended)
1. In Apps Script, click **Triggers** (clock icon)
2. Click **+ Add Trigger**
3. Configure:
   - **Function**: `quickTestYourSheet`
   - **Event source**: Time-driven
   - **Type**: Day timer
   - **Time**: Choose your preferred time (e.g., 8:00 AM)
4. **Save**

**Result**: Your data will automatically update daily!

### **Customize Sheet Name** (If Needed)
If you want to change the output sheet name from 'all_data':

1. In Apps Script, open `main.gs`
2. Find line: `SheetFormatter.writeToSheet(ss, 'all_data', ...)`
3. Change `'all_data'` to your preferred name
4. Click **Save** then **Run**

### **Monitor Performance**
Check the Apps Script console for:
- Execution time (typically 30-60 seconds)
- Number of rows fetched
- Success/error messages

## 🔍 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. "Permission denied" Error**
**Cause**: BigQuery permissions issue  
**Solution**: 
- Ensure you have BigQuery Data Viewer role in Google Cloud Console
- Verify the project/dataset/table names are correct

#### **2. "Script timeout" Error**
**Cause**: Large dataset or slow query  
**Solution**:
- This is rare with the optimized query
- Try running during off-peak hours
- Check BigQuery console for query performance

#### **3. "Sheet not found" Error**
**Cause**: Google Sheet access issue  
**Solution**:
- Verify the sheet URL is accessible
- Check if you have edit permissions on the sheet

#### **4. No Data Appears**
**Cause**: Query returned no results  
**Solution**:
- Check if campaigns exist for recent dates
- Verify the HAVING clause filters in the query
- Review BigQuery table for data availability

### **Verification Steps**

#### **Test Connection**:
```javascript
// Run this function to test basic connectivity
testYourSheetConnection();
```

#### **Check Data Fetch**:
```javascript
// Run this to test BigQuery without writing to sheet
const allData = BigQueryFetcher.fetchAllData();
console.log(`Fetched ${allData.rows.length} campaigns`);
```

## 📈 **Performance Optimization**

### **Query Efficiency**
Your deployed script uses a single optimized query that:
- ✅ Groups data by team structure (SQUAD, content, dm, etc.)
- ✅ Calculates all time periods in one query
- ✅ Uses efficient CASE statements for date filtering
- ✅ Applies proper HAVING filters to reduce data size

### **Cost Monitoring**
- **Before**: Multiple queries = Higher costs
- **After**: Single query = 80-90% cost reduction
- **Monitor**: Check BigQuery billing for cost trends

### **Data Freshness**
- Query uses `CURRENT_DATE('Asia/Jakarta')` for timezone-aware dates
- Includes data through "today" in Jakarta time
- Historical data covers: today, yesterday, L3D, this month, L30D, this year

## 🔄 **Making Changes**

### **Code Updates**:
```bash
# If you need to modify the code
cd /home/harryfair/bigquery-optimizer
# Edit .gs files as needed
clasp push  # Deploy changes to Apps Script
```

### **Configuration Changes**:
Most configuration is already optimal, but you can modify:
- **Time periods**: Adjust date ranges in the SQL query
- **Filters**: Modify HAVING clause conditions
- **Output format**: Change formatting in sheet-formatter.gs

## 📚 **Additional Resources**

- **Cost Analysis**: [COST-ANALYSIS.md](COST-ANALYSIS.md) - Detailed cost breakdown
- **Deployment Details**: [../DEPLOYMENT.md](../DEPLOYMENT.md) - Technical deployment info
- **GitHub Repository**: https://github.com/harryfair/bigquery-optimizer

## 🎯 **Success Checklist**

Before contacting support, verify:
- [ ] Apps Script project opens without errors
- [ ] BigQuery API is enabled in Google Cloud Console
- [ ] Google Sheet is accessible and editable
- [ ] `quickTestYourSheet` function appears in dropdown
- [ ] Console shows execution logs when run
- [ ] 'all_data' sheet appears with formatted data

## 📞 **Quick Links**

**🔗 Essential Links**:
- **Apps Script**: https://script.google.com/d/1pJzhrhoDh5YHViWD3mrz0XFSRzH0MdN9bQG4NbDmigr1bp2gTmXjN1mP/edit
- **Your Sheet**: https://docs.google.com/spreadsheets/d/10HpNIKXR3OPX-WErO_max3YqKnNPnZmehahTZXPlIpQ/edit
- **GitHub**: https://github.com/harryfair/bigquery-optimizer

**🎉 You're all set! Your BigQuery Optimizer is ready to save costs and streamline your workflow.**