<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

import { _arrayBufferToBase64 } from '@/utils/image';

import { API_URL } from '@/environment'
import type { ITabelasResult, TVisualization } from '@/types';

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

const requestImageIsLoading = ref(false)
const requestTableIsLoading = ref(false)

const selectedMinYear = ref(2013);
const selectedMaxYear = ref(2023);
const visualizationType = ref<TVisualization>('taxa_aprovacao')

const imageResponse = ref<string | null>(null)
const tabelasResult = ref<ITabelasResult | null>(null);



const onRequestImage = () => {
  if (selectedMinYear.value && selectedMaxYear.value) {
    requestImageIsLoading.value = true;
    imageResponse.value = null;

    axios.get(`${API_URL}/v2/visualizacao/image`, {
      params: {
        selecao: selectedMinYear.value,
        selecao2: selectedMaxYear.value,
        type: visualizationType.value,
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        requestImageIsLoading.value = false;
        imageResponse.value = 'data:image/png;base64,' + _arrayBufferToBase64(response.data);
      })
      .catch(error => {
        requestImageIsLoading.value = false;
        console.error('[REQUEST ERROR]', error)
      })
  }
}

const onRequestTableData = () => {
  if (selectedMinYear.value && selectedMaxYear.value) {
    requestTableIsLoading.value = true;
    tabelasResult.value = null;

    axios.get(`${API_URL}/v2/visualizacao/tabelas`, {
      params: {
        selecao: selectedMinYear.value,
        selecao2: selectedMaxYear.value,
      },
    })
      .then(response => response.data)
      .then(response => {
        tabelasResult.value = response;
        requestTableIsLoading.value = false;
      })
      .catch(error => {
        console.error('[REQUEST ERROR]', error);
        requestTableIsLoading.value = false;
      })
  }
}

const requestAllData = () => {
  onRequestImage();
  onRequestTableData();
}

const onChangeVisualizationType = (value: TVisualization) => {
  visualizationType.value = value;
  onRequestImage();
}

onMounted(() => {
  requestAllData();
})

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
      cols="4"
      md="2"
    >
    <BButton
        :loading="requestImageIsLoading || requestTableIsLoading"
        loading-text="Carregando..."
        :disabled="requestImageIsLoading || requestTableIsLoading"
        variant="primary"
        @click="requestAllData"
      >Aplicar filtro</BButton>
    </BCol>
  </BRow>
  <hr>
  <BRow class="pt-3">
    <BCol md="6">
      <h2 class="text-center">Visualizar fluxograma</h2>
      <div
        class="mb-2 border-radius-5 p-3 text-center"
        style="border: 2px solid #d3d3d3; border-radius: 5px;"
      >
        <label class="mb-2">Selecione um tipo de visualização: </label>
        <div class="button-group">
          <BButtonGroup>
            <BButton
              :variant="visualizationType === 'taxa_aprovacao' ? 'primary' : 'outline-primary'"
              @click="onChangeVisualizationType('taxa_aprovacao')"
            >
              <span v-b-tooltip.hover="'Mostra a taxa de aprovação dos alunos na 1ª tentativa de cada disciplina'">
                Taxa de Aprovação 1ª tentativa
              </span>
            </BButton>

            <BButton
              :variant="visualizationType === 'gargalo' ? 'primary' : 'outline-primary'"
              @click="onChangeVisualizationType('gargalo')"
            >
              <span
                v-b-tooltip.hover="'Exibe as disciplinas classificadas como gargalos, definidas como aquelas em que o aluno nunca conseguiu aprovação.'"
              >
                Gargalos
              </span>
            </BButton>

            <BButton
              :variant="visualizationType === 'supressao' ? 'primary' : 'outline-primary'"
              @click="onChangeVisualizationType('supressao')"
            >
              <span v-b-tooltip.hover="'Mostra as disciplinas que os alunos suprimiram'">
                Supressão
              </span>
            </BButton>

            <BButton
              :variant="visualizationType === 'trancamento' ? 'primary' : 'outline-primary'"
              @click="onChangeVisualizationType('trancamento')"
            >
              <span v-b-tooltip.hover="'Mostra as disciplinas que os alunos trancaram'">
                Trancamento
              </span>
            </BButton>
          </BButtonGroup>
        </div>
        <hr>
        <template v-if="imageResponse">
          <img
            :src="imageResponse"
            class="w-100"
          />
        </template>
        <div
          class="text-center"
          v-if="requestImageIsLoading"
        >
          <BSpinner label="Spinning" />
        </div>
      </div>

    </BCol>

    <BCol md="6">

      <h2 class="text-center mb-2">Informações gerais</h2>
      <template v-if="tabelasResult">

        <div style="max-height: 500px; overflow: auto;">
          <BTable
            striped
            bordered
            hover
            :items="tabelasResult.df_consolidado"
            :fields="[
              { key: 'Código', sortable: true },
              { key: 'Nome', sortable: true },
              { key: 'Gargalo', sortable: true },
              { key: 'Supressões', sortable: true },
              { key: 'Taxa de Aprovação (%)', sortable: true },
              { key: 'Trancamentos', sortable: true },
            ]"
          />
        </div>

      </template>
      <div
        class="text-center"
        v-if="requestTableIsLoading"
      >
        <BSpinner label="Spinning" />
      </div>
    </BCol>
  </BRow>
</template>
