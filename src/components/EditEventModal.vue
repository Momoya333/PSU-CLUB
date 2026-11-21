<template>
  <q-dialog
    :model-value="modelValue"
    :maximized="$q.screen.lt.sm"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="width: 520px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">Edit Event</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section class="q-gutter-md q-pt-none">
          <q-select
            v-model="form.clubId"
            outlined
            dense
            emit-value
            map-options
            label="Club *"
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
            label="Event description"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Save Changes"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { useCampusStore } from '@/stores/useCampusStore'

const props = defineProps({
  modelValue: Boolean,
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const { state } = useCampusStore()
const clubOptions = computed(() =>
  state.clubs.map(c => ({ label: c.name, value: c.id }))
)

const form = reactive({
  id: '',
  clubId: '',
  title: '',
  date: '',
  location: '',
  tags: [],
  description: ''
})

watch(
  () => props.event,
  newVal => {
    if (newVal) {
      form.id = newVal.id
      form.clubId = newVal.clubId || ''
      form.title = newVal.title || ''
      form.date = newVal.date || ''
      form.location = newVal.location || ''
      form.tags = Array.isArray(newVal.tags) ? [...newVal.tags] : []
      form.description = newVal.description || ''
    }
  },
  { immediate: true }
)

function submit() {
  emit('submit', { ...form, tags: [...form.tags] })
  emit('update:modelValue', false)
}
</script>
