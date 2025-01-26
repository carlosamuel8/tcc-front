<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { _arrayBufferToBase64 } from '@/utils/image';

const selectedYear = ref('Todos as turmas')
const requestIsLoading = ref(false)
const range = ref([2013, 2023])

const imageResponseTab3 = ref<string | null>(null)
const imageResponseTab4 = ref<string | null>(null)

const onGenerateImageTab3Click = () => {
  if (selectedYear.value) {
    requestIsLoading.value = true;
    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/petrinet', {
      params: {
        selecao: range.value[0],
        selecao2: range.value[1],
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestIsLoading.value = false;
        imageResponseTab3.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })
    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/fluxograma', {
      params: {
        selecao: range.value[0],
        selecao2: range.value[1],
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestIsLoading.value = false;
        imageResponseTab4.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })
  }
}

</script>
<template>
  <BRow
    class="pt-3"
    align-h="center"
  >
    <BCol md="12">
      <h4 class="text-center">Selecione um período: </h4>
    </BCol>
  </BRow>
  <BRow
    class="pt-3"
    align-h="center"
  >
    <BCol
      md="4"
      cols="4"
    >
      <VueSlider
        :min="2013"
        :max="2023"
        :interval="1"
        :marks="true"
        v-model="range"
      ></VueSlider>
    </BCol>
    <BCol
      md="2"
      cols="4"
    >
      <BButton
        :loading="requestIsLoading"
        loading-text="Carregando..."
        :disabled="requestIsLoading"
        variant="primary"
        @click="onGenerateImageTab3Click"
      >Executar Replay</BButton>
    </BCol>
  </BRow>
  <hr>
  <BRow class="pt-3">
    <BCol md="6">
      <h2 class="text-center">Visualizar Rede de Petri</h2>

      <template v-if="imageResponseTab3">
        <img
          :src="imageResponseTab3"
          class="w-100"
          style="border: 2px solid #d3d3d3; border-radius: 5px;"
        />
      </template>
    </BCol>

    <BCol md="6">
      <h2 class="text-center">Visualizar Fluxograma</h2>
      <template v-if="imageResponseTab4">
        <img
          :src="imageResponseTab4"
          class="w-100"
          style="border: 2px solid #d3d3d3; border-radius: 5px;"
        />
      </template>
    </BCol>
  </BRow>
</template>
