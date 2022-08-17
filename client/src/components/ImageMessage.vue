<template>
  <div class="image-sending">
      <img :src="urlImage" alt="">
  </div>
</template>

<script>
export default {
    name: 'ImageMessage',
    props: ['image'],
    data: () => ({
        urlImage: null,
    }),
    created(){
        this.urlImage = URL.createObjectURL(this.image);
    }
}
</script>

<style>

</style>