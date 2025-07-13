/**
 * BigQuery Fetcher Module
 * 
 * Handles all BigQuery data fetching operations with optimization features
 * including caching, error handling, and performance monitoring.
 */

const BigQueryFetcher = {
  
  // Configuration
  config: {
    projectId: 'numeric-button-449507-v7',
    datasetId: 'gdv',
    tableId: 'gdv-daily',
    location: 'asia-southeast2',
    maxRetries: 3,
    retryDelay: 1000
  },
  
  // Cache and stats
  cache: {
    data: null,
    timestamp: null,
    ttl: 5 * 60 * 1000 // 5 minutes cache TTL
  },
  
  stats: {
    lastFetchTime: null,
    lastRowCount: 0,
    lastBytesProcessed: 0,
    totalQueries: 0
  },

  /**
   * Main function to fetch all aggregated metrics from BigQuery
   * @returns {Object} Object containing headers and rows
   */
  fetchAllData() {
    try {
      // Check cache first
      if (this.isCacheValid()) {
        console.log('Returning cached BigQuery data');
        return this.cache.data;
      }

      console.log('Fetching fresh data from BigQuery...');
      const startTime = new Date();
      
      const query = this.buildOptimizedQuery();
      const result = this.executeQuery(query);
      
      // Update cache and stats
      this.cache.data = result;
      this.cache.timestamp = new Date();
      this.stats.lastFetchTime = new Date();
      this.stats.lastRowCount = result.rows.length;
      this.stats.totalQueries++;
      
      const executionTime = new Date() - startTime;
      console.log(`BigQuery fetch completed in ${executionTime}ms, ${result.rows.length} rows`);
      
      return result;
      
    } catch (error) {
      console.error('Error in BigQueryFetcher.fetchAllData:', error);
      throw new Error(`BigQuery fetch failed: ${error.message}`);
    }
  },

  /**
   * Builds the optimized SQL query for fetching all data
   * @returns {string} The SQL query string
   */
  buildOptimizedQuery() {
    const yesterday = `DATE_SUB(CURRENT_DATE('Asia/Jakarta'), INTERVAL 1 DAY)`;
    const today = `CURRENT_DATE('Asia/Jakarta')`;

    return `
      SELECT
        SQUAD,short_url,content,dm,isu,visual,

        -- today metrics
        SUM(CASE WHEN date = ${today} THEN cost ELSE 0 END)      AS cost_today,
        SUM(CASE WHEN date = ${today} THEN gdv  ELSE 0 END)      AS gdv_today,
        SUM(CASE WHEN date = ${today} THEN gdv_ads ELSE 0 END)   AS gdv_ads_today,

        -- yesterday metrics
        SUM(CASE WHEN date = ${yesterday} THEN cost ELSE 0 END)   AS cost_yesterday,
        SUM(CASE WHEN date = ${yesterday} THEN gdv  ELSE 0 END)   AS gdv_yesterday,
        SUM(CASE WHEN date = ${yesterday} THEN gdv_ads ELSE 0 END) AS gdv_ads_yesterday,

        -- last 3 days metrics
        SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 3 DAY) AND ${today}
                 THEN cost ELSE 0 END)                           AS cost_l3d,
        SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 3 DAY) AND ${today}
                 THEN gdv ELSE 0 END)                            AS gdv_l3d,
        SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 3 DAY) AND ${today}
                 THEN gdv_ads ELSE 0 END)                       AS gdv_ads_l3d,

        -- this month metrics
        SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, MONTH) AND ${today}
                 THEN cost ELSE 0 END)                           AS cost_this_month,
        SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, MONTH) AND ${today}
                 THEN gdv ELSE 0 END)                            AS gdv_this_month,
        SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, MONTH) AND ${today}
                 THEN gdv_ads ELSE 0 END)                        AS gdv_ads_this_month,

        -- last 30 days metrics
        SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 30 DAY) AND ${today}
                 THEN cost ELSE 0 END)                           AS cost_l30d,
        SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 30 DAY) AND ${today}
                 THEN gdv ELSE 0 END)                            AS gdv_l30d,
        SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 30 DAY) AND ${today}
                 THEN gdv_ads ELSE 0 END)                       AS gdv_ads_l30d,

        -- this year metrics
        SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                 THEN cost ELSE 0 END)                           AS cost_this_year,
        SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                 THEN gdv ELSE 0 END)                            AS gdv_this_year,
        SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                 THEN gdv_ads ELSE 0 END)                       AS gdv_ads_this_year,

        -- ROAS ADS calculations
        SAFE_DIVIDE(
          SUM(CASE WHEN date = ${today} THEN gdv_ads ELSE 0 END),
          SUM(CASE WHEN date = ${today} THEN cost ELSE 0 END)
        )                                                        AS roas_ads_today,
        SAFE_DIVIDE(
          SUM(CASE WHEN date = ${yesterday} THEN gdv_ads ELSE 0 END),
          SUM(CASE WHEN date = ${yesterday} THEN cost ELSE 0 END)
        )                                                        AS roas_ads_yesterday,
        SAFE_DIVIDE(
          SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 3 DAY) AND ${today}
                   THEN gdv_ads ELSE 0 END),
          SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 3 DAY) AND ${today}
                   THEN cost ELSE 0 END)
        )                                                        AS roas_ads_l3d,
        SAFE_DIVIDE(
          SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, MONTH) AND ${today}
                   THEN gdv_ads ELSE 0 END),
          SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, MONTH) AND ${today}
                   THEN cost ELSE 0 END)
        )                                                        AS roas_ads_this_month,
        SAFE_DIVIDE(
          SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 30 DAY) AND ${today}
                   THEN gdv_ads ELSE 0 END),
          SUM(CASE WHEN date BETWEEN DATE_SUB(${today}, INTERVAL 30 DAY) AND ${today}
                   THEN cost ELSE 0 END)
        )                                                        AS roas_ads_l30d,
        SAFE_DIVIDE(
          SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                   THEN gdv_ads ELSE 0 END),
          SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                   THEN cost ELSE 0 END)
        )                                                        AS roas_ads_this_year,

        -- ads vs donasi ratio
        SAFE_DIVIDE(
          SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                   THEN cost ELSE 0 END),
          SUM(CASE WHEN date BETWEEN DATE_TRUNC(${today}, YEAR) AND ${today}
                   THEN gdv ELSE 0 END)
        )                                                        AS ads_donasi_this_year,

        -- cost date tracking
        MIN(CASE WHEN cost > 0 THEN date ELSE NULL END)           AS start_cost_date,
        MAX(CASE WHEN cost > 0 THEN date ELSE NULL END)           AS last_cost_date,

        -- status determination
        CASE
          WHEN MAX(CASE WHEN cost > 0 THEN date ELSE NULL END) = ${today}
            THEN 'ACTIVE'
          ELSE 'PAUSED'
        END                                                      AS status_ads

      FROM \`${this.config.projectId}.${this.config.datasetId}.${this.config.tableId}\`
      GROUP BY SQUAD,short_url,isu,content,dm,visual
      HAVING
        cost_today        != 0 OR gdv_today         != 0 OR gdv_ads_today     != 0 OR
        cost_yesterday    != 0 OR gdv_yesterday     != 0 OR gdv_ads_yesterday != 0 OR
        cost_l3d          != 0 OR gdv_l3d           != 0 OR gdv_ads_l3d       != 0 OR
        cost_this_month   != 0 OR gdv_this_month   != 0 OR gdv_ads_this_month!= 0 OR
        cost_l30d         != 0 OR gdv_l30d          != 0 OR gdv_ads_l30d      != 0 OR
        cost_this_year    != 0 OR gdv_this_year    != 0 OR gdv_ads_this_year != 0
      ORDER BY
        CASE WHEN status_ads = 'ACTIVE' THEN 1 ELSE 0 END DESC,
        cost_l30d DESC
    `;
  },

  /**
   * Executes the BigQuery query with retry logic
   * @param {string} query - SQL query to execute
   * @returns {Object} Query result with headers and rows
   */
  executeQuery(query) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`BigQuery attempt ${attempt}/${this.config.maxRetries}`);
        
        const request = { 
          query, 
          useLegacySql: false, 
          location: this.config.location 
        };
        
        const jobId = BigQuery.Jobs.query(request, this.config.projectId).jobReference.jobId;
        let results = BigQuery.Jobs.getQueryResults(this.config.projectId, jobId, { 
          location: this.config.location 
        });
        
        // Wait for job completion
        while (!results.jobComplete) {
          Utilities.sleep(this.config.retryDelay);
          results = BigQuery.Jobs.getQueryResults(this.config.projectId, jobId, { 
            location: this.config.location 
          });
        }
        
        // Collect all rows (handle pagination)
        let rows = results.rows || [];
        while (results.pageToken) {
          results = BigQuery.Jobs.getQueryResults(this.config.projectId, jobId, {
            pageToken: results.pageToken,
            location: this.config.location
          });
          rows = rows.concat(results.rows || []);
        }
        
        // Update stats
        this.stats.lastBytesProcessed = results.totalBytesProcessed || 0;
        
        return {
          headers: this.getHeaders(),
          rows: rows
        };
        
      } catch (error) {
        lastError = error;
        console.warn(`BigQuery attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * attempt;
          console.log(`Retrying in ${delay}ms...`);
          Utilities.sleep(delay);
        }
      }
    }
    
    throw new Error(`BigQuery failed after ${this.config.maxRetries} attempts: ${lastError.message}`);
  },

  /**
   * Returns the standardized column headers
   * @returns {Array} Array of column header names
   */
  getHeaders() {
    return [
      'SQUAD','short_url','content','dm','isu','visual',
      'cost_today','gdv_today','gdv_ads_today',
      'cost_yesterday','gdv_yesterday','gdv_ads_yesterday',
      'cost_l3d','gdv_l3d','gdv_ads_l3d',
      'cost_this_month','gdv_this_month','gdv_ads_this_month',
      'cost_l30d','gdv_l30d','gdv_ads_l30d',
      'cost_this_year','gdv_this_year','gdv_ads_this_year',
      'roas_ads_today','roas_ads_yesterday','roas_ads_l3d',
      'roas_ads_this_month','roas_ads_l30d','roas_ads_this_year',
      'ads/donasi_this_year',
      'start_cost_date','last_cost_date','status_ads'
    ];
  },

  /**
   * Checks if cached data is still valid
   * @returns {boolean} True if cache is valid
   */
  isCacheValid() {
    if (!this.cache.data || !this.cache.timestamp) {
      return false;
    }
    
    const now = new Date();
    const age = now - this.cache.timestamp;
    return age < this.cache.ttl;
  },

  /**
   * Clears the cache and forces fresh data fetch
   */
  clearCache() {
    this.cache.data = null;
    this.cache.timestamp = null;
    console.log('BigQuery cache cleared');
  },

  /**
   * Gets the timestamp of the last successful fetch
   * @returns {Date|null} Last fetch timestamp
   */
  getLastFetchTime() {
    return this.stats.lastFetchTime;
  },

  /**
   * Gets the row count from the last fetch
   * @returns {number} Number of rows fetched
   */
  getLastRowCount() {
    return this.stats.lastRowCount;
  },

  /**
   * Gets the bytes processed in the last query
   * @returns {number} Bytes processed
   */
  getLastBytesProcessed() {
    return this.stats.lastBytesProcessed;
  },

  /**
   * Gets comprehensive statistics about BigQuery usage
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      ...this.stats,
      cacheStatus: this.isCacheValid() ? 'valid' : 'expired',
      cacheAge: this.cache.timestamp ? new Date() - this.cache.timestamp : null
    };
  }
};