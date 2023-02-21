<template>
  <div id="app">
    <Header/>
    <router-view/>    
  </div>
</template>

<script>
  import Header from './components/Header';

  export default {
    name: 'App',
    components:{
      Header
    }
    
  }

</script>

<style scoped>

  #app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

</style>
