<!-- Admin Security Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';

  let suspiciousActivities = [];
  let securityEvents = [];
  let selectedActivity = null;
  let loading = true;
  let error = null;
  let timeRange = '24h';
  let activityType = 'all';

  async function fetchSecurityData() {
    try {
      loading = true;
      const response = await fetch(
        `/api/admin/security?timeRange=${timeRange}&type=${activityType}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch security data');
      }

      suspiciousActivities = data.suspiciousActivities;
      securityEvents = data.securityEvents;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function showActivityDetails(activity) {
    selectedActivity = activity;
  }

  async function resolveActivity(activityId) {
    try {
      const response = await fetch(`/api/admin/security/resolve/${activityId}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Refresh data
      await fetchSecurityData();
      selectedActivity = null;
    } catch (err) {
      error = err.message;
    }
  }

  onMount(fetchSecurityData);
</script>

<div class="p-6">
  <h1 class="text-2xl font-bold text-purple-900 mb-6">Security Dashboard</h1>

  <!-- Filters -->
  <div class="flex gap-4 mb-6">
    <select
      bind:value={timeRange}
      on:change={fetchSecurityData}
      class="px-4 py-2 border rounded-md"
    >
      <option value="24h">Last 24 Hours</option>
      <option value="7d">Last 7 Days</option>
      <option value="30d">Last 30 Days</option>
    </select>

    <select
      bind:value={activityType}
      on:change={fetchSecurityData}
      class="px-4 py-2 border rounded-md"
    >
      <option value="all">All Activities</option>
      <option value="login_failed">Failed Logins</option>
      <option value="password_reset">Password Resets</option>
      <option value="new_ip">New IP Addresses</option>
      <option value="unusual_time">Unusual Times</option>
    </select>
  </div>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Suspicious Activities -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Suspicious Activities</h2>

      {#if loading}
        <div class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      {:else if suspiciousActivities.length === 0}
        <p class="text-gray-500 text-center py-8">No suspicious activities found</p>
      {:else}
        <div class="space-y-4">
          {#each suspiciousActivities as activity}
            <div
              class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              on:click={() => showActivityDetails(activity)}
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium text-purple-900">{activity.activity_type}</h3>
                  <p class="text-sm text-gray-600">User: {activity.user_email}</p>
                  <p class="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at))} ago
                  </p>
                </div>
                {#if !activity.resolved}
                  <span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Active
                  </span>
                {:else}
                  <span
                    class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >
                    Resolved
                  </span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Security Events -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Security Events</h2>

      {#if loading}
        <div class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      {:else if securityEvents.length === 0}
        <p class="text-gray-500 text-center py-8">No security events found</p>
      {:else}
        <div class="space-y-4">
          {#each securityEvents as event}
            <div class="border rounded-lg p-4">
              <h3 class="font-medium text-purple-900">{event.event_type}</h3>
              <p class="text-sm text-gray-600">IP: {event.ip_address}</p>
              <p class="text-xs text-gray-500">
                {formatDistanceToNow(new Date(event.created_at))} ago
              </p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Activity Details Modal -->
  {#if selectedActivity}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold text-purple-900">Activity Details</h2>
          <button
            on:click={() => (selectedActivity = null)}
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="font-medium">Type</h3>
            <p>{selectedActivity.activity_type}</p>
          </div>

          <div>
            <h3 class="font-medium">User</h3>
            <p>{selectedActivity.user_email}</p>
          </div>

          <div>
            <h3 class="font-medium">Details</h3>
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(JSON.parse(selectedActivity.details), null, 2)}
            </pre>
          </div>

          <div>
            <h3 class="font-medium">Time</h3>
            <p>{new Date(selectedActivity.created_at).toLocaleString()}</p>
          </div>

          {#if !selectedActivity.resolved}
            <div class="flex justify-end mt-6">
              <button
                on:click={() => resolveActivity(selectedActivity.id)}
                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Mark as Resolved
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
