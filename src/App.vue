<template>
    <v-app v-resize="onResize">
        <v-layout
            class="bg-image"
            style="display:block;">
            <v-toolbar 
                style="position:fixed;width:100%;"
                v-bind:style="{ transform: transform }"
                :src="require('./assets/cinema1.jpg')"
                dark
                absolute
                prominent>
               
                <v-toolbar-title class=" text-uppercase">
                    <span class="headline">movies</span>
                    <span class="caption font-weight-light">archive</span>
                </v-toolbar-title>
                
                <v-spacer></v-spacer>
                <v-icon>movie_filter</v-icon>
                <template v-slot:extension>                    
                    <v-autocomplete
                        ref="ac"
                        dark
                        append-icon="search"
                        v-model="actor"
                        label="by actor"
                        clearable
                        color="yellow"
                        @change="loadMovies"
                        :items="actors">
                    </v-autocomplete>
                </template>
                
            </v-toolbar>
            <div 
                v-if="movies.length == 0"
                class="text-center font-weight-thin headline cyan--text" 
                style="padding-top:190px; width:100% !important;">
                <p>Choose an <span class="display-3 font-weight-thin">actor/actress</span> and find out the films <span class="display-2 font-weight-thin">participated in each year.</span></p>
            </div>
             <v-sheet v-else width="100%"
                style="-webkit-overflow-scrolling: touch;"
                color="transparent"                
                >
                <v-container style="padding-top:190px;">
                    <v-layout row wrap>
                        <template v-for="(movie, idx) in movies">
                            <v-flex xs12 sm6 lg3 :key="idx">
                                <movie-list class="mb-3" :movie="movie"></movie-list>
                            </v-flex>
                        </template>
                            
                    </v-layout>
                    
                    <div v-if="loading" class="text-center" >
                        <v-progress-circular 
                            :size="50"
                            indeterminate
                            color="white">
                        </v-progress-circular>
                    </div>                     
                </v-container>
            </v-sheet>
           
        </v-layout>
    </v-app>
</template>

<script>
   import { db } from '@/api'
    import MovieList from '@/components/Movielist'

    export default {
        name: 'App',
        components: {
            MovieList
        },
        data: () => ({
            previousScroll: 0,
            currentScroll: 0,
            isScrollingUp: true,
            actors: [],
            actor: null,
            movies: [],
            lastVisible: null,
            loadMore: false,
            loading: false,
            page: 12,
            
        }), 
        computed: {
            transform() {
                const value = this.isScrollingUp ? 0: -175
                return `translateY(${ value }px`
            }
        } ,
        methods: {
           
            loadMovies(clear) {               
                if (!this.actor || this.loading) return

                if (clear) {
                    this.movies = []
                    this.loadMore = true
                    this.lastVisible = null
                    this.$refs.ac.blur()
                }
                if (!this.loadMore || this.loading) return 

                this.loading = true
                const movies = db.collection('movies')
                
                movies
                    .where('actors', 'array-contains', this.actor)
                    .orderBy('year')
                    .startAfter(this.lastVisible || null)
                    .limit(this.page)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(movie => {                           
                            this.movies.push(movie.data())
                        });
                        if (snapshot.docs.length < this.page)
                            this.loadMore = false

                        this.lastVisible = snapshot.docs[snapshot.docs.length-1]
                    
                        this.loading = false
                    })
                    .catch(err => console.log(err.message))
            },
            handleScroll(e) {
                const el = e.target.children[0]                                
                this.previousScroll = this.currentScroll
                
                this.currentScroll = el && el.scrollTop 
                    ? el.scrollTop 
                    : window.pageYOffset

                this.currentScroll = this.currentScroll < 0 
                    ? 0 
                    :this.currentScroll

                this.isScrollingUp = this.currentScroll <= this.previousScroll 
               
                if (this.currentScroll + el.clientHeight + 300 >= el.scrollHeight) {
                    this.loadMovies()
                }
                
            },
            onResize() {
                const size = window.innerWidth
                this.page = size <= 1024 ? 6 : 12
            }
        },
        created() {
            const helpers = db.collection('helpers')
            helpers
                .doc('actors')
                .get()
                .then(snapshot => {
                    this.actors = snapshot.data().actors                                        
                    this.actors.sort()
                })
                .catch(err => console.log(err.message))

            
        },
        mounted() {
            this.onResize()

            document.addEventListener('scroll', this.handleScroll)
            //document.body.addEventListener('touchstart', this.handleScroll, { passive: true })

        },
        destroyed() {
            document.removeEventListener('scroll', this.handleScroll)
            //document.removeEventListener('touchstart', this.handleScroll, { passive: true })
        }
    }
</script>

<style>
    .bg-image {
        background-image:url(./assets/cinema_seats.jpg);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;   
        background-attachment: fixed;    
       
    }
    .bg {
        background-color: #02252b;
    }
</style>