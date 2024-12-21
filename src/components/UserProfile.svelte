<script lang="ts">
  import { onMount } from 'svelte';
  import { z } from 'zod';

  export let userId: string;

  let user = null;
  let activities = [];
  let loading = true;
  let error = '';
  let successMessage = '';
  let showChangePassword = false;

  // Form data
  let profileData = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
  });

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  onMount(async () => {
    await Promise.all([fetchUserProfile(), fetchUserActivities()]);
  });

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        user = data.user;
        profileData.name = user.name;
        profileData.email = user.email;
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function fetchUserActivities() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/users/${userId}/activities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        activities = data.activities;
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      console.error('Error fetching activities:', e);
    }
  }

  async function handleProfileUpdate() {
    try {
      error = '';
      successMessage = '';
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      // Validate form data
      profileSchema.parse(profileData);

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });

      const data = await response.json();
      if (data.success) {
        successMessage = 'Profile updated successfully';
        await fetchUserActivities();
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      error = e.message;
    }
  }

  async function handlePasswordChange() {
    try {
      error = '';
      successMessage = '';
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      // Validate password data
      passwordSchema.parse(profileData);

      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        successMessage = 'Password changed successfully';
        showChangePassword = false;
        profileData.currentPassword = '';
        profileData.newPassword = '';
        profileData.confirmPassword = '';
        await fetchUserActivities();
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      error = e.message;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  }

  function formatActivity(action) {
    return action.replace(/_/g, ' ').toLowerCase();
  }
</script>

<div class="space-y-6">
  {#if loading}
    <div class="text-center py-4">
      <svg
        class="animate-spin h-8 w-8 text-purple-600 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  {:else}
    {#if error}
      <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    {/if}

    {#if successMessage}
      <div class="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        {successMessage}
      </div>
    {/if}

    <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
        <form on:submit|preventDefault={handleProfileUpdate} class="mt-6 space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              bind:value={profileData.name}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
              minlength="2"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              bind:value={profileData.email}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="submit"
              class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Update Profile
            </button>
            <button
              type="button"
              on:click={() => (showChangePassword = true)}
              class="text-purple-600 hover:text-purple-900 px-4 py-2"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div class="mt-6 flow-root">
          <ul class="-mb-8">
            {#each activities as activity, i}
              <li class="relative pb-8">
                {#if i !== activities.length - 1}
                  <span
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                {/if}
                <div class="relative flex space-x-3">
                  <div>
                    <span
                      class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ring-8 ring-white"
                    >
                      <svg
                        class="h-5 w-5 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div>
                      <div class="text-sm text-gray-500">
                        <span class="font-medium text-gray-900"
                          >{formatActivity(activity.action)}</span
                        >
                        {#if activity.details}
                          <span class="ml-2">{activity.details}</span>
                        {/if}
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/if}
</div>

{#if showChangePassword}
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form on:submit|preventDefault={handlePasswordChange} class="p-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Change Password</h3>

          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700"
              >Current Password</label
            >
            <input
              type="password"
              id="currentPassword"
              bind:value={profileData.currentPassword}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700"
              >New Password</label
            >
            <input
              type="password"
              id="newPassword"
              bind:value={profileData.newPassword}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
              minlength="8"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
              >Confirm New Password</label
            >
            <input
              type="password"
              id="confirmPassword"
              bind:value={profileData.confirmPassword}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>

          <div class="mt-5 sm:mt-6 space-x-3">
            <button
              type="submit"
              class="inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
            >
              Change Password
            </button>
            <button
              type="button"
              on:click={() => (showChangePassword = false)}
              class="mt-3 sm:mt-0 inline-flex justify-center w-full sm:w-auto rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
