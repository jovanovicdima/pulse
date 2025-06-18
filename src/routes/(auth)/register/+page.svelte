<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';
  import { Button, Label, Input } from 'flowbite-svelte';
  import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

  import blackLogo from '$lib/images/black-logo.svg';
  import d20 from '$lib/images/d20.svg';
  import defaultLogo from '$lib/images/logo.svg';

  let showPassword: boolean = false;
  let showConfirmPassword: boolean = false;

  export let form: ActionData;
  // export let data: PageData;
</script>

<div class="flex h-full w-full flex-col items-center gap-5 p-10">
  <div class="flex flex-col items-center gap-4">
    <img src={blackLogo} alt="" class="size-24" />
    <h1 class="text-3xl">Create New Account</h1>
  </div>

  <form
    action="?/register"
    method="POST"
    use:enhance
    class="flex w-full max-w-96 flex-col gap-4 rounded-md bg-white p-4"
  >
    <div class="flex w-full flex-col gap-1">
      <Label for="username">Username</Label>
      <Input
        name="username"
        type="text"
        id="username"
        placeholder="Enter your username"
        required
      />
    </div>

    <div class="flex w-full flex-col gap-1">
      <Label for="fullname">Full Name</Label>
      <Input
        name="fullname"
        type="text"
        id="fullname"
        placeholder="Enter your full name"
        required
      />
    </div>

    <div class="flex w-full flex-col gap-1">
      <Label for="email">Email address</Label>
      <Input
        name="email"
        type="email"
        id="email"
        placeholder="Enter your email address"
        required
      />
    </div>

    <div class="flex w-full flex-col gap-1">
      <Label for="address">Address</Label>
      <Input
        name="address"
        type="text"
        id="address"
        placeholder="Enter your address"
        required
      />
    </div>

    <div class="flex w-full flex-col gap-1">
      <Label for="phone">Phone</Label>
      <Input
        name="phone"
        type="tel"
        id="phone"
        placeholder="Enter your phone number"
        required
      />
    </div>

    <div class="flex w-full flex-col gap-1">
      <Label for="password">Password</Label>
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        name="password"
        required
      >
        <button
          type="button"
          slot="right"
          on:click={() => (showPassword = !showPassword)}
        >
          {#if showPassword}
            <EyeOutline class="size-6" />
          {:else}
            <EyeSlashOutline class="size-6" />
          {/if}
        </button>
      </Input>
    </div>

    <div class="flex w-full flex-col gap-1">
      <Label for="repeatPassword">Confirm password</Label>
      <Input
        id="repeatPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        name="repeatPassword"
        required
      >
        <button
          type="button"
          slot="right"
          on:click={() => (showConfirmPassword = !showConfirmPassword)}
        >
          {#if showConfirmPassword}
            <EyeOutline class="size-6" />
          {:else}
            <EyeSlashOutline class="size-6" />
          {/if}
        </button>
      </Input>
    </div>

    {#if form?.invalid}
      <p class="text-center text-red-500">
        Something went wrong. Please try again.
      </p>
    {/if}

    {#if form?.email}
      <p class="text-center text-red-500">Email is already taken.</p>
    {/if}

    {#if form?.username}
      <p class="text-center text-red-500">Username is already taken.</p>
    {/if}

    {#if form?.repeatPassword}
      <p class="text-center text-red-500">Passwords must match.</p>
    {/if}

    <Button type="submit" class="mt-4 w-full bg-geek">Register</Button>
    <p class="text-center">
      Already have an account? <a class="text-geek" href="/login">Log in.</a>
    </p>
  </form>

  <div class="fixed bottom-0 left-0 -z-10 m-4 my-8 hidden size-48 sm:block">
    <img src={defaultLogo} alt="" class="h-full w-full" />
  </div>

  <div class="fixed -right-8 bottom-0 -z-10 size-60 sm:size-96">
    <img src={d20} alt="" class="h-full w-full" />
  </div>
</div>
