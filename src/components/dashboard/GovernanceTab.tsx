import { useState } from 'react'
import { format, fromUnixTime } from 'date-fns'
import { useProposals, useProposalVotes, tallyVotes } from '../../hooks/useGovernance'
import styles from './GovernanceTab.module.css'

export function GovernanceTab() {
  const { data: proposals, isLoading, error } = useProposals(10)
  const [selected, setSelected] = useState<string | null>(null)
  const { data: votes } = useProposalVotes(selected)

  const tally = votes && votes.length > 0 ? tallyVotes(votes) : null

  if (isLoading) return <div className="card"><p className="muted" style={{ padding: '1.5rem 0' }}>Loading proposals…</p></div>
  if (error) return <div className="card"><p className="warn" style={{ padding: '1.5rem 0' }}>Subgraph unavailable — deploy blokc-graph to enable governance data.</p></div>

  if (!proposals || proposals.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p className="muted">No proposals found. The subgraph may still be syncing.</p>
        <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
          Voting plugin: <code className="mono">0xbe40B1…d3D1</code>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {/* Proposals list */}
      <div className="card">
        <div className="card-title">Active &amp; recent proposals</div>
        {proposals.map((p) => {
          const now = Math.floor(Date.now() / 1000)
          const isActive = p.startDate <= now && p.endDate >= now
          const isEnded = p.endDate < now

          return (
            <div
              key={p.id}
              className={`${styles.proposalRow} ${selected === p.id ? styles.selected : ''}`}
              onClick={() => setSelected(selected === p.id ? null : p.id)}
            >
              <div className={styles.proposalTop}>
                <span
                  className={`badge ${isActive ? 'badge-green' : p.executed ? 'badge-green' : 'badge-muted'}`}
                >
                  {isActive ? 'Active' : p.executed ? 'Executed' : isEnded ? 'Ended' : 'Pending'}
                </span>
                <span className={styles.proposalId} title={p.id}>
                  #{p.id.slice(0, 10)}…
                </span>
              </div>
              <div className={styles.proposalMeta}>
                <span className="muted">
                  Ends {format(fromUnixTime(p.endDate), 'MMM d, yyyy')}
                </span>
                <span className="muted">
                  by {p.creator.slice(0, 6)}…{p.creator.slice(-4)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Votes panel */}
      <div className="card">
        <div className="card-title">Vote breakdown</div>
        {!selected && (
          <p className="muted" style={{ fontSize: 13 }}>Select a proposal to see votes.</p>
        )}
        {selected && !tally && (
          <p className="muted" style={{ fontSize: 13 }}>Loading votes…</p>
        )}
        {selected && tally && (
          <>
            <div className={styles.tallyBars}>
              <TallyBar label="Yes" pct={tally.yesPct} color="#1D9E75" />
              <TallyBar label="No" pct={tally.noPct} color="#E24B4A" />
              <TallyBar label="Abstain" pct={tally.abstainPct} color="#555B72" />
            </div>
            <div className={styles.voteList}>
              <div className="card-title" style={{ marginTop: '1rem' }}>Individual votes</div>
              {votes!.slice(0, 12).map((v) => (
                <div key={v.proposalId + v.voter} className={styles.voteRow}>
                  <span className="mono" style={{ fontSize: 12 }}>
                    {v.voter.slice(0, 6)}…{v.voter.slice(-4)}
                  </span>
                  <span
                    className={
                      v.voteOption === 1 ? styles.voteYes :
                      v.voteOption === 2 ? styles.voteNo :
                      'muted'
                    }
                  >
                    {v.voteOption === 1 ? 'Yes' : v.voteOption === 2 ? 'No' : 'Abstain'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function TallyBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ color }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg-hover)', borderRadius: 3 }}>
        <div
          style={{
            width: `${pct}%`, height: 6, background: color,
            borderRadius: 3, transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
