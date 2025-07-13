/**
 * Filter Configurations
 * 
 * Centralized configuration for all data filtering operations.
 * Each filter defines how to filter the main dataset for specific use cases.
 */

const FilterConfigs = {
  
  /**
   * All available filter configurations
   */
  filters: {
    
    // Kevin's AREA 2 squad filter (backward compatibility)
    kevin_squad: {
      name: 'Kevin Squad (AREA 2)',
      sheetName: 'campaign',
      description: 'Filter for AREA 2 squad data (Kevin\'s team)',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'AREA 2';
      }
    },
    
    // Squad-level filters (all squads from your data)
    squad_area1: {
      name: 'Squad AREA 1',
      sheetName: 'squad_area1',
      description: 'Filter for AREA 1 squad',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'AREA 1';
      }
    },
    
    squad_area2: {
      name: 'Squad AREA 2',
      sheetName: 'squad_area2',
      description: 'Filter for AREA 2 squad',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'AREA 2';
      }
    },
    
    squad_area3: {
      name: 'Squad AREA 3',
      sheetName: 'squad_area3',
      description: 'Filter for AREA 3 squad',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'AREA 3';
      }
    },
    
    squad_program: {
      name: 'Squad PROGRAM',
      sheetName: 'squad_program',
      description: 'Filter for PROGRAM squad',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'PROGRAM';
      }
    },
    
    squad_hospital: {
      name: 'Squad HOSPITAL',
      sheetName: 'squad_hospital',
      description: 'Filter for HOSPITAL squad',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'HOSPITAL';
      }
    },
    
    squad_inbound: {
      name: 'Squad INBOUND',
      sheetName: 'squad_inbound',
      description: 'Filter for INBOUND squad',
      filter: (row, headers) => {
        const squadIndex = headers.indexOf('SQUAD');
        return squadIndex !== -1 && row[squadIndex] === 'INBOUND';
      }
    },
    
    // Content-based filters
    content_active: {
      name: 'Active Content',
      sheetName: 'content_active',
      description: 'Filter for campaigns with active content',
      filter: (row, headers) => {
        const contentIndex = headers.indexOf('content');
        return contentIndex !== -1 && row[contentIndex] !== null && row[contentIndex] !== '';
      }
    },
    
    // Individual content creator filters (add key ones)
    content_monica: {
      name: 'Monica Content',
      sheetName: 'content_monica',
      description: 'Filter for Monica content campaigns',
      filter: (row, headers) => {
        const contentIndex = headers.indexOf('content');
        return contentIndex !== -1 && row[contentIndex] === 'MONICA';
      }
    },
    
    content_tazkiya: {
      name: 'Tazkiya Content',
      sheetName: 'content_tazkiya',
      description: 'Filter for Tazkiya content campaigns',
      filter: (row, headers) => {
        const contentIndex = headers.indexOf('content');
        return contentIndex !== -1 && row[contentIndex] === 'TAZKIYA';
      }
    },
    
    content_shafira: {
      name: 'Shafira Content',
      sheetName: 'content_shafira',
      description: 'Filter for Shafira content campaigns',
      filter: (row, headers) => {
        const contentIndex = headers.indexOf('content');
        return contentIndex !== -1 && row[contentIndex] === 'SHAFIRA';
      }
    },
    
    // DM (Digital Marketing) filters
    dm_active: {
      name: 'Active DM Campaigns',
      sheetName: 'dm_active',
      description: 'Filter for campaigns with assigned DM',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        return dmIndex !== -1 && row[dmIndex] !== null && row[dmIndex] !== '';
      }
    },
    
    // Individual DM filters (key team members)
    dm_kevin: {
      name: 'Kevin DM Campaigns',
      sheetName: 'dm_kevin',
      description: 'Filter for campaigns managed by Kevin',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        return dmIndex !== -1 && row[dmIndex] === 'KEVIN';
      }
    },
    
    dm_miqdad: {
      name: 'Miqdad DM Campaigns',
      sheetName: 'dm_miqdad',
      description: 'Filter for campaigns managed by Miqdad',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        return dmIndex !== -1 && row[dmIndex] === 'MIQDAD';
      }
    },
    
    dm_naufal: {
      name: 'Naufal DM Campaigns',
      sheetName: 'dm_naufal',
      description: 'Filter for campaigns managed by Naufal',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        return dmIndex !== -1 && row[dmIndex] === 'NAUFAL';
      }
    },
    
    dm_hamam: {
      name: 'Hamam DM Campaigns',
      sheetName: 'dm_hamam',
      description: 'Filter for campaigns managed by Hamam',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        return dmIndex !== -1 && row[dmIndex] === 'HAMAM';
      }
    },
    
    dm_taufik: {
      name: 'Taufik DM Campaigns',
      sheetName: 'dm_taufik',
      description: 'Filter for campaigns managed by Taufik',
      filter: (row, headers) => {
        const dmIndex = headers.indexOf('dm');
        return dmIndex !== -1 && row[dmIndex] === 'TAUFIK';
      }
    },
    
    // Issue-based filters
    isu_active: {
      name: 'Active Issues',
      sheetName: 'isu_active',
      description: 'Filter for campaigns with defined issues',
      filter: (row, headers) => {
        const isuIndex = headers.indexOf('isu');
        return isuIndex !== -1 && row[isuIndex] !== null && row[isuIndex] !== '';
      }
    },
    
    // Visual-based filters
    visual_active: {
      name: 'Active Visuals',
      sheetName: 'visual_active',
      description: 'Filter for campaigns with visual elements',
      filter: (row, headers) => {
        const visualIndex = headers.indexOf('visual');
        return visualIndex !== -1 && row[visualIndex] !== null && row[visualIndex] !== '';
      }
    },
    
    // Performance-based filters
    high_performers: {
      name: 'High Performers',
      sheetName: 'high_performers',
      description: 'Filter for high-performing campaigns (ROAS > 2.0)',
      filter: (row, headers) => {
        const roasIndex = headers.indexOf('roas_ads_l30d');
        if (roasIndex === -1) return false;
        const roas = parseFloat(row[roasIndex]);
        return !isNaN(roas) && roas > 2.0;
      }
    },
    
    low_performers: {
      name: 'Low Performers',
      sheetName: 'low_performers',
      description: 'Filter for low-performing campaigns (ROAS < 1.0)',
      filter: (row, headers) => {
        const roasIndex = headers.indexOf('roas_ads_l30d');
        if (roasIndex === -1) return false;
        const roas = parseFloat(row[roasIndex]);
        return !isNaN(roas) && roas < 1.0;
      }
    },
    
    // Status-based filters
    active_campaigns: {
      name: 'Active Campaigns',
      sheetName: 'active_campaigns',
      description: 'Filter for currently active campaigns',
      filter: (row, headers) => {
        const statusIndex = headers.indexOf('status_ads');
        return statusIndex !== -1 && row[statusIndex] === 'ACTIVE';
      }
    },
    
    paused_campaigns: {
      name: 'Paused Campaigns',
      sheetName: 'paused_campaigns',
      description: 'Filter for paused campaigns',
      filter: (row, headers) => {
        const statusIndex = headers.indexOf('status_ads');
        return statusIndex !== -1 && row[statusIndex] === 'PAUSED';
      }
    },
    
    // Cost-based filters
    high_spend: {
      name: 'High Spend Campaigns',
      sheetName: 'high_spend',
      description: 'Filter for campaigns with high spending (>100k last 30 days)',
      filter: (row, headers) => {
        const costIndex = headers.indexOf('cost_l30d');
        if (costIndex === -1) return false;
        const cost = parseFloat(row[costIndex]);
        return !isNaN(cost) && cost > 100000;
      }
    },
    
    low_spend: {
      name: 'Low Spend Campaigns',
      sheetName: 'low_spend',
      description: 'Filter for campaigns with low spending (<10k last 30 days)',
      filter: (row, headers) => {
        const costIndex = headers.indexOf('cost_l30d');
        if (costIndex === -1) return false;
        const cost = parseFloat(row[costIndex]);
        return !isNaN(cost) && cost > 0 && cost < 10000;
      }
    }
  },

  /**
   * Get a specific filter configuration
   * @param {string} filterName - Name of the filter
   * @returns {Object} Filter configuration object
   */
  getFilter(filterName) {
    const filter = this.filters[filterName];
    if (!filter) {
      throw new Error(`Filter '${filterName}' not found`);
    }
    return filter;
  },

  /**
   * Get all available filters
   * @returns {Object} All filter configurations
   */
  getAllFilters() {
    return this.filters;
  },

  /**
   * Get filters by category
   * @param {string} category - Category name (squad, content, dm, isu, visual, performance, status, cost)
   * @returns {Object} Filtered configurations
   */
  getFiltersByCategory(category) {
    const categoryFilters = {};
    Object.keys(this.filters).forEach(key => {
      if (key.startsWith(category + '_')) {
        categoryFilters[key] = this.filters[key];
      }
    });
    return categoryFilters;
  },

  /**
   * Get available categories
   * @returns {Array} List of available categories
   */
  getCategories() {
    const categories = new Set();
    Object.keys(this.filters).forEach(key => {
      const parts = key.split('_');
      if (parts.length > 1) {
        categories.add(parts[0]);
      }
    });
    return Array.from(categories);
  },

  /**
   * Add a custom filter configuration
   * @param {string} name - Filter name
   * @param {Object} config - Filter configuration
   */
  addCustomFilter(name, config) {
    if (this.filters[name]) {
      console.warn(`Filter '${name}' already exists, overwriting`);
    }
    
    // Validate configuration
    if (!config.filter || typeof config.filter !== 'function') {
      throw new Error('Filter configuration must include a filter function');
    }
    
    if (!config.sheetName) {
      throw new Error('Filter configuration must include a sheetName');
    }
    
    this.filters[name] = {
      name: config.name || name,
      sheetName: config.sheetName,
      description: config.description || `Custom filter: ${name}`,
      filter: config.filter
    };
    
    console.log(`Custom filter '${name}' added successfully`);
  },

  /**
   * Remove a filter configuration
   * @param {string} filterName - Name of the filter to remove
   */
  removeFilter(filterName) {
    if (this.filters[filterName]) {
      delete this.filters[filterName];
      console.log(`Filter '${filterName}' removed`);
    } else {
      console.warn(`Filter '${filterName}' not found`);
    }
  },

  /**
   * Validate a filter configuration
   * @param {string} filterName - Name of the filter to validate
   * @returns {boolean} True if valid
   */
  validateFilter(filterName) {
    try {
      const filter = this.getFilter(filterName);
      
      if (typeof filter.filter !== 'function') {
        throw new Error('Filter must be a function');
      }
      
      if (!filter.sheetName) {
        throw new Error('Filter must have a sheetName');
      }
      
      return true;
      
    } catch (error) {
      console.error(`Filter validation failed for '${filterName}':`, error);
      return false;
    }
  },

  /**
   * Create a simple column-based filter
   * @param {string} columnName - Name of the column to filter on
   * @param {*} value - Value to filter for
   * @param {string} operator - Comparison operator
   * @returns {Function} Filter function
   */
  createColumnFilter(columnName, value, operator = '=') {
    return (row, headers) => {
      const columnIndex = headers.indexOf(columnName);
      if (columnIndex === -1) return false;
      
      const cellValue = row[columnIndex];
      
      switch (operator) {
        case '=':
          return cellValue === value;
        case '!=':
          return cellValue !== value;
        case 'contains':
          return cellValue && String(cellValue).includes(value);
        case 'not_empty':
          return cellValue !== null && cellValue !== undefined && cellValue !== '';
        case '>':
          return parseFloat(cellValue) > parseFloat(value);
        case '<':
          return parseFloat(cellValue) < parseFloat(value);
        case '>=':
          return parseFloat(cellValue) >= parseFloat(value);
        case '<=':
          return parseFloat(cellValue) <= parseFloat(value);
        default:
          return cellValue === value;
      }
    };
  },

  /**
   * List all available filters with their descriptions
   * @returns {Array} Array of filter information
   */
  listFilters() {
    return Object.keys(this.filters).map(key => ({
      key: key,
      name: this.filters[key].name,
      sheetName: this.filters[key].sheetName,
      description: this.filters[key].description
    }));
  },

  /**
   * Generate filters for all team members dynamically
   * Call this to add filters for all content creators and DMs
   */
  generateTeamFilters() {
    // All content creators from your data
    const contentCreators = [
      'MONICA', 'TAZKIYA', 'SHAFIRA', 'VORA', 'BUNGA', 'NOURMA', 'PHANIE', 'AUZIAH',
      'GITA', 'YASYI', 'ABI', 'ATI', 'DEWI', 'RESTY', 'NABILLA', 'DZULFIKAR',
      'DIMAS', 'NADIAUM', 'BIMA', 'LUI', 'INTA', 'HANIFA', 'OKTA', 'VICKY',
      'ALYA', 'LINDY', 'AHDANIA', 'HASNA', 'NOYA', 'JULI', 'GINA', 'RENNI',
      'UNIKE', 'RAHMAH', 'SYAHID', 'WINNY', 'EVINTA', 'NAIMMAH', 'MELATI', 'DELA', 'WITRI'
    ];

    // All DMs from your data
    const digitalMarketers = [
      'MIQDAD', 'NAUFAL', 'HAMAM', 'TAUFIK', 'CITRA', 'AKBAR', 'LUTHFI', 'DANNY',
      'ARIES', 'IBECK', 'ILHAM', 'DHANI', 'ALVIN', 'KEVIN', 'FAHMI', 'DINI',
      'ICA', 'RIEFAN', 'NABILAH'
    ];

    // Generate content creator filters
    contentCreators.forEach(creator => {
      const filterKey = `content_${creator.toLowerCase()}`;
      if (!this.filters[filterKey]) {
        this.addCustomFilter(filterKey, {
          name: `${creator} Content`,
          sheetName: `content_${creator.toLowerCase()}`,
          description: `Filter for ${creator} content campaigns`,
          filter: (row, headers) => {
            const contentIndex = headers.indexOf('content');
            return contentIndex !== -1 && row[contentIndex] === creator;
          }
        });
      }
    });

    // Generate DM filters
    digitalMarketers.forEach(dm => {
      const filterKey = `dm_${dm.toLowerCase()}`;
      if (!this.filters[filterKey]) {
        this.addCustomFilter(filterKey, {
          name: `${dm} DM Campaigns`,
          sheetName: `dm_${dm.toLowerCase()}`,
          description: `Filter for campaigns managed by ${dm}`,
          filter: (row, headers) => {
            const dmIndex = headers.indexOf('dm');
            return dmIndex !== -1 && row[dmIndex] === dm;
          }
        });
      }
    });

    console.log(`Generated ${contentCreators.length} content filters and ${digitalMarketers.length} DM filters`);
  },

  /**
   * Get filters for a specific squad
   * @param {string} squadName - Name of the squad (AREA 1, AREA 2, etc.)
   * @returns {Object} Filter configuration for the squad
   */
  getSquadFilter(squadName) {
    const squadKey = `squad_${squadName.toLowerCase().replace(' ', '_')}`;
    return this.filters[squadKey];
  },

  /**
   * Get all content creator names
   * @returns {Array} List of all content creators
   */
  getContentCreators() {
    return [
      'MONICA', 'TAZKIYA', 'SHAFIRA', 'VORA', 'BUNGA', 'NOURMA', 'PHANIE', 'AUZIAH',
      'GITA', 'YASYI', 'ABI', 'ATI', 'DEWI', 'RESTY', 'NABILLA', 'DZULFIKAR',
      'DIMAS', 'NADIAUM', 'BIMA', 'LUI', 'INTA', 'HANIFA', 'OKTA', 'VICKY',
      'ALYA', 'LINDY', 'AHDANIA', 'HASNA', 'NOYA', 'JULI', 'GINA', 'RENNI',
      'UNIKE', 'RAHMAH', 'SYAHID', 'WINNY', 'EVINTA', 'NAIMMAH', 'MELATI', 'DELA', 'WITRI'
    ];
  },

  /**
   * Get all DM names
   * @returns {Array} List of all digital marketers
   */
  getDigitalMarketers() {
    return [
      'MIQDAD', 'NAUFAL', 'HAMAM', 'TAUFIK', 'CITRA', 'AKBAR', 'LUTHFI', 'DANNY',
      'ARIES', 'IBECK', 'ILHAM', 'DHANI', 'ALVIN', 'KEVIN', 'FAHMI', 'DINI',
      'ICA', 'RIEFAN', 'NABILAH'
    ];
  },

  /**
   * Get all squad names
   * @returns {Array} List of all squads
   */
  getSquads() {
    return ['AREA 1', 'AREA 2', 'AREA 3', 'PROGRAM', 'HOSPITAL', 'INBOUND'];
  }
};