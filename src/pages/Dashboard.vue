<template>
  <div id="dashboard">
    
    <h2>Minha conta</h2>
    <span>Atualize seu perfil</span>

    <form @submit.prevent="updateProfile">
      <label>Nome:</label>
      <input type="text" v-model="nome" id="name" :placeholder="user.nome" />
      <button class="button" type="submit">Atualizar Perfil</button>
    </form>

    <button class="button logout" @click="logOut">Sair</button>
  </div>
</template>
  
<script>
  import firebase from '../services/firebaseConnection';

  export default {
    name: 'Dashboard-posts',
    data(){
      return{
        nome: '',
        user: {},
      }
    },
    created(){
      const user = localStorage.getItem('devposts');

      this.user = JSON.parse(user);

      console.log(user);
    },
    methods:{
      async logOut() {
        const confirm = window.confirm('Sair?')

        if (confirm) {
          await firebase.auth().signOut()
          .then( async () => {
            await localStorage.removeItem('devposts');
            this.$router.push('/login');
          })
        } else {
          return;
        }
      },
      async updateProfile() {
        if (this.nome == "") {
          return;
        }

        await firebase.firestore().collection('users')
        .doc(this.user.uid).update({
          nome: this.nome
        })

        const postDocs = await firebase.firestore().collection('posts')
        .where('userId', '==', this.user.uid).get();

        postDocs.forEach( async doc => {
          await firebase.firestore().collection('posts').doc(doc.id).update({
            autor: this.nome
          })
        })

        localStorage.setItem('devposts', JSON.stringify({
          uid: this.user.uid,
          nome: this.nome
        }));

        alert("Perfil atualizado com sucesso!");
      }
    }
  }
</script>
  
<style scoped>
  #dashboard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    padding: 15px 20px;
    width: 600px;
    max-width: 600px;
    background: #4C5059;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  h2 {
    color: #FFF;
    margin-bottom: 25px;
  }

  span {
    color: #FFF
  }

  form {
    width: 500px;
    display: flex;
    flex-direction: column;    
  }

  form label {
    font-size: 18px;
    color: #FFF;
    padding-bottom: 5px;
  }

  form input {
    height: 30px;
    padding: 5px;
    font-size: 17px;
    border: 0;
    outline: none;
    margin-bottom: 5px;
    background: #FAFAFA;
  }

  button {
    cursor: pointer;
    margin-top: 15px;
    height: 35px;
    border: 0;
    background: #7289DA;
    color: #FFF;
    font-size: 17px;
  }

  button.logout {
    width: 500px;
    color: #FFF;
    background: #E36D6D;
  }
</style>