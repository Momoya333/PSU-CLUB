<template>
  <q-dialog
    :model-value="modelValue"
    :maximized="$q.screen.lt.sm"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="width: 520px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">Create Post</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit.prevent="submit" @reset="reset">
        <q-card-section class="q-gutter-md q-pt-none">
          <q-select
            v-model="form.clubId"
            outlined
            dense
            emit-value
            map-options
            label="Post as club *"
            :options="clubOptions"
            :rules="[v => !!v || 'Please select a club']"
          />
          <q-input
            v-model="form.title"
            outlined
            dense
            label="Event title *"
            :rules="[v => !!v || 'Title is required']"
          />
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.date"
                outlined
                dense
                type="date"
                label="Date *"
                stack-label
                :rules="[v => !!v || 'Pick a date']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.location"
                outlined
                dense
                label="Location"
              />
            </div>
          </div>
          <q-select
            v-model="form.tags"
            outlined
            dense
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            new-value-mode="add-unique"
            label="Tags (กด Enter เพื่อเพิ่ม)"
          />
          <q-input
            v-model="form.description"
            outlined
            type="textarea"
            rows="3"
            label="What's happening in your club?"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Reset" type="reset" />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Post"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useCampusStore } from '@/stores/useCampusStore'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'submit'])

const { state } = useCampusStore()
const clubOptions = computed(() =>
  state.clubs.map(c => ({ label: c.name, value: c.id }))
)

const blank = () => ({
  clubId: null,
  title: '',
  date: '',
  location: '',
  tags: [],
  description: ''
})
const form = reactive(blank())
const reset = () => Object.assign(form, blank())

function submit() {
  emit('submit', { ...form, tags: [...form.tags] })
  reset()
  emit('update:modelValue', false)
}
</script>
