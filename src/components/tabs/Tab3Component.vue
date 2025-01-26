<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

import { _arrayBufferToBase64 } from '@/utils/image';

const selectedYear = ref('Todos as turmas')
const requestIsLoading = ref(false)

const yearSelectOptions = [
  { value: null, text: 'Selecione uma opção' },
  { value: '2013', text: '2013' },
  { value: '2014', text: '2014' },
  { value: '2015', text: '2015' },
  { value: '2016', text: '2016' },
  { value: '2017', text: '2017' },
  { value: '2018', text: '2018' },
  { value: '2019', text: '2019' },
  { value: '2020', text: '2020' },
  { value: '2021', text: '2021' },
  { value: '2022', text: '2022' },
  { value: '2023', text: '2023' },
];

const selectedMinYear = ref(2013);
const selectedMaxYear = ref(2023);

const imageResponseTab3 = ref<string | null>(null)
const imageResponseTab4 = ref<string | null>(null)

const onGenerateImageTab3Click = () => {
  if (selectedYear.value) {
    requestIsLoading.value = true;
    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/petrinet', {
      params: {
        selecao: selectedMinYear.value,
        selecao2: selectedMaxYear.value,
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
        selecao: selectedMinYear.value,
        selecao2: selectedMaxYear.value,
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
      <label>Ano inicial</label>
      <BFormSelect
        v-model="selectedMinYear"
        :options="yearSelectOptions"
      />
    </BCol>
    <BCol
      md="4"
      cols="4"
    >
      <label>Ano final</label>
      <BFormSelect
        v-model="selectedMaxYear"
        :options="yearSelectOptions"
      />
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
