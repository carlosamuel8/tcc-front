<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import VueSlider from 'vue-3-slider-component'

import { _arrayBufferToBase64 } from '@/utils/image';

import { API_URL } from '@/environment'

const requestPetrinetIsLoading = ref(false)
const requestFluxogramaIsLoading = ref(false)

const range = ref([2013, 2023]);

const imageResponsePetrinet = ref<string | null>(null)
const imageResponseFluxograma = ref<string | null>(null)

const onGenerateImagesClick = () => {
  if (range.value) {
    requestPetrinetIsLoading.value = true;
    requestFluxogramaIsLoading.value = true;

    imageResponsePetrinet.value = null;
    imageResponseFluxograma.value = null;

    axios.get(`${API_URL}/v2/visualizacao/petrinet`, {
      params: {
        selecao: range.value[0],
        selecao2: range.value[1],
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestPetrinetIsLoading.value = false;
        imageResponsePetrinet.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestPetrinetIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })

    axios.get(`${API_URL}/v2/visualizacao/fluxograma`, {
      params: {
        selecao: range.value[0],
        selecao2: range.value[1],
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestFluxogramaIsLoading.value = false;
        imageResponseFluxograma.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestFluxogramaIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })
  }
}

onMounted(() => {
  onGenerateImagesClick();
});

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
      md="6"
      cols="12"
    >
      <VueSlider
        v-model="range"
        min="2013"
        max="2023"
        marks
        adsorb
      />
    </BCol>
    <BCol
      md="2"
      cols="12"
    >
      <BButton
        :loading="requestFluxogramaIsLoading || requestPetrinetIsLoading"
        loading-text="Carregando..."
        :disabled="requestFluxogramaIsLoading || requestPetrinetIsLoading"
        variant="primary"
        @click="onGenerateImagesClick"
      >Executar Replay</BButton>
    </BCol>
  </BRow>
  <hr>
  <BRow class="pt-3">
    <BCol md="6">
      <h2 class="text-center">Visualizar Rede de Petri</h2>

      <template v-if="imageResponsePetrinet">
        <img
          :src="imageResponsePetrinet"
          class="w-100"
          style="border: 2px solid #d3d3d3; border-radius: 5px;"
        />
      </template>
      <div
        class="text-center"
        v-if="requestPetrinetIsLoading"
      >
        <BSpinner label="Spinning" />
      </div>
    </BCol>

    <BCol md="6">
      <h2 class="text-center">Visualizar Fluxograma</h2>
      <template v-if="imageResponseFluxograma">
        <img
          :src="imageResponseFluxograma"
          class="w-100"
          style="border: 2px solid #d3d3d3; border-radius: 5px;"
        />
      </template>
      <div
        class="text-center"
        v-if="requestFluxogramaIsLoading"
      >
        <BSpinner label="Spinning" />
      </div>
    </BCol>
  </BRow>
</template>
