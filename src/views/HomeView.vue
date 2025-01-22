<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

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

const selectedYear = ref(null)
const requestIsLoading = ref(false)

const imageResponse = ref<string | null>(null)

function _arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const onGenerateImageClick = () => {
  if (selectedYear.value) {
    requestIsLoading.value = true;
    axios.get('http://localhost:5000/visualizacao/csv', {
      params: {
        year: selectedYear.value,
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestIsLoading.value = false;
        imageResponse.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })
  }
}
</script>

<template>
  <BContainer class="bv-example-row">
    <BRow class="pt-3">
      <BCol md="4">
        <div class="d-grid gap-2">
          <BFormSelect
            v-model="selectedYear"
            :options="yearSelectOptions"
          />
          <BButton
            :loading="requestIsLoading"
            loading-text="Carregando..."
            :disabled="requestIsLoading"
            variant="primary"
            @click="onGenerateImageClick"
          >Gerar Imagem</BButton>
        </div>
      </BCol>
      <BCol md="8">
        <template v-if="imageResponse">
          <img
            :src="imageResponse"
            class="w-100"
          />
        </template>
      </BCol>
    </BRow>
  </BContainer>
</template>
