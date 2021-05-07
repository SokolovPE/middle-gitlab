<template>
    <div>
        <h2>Home page</h2>
        <v-btn :to="{ name: 'CreateMR' }">Create MR</v-btn>
    </div>
</template>

<script>
export default {
    name: 'Home',
};
</script>
