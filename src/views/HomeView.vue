<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { BCol } from 'bootstrap-vue-next';

const yearSelectOptions = [
  { value: null, text: 'Selecione uma opção' },
  { value: 'Todos as turmas', text: 'Todas as turmas' },
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

interface IAnaliseTurmaItem {
  Quantidade: number;
  Status: string;
}

interface IConsolidade {
  'Código': string;
  'Gargalo': number;
  'Nome': string;
  'Supressões': number;
  'Taxa de Aprovação (%)': number;
  'Trancamentos': number;
}

interface ITabelasResult {
  analise_turma: IAnaliseTurmaItem[],
  df_consolidado: IConsolidade[],
}

const selectedYear = ref('Todos as turmas')
const requestIsLoading = ref(false)
const visualizationType = ref('taxa_aprovacao')
const visualizationTypeTab2 = ref('taxa_aprovacao')
const range = ref([2013, 2023])

const imageResponse = ref<string | null>(null)
const imageResponseTab2 = ref<string | null>(null)

const tabelasResult = ref<ITabelasResult | null>(null);
const tabelasResultTab2 = ref<ITabelasResult | null>(null);

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
    axios.get('http://localhost:5000/v2/visualizacao/image', {
      params: {
        selecao: selectedYear.value,
        type: visualizationType.value,
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

    axios.get('http://localhost:5000/v2/visualizacao/tabelas', {
      params: {
        selecao: selectedYear.value,
      },
    })
      .then(response => response.data)
      .then(response => {
        tabelasResult.value = response;
      })
      .catch(error => {
        console.error('[REQUEST ERROR]', error)
      })
  }
}

const onGenerateImageTab2Click = () => {
  if (selectedYear.value) {
    requestIsLoading.value = true;
    axios.get('http://localhost:5000/v2/visualizacao/image', {
      params: {
        selecao: range.value[0],
        selecao2: range.value[1],
        type: visualizationTypeTab2.value,
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestIsLoading.value = false;
        imageResponseTab2.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })

    axios.get('http://localhost:5000/v2/visualizacao/tabelas', {
      params: {
        selecao: selectedYear.value,
      },
    })
      .then(response => response.data)
      .then(response => {
        tabelasResultTab2.value = response;
      })
      .catch(error => {
        console.error('[REQUEST ERROR]', error)
      })
  }
}

onMounted(() => {
  onGenerateImageClick()
})
</script>

<template>
  <BContainer fluid>
    <BCard no-body>
      <BTabs card align="center">
        <BTab title="Tab 1" active>
          <div class="d-flex gap-3">
            <BFormSelect v-model="selectedYear" :options="yearSelectOptions" />
            <BButton :loading="requestIsLoading" loading-text="Carregando..." :disabled="requestIsLoading"
              variant="primary" @click="onGenerateImageClick">Gerar Imagem</BButton>
          </div>

          <div>
            <label>Tipo de visualizaçâo</label>
            <BFormRadioGroup v-model="visualizationType" name="visualization-type">
              <BFormRadio value="taxa_aprovacao">Taxa de Aprovação
              </BFormRadio>
              <BFormRadio value="gargalo">Gargalos</BFormRadio>
              <BFormRadio value="supressao">Supressâo</BFormRadio>
              <BFormRadio value="trancamento">Trancamento
              </BFormRadio>
            </BFormRadioGroup>
          </div>
          <hr />

          <BRow class="pt-3">
            <BCol md="6">
              <template v-if="imageResponse">
                <img :src="imageResponse" class="w-100" />
              </template>
            </BCol>
            <BCol md="6">
              <template v-if="tabelasResult">
                <BTable striped bordered hover :items="tabelasResult.analise_turma" :fields="[
                  { key: 'Status', sortable: true },
                  { key: 'Quantidade', sortable: true },
                ]" />

                <hr />

                <div style="max-height: 500px; overflow: auto;">

                  <BTable striped bordered hover :items="tabelasResult.df_consolidado" :fields="[
                    { key: 'Código', sortable: true },
                    { key: 'Gargalo', sortable: true },
                    { key: 'Nome', sortable: true },
                    { key: 'Supressões', sortable: true },
                    { key: 'Taxa de Aprovação (%)', sortable: true },
                    { key: 'Trancamentos', sortable: true },
                  ]" />
                </div>

              </template>
            </BCol>
          </BRow>
        </BTab>
        <BTab title="Tab 2">
          <BRow class="pt-3">
            <BCol md="4">
              <VueSlider :min="2013" :max="2023" :interval="1" :marks="true" v-model="range"></VueSlider>
            </BCol>
            <BCol md="6">
              <div>
                <label>Tipo de visualizaçâo</label>
                <BFormRadioGroup v-model="visualizationTypeTab2" name="visualization-type-t2">
                  <BFormRadio value="taxa_aprovacao">Taxa de Aprovação
                  </BFormRadio>
                  <BFormRadio value="gargalo">Gargalos</BFormRadio>
                  <BFormRadio value="supressao">Supressâo</BFormRadio>
                  <BFormRadio value="trancamento">Trancamento
                  </BFormRadio>
                </BFormRadioGroup>
              </div>
            </BCol>
            <BCol md="2">
              <BButton :loading="requestIsLoading" loading-text="Carregando..." :disabled="requestIsLoading"
                variant="primary" @click="onGenerateImageTab2Click">Gerar Imagem</BButton>
              </BCol>
          </BRow>
          <BRow class="pt-3">
            <BCol md="6">
              <template v-if="imageResponseTab2">
                <img :src="imageResponseTab2" class="w-100" />
              </template>
            </BCol>
            <BCol md="6">
              <template v-if="tabelasResultTab2">

                <div style="max-height: 500px; overflow: auto;">
                  <BTable striped bordered hover :items="tabelasResultTab2.df_consolidado" :fields="[
                    { key: 'Código', sortable: true },
                    { key: 'Gargalo', sortable: true },
                    { key: 'Nome', sortable: true },
                    { key: 'Supressões', sortable: true },
                    { key: 'Taxa de Aprovação (%)', sortable: true },
                    { key: 'Trancamentos', sortable: true },
                  ]" />
                </div>

              </template>
            </BCol>
          </BRow>
        </BTab>
      </BTabs>
    </BCard>
  </BContainer>
</template>
