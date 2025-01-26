<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import { _arrayBufferToBase64 } from '@/utils/image';

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
const visualizationTypeTab2 = ref('taxa_aprovacao')
const range = ref([2013, 2023])

const imageResponseTab2 = ref<string | null>(null)

const tabelasResultTab2 = ref<ITabelasResult | null>(null);

const onGenerateImageTab2Click = () => {
  if (selectedYear.value) {
    requestIsLoading.value = true;
    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/image', {
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

    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/tabelas', {
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
        @click="onGenerateImageTab2Click"
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
          <BButton
            class="custom-button left-rounded"
            :class="{ 'selected': visualizationTypeTab2 === 'taxa_aprovacao' }"
            v-b-tooltip.hover="'Mostra a taxa de aprovação geral dos alunos no período selecionado'"
            @click="visualizationTypeTab2 = 'taxa_aprovacao'"
          >
            Taxa de Aprovação
          </BButton>

          <BButton
            class="custom-button"
            :class="{ 'selected': visualizationTypeTab2 === 'gargalo' }"
            v-b-tooltip.hover="'Exibe as disciplinas classificadas como gargalos, definidas como aquelas em que o aluno nunca conseguiu aprovação no período selecionado'"
            @click="visualizationTypeTab2 = 'gargalo'"
          >
            Gargalos
          </BButton>

          <BButton
            class="custom-button"
            :class="{ 'selected': visualizationTypeTab2 === 'supressao' }"
            v-b-tooltip.hover="'Mostra as disciplinas que os alunos suprimiram no período selecionado  '"
            @click="visualizationTypeTab2 = 'supressao'"
          >
            Supressão
          </BButton>

          <BButton
            class="custom-button right-rounded"
            :class="{ 'selected': visualizationTypeTab2 === 'trancamento' }"
            v-b-tooltip.hover="'Mostra as disciplinas que os alunos trancaram no período selecionado'"
            @click="visualizationTypeTab2 = 'trancamento'"
          >
            Trancamento
          </BButton>
        </div>
        <hr>
        <template v-if="imageResponseTab2">
          <img
            :src="imageResponseTab2"
            class="w-100"
          />
        </template>
      </div>

    </BCol>

    <BCol md="6">

      <h2 class="text-center mb-2">Informações gerais</h2>
      <template v-if="tabelasResultTab2">

        <div style="max-height: 500px; overflow: auto;">
          <BTable
            striped
            bordered
            hover
            :items="tabelasResultTab2.df_consolidado"
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
    </BCol>
  </BRow>
</template>
