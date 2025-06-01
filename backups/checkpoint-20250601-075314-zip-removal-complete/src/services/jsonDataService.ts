import { Builder } from './googleSheetsService';

export class JSONDataService {
  private buildersCache: Builder[] | null = null;
  private buildersByStateCache: Record<string, Builder[]> | null = null;
  private statesCache: string[] | null = null;

  /**
   * Fetch all builders from JSON data
   */
  async getBuilders(): Promise<Builder[]> {
    // Always clear cache to ensure fresh data
    this.buildersCache = null;
    
    try {
      console.log('🔗 JSONDataService: Fetching builders from JSON...');
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/data/builders.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const builders: Builder[] = await response.json();
      console.log(`📊 JSONDataService: Loaded ${builders.length} builders from JSON`);
      
      // Debug Advanced RV in the service
      const advancedRV = builders.find(b => b.name === 'Advanced RV');
      if (advancedRV) {
        console.log('🔍 JSONDataService - ADVANCED RV GALLERY:', advancedRV.gallery);
      }
      
      this.buildersCache = builders;
      return builders;
    } catch (error) {
      console.error('❌ JSONDataService: Error fetching builders:', error);
      throw new Error('Failed to load builder data from JSON files');
    }
  }

  /**
   * Get builders organized by state
   */
  async getBuildersByState(): Promise<Record<string, Builder[]>> {
    if (this.buildersByStateCache) {
      console.log('📋 JSONDataService: Returning cached builders by state data');
      return this.buildersByStateCache;
    }

    try {
      console.log('🔗 JSONDataService: Fetching builders by state from JSON...');
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/data/builders-by-state.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buildersByState: Record<string, Builder[]> = await response.json();
      console.log(`📊 JSONDataService: Loaded builders for ${Object.keys(buildersByState).length} states`);
      
      this.buildersByStateCache = buildersByState;
      return buildersByState;
    } catch (error) {
      console.error('❌ JSONDataService: Error fetching builders by state:', error);
      throw new Error('Failed to load builders by state from JSON files');
    }
  }

  /**
   * Get builders for a specific state
   */
  async getBuildersForState(state: string): Promise<Builder[]> {
    const buildersByState = await this.getBuildersByState();
    const stateBuilders = buildersByState[state] || [];
    
    console.log(`🔍 JSONDataService: Found ${stateBuilders.length} builders for ${state}`);
    
    if (state === 'New Jersey' && stateBuilders.length > 0) {
      console.log('📋 New Jersey builders from JSON:');
      stateBuilders.forEach((builder, index) => {
        console.log(`  ${index + 1}. ${builder.name} (${builder.location.city})`);
      });
    }
    
    return stateBuilders;
  }

  /**
   * Get list of all states
   */
  async getStates(): Promise<string[]> {
    if (this.statesCache) {
      console.log('📋 JSONDataService: Returning cached states data');
      return this.statesCache;
    }

    try {
      console.log('🔗 JSONDataService: Fetching states from JSON...');
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/data/states.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const states: string[] = await response.json();
      console.log(`📊 JSONDataService: Loaded ${states.length} states`);
      
      this.statesCache = states;
      return states;
    } catch (error) {
      console.error('❌ JSONDataService: Error fetching states:', error);
      throw new Error('Failed to load states from JSON files');
    }
  }

  /**
   * Search builders by name, location, or services
   */
  async searchBuilders(query: string): Promise<Builder[]> {
    const allBuilders = await this.getBuilders();
    const searchTerm = query.toLowerCase();
    
    const filteredBuilders = allBuilders.filter(builder => {
      // Search in name
      if (builder.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in location
      if (builder.location.city.toLowerCase().includes(searchTerm)) return true;
      if (builder.location.state.toLowerCase().includes(searchTerm)) return true;
      
      // Search in description
      if (builder.description.toLowerCase().includes(searchTerm)) return true;
      
      // Search in services array
      if (builder.services && Array.isArray(builder.services)) {
        for (const service of builder.services) {
          if (typeof service === 'string' && service.toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
      }
      
      return false;
    });
    
    return filteredBuilders;
  }

  /**
   * Clear cache (useful for refreshing data)
   */
  clearCache(): void {
    this.buildersCache = null;
    this.buildersByStateCache = null;
    this.statesCache = null;
    console.log('🧹 JSONDataService: Cache cleared');
  }

  /**
   * Force refresh data by clearing cache and refetching
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 JSONDataService: Force refreshing all data...');
    this.clearCache();
    await this.getBuilders();
    await this.getBuildersByState();
    console.log('✅ JSONDataService: Force refresh completed');
  }
}

// Export singleton instance
export const jsonDataService = new JSONDataService();
