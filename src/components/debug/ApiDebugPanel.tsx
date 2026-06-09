'use client'

import { useState } from 'react'
import { API_BASE_URL, pingAllEndpoints } from '@/lib/api'
import { API_ENDPOINTS, formatJson, isApiDebugEnabled } from '@/lib/apiDebug'
import { useApiDebugStore } from '@/store/useApiDebugStore'
import { useAppStore } from '@/store/useAppStore'
import type { ApiLogEntry, EndpointStatus } from '@/store/useApiDebugStore'

export function ApiDebugPanel() {
  const logs = useApiDebugStore((s) => s.logs)
  const panelOpen = useApiDebugStore((s) => s.panelOpen)
  const togglePanel = useApiDebugStore((s) => s.togglePanel)
  const setPanelOpen = useApiDebugStore((s) => s.setPanelOpen)
  const clearLogs = useApiDebugStore((s) => s.clearLogs)
  const getEndpointStatuses = useApiDebugStore((s) => s.getEndpointStatuses)

  const simulationMode = useAppStore((s) => s.simulationMode)
  const setSimulationMode = useAppStore((s) => s.setSimulationMode)

  const [pinging, setPinging] = useState(false)
  const endpointStatuses = getEndpointStatuses()

  if (!isApiDebugEnabled) return null

  const errorCount = logs.filter((l) => l.state === 'error' || (l.status && l.status >= 400)).length
  const pendingCount = logs.filter((l) => l.state === 'pending').length

  async function handlePingAll() {
    setPinging(true)
    setPanelOpen(true)
    try {
      await pingAllEndpoints()
    } finally {
      setPinging(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={togglePanel}
        className="fixed bottom-24 right-4 z-[100] flex h-11 items-center gap-2 rounded-full px-3.5 text-xs font-bold shadow-lg active:scale-95"
        style={{
          backgroundColor: errorCount > 0 ? '#E85C6A' : pendingCount > 0 ? '#f59e0b' : '#111111',
          color: '#fff',
        }}
        aria-label="Toggle API debug panel"
      >
        <span className="font-mono">API</span>
        {pendingCount > 0 ? (
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">…</span>
        ) : logs.length > 0 ? (
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{logs.length}</span>
        ) : null}
      </button>

      {panelOpen && (
        <div className="fixed inset-0 z-[99] flex flex-col bg-black/40 backdrop-blur-sm">
          <div className="mt-auto flex max-h-[90dvh] flex-col rounded-t-2xl bg-zinc-950 text-zinc-100 shadow-2xl">
            <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-white">API Debug — All Endpoints</p>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{API_BASE_URL}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePingAll}
                  disabled={pinging}
                  className="rounded-lg bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
                >
                  {pinging ? 'Pinging…' : 'Ping all'}
                </button>
                <button
                  type="button"
                  onClick={clearLogs}
                  className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={togglePanel}
                  className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </header>

            {/* Simulation controls */}
            <div className="border-b border-zinc-800 px-4 py-3 bg-zinc-900/40">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                    Simulation &amp; Demo Mode
                  </p>
                  <p className="mt-0.5 text-[9px] text-zinc-500">
                    Seeds mock balances &amp; history when live endpoints are empty.
                  </p>
                </div>
                <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 shrink-0 select-none">
                  {(['auto', 'forced', 'off'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSimulationMode(m)}
                      className={`rounded-md px-3 py-1 text-[10px] font-bold capitalize transition-all ${
                        simulationMode === m
                          ? 'bg-amber-500 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-800 px-4 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Endpoint status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {endpointStatuses.map((ep) => (
                  <EndpointChip key={ep.endpointId} status={ep} />
                ))}
              </div>
              <p className="mt-2 text-[10px] text-zinc-600">
                {API_ENDPOINTS.length} endpoints · tap a log below for full request/response
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {logs.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-zinc-500">No requests yet.</p>
                  <button
                    type="button"
                    onClick={handlePingAll}
                    disabled={pinging}
                    className="mt-3 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Ping all 4 endpoints now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <LogCard key={log.id} log={log} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function EndpointChip({ status }: { status: EndpointStatus }) {
  const color =
    status.lastState === 'success'
      ? '#4ade80'
      : status.lastState === 'error'
        ? '#E85C6A'
        : status.lastState === 'pending'
          ? '#fbbf24'
          : '#52525b'

  return (
    <div
      className="rounded-lg border px-2.5 py-2"
      style={{ borderColor: `${color}44`, backgroundColor: `${color}11` }}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-bold text-white">{status.label}</span>
        <span className="font-mono text-[10px] font-bold" style={{ color }}>
          {status.lastState === 'idle'
            ? '—'
            : status.lastState === 'pending'
              ? '…'
              : status.lastStatus ?? 'ERR'}
        </span>
      </div>
      <p className="mt-0.5 truncate font-mono text-[9px] text-zinc-500">
        {status.method} {status.path}
      </p>
      <p className="mt-0.5 text-[9px] text-zinc-600">
        {status.callCount > 0 ? `${status.callCount} call${status.callCount === 1 ? '' : 's'}` : 'not called'}
        {status.lastCall ? ` · ${status.lastCall}` : ''}
      </p>
    </div>
  )
}

function LogCard({ log }: { log: ApiLogEntry }) {
  const [expanded, setExpanded] = useState(false)
  const failed = log.state === 'error' || Boolean(log.status && log.status >= 400)
  const statusLabel =
    log.state === 'pending' ? '…' : log.status ?? (log.error ? 'ERR' : '—')

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: failed ? '#E85C6A44' : log.state === 'pending' ? '#fbbf2444' : '#27272a' }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left"
      >
        <span
          className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
          style={{
            backgroundColor: failed ? '#E85C6A22' : log.state === 'pending' ? '#fbbf2422' : '#22c55e22',
            color: failed ? '#E85C6A' : log.state === 'pending' ? '#fbbf24' : '#4ade80',
          }}
        >
          {statusLabel}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs font-semibold text-white">
            {log.method} {log.url}
          </p>
          <p className="mt-0.5 truncate font-mono text-[9px] text-zinc-500">{log.fullUrl}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">
            {log.timestamp}
            {log.state !== 'pending' ? ` · ${log.durationMs}ms` : ' · in flight…'}
          </p>
          {log.method === 'POST' && (
            <p className="mt-1 truncate font-mono text-[10px] text-amber-400/90">
              initData: {log.initDataPreview}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs text-zinc-500">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-zinc-800 px-3 py-2.5">
          <LogBlock label="Request" value={formatJson(log.requestBody)} />
          {log.error ? (
            <LogBlock label="Error" value={log.error} error />
          ) : log.state === 'pending' ? (
            <LogBlock label="Response" value="Waiting for server…" />
          ) : (
            <LogBlock label="Response" value={formatJson(log.responseBody)} />
          )}
          <CopyButton
            text={formatJson({
              url: log.fullUrl,
              method: log.method,
              request: log.requestBody,
              response: log.responseBody,
              status: log.status,
              error: log.error,
            })}
          />
        </div>
      )}
    </div>
  )
}

function LogBlock({ label, value, error }: { label: string; value: string; error?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <pre
        className="max-h-48 overflow-auto rounded-lg p-2 font-mono text-[10px] leading-relaxed"
        style={{
          backgroundColor: error ? '#E85C6A11' : '#18181b',
          color: error ? '#fca5a5' : '#d4d4d8',
        }}
      >
        {value}
      </pre>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // clipboard may be unavailable in some WebViews
        }
      }}
      className="w-full rounded-lg bg-zinc-800 py-2 text-[11px] font-semibold text-zinc-300"
    >
      {copied ? 'Copied!' : 'Copy request + response'}
    </button>
  )
}
