import { create } from 'zustand'
import { API_ENDPOINTS, type ApiEndpointId } from '@/lib/apiDebug'

export type ApiLogState = 'pending' | 'success' | 'error'

export interface ApiLogEntry {
  id: string
  endpointId: ApiEndpointId | null
  method: string
  url: string
  fullUrl: string
  requestBody: unknown
  initDataPreview: string
  status: number | null
  responseBody: unknown
  error: string | null
  durationMs: number
  timestamp: string
  state: ApiLogState
}

export interface EndpointStatus {
  endpointId: ApiEndpointId
  label: string
  method: string
  path: string
  lastStatus: number | null
  lastState: ApiLogState | 'idle'
  lastCall: string | null
  lastError: string | null
  callCount: number
}

interface ApiDebugStore {
  logs: ApiLogEntry[]
  panelOpen: boolean
  addLog: (entry: ApiLogEntry) => void
  updateLog: (id: string, updates: Partial<ApiLogEntry>) => void
  clearLogs: () => void
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  getEndpointStatuses: () => EndpointStatus[]
}

const MAX_LOGS = 50

export const useApiDebugStore = create<ApiDebugStore>((set, get) => ({
  logs: [],
  panelOpen: false,

  addLog: (entry) =>
    set((s) => ({
      logs: [entry, ...s.logs].slice(0, MAX_LOGS),
    })),

  updateLog: (id, updates) =>
    set((s) => ({
      logs: s.logs.map((log) => (log.id === id ? { ...log, ...updates } : log)),
    })),

  clearLogs: () => set({ logs: [] }),
  setPanelOpen: (open) => set({ panelOpen: open }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),

  getEndpointStatuses: () => {
    const logs = get().logs

    return API_ENDPOINTS.map((ep) => {
      const epLogs = logs.filter((l) => l.endpointId === ep.id)
      const latest = epLogs[0]

      return {
        endpointId: ep.id,
        label: ep.label,
        method: ep.method,
        path: ep.path,
        lastStatus: latest?.status ?? null,
        lastState: latest?.state ?? 'idle',
        lastCall: latest?.timestamp ?? null,
        lastError: latest?.error ?? null,
        callCount: epLogs.length,
      }
    })
  },
}))
