<script setup lang="ts">
import Tab1Component from '@/components/tabs/Tab1Component.vue';
import Tab2Component from '@/components/tabs/Tab2Component.vue';

</script>

<template>
  <BContainer fluid>
    <BCard no-body>
      <BTabs card align="center">
        <BTab title="Visualizações por Turma" active>
          <Tab1Component />
        </BTab>
        <BTab title="Visualizações por Período">
          <Tab2Component />
        </BTab>
        <BTab title="Mineração de Processos">

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
