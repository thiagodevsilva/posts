<template>
  <div id="home">
    <div class="newpost">
      <h2>Bem vindo de volta!</h2>
      <span>Compartilhe seu dia.</span>
      <textarea placeholder="O que está pensando hoje?" rows="15" v-model="input"></textarea>
      <button @click="createPost">Compartilhar</button>
    </div>

    <div class="postarea loading" v-if="loading">
      <h2>Buscando posts...</h2>
    </div>

    <div class="postarea" v-else>
      <article class="post" v-for="post in posts" :key="post.id">
        <router-link tag="h1" :to="`/perfil/${post.userId}`">
          {{ post.autor}}
        </router-link>
        <p>{{ post.content | postLength }}</p>

        <div class="action-post">
          <button @click="likePost(post.id, post.likes)">{{ post.likes == 0 ? 'Curtir' : post.likes + ' Curtida(s)' }}</button>
          <button @click="togglePostModal(post)">Ver postagem</button>
        </div>
      </article>

    </div>

    <Modal v-if="showPostModal" :post="fullPost" @close="togglePostModal">

    </Modal>

  </div>
</template>

<script>
  import firebase from '../services/firebaseConnection';
  import Modal from '../components/Modal.vue';

  export default {
      name: 'Home-posts',
      components:{
        Modal
      },
      data(){
        return{
          input: '',
          user: {},
          loading: true,
          posts: [],
          showPostModal: false,
          fullPost: {},
        }
      },
      async created(){
        const user = localStorage.getItem('devposts');
        this.user = JSON.parse(user);

        await firebase.firestore().collection('posts')
        .orderBy('created', 'desc')
        .onSnapshot( (doc) => {
          this.posts = []

          doc.forEach( (item) => {
            this.posts.push({
              id: item.id,
              autor: item.data().autor,
              content: item.data().content,
              likes: item.data().likes,
              created: item.data().created,
              userId: item.data().userId,
            });
          })

          this.loading = false;
        })
      },
      methods:{
        async createPost(){
          if (this.input === '') {
            return;
          }

          console.log(this.user);
          await firebase.firestore().collection('posts')
          .add({
            created: new Date(),
            content: this.input,
            autor: this.user.nome,
            userId: this.user.uid,
            likes: 0,
          })
          .then( () => {
            this.input = '';
            console.log('POST CRIADO COM SUCESSO')
          })
          .catch( (error) => {
            console.log('ERRO AO CRIAR POST: ' + error)
          })
        },
        async likePost(id, likes) {
          const userId = this.user.uid;
          const docId = `${userId}_${id}`;

          const doc = await firebase.firestore().collection('likes')
          .doc(docId).get()

          if (doc.exists) {
            await firebase.firestore().collection('posts')
            .doc(id).update({
              likes: likes - 1
            });

            await firebase.firestore().collection('likes')
            .doc(docId).delete();
            return;
          }

          // Create like
          await firebase.firestore().collection('likes')
          .doc(docId).set({
              postId: id,
              userId: userId
          })

          // Atualizar o numero de likes
          await firebase.firestore().collection('posts')
          .doc(id).update({
              likes: likes + 1
          })
        },
        togglePostModal(post){
          this.showPostModal = !this.showPostModal;
          
          if (this.showPostModal) {
            this.fullPost = post;
          } else {
            this.fullPost = {};
          }
        }
      },
      filters:{
        postLength(valor){
          if (valor.length < 200) {
            return valor;
          }

          return `${valor.substring(0,200)}...`
        }
      }
  }
</script>

<style scoped>
  #home {
    display: flex;
    margin: 25px;
  }

  @import './home.css';

</style>