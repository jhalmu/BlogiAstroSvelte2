<!-- MetricsDashboard.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Logger from '../../utils/logger';

  let metrics = '';
  let selectedComponent = '';
  let refreshInterval: number;

  const logger = Logger.getInstance();

  async function refreshMetrics() {
    try {
      metrics = await logger.getMetricsReport(selectedComponent || undefined);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }

  onMount(() => {
    refreshMetrics();
    refreshInterval = setInterval(refreshMetrics, 60000) as unknown as number;
  });

  onDestroy(() => {
    clearInterval(refreshInterval);
  });
</script>

<div class="metrics-dashboard bg-white p-6 rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold text-purple-900 mb-6">Performance Metrics Dashboard</h2>

  <div class="mb-6">
    <label for="component" class="block text-sm font-medium text-gray-700 mb-2">
      Filter by Component
    </label>
    <select
      id="component"
      bind:value={selectedComponent}
      on:change={refreshMetrics}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="">All Components</option>
      <option value="BlogCard">Blog Card</option>
      <option value="SecurityDashboard">Security Dashboard</option>
      <!-- Add more components as needed -->
    </select>
  </div>

  <div class="metrics-content bg-gray-50 p-4 rounded-lg">
    <pre class="whitespace-pre-wrap font-mono text-sm text-gray-700">{metrics}</pre>
  </div>

  <div class="mt-4 text-right">
    <button
      on:click={refreshMetrics}
      class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      Refresh Metrics
    </button>
  </div>
</div>

<style>
  .metrics-dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  .metrics-content {
    max-height: 600px;
    overflow-y: auto;
  }
</style>
