import { GraphQLClient, gql } from 'graphql-request'
import { SUBGRAPH_URL } from './constants'
import type { SubgraphProposalResponse } from '../types'

export const graphClient = new GraphQLClient(SUBGRAPH_URL)

// ── DAO Governance queries ────────────────────────────────────────────────────

export const GET_PROPOSALS = gql`
  query GetProposals($first: Int = 10, $skip: Int = 0) {
    proposalCreateds(
      first: $first
      skip: $skip
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      creator
      startDate
      endDate
      metadata
      blockNumber
      timestamp
    }
    proposalExecuteds(first: $first orderBy: blockNumber orderDirection: desc) {
      id
      blockNumber
      timestamp
    }
  }
`

export const GET_VOTES_FOR_PROPOSAL = gql`
  query GetVotesForProposal($proposalId: BigInt!) {
    voteCasts(where: { proposalId: $proposalId } orderBy: timestamp orderDirection: desc) {
      id
      proposalId
      voter
      voteOption
      votingPower
      timestamp
    }
  }
`

export const GET_RECENT_VOTES = gql`
  query GetRecentVotes($first: Int = 20) {
    voteCasts(first: $first orderBy: timestamp orderDirection: desc) {
      id
      proposalId
      voter
      voteOption
      votingPower
      timestamp
    }
  }
`

export const GET_VOTING_SETTINGS = gql`
  query GetVotingSettings {
    votingSettingsUpdateds(first: 1 orderBy: blockNumber orderDirection: desc) {
      id
      votingMode
      supportThreshold
      minParticipation
      minDuration
      minProposerVotingPower
      blockNumber
      timestamp
    }
  }
`

// ── Fetch helpers ─────────────────────────────────────────────────────────────

export async function fetchProposals(first = 10, skip = 0): Promise<SubgraphProposalResponse> {
  try {
    return await graphClient.request<SubgraphProposalResponse>(GET_PROPOSALS, { first, skip })
  } catch (err) {
    console.warn('[subgraph] fetchProposals failed – subgraph may not be deployed yet', err)
    return { proposalCreateds: [], proposalExecuteds: [], voteCasts: [] }
  }
}

export async function fetchVotesForProposal(proposalId: string) {
  try {
    return await graphClient.request(GET_VOTES_FOR_PROPOSAL, { proposalId })
  } catch (err) {
    console.warn('[subgraph] fetchVotesForProposal failed', err)
    return { voteCasts: [] }
  }
}
