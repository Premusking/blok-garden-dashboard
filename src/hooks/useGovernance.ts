import { useQuery } from '@tanstack/react-query'
import { fetchProposals, fetchVotesForProposal } from '../lib/graphql'
import type { Proposal, VoteCast } from '../types'

export function useProposals(first = 10) {
  return useQuery({
    queryKey: ['proposals', first],
    staleTime: 60_000,
    queryFn: async (): Promise<Proposal[]> => {
      const data = await fetchProposals(first)
      const executedIds = new Set(data.proposalExecuteds.map((e) => e.id))

      return data.proposalCreateds.map((p) => ({
        id: p.id,
        creator: p.creator as `0x${string}`,
        startDate: parseInt(p.startDate),
        endDate: parseInt(p.endDate),
        metadata: p.metadata,
        executed: executedIds.has(p.id),
        votes: [],
      }))
    },
  })
}

export function useProposalVotes(proposalId: string | null) {
  return useQuery({
    queryKey: ['votes', proposalId],
    enabled: !!proposalId,
    staleTime: 30_000,
    queryFn: async (): Promise<VoteCast[]> => {
      const data = await fetchVotesForProposal(proposalId!) as any
      return (data.voteCasts ?? []).map((v: any) => ({
        proposalId: v.proposalId,
        voter: v.voter as `0x${string}`,
        voteOption: v.voteOption,
        votingPower: BigInt(v.votingPower),
        timestamp: parseInt(v.timestamp),
      }))
    },
  })
}

// ── Tally helper ──────────────────────────────────────────────────────────────
export function tallyVotes(votes: VoteCast[]) {
  let yes = 0n, no = 0n, abstain = 0n
  for (const v of votes) {
    if (v.voteOption === 1) yes += v.votingPower
    else if (v.voteOption === 2) no += v.votingPower
    else abstain += v.votingPower
  }
  const total = yes + no + abstain || 1n
  return {
    yes, no, abstain,
    yesPct: Number((yes * 100n) / total),
    noPct: Number((no * 100n) / total),
    abstainPct: Number((abstain * 100n) / total),
  }
}
