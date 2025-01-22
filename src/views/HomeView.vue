<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
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

interface IGargalos {
  0: string;
  1: string;
  2: number;
}

interface ISupressoes {
  0: string;
  1: string;
  2: number;
}

interface ITabelasResult {
  analise_turma: IAnaliseTurmaItem[],
  disciplinas_com_maior_gargalo: IGargalos[],
  disciplinas_com_maior_supressoes: ISupressoes[],
}

const selectedYear = ref(null)
const requestIsLoading = ref(false)

const imageResponse = ref<string | null>(null)

const tabelasResult = ref<ITabelasResult | null>(null);

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
</script>

<template>
  <BContainer fluid>
    <BCard no-body>
      <BTabs card>
        <BTab title="Tab 1" active>
          <div class="d-grid gap-2">
            <BFormSelect v-model="selectedYear" :options="yearSelectOptions" />
            <BButton :loading="requestIsLoading" loading-text="Carregando..." :disabled="requestIsLoading"
              variant="primary" @click="onGenerateImageClick">Gerar Imagem</BButton>
          </div>
          <hr />

          <BRow class="pt-3">
            <BCol md="7">
              <template v-if="imageResponse">
                <img :src="imageResponse" class="w-100" />
              </template>
            </BCol>
            <BCol md="5">
              <template v-if="tabelasResult">
                <BTable striped bordered hover :items="tabelasResult.analise_turma" :fields="[
                  { key: 'Status', sortable: true },
                  { key: 'Quantidade', sortable: true },
                ]" />

                <hr />

                <div style="max-height: 500px; overflow: auto;">

                  <span>oioioi</span>
                  <BTable striped bordered hover :items="tabelasResult.disciplinas_com_maior_gargalo" :fields="[
                    { key: 0, label: 'Código', sortable: false },
                    { key: 1, label: 'Disciplina', sortable: false },
                    { key: 2, label: 'Quantidade', sortable: false },
                  ]" />
                </div>

                <hr />

                <div style="max-height: 500px; overflow: auto;">
                  <BTable striped bordered hover :items="tabelasResult.disciplinas_com_maior_supressoes" :fields="[
                    { key: 0, label: 'Código', sortable: false },
                    { key: 1, label: 'Disciplina', sortable: false },
                    { key: 2, label: 'Quantidade', sortable: false },
                  ]" />
                </div>

              </template>
            </BCol>
          </BRow>
        </BTab>
        <BTab title="Tab 2">
          <BCardText>Tab contents 2</BCardText>
        </BTab>
      </BTabs>
    </BCard>
  </BContainer>
</template>
