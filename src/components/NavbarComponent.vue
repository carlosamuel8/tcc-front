<script setup lang="ts">
</script>
<template>
  <BNavbar
    v-b-color-mode="'dark'"
    toggleable="lg"
    variant="dark"
  >
    <BNavbarBrand to="/">NavBar</BNavbarBrand>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse
      id="nav-collapse"
      is-nav
    >
      <BNavbarNav>
        <BNavItem to="/about">
          Sobre
        </BNavItem>
        <BNavItem
          href="#"
          disabled
        >Disabled</BNavItem>
      </BNavbarNav>
      <BNavForm class="ms-auto d-flex">
        <BFormInput
          class="me-2"
          placeholder="Search"
        />
        <BButton
          type="submit"
          variant="outline-success"
        >Search</BButton>
      </BNavForm>
    </BCollapse>
  </BNavbar>
</template>
