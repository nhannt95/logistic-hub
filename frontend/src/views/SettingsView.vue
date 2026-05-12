<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Database, ShieldCheck } from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MasterDataView from './MasterDataView.vue'
import UsersView from './UsersView.vue'

const route = useRoute()
const router = useRouter()

type Group = 'master' | 'users'
const group = ref<Group>((route.query.group as Group) === 'users' ? 'users' : 'master')

// Reflect tab in URL (so refresh keeps state, deep link friendly)
watch(group, (g) => {
  router.replace({ query: { ...route.query, group: g } })
})
</script>

<template>
  <Tabs v-model="group" class="space-y-4">
    <TabsList class="h-10">
      <TabsTrigger value="master" class="gap-2">
        <Database class="h-4 w-4" />
        <span class="hidden sm:inline">Master Data</span>
        <span class="sm:hidden">Master</span>
      </TabsTrigger>
      <TabsTrigger value="users" class="gap-2">
        <ShieldCheck class="h-4 w-4" />
        <span class="hidden sm:inline">Quản lý User</span>
        <span class="sm:hidden">User</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="master" class="mt-0">
      <MasterDataView />
    </TabsContent>
    <TabsContent value="users" class="mt-0">
      <UsersView />
    </TabsContent>
  </Tabs>
</template>
