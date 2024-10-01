<template>
  <section>
    <div class="divide-y divide-white/5">
      <div
        class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        <div>
          <h2 class="text-base font-semibold leading-7 text-zinc-800">All Blogs</h2>
          <p class="mt-1 text-sm leading-6 text-gray-400">
            Here you can see all the blogs you have created. You can also edit or delete them.
          </p>
          <button
            class="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 sm:text-base"
          >
            Write a new blog
          </button>
        </div>

        <!-- TODO: Add a blogs list vertically here -->
        <form class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div class="col-span-full">
              <label for="email" class="block text-sm font-medium leading-6 text-white"
                >Email address</label
              >
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
