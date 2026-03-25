import type { Card as FsrsCard, State as FsrsState } from 'ts-fsrs';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type LeetcodeDomain = 'leetcode.com' | 'leetcode.cn';

export interface Card {
  id: string;
  slug: string;
  name: string;
  leetcodeId: string;
  difficulty: Difficulty;
  domain: LeetcodeDomain;
  createdAt: Date;
  fsrs: FsrsCard;
  paused: boolean;
}

export interface StoredCard extends Omit<Card, 'createdAt' | 'fsrs'> {
  createdAt: number;
  fsrs: Omit<FsrsCard, 'due' | 'last_review'> & {
    due: number;
    last_review?: number;
  };
}

export { FsrsState };