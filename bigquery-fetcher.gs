/**
 * Simplified BigQuery Fetcher - Just Get Data
 * Removed caching and advanced features
 */

const BigQueryFetcher = {
  
  // Configuration
  config: {
    projectId: 'numeric-button-449507-v7',
    datasetId: 'gdv',
    tableId: 'gdv-daily',
    location: 'asia-southeast2'
  },

  /**
   * Fetch all data from BigQuery (simplified version)
   */
  fetchAllData() {
    try {
      console.log('Fetching data from BigQuery...');
      
      const query = this.buildQuery();
      const result = this.executeQuery(query);
      
      console.log(`BigQuery fetch completed: ${result.rows.length} rows`);
      return result;
      
    } catch (error) {
      console.error('BigQuery fetch failed:', error);
      throw new Error(`BigQuery fetch failed: ${error.message}`);
    }
  },

  /**
   * Build the SQL query
   */
  buildQuery() {
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

        -- ROAS calculations
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
   * Execute the BigQuery query
   */
  executeQuery(query) {
    try {
      const request = { 
        query, 
        useLegacySql: false, 
        location: this.config.location 
      };
      
      const jobId = BigQuery.Jobs.query(request, this.config.projectId).jobReference.jobId;
      let results = BigQuery.Jobs.getQueryResults(this.config.projectId, jobId, { 
        location: this.config.location 
      });
      
      // Wait for completion
      while (!results.jobComplete) {
        Utilities.sleep(1000);
        results = BigQuery.Jobs.getQueryResults(this.config.projectId, jobId, { 
          location: this.config.location 
        });
      }
      
      // Get all rows
      let rows = results.rows || [];
      while (results.pageToken) {
        results = BigQuery.Jobs.getQueryResults(this.config.projectId, jobId, {
          pageToken: results.pageToken,
          location: this.config.location
        });
        rows = rows.concat(results.rows || []);
      }
      
      return {
        headers: this.getHeaders(),
        rows: rows
      };
      
    } catch (error) {
      throw new Error(`BigQuery execution failed: ${error.message}`);
    }
  },

  /**
   * Get column headers
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
  }
};