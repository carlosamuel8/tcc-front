<script setup lang="ts">
import Tab1Component from '@/components/tabs/Tab1Component.vue';
import Tab2Component from '@/components/tabs/Tab2Component.vue';
import Tab3Component from '@/components/tabs/Tab3Component.vue';

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
          <Tab3Component />
        </BTab>
      </BTabs>
    </BCard>
  </BContainer>
</template>
