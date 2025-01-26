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
const imageResponseTab3 = ref<string | null>(null)
const imageResponseTab4 = ref<string | null>(null)


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

onMounted(() => {
  onGenerateImageClick()
})
</script>

<template>
  <BContainer fluid>
    <BCard no-body>
      <BTabs card align="center">
        <BTab title="Visualizações por Turma" active>
          <BRow class="pt-3" align-h="center">
            <BCol md="12">
              <h4 class="text-center">Selecione o ano de ingresso: </h4>
            </BCol>
          </BRow>
            <BRow class="pt-3" align-h="center">
              <BCol md="5" cols="8">
                <BFormSelect v-model="selectedYear" :options="yearSelectOptions" />
              </BCol>
              <BCol md="auto" cols="4">
               <BButton :loading="requestIsLoading" loading-text="Carregando..." :disabled="requestIsLoading"
                  variant="primary" @click="onGenerateImageClick">Aplicar filtro</BButton>
              </BCol>
            </BRow>

          <hr />

          <BRow class="pt-3">
            <BCol md="6">
              <h2 class="text-center">Visualizar fluxograma</h2>
              <div class="mb-2 border-radius-5 p-3 text-center" style="border: 2px solid #d3d3d3; border-radius: 5px;">
                <label class="mb-2">Selecione um tipo de visualização: </label>
                <div class="button-group">
                  <BButton class="custom-button left-rounded"
                    :class="{ 'selected': visualizationType === 'taxa_aprovacao' }"
                    v-b-tooltip.hover="'Mostra a taxa de aprovação dos alunos na 1ª tentativa de cada disciplina'"
                    @click="visualizationType = 'taxa_aprovacao'">
                    Taxa de Aprovação 1ª tentativa
                  </BButton>

                  <BButton class="custom-button" :class="{ 'selected': visualizationType === 'gargalo' }"
                  v-b-tooltip.hover="'Exibe as disciplinas classificadas como gargalos, definidas como aquelas em que o aluno nunca conseguiu aprovação.'" @click="visualizationType = 'gargalo'">
                  Gargalos
                  </BButton>

                  <BButton class="custom-button" :class="{ 'selected': visualizationType === 'supressao' }"
                    v-b-tooltip.hover="'Mostra as disciplinas que os alunos suprimiram  '" @click="visualizationType = 'supressao'">
                    Supressão
                  </BButton>

                  <BButton class="custom-button right-rounded"
                    :class="{ 'selected': visualizationType === 'trancamento' }"
                    v-b-tooltip.hover="'Mostra as disciplinas que os alunos trancaram'" @click="visualizationType = 'trancamento'">
                    Trancamento
                  </BButton>
                </div>

                <hr>

                <template v-if="imageResponse">
                  <img :src="imageResponse" class="w-100" />
                </template>
              </div>
            </BCol>
            <BCol md="6">
              <h2 class="text-center">Status dos alunos</h2>
              <template v-if="tabelasResult">
                <BTable striped bordered hover :items="tabelasResult.analise_turma" :fields="[
                  { key: 'Status', sortable: true },
                  { key: 'Quantidade', sortable: true },
                ]" />

                <hr />

                <div style="max-height: 500px; overflow: auto;">
                  <h2 class="text-center mb-2">Informações gerais</h2>

                  <BTable striped bordered hover :items="tabelasResult.df_consolidado" :fields="[
                    { key: 'Código', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
                    { key: 'Nome', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
                    { key: 'Gargalo', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
                    { key: 'Supressões', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
                    { key: 'Taxa de Aprovação (%)', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
                    { key: 'Trancamentos', sortable: true, thAttr: { style: 'text-align: center; vertical-align: middle;' } },
                  ]" />
                </div>

              </template>
            </BCol>
          </BRow>
        </BTab>
        <BTab title="Visualizações por Período">
          <BRow class="pt-3" align-h="center">
            <BCol md="12">
              <h4 class="text-center">Selecione um período: </h4>
            </BCol>
          </BRow>
          <BRow class="pt-3" align-h="center">
            <BCol md="4" cols="4">
              <VueSlider :min="2013" :max="2023" :interval="1" :marks="true" v-model="range"></VueSlider>
            </BCol>
            <BCol md="2" cols="4">
              <BButton :loading="requestIsLoading" loading-text="Carregando..." :disabled="requestIsLoading"
                variant="primary" @click="onGenerateImageTab2Click">Aplicar filtro</BButton>
            </BCol>
          </BRow>
          <hr>
          <BRow class="pt-3">
            <BCol md="6">
              <h2 class="text-center">Visualizar fluxograma</h2>
              <div class="mb-2 border-radius-5 p-3 text-center" style="border: 2px solid #d3d3d3; border-radius: 5px;">
                <label class="mb-2">Selecione um tipo de visualização: </label>
                <div class="button-group">
                  <BButton class="custom-button left-rounded"
                    :class="{ 'selected': visualizationTypeTab2 === 'taxa_aprovacao' }"
                    v-b-tooltip.hover="'Mostra a taxa de aprovação geral dos alunos no período selecionado'"
                    @click="visualizationTypeTab2 = 'taxa_aprovacao'">
                    Taxa de Aprovação
                  </BButton>

                  <BButton class="custom-button" :class="{ 'selected': visualizationTypeTab2 === 'gargalo' }"
                  v-b-tooltip.hover="'Exibe as disciplinas classificadas como gargalos, definidas como aquelas em que o aluno nunca conseguiu aprovação no período selecionado'" @click="visualizationTypeTab2 = 'gargalo'">
                  Gargalos
                  </BButton>

                  <BButton class="custom-button" :class="{ 'selected': visualizationTypeTab2 === 'supressao' }"
                    v-b-tooltip.hover="'Mostra as disciplinas que os alunos suprimiram no período selecionado  '" @click="visualizationTypeTab2 = 'supressao'">
                    Supressão
                  </BButton>

                  <BButton class="custom-button right-rounded"
                    :class="{ 'selected': visualizationTypeTab2 === 'trancamento' }"
                    v-b-tooltip.hover="'Mostra as disciplinas que os alunos trancaram no período selecionado'" @click="visualizationTypeTab2 = 'trancamento'">
                    Trancamento
                  </BButton>
                </div>
                <hr>
                <template v-if="imageResponseTab2">
                  <img :src="imageResponseTab2" class="w-100" />
                </template>
              </div>

            </BCol>

            <BCol md="6">

              <h2 class="text-center mb-2">Informações gerais</h2>
              <template v-if="tabelasResultTab2">

                <div style="max-height: 500px; overflow: auto;">
                  <BTable striped bordered hover :items="tabelasResultTab2.df_consolidado" :fields="[
                    { key: 'Código', sortable: true },
                    { key: 'Nome', sortable: true },
                    { key: 'Gargalo', sortable: true },
                    { key: 'Supressões', sortable: true },
                    { key: 'Taxa de Aprovação (%)', sortable: true },
                    { key: 'Trancamentos', sortable: true },
                  ]" />
                </div>

              </template>
            </BCol>
          </BRow>
        </BTab>
        <BTab title="Mineração de Processos">
          <BRow class="pt-3" align-h="center">
            <BCol md="12">
              <h4 class="text-center">Selecione um período: </h4>
            </BCol>
          </BRow>          <BRow class="pt-3" align-h="center">
            <BCol md="4" cols="4">
              <VueSlider :min="2013" :max="2023" :interval="1" :marks="true" v-model="range"></VueSlider>
            </BCol>
            <BCol md="2" cols="4">
              <BButton :loading="requestIsLoading" loading-text="Carregando..." :disabled="requestIsLoading"
                variant="primary" @click="onGenerateImageTab3Click">Executar Replay</BButton>
            </BCol>
          </BRow>
          <hr>
          <BRow class="pt-3">
            <BCol md="6">
              <h2 class="text-center">Visualizar Rede de Petri</h2>

              <template v-if="imageResponseTab3">
                <img :src="imageResponseTab3" class="w-100" style="border: 2px solid #d3d3d3; border-radius: 5px;" />
              </template>
            </BCol>

            <BCol md="6">
              <h2 class="text-center">Visualizar Fluxograma</h2>
              <template v-if="imageResponseTab4">
                <img :src="imageResponseTab4" class="w-100" style="border: 2px solid #d3d3d3; border-radius: 5px;" />
              </template>
            </BCol>
          </BRow>
        </BTab>
      </BTabs>
    </BCard>
  </BContainer>
</template>

<style>
.button-group {
  display: flex;
  gap: 0;
  /* Remove o espaço entre os botões */
}

.custom-button {
  background-color: white;
  border: 1px solid #ddd;
  color: #333;
  flex: 1;
  /* Faz os botões terem o mesmo tamanho */
  border-radius: 0;
  /* Remove bordas arredondadas por padrão */
  transition: background-color 0.3s, color 0.3s;
}

.custom-button:hover {
  background-color: #d1f1f8;
  /* Hover cinza */
  color: #333;
  border: #b1b1b1;
}

.custom-button.selected {
  background-color: #007bff;
  /* Azul quando selecionado */
  color: white;
  border-color: #007bff;
}

.left-rounded {
  border-top-left-radius: 8px;
  /* Arredonda apenas o canto superior esquerdo */
  border-bottom-left-radius: 8px;
  /* Arredonda apenas o canto inferior esquerdo */
}

.right-rounded {
  border-top-right-radius: 8px;
  /* Arredonda apenas o canto superior direito */
  border-bottom-right-radius: 8px;
  /* Arredonda apenas o canto inferior direito */
}

.custom-button:not(:last-child) {
  border-right: none;
  /* Remove a borda entre os botões */
}
</style>
