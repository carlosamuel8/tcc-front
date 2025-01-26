<script setup lang="ts">
import { _arrayBufferToBase64 } from '@/utils/image';
import axios from 'axios';
import { onMounted, ref } from 'vue';

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
const imageResponse = ref<string | null>(null)
  const tabelasResult = ref<ITabelasResult | null>(null);

const onGenerateImageClick = () => {
  if (selectedYear.value) {
    requestIsLoading.value = true;
    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/image', {
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

    axios.get('https://data-analyze-6154fde0abbf.herokuapp.com/v2/visualizacao/tabelas', {
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

onMounted(() => {
  onGenerateImageClick()
})
</script>
<template>
  <BRow
    class="pt-3"
    align-h="center"
  >
    <BCol md="12">
      <h4 class="text-center">Selecione o ano de ingresso: </h4>
    </BCol>
  </BRow>
  <BRow
    class="pt-3"
    align-h="center"
  >
    <BCol
      md="5"
      cols="8"
    >
      <BFormSelect
        v-model="selectedYear"
        :options="yearSelectOptions"
      />
    </BCol>
    <BCol
      md="auto"
      cols="4"
    >
      <BButton
        :loading="requestIsLoading"
        loading-text="Carregando..."
        :disabled="requestIsLoading"
        variant="primary"
        @click="onGenerateImageClick"
      >Aplicar filtro</BButton>
    </BCol>
  </BRow>

  <hr />

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
            :class="{ 'selected': visualizationType === 'taxa_aprovacao' }"
            v-b-tooltip.hover="'Mostra a taxa de aprovação dos alunos na 1ª tentativa de cada disciplina'"
            @click="visualizationType = 'taxa_aprovacao'"
          >
            Taxa de Aprovação 1ª tentativa
          </BButton>

          <BButton
            class="custom-button"
            :class="{ 'selected': visualizationType === 'gargalo' }"
            v-b-tooltip.hover="'Exibe as disciplinas classificadas como gargalos, definidas como aquelas em que o aluno nunca conseguiu aprovação.'"
            @click="visualizationType = 'gargalo'"
          >
            Gargalos
          </BButton>

          <BButton
            class="custom-button"
            :class="{ 'selected': visualizationType === 'supressao' }"
            v-b-tooltip.hover="'Mostra as disciplinas que os alunos suprimiram  '"
            @click="visualizationType = 'supressao'"
          >
            Supressão
          </BButton>

          <BButton
            class="custom-button right-rounded"
            :class="{ 'selected': visualizationType === 'trancamento' }"
            v-b-tooltip.hover="'Mostra as disciplinas que os alunos trancaram'"
            @click="visualizationType = 'trancamento'"
          >
            Trancamento
          </BButton>
        </div>

        <hr>

        <template v-if="imageResponse">
          <img
            :src="imageResponse"
            class="w-100"
          />
        </template>
      </div>
    </BCol>
    <BCol md="6">
      <h2 class="text-center">Status dos alunos</h2>
      <template v-if="tabelasResult">
        <BTable
          striped
          bordered
          hover
          :items="tabelasResult.analise_turma"
          :fields="[
            { key: 'Status', sortable: true },
            { key: 'Quantidade', sortable: true },
          ]"
        />

        <hr />

        <div style="max-height: 500px; overflow: auto;">
          <h2 class="text-center mb-2">Informações gerais</h2>

          <BTable
            striped
            bordered
            hover
            :items="tabelasResult.df_consolidado"
            :fields="[
              { key: 'Código', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
              { key: 'Nome', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
              { key: 'Gargalo', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
              { key: 'Supressões', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
              { key: 'Taxa de Aprovação (%)', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
              { key: 'Trancamentos', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
            ]"
          />
        </div>

      </template>
    </BCol>
  </BRow>
</template>
