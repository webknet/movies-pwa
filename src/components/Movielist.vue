<template>
   
    <v-card class="ma-2"
        v-if="movie"
        dark
        min-width="300"
        color="#346b74">

            <v-layout>               
                <v-flex xs5>
                    <v-img
                    :src="movie.poster" height="213" width="154"></v-img>
                </v-flex>
                <v-flex xs7 class="pr-2 pl-2">
                    <div class="title font-weight-light text-center">
                        <span class="">{{ movie.title }}</span>
                    </div>
                    <div class=" text-center">
                    <v-rating 
                        :value="movie.rating"
                        _small dense
                        color="orange"
                        background-color="orange lighten-3"
                        readonly></v-rating>
                    
                        <h2 class="font-weight-thin">{{ movie.year}}</h2>
                    </div>
                    <div class="mt-5">
                        <v-chip 
                            class="ma-1 caption font-weight-light"
                            small 
                            color="blue-grey lighten-3"
                            outlined 
                            v-for="(gr, index) in movie.genre" 
                            :key="index">
                            {{ gr }}</v-chip>
                        
                    </div>
                    
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
           <v-card-text style="min-height:130px;">
               <v-layout class="faces-layout">
                        <div v-for="(actor, index) in movie.actor_facets" :key="index">
                            <v-flex text-center>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                       <div class="elevation-10 ma-1" v-on="on" style="border: solid 1px white; ">
                                            <v-img style="_border-radius:5px" :src="actor.split('|')[0]" max-width="60" width="45" height="68" alt=""></v-img>
                                        </div>
                                    </template>
                                    <span class="caption font-weight-light">{{ actor.split('|')[1]}}</span>
                                </v-tooltip>
                                
                               <!--   -->
                            
                            </v-flex>
                            
                            
                        </div>
                    </v-layout>
           </v-card-text>
       
    </v-card>
       
</template>

<script>
    export default {
        props: {
            movie: Object
        }
    }
</script>

<style>
     .faces-layout {
            overflow-y:hidden;-webkit-overflow-scrolling: touch;
        }
</style>